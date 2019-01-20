<template>
    <v-layout row wrap>
        <v-flex d-flex xs12>
            <v-toolbar id="addressSearchToolbar">
                <v-layout row>
                    <v-flex xs7>
                        <slot name="mainAction"
                              :getAdddresAndTxns="getAdddresAndTxns"
                              :getAddress="getAddress"
                              :addressKeysLoaded="addressKeysLoaded"
                              :addressIsValid="addressIsValid"
                        >
                            <v-text-field
                                    hide-details
                                    :append-icon="privateKey? 'lock' : 'search'"
                                    :disable="privateKey"
                                    @click:append="getAdddresAndTxns"
                                    @keyup.enter.capture="getAdddresAndTxns"
                                    single-line
                                    v-model="address"
                                    placeholder="Enter a Bismuth address"
                            ></v-text-field>
                        </slot>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <template v-if="addressBalance.balance">
                            <v-btn flat @click="()=>addressExtraInfo.show = !addressExtraInfo.show">
                                <img src="../assets/bismuth_logo_32.png">
                                {{addressBalance.balance.toFixed(4)}}
                            </v-btn>
                        </template>
                        <v-spacer></v-spacer>
                        <template v-if="addressKeysLoaded">
                            <slot name="addressKeyLoadedAction" :publicKey="publicKey" :privateKey="privateKey"
                                  :address="address">
                            </slot>
                        </template>
                        <v-menu offset-x left bottom>
                            <v-btn
                                    icon
                                    slot="activator">
                                <v-icon>more_vert</v-icon>
                            </v-btn>
                            <v-list dense>
                                <v-list-tile @click="copyToClipboard(addressId)">
                                    <v-list-tile-avatar>
                                        <v-icon>fa-clipboard</v-icon>
                                    </v-list-tile-avatar>
                                    <v-list-tile-title>
                                        Copy address
                                    </v-list-tile-title>
                                </v-list-tile>
                                <v-divider></v-divider>

                                <v-list-tile v-if="addressTxnList.length"
                                             @click="()=>addressExtraInfo.show = !addressExtraInfo.show">
                                    <v-list-tile-avatar>
                                        <v-icon>{{(addressExtraInfo.show)? 'fa-chevron-up' : 'fa-chevron-down'}}
                                        </v-icon>
                                    </v-list-tile-avatar>
                                    <v-list-tile-title>
                                        {{ (addressExtraInfo.show) ? 'Hide' : 'Show'}} Txns
                                    </v-list-tile-title>
                                </v-list-tile>

                                <v-list-tile @click="getAdddresAndTxns">
                                    <v-list-tile-avatar>
                                        <v-icon>fa-sync-alt</v-icon>
                                    </v-list-tile-avatar>
                                    <v-list-tile-title>
                                        Refresh Txns
                                    </v-list-tile-title>
                                </v-list-tile>
                                <v-divider></v-divider>
                                <slot name="addressVertMenu" :addressKeysLoaded="addressKeysLoaded">

                                </slot>
                            </v-list>
                        </v-menu>

                    </v-toolbar-items>
                </v-layout>
            </v-toolbar>
        </v-flex>
        <template v-if="addressExtraInfo.show">
            <v-flex id="addressPrimaryInfoDash"
                    v-if="addressIsValid && addressBalance.balance" d-flex xs12 pt-1 mb-2>
                <v-layout row wrap>
                    <v-flex id="addressExtraInfoBalance" d-flex xs12 md5>
                        <v-card flat>
                            <v-layout row wrap>
                                <v-flex xs12 md3>
                                    <img src="../assets/bismuth_logo_128.png">
                                </v-flex>
                                <v-flex xs12 md7>
                                    <v-card-title primary-title>
                                        <div>
                                            <div class="display-2">
                                                <VueNumeric read-only :precision="2" separator=","
                                                            v-model="addressBalance.balance"/>
                                            </div>
                                            <div>Balance</div>
                                        </div>
                                    </v-card-title>
                                </v-flex>
                                <v-flex md2>
                                    <v-menu offset-x left bottom>
                                        <v-btn
                                                icon
                                                slot="activator">
                                            <v-icon>settings</v-icon>
                                        </v-btn>
                                        <v-list dense>
                                            <v-list-tile-title>Show</v-list-tile-title>
                                            <v-list-tile-action>
                                                <v-overflow-btn
                                                        :items="[
                                               { text: 10},
                                               { text: 20},
                                               {text :50},
                                               {text:100}
                                            ]"
                                                        v-model="txnListLimit"
                                                        label="Show last Limit"
                                                        editable
                                                        item-value="text"
                                                ></v-overflow-btn>
                                            </v-list-tile-action>
                                            <v-divider></v-divider>

                                            <v-list-tile>
                                                <v-list-tile-title>Incoming</v-list-tile-title>
                                                <v-list-tile-action>

                                                    <v-checkbox v-model="txnListFilters" color="success"
                                                                value='{"type": "direction" , "value": "incoming"}'></v-checkbox>
                                                </v-list-tile-action>
                                            </v-list-tile>
                                            <v-list-tile>

                                                <v-list-tile-title>Outgoing</v-list-tile-title>
                                                <v-list-tile-action>
                                                    <v-checkbox v-model="txnListFilters" color="red"
                                                                value='{"type": "direction" , "value": "outgoing"}'></v-checkbox>
                                                </v-list-tile-action>
                                            </v-list-tile>
                                            <v-list-tile>

                                                <v-list-tile-title>Full Address</v-list-tile-title>
                                                <v-list-tile-action>
                                                    <v-switch v-model="txnListShowFullAddress"></v-switch>
                                                </v-list-tile-action>
                                            </v-list-tile>

                                        </v-list>

                                    </v-menu>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                    <v-flex id="addressExtraInfoDetails" d-flex xs12 md6 offset-md1>
                        <v-layout row wrap>
                            <v-flex d-flex>
                                <v-card flat>
                                    <v-card-title primary-title>
                                        <div>
                                            <div class="headline">
                                                <v-icon color="green" large>chevron_right</v-icon>
                                                <VueNumeric read-only :precision="2" separator=","
                                                            v-model="addressBalance.totalCredits"/>
                                            </div>
                                            <div>Total Credits</div>
                                        </div>
                                    </v-card-title>
                                </v-card>
                            </v-flex>
                            <v-flex d-flex>

                                <v-card flat>
                                    <v-card-title primary-title>
                                        <div>
                                            <div class="headline">
                                                <v-icon color="red" large>chevron_left</v-icon>
                                                <VueNumeric read-only :precision="2" separator=","
                                                            v-model="addressBalance.totalDebits"/>
                                            </div>
                                            <div>Total Debits</div>
                                        </div>
                                    </v-card-title>
                                </v-card>
                            </v-flex>
                            <v-flex d-flex>
                                <v-card flat>
                                    <v-card-title primary-title>
                                        <div>
                                            <div class="headline">
                                                <v-icon>local_atm</v-icon>
                                                <VueNumeric read-only :precision="2" separator=","
                                                            v-model="addressBalance.totalFees"/>
                                            </div>
                                            <div>Total Fees Paid</div>
                                        </div>
                                    </v-card-title>
                                </v-card>
                            </v-flex>
                            <!--<v-flex d-flex>
                                <v-card>
                                    {{addressBalance.totalRewards}}
                                    Total Rewards
                                </v-card>
                            </v-flex>-->
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 id="addressTxnsDataTable" v-if="addressTxnList.length">
                <v-data-table
                        :headers="[
              { text: 'Block Height' , value: 'blockHeight', align: 'left'},
              { text: 'Type' , value: 'direction', align: 'center' },
              { text: 'Date' , value: 'timestamp', align: 'center'},
              { text: 'Address' , value: 'address',align: 'center'},
              { text: 'Transaction ID' , value: 'txnId', align: 'center'},
              { text: 'Amount' , value: 'amount', align: 'left'},
              { text: 'Fee' , value: 'fee',align: 'left'},
              { text: 'Actions' , value: 'actions', sortable: false, align: 'center'},
            ]"
                        :items="addressTxnListToDisplay"
                        item-key="txnId"
                        :pagination="{sortBy: 'blockHeight',descending : true, rowsPerPage: -1}"
                        hide-actions
                >
                    <template slot="items" slot-scope="props">
                        <tr>
                            <td class="text-xs-center">
                                {{ props.item.blockHeight }}
                            </td>
                            <td class="text-xs-center">
                                <v-icon :color="props.item.direction === 'incoming' ? 'green' : 'red' ">
                                    {{(props.item.direction === 'incoming' ? 'chevron_right': 'chevron_left')}}
                                </v-icon>

                                <v-icon v-if="props.item.txnTypeIcon !== 'unknown'" color="blue-grey darken-1">
                                    {{ props.item.txnTypeIcon}}
                                </v-icon>
                            </td>
                            <td class="text-xs-center">{{ props.item.relativeTime }}</td>
                            <td id=TxnBenefAddress class="text-xs-center">

                                <v-menu bottom offset-y>

                                    <v-btn
                                            slot="activator"
                                            color="grey darken"
                                            outline
                                    >
                                        {{ showFullAddress ? getTxnBeneficiaryAddress(props.item) :
                                        $options.filters.firstLastFour(getTxnBeneficiaryAddress(props.item)) }}
                                    </v-btn>

                                    <v-list>
                                        <!--                                   <v-list-tile
                                                                                   @click="goToTxnBeneficiaryAddress(getTxnBeneficiaryAddress(props.item))">
                                                                               <v-list-tile-title>Go to Address</v-list-tile-title>
                                                                           </v-list-tile>-->
                                        <v-list-tile @click="copyToClipboard(getTxnBeneficiaryAddress(props.item))">
                                            <v-list-tile-title>Copy Address</v-list-tile-title>
                                        </v-list-tile>
                                    </v-list>
                                </v-menu>

                            </td>
                            <td id=txnId class="text-xs-center">
                                <v-btn outline color="grey darken" @click="props.expanded = !props.expanded">
                                    <v-icon right left>check_circle</v-icon>
                                    <!--{{ showFullAddress ? props.item.txnId: props.item.txnId.slice(0,4) }}-->
                                </v-btn>
                            </td>
                            <td :class="props.item.direction === 'incoming' ? 'title green--text text-xs-left' : 'title red--text text-xs-left'">
                                <VueNumeric read-only :minus="true" :precision="2" separator=","
                                            :value="props.item.amountDirection"/>
                            </td>
                            <td class="text-xs-left">{{ props.item.fee }}</td>
                            <!-- @todo These functions !-->
                            <td class="text-xs-center">
                                <v-menu offset-x left bottom>
                                    <v-btn
                                            icon
                                            slot="activator">
                                        <v-icon>more_vert</v-icon>
                                    </v-btn>
                                    <v-list dense>
                                        <!--                                  <v-list-tile>
                                                                              <v-list-tile-title>Go to Transaction</v-list-tile-title>
                                                                          </v-list-tile>-->
                                        <v-list-tile @click="copyToClipboard(props.item.address)">
                                            <v-list-tile-title>Copy Address</v-list-tile-title>
                                        </v-list-tile>
                                        <v-list-tile @click="copyToClipboard(props.item.recipient)">
                                            <v-list-tile-title>Copy Destination</v-list-tile-title>
                                        </v-list-tile>
                                    </v-list>
                                </v-menu>
                            </td>
                        </tr>
                    </template>
                    <template slot="expand" slot-scope="props">
                        <TranscationsPrimary :txn="props.item"/>
                    </template>
                </v-data-table>
            </v-flex>
        </template>
        <v-dialog
                v-model="showLoadDialog"
                hide-overlay
                persistent
                width="300"
        >
            <v-card
                    color="primary"
                    dark
            >
                <v-card-text>
                    Loading...
                    <v-progress-linear
                            indeterminate
                            color="white"
                            class="mb-0"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
/**
     * @todo refactors Address methods to mixin
     */

import TranscationsPrimary from '@/components/TransactionsPrimary'
import bismuthHelpers from '../models/bismuthMixins'

export default {
  name: 'Address',
  components: { TranscationsPrimary },
  mixins: [bismuthHelpers],

  props: ['addressId', 'autoFetch', 'publicKey', 'privateKey'],
  async mounted () {
    if (this.autoFetch && this.addressIsValid) {
      await this.getAdddresAndTxns()
    }
  },
  data () {
    return {
      address: this.addressId || null,
      isLoading: false,
      rules: {
        length: len => v =>
          (v || '').length === len ||
                        `Invalid character length, required ${len}`,
        address: v =>
          (v || '').match(/^[a-f0-9]{56}$/) ||
                        'Bismuth Address should be Alphanumeric and 56 chars long',
        required: v => !!v || 'This field is required'
      },
      addressBalance: {
        balance: null,
        totalDebits: null,
        totalCredits: null,
        totalFees: null,
        totalRewards: null,
        balanceNotInMempool: null
      },
      addressExtraInfo: {
        show: true
      },
      txnListLimit: 10,
      txnListOffset: 0,
      txnListShowFullAddress: false,
      txnListFilters: [
        '{"type": "direction" , "value": "incoming"}',
        '{"type": "direction" , "value": "outgoing"}'
      ],
      addressTxnList: []
    }
  },
  filters: {
    firstLastFour (s) {
      return `${s.slice(0, 4)} ... ${s.slice(-4)}`
    }
  },
  computed: {
    /**
             * FIXME Quick hack for slot scope  on $parent data for databale
             */
    showFullAddress () {
      return this.txnListShowFullAddress
    },
    addressIsValid () {
      return this.address && this.rules.address(this.address).length === 1
    },
    addressTxnListToDisplay () {
      let txnsToShow = this.addressTxnList

      if (this.txnListFilters.length) {
        const filters = this.txnListFilters.map(JSON.parse)
        txnsToShow = txnsToShow.filter(t =>
        // Using some for 'OR'
          filters.some(({ type, value }) => t[type] === value)
        )
      }
      return txnsToShow
    },
    showLoadDialog () {
      return this.isLoading
    },
    addressKeysLoaded () {
      return !!(this.privateKey && this.publicKey)
    }
  },
  watch: {
    addressId: {
      async handler (n, o) {
        if (n !== o) {
          this.address = n
        }
      }
    },
    txnListLimit: {
      async handler (n, o) {
        if (n !== o) {
          await this.getAddressTxns()
        }
      }
    }
  },
  methods: {
    async getAddress () {
      this.isLoading = true
      try {
        const [
          balance,
          totalCredits,
          totalDebits,
          totalFees,
          totalRewards,
          balanceNotInMempool
        ] = (await (await this.$sdk).getAddressBalance(this.address)).map(
          parseFloat
        )

        this.addressBalance.balance = balance
        this.addressBalance.totalDebits = totalDebits
        this.addressBalance.totalCredits = totalCredits
        this.addressBalance.totalFees = totalFees
        this.addressBalance.totalRewards = totalRewards
        this.addressBalance.balanceNotInMempool = balanceNotInMempool
      } catch (err) {
        console.error('Error getting address balance', err)
      } finally {
        this.isLoading = false
      }
    },
    goToTxnBeneficiaryAddress (address) {
      this.$router.push({ path: `${address}?autoFetch=true` })
    },
    async getAddressTxns () {
      try {
        this.isLoading = true
        const addressTxnList = await (await this.$sdk).getAddressTxnList(
          this.address,
          this.txnListLimit
        )
        if (addressTxnList.length) {
          this.addressTxnList = addressTxnList.map(this.parseTxn)
        }
      } catch (err) {
        console.error('Error gettting Txns', { err })
      } finally {
        this.isLoading = false
      }
    },
    async getAdddresAndTxns () {
      // FIXME the way we stub the socket for once makes it impossible to do parrallel calls ://
      await this.getAddress()
      await this.getAddressTxns()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
