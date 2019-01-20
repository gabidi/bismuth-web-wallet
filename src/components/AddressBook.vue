<template>
    <div id="addressBook">
        <v-layout row wrap>
            <v-flex xs12>
		    <!-- @todo HERE: Add linear progress bar + watch and refresh addresses on change from true to false-->
                <v-alert type="info" :value="addressbookMempoolTxns.length" transition="scale-transition">
                    <span class="headline">
                        Address book addresses have {{addressbookMempoolTxns.length}} pending transactions (in mempool)
                    </span>
                    <v-list two-line>
                        <v-list-tile v-for="txn in addressbookMempoolTxns">
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    ({{txn.mempoolAddressStatus}}) {{txn.address}}
                                </v-list-tile-title>
                                <v-list-tile-sub-title>
                                    Amount: {{txn.amount}}, From: {{txn.memPoolAddress}}, Date {{txn.timestampMoment}} (
                                    TimeStamp: {{ txn.timestamp}} )
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-alert>
            </v-flex>
            <template v-if="addressList.length">
                <v-flex xs12 v-for="(entry,index) in addressList" mb-1>
                    <v-layout row wrap>
                        <v-flex xs10 offset-xs1>
                            <v-card flat pa-1>
                                <v-card-text>
                                    <Address :addressId="entry.address" :publicKey="entry.publicKey"
                                             :privateKey="entry.privateKey"
                                             :autoFetch="entry.autoFetch">
                                        <template slot="mainAction"
                                                  slot-scope="{ getAdddresAndTxns ,addressKeysLoaded,addressIsValid}">
                                            <v-text-field
                                                    hide-details
                                                    :append-icon="addressKeysLoaded? 'fa-lock' : 'search'"
                                                    :disabled="addressKeysLoaded"
                                                    @click:append="addressIsValid ? getAdddresAndTxns() : null"
                                                    @keyup.enter.capture="addressIsValid ? getAdddresAndTxns() : null"
                                                    single-line
                                                    v-model="entry.address"
                                                    placeholder="Enter a Bismuth address"
                                            ></v-text-field>
                                        </template>

                                        <template slot="addressVertMenu" slot-scope="{addressKeysLoaded}">

                                            <v-list-tile v-if="!addressKeysLoaded" @click="importDialog = true">
                                                <v-list-tile-avatar>
                                                    <v-icon>fa-file-import</v-icon>
                                                </v-list-tile-avatar>
                                                <v-list-tile-title>Import Keys</v-list-tile-title>
                                            </v-list-tile>
                                            <v-list-tile v-if="addressList.length > 1" icon small color="red"
                                                         @click="removeAddress(index)">
                                                <v-list-tile-avatar>
                                                    <v-icon>fa-minus</v-icon>
                                                </v-list-tile-avatar>
                                                <v-list-tile-title>Delete</v-list-tile-title>
                                            </v-list-tile>
                                        </template>

                                        <template slot="addressKeyLoadedAction"
                                                  slot-scope="{publicKey,privateKey,address}">
                                            <v-btn @click="entry.signTxnModal = true" flat>
                                                Send Txn
                                            </v-btn>
                                            <v-dialog v-model="entry.signTxnModal"
                                                      transition="dialog-bottom-transition">
                                                <TransactionsSign :address="address" :privateKey="privateKey"
                                                                  :publicKey="publicKey"
                                                                  :resetToggle="entry.signTxnModal"
                                                >
                                                    <template slot="txnSentAction"
                                                              slot-scope="{txnSent,amount,recipient,txnSentResult,txnSentResultSuccess}">
                                                        <template v-if="txnSentResultSuccess">
                                                            <p class="headline"> You successfully sent {{amount}} to
                                                                {{recipient}} !</p>
                                                            <p class="subheading">Please allow upto 15 seconds for the
                                                                mempool to refresh.</p>
                                                        </template>
                                                        <template v-else>
                                                            <span class="headline">Server declined your transaction !</span>
                                                            <code>
                                                                {{txnSentResult}}
                                                            </code>
                                                        </template>
                                                        <v-btn @click="entry.signTxnModal=false">Close</v-btn>
                                                    </template>
                                                </TransactionsSign>
                                            </v-dialog>
                                        </template>
                                    </Address>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </template>
            <v-flex xs12>
                <v-layout row wrap justify-end>
                    <v-flex xs2 align-right>
                        <v-menu top right>
                            <v-btn slot="activator" icon fab large bottom color="red">
                                <v-icon>fa-plus</v-icon>
                            </v-btn>
                            <v-list>
                                <v-list-tile @click="addAddress()">
                                    <v-list-tile-avatar>
                                        <v-icon>fa-search</v-icon>
                                    </v-list-tile-avatar>
                                    <v-list-tile-title>Lookup an Address</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="importDialog = true">
                                    <v-list-tile-avatar>
                                        <v-icon>fa-file-import</v-icon>
                                    </v-list-tile-avatar>
                                    <v-list-tile-title>Import Address & Keys</v-list-tile-title>
                                </v-list-tile>
                                <v-list-tile @click="toggleCreateNewDialog(true)">
                                    <v-list-tile-avatar>
                                        <v-icon>fa-plus</v-icon>
                                    </v-list-tile-avatar>
                                    <v-list-tile-title>Create New Address & Keys</v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                    </v-flex>
                </v-layout>
            </v-flex>


            <v-dialog v-model="createDialog" fullscreen transition="dialog-bottom-transition" lazy>
                <NewAddress :resetToggle="createDialog">
                    <template slot="cancel">
                        <v-btn @click="createDialog = false">Cancel and Close</v-btn>
                    </template>
                    <template slot="finalAction" slot-scope="{addressKeys,keysHaveBeenSaved}">
                        <v-btn @click="addAddress(addressKeys)">Add to AddressBook</v-btn>
                        <v-btn :disabled="!keysHaveBeenSaved" @click="createDialog = false">
                            {{(!keysHaveBeenSaved) ? 'Save your keys please' : 'Close'}}
                        </v-btn>

                    </template>
                </NewAddress>
            </v-dialog>
            <v-dialog v-model="importDialog" transition="dialog-bottom-transition">
                <ImportDer :resetToggle="importDialog">
                    <template slot="derLoadedActions" slot-scope="{privateKey,publicKey,address}">
                        <v-btn @click="()=>addAddress({privateKey,publicKey,address,autoFetch:true})">Add to AddressBook
                        </v-btn>
                    </template>
                </ImportDer>
            </v-dialog>
        </v-layout>


    </div>

</template>

<script>
import Address from '@/components/Address'
import NewAddress from '@/components/NewAddress'
import ImportDer from '@/components/ImportDer'
import TransactionsSign from '@/components/TransactionsSign'
import moment from 'moment'

export default {
  name: 'AddressBook',
  components: { Address, NewAddress, ImportDer, TransactionsSign },
  mixins: [],
  data () {
    return {
      addressList: [{ address: null, autoFetch: false }],
      importDialog: false,
      createDialog: false,
      signTxn: false,
      memPoolInterval: null,
      memPool: []
    }
  },
  mounted () {
    try {
      const addressList = JSON.parse(window.localStorage.getItem('bismuthAddressBook'))
      if (addressList && addressList.length) {
        this.addressList.splice(0, this.addressList.length, ...addressList)
      }
    } catch (err) {
      // Clean storage if corrupted
      console.error('Error parsing addressList', err)
      localStorage.removeItem('bismuthAddressBook')
    }

    this.memPoolInterval = setInterval(async () => {
      const mempool = await (await this.$sdk).getMempoolTxns()
      this.memPool = mempool
    }, 10000)
  },
  beforeDestroy () {
    clearInterval(this.memPoolInterval)
  },
  computed: {
    addressbookMempoolTxns () {
      if (!this.memPool.length) {
        return []
      }
      return this.memPool.map(([
        timestamp,
        memPoolAddress,
        memPoolrecipient,
        amount,
        signature
      ]) => {
        const { address } = this.addressList.find(({ address }) => address === memPoolAddress || address === memPoolrecipient) || { address: null }
        if (address) {
          return {
            timestamp: parseInt(timestamp),
            timestampMoment: moment.unix(parseInt(timestamp)),
            address,
            mempoolAddressStatus: (address === memPoolAddress) ? 'outgoing' : 'incoming',
            memPoolAddress,
            memPoolrecipient,
            amount,
            signature
          }
        }
      }).filter(x => !!x)
    }
  },
  provide () {
    return {
      // addAddress: this.addAddress,
      // removeAddress: this.removeAddress
    }
  },
  watch: {
    addressList (o, n) {
      localStorage.setItem('bismuthAddressBook',
        // Save address only, no keys
        JSON.stringify(this.addressList.map(({ address, autoFetch }) => ({ address, autoFetch })))
      )
    },
    addressbookMempoolTxns (v) {

    }
  },
  methods: {
    toggleCreateNewDialog (value = false) {
      this.createDialog = value
    },

    addAddress ({ address, publicKey = null, privateKey = null, autoFetch = false, signTxnModal = false, memPoolStatus = null } = {}) {
      const addressIndex = this.addressList.findIndex(x => x.address === address)
      // If address is already in list ignore unless adding keys
      if (addressIndex > -1) {
        if (!publicKey || !privateKey) {
          return
        }
        this.addressList.splice(addressIndex, 1, {
          address,
          publicKey,
          privateKey,
          autoFetch,
          signTxnModal,
          memPoolStatus
        })
      } else {
        this.addressList.push({ address, publicKey, privateKey, autoFetch, signTxnModal, memPoolStatus })
      }
    },
    removeAddress (index) {
      this.addressList.splice(index, 1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
