<template>
    <div>
        <v-card id="txnPrimaryInfo">
            <v-card-title>
                <span class="headline">Send from Address: {{address}}</span>
            </v-card-title>
            <v-card-text>
                <v-layout row wrap>
                    <template v-if="!signedTxn.length && !txnSent">
                        <v-flex xs12>
                            <v-text-field v-model="txnData.amount"
                                          placeholder="enter amount"
                                          type="number"
                                          label="Amount of BIS to send"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field v-model="txnData.recipient"
                                          placeholder="enter recipent address"
                                          type="text"
                                          label="Address to send to"
                            ></v-text-field>
                        </v-flex>
                    </template>
                    <template v-if="signedTxn.length">
                        {{signedTxn}}
                    </template>

                    <template v-if="txnSent">
                        <slot name="txnSentAction"
                              :txnSentResult="txnSentResult"
                              :amount="txnData.amount"
                              :recipient="txnData.recipient"
                              :txnSentResultSuccess="txnSentResultSuccess"
                        >
                            <code>{{txnSentResult}}</code>
                        </slot>
                    </template>
                </v-layout>
            </v-card-text>
            <v-card-actions>
                <template v-if="!signedTxn.length && !txnSent">
                    <v-btn
                            :disabled="false"
                            @click="sign({amount:txnData.amount,address,recipient:txnData.recipient})">Sign Txn
                    </v-btn>
                </template>
                <template v-if="signedTxn.length">
                    <v-btn @click="confirmDialog=true">Send Transaction</v-btn>
                </template>
            </v-card-actions>
        </v-card>

        <v-dialog
                v-model="confirmDialog"
                max-width="290"
        >
            <v-card>
                <v-card-title class="headline">ARE YOU SURE ??</v-card-title>

                <v-card-text>
                    You are about to send {{address}} --- {{txnData.amount}} --> {{txnData.recipient}}
                    THIS CANNOT BE CANCELED OR UNDONE.
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                            color="green darken-1"
                            flat="flat"
                            @click="confirmDialog = false"
                    >
                        CANCEL
                    </v-btn>

                    <v-btn
                            color="green darken-1"
                            flat="flat"
                            @click="confirmTxn"
                    >
                        Yes, Send it!
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
                v-model="sendingTxn"
                hide-overlay
                persistent
                width="300"
        >
            <v-card
                    color="primary"
                    dark
            >
                <v-card-text>
                    Sending Txn to MemPool
                    <v-progress-circular
                            indeterminate
                            color="white"
                            class="mb-0"
                    ></v-progress-circular>
                </v-card-text>
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
import bismuthHelpers from '../models/bismuthMixins'
import { sign } from 'bismuth-js-crypto'

export default {
  name: 'TransactionsSign',
  props: ['address', 'destination', 'publicKey', 'privateKey', 'resetToggle', 'maxSendAmount'],
  mixins: [bismuthHelpers],
  async mounted () {
  },
  data () {
    return {
      rules: {
        length: len => v =>
          (v || '').length === len ||
                        `Invalid character length, required ${len}`,
        address: v =>
          (v || '').match(/^[a-f0-9]{56}$/) ||
                        'Bismuth Address should be Alphanumeric and 56 chars long',
        required: v => !!v || 'This field is required'
      },
      txnData: {
        amount: 0.0,
        recipient: this.destination || '',
        operation: null,
        openfield: null
      },
      signedTxn: [],
      confirmDialog: false,
      confirmSend: false,
      sendingTxn: false,
      txnSent: false,
      txnSentResult: null
    }
  },
  filters: {},
  computed: {
    txnSentResultSuccess () {
      if (!this.txnSentResult || !this.txnSentResult.length || this.txnSentResult.length < 3) {
        return false
      }
      return this.txnSentResult[3] === 'Success'
    }
  },
  watch: {
    resetToggle () {
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  },
  methods: {
    sign ({
      timestamp = Date.now() / 1000,
      address = this.address,
      recipient, amount,
      operation = '',
      openfield = ''
    } = {}) {
      const base64SignedTxn = sign.getSignedTxnBase64({
        formatedTxnString: sign.formatTxn({
          timestamp,
          address,
          recipient,
          amount,
          operation,
          openfield
        }),
        pemPublicKey: this.publicKey,
        pemPrivateKey: this.privateKey
      })
      this.signedTxn = [
        timestamp.toFixed(2).toString(),
        address,
        recipient,
        parseFloat(amount).toFixed(8).toString(),
        base64SignedTxn,
        btoa(this.publicKey),
        operation,
        openfield
      ]
    },
    async confirmTxn () {
      this.confirmSend = true
      await this.send()
      if (this.confirmDialog) {
        this.confirmDialog = false
      }
      this.confirmSend = false
    },
    async send () {
      if (!this.signedTxn || !this.confirmSend) {
        return false
      }
      this.sendingTxn = true
      try {
        console.log('Sending signed', this.signedTxn)
        const txnResult = await (await this.$sdk).insertMemPoolTxn(this.signedTxn)
        this.txnSent = true
        this.txnSentResult = txnResult
      } catch (err) {
        console.error('Error Sending Txn!', err)
      } finally {
        this.signedTxn = false
        this.sendingTxn = false
      }
    }
  }
}
</script>
