<template>
    <div id="addressBook">
        <v-layout row wrap>
            <v-flex xs12>
                <template v-if="addressList.length">
                    <div v-for="(entry,index) in addressList">
                        <Address :addressId="entry.address" :publicKey="entry.publicKey" :privateKey="entry.privateKey" :autoFetch="entry.autoFetch">
                            <template slot="mainAction" slot-scope="{ getAdddresAndTxns }">
                                <v-text-field
                                        hide-details
                                        append-icon="search"
                                        @click:append="getAdddresAndTxns"
                                        @keyup.enter.capture="getAdddresAndTxns"
                                        single-line
                                        v-model="entry.address"
                                        placeholder="Enter a Bismuth address"
                                ></v-text-field>
                            </template>
                            <template slot="addressAction" slot-scope="{publicKey,privateKey}">
                                <template v-if="privateKey">
                                    <v-btn>
                                        <v-icon>fa-lock</v-icon>
                                        Send Txn
                                    </v-btn>
                                </template>
                                <v-btn v-if="index !== 0" icon small color="red" @click="removeAddress(index)">
                                    <v-icon>remove</v-icon>
                                </v-btn>
                            </template>
                        </Address>
                    </div>
                </template>
            </v-flex>
            <v-flex xs12>
                <v-menu bottom left>
                    <v-btn slot="activator" icon fab color="red">
                        <v-icon>add</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="addAddress('')">
                            <v-list-tile-title>Search</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="importDialog = true">
                            <v-list-tile-title>Import Keys</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="toggleCreateNewDialog(true)">
                            <v-list-tile-title>Create New</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-flex>
        </v-layout>

        <v-dialog v-model="createDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <NewAddress>
                <template slot="cancel">
                    <v-btn @click="createDialog = false">Cancel and Close</v-btn>
                </template>
                <template slot="finalAction" slot-scope="{addressKeys}">
                    <v-btn @click="addAddress(addressKeys)">Add to AddressBook</v-btn>
                </template>
            </NewAddress>
        </v-dialog>

    </div>

</template>

<script>
import Address from '@/components/Address'
import NewAddress from '@/components/NewAddress'

export default {
  name: 'AddressBook',
  components: { Address, NewAddress },
  mixins: [],
  data () {
    return {
      addressList: [{ addressId: null, autoFetch: false }],
      importDialog: false,
      createDialog: false
    }
  },
  provide () {
    return {
      // addAddress: this.addAddress,
      // removeAddress: this.removeAddress
    }
  },
  computed: {},
  methods: {
    toggleCreateNewDialog (value = false) {
      this.createDialog = value
    },
    addAddress ({ address, publicKey = null, privateKey = null, autoFetch = false } = {}) {
      this.addressList.push({ address, publicKey, privateKey, autoFetch })
    },
    removeAddress (index) {
        console.log(index)
      this.addressList.splice(index, 1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
