<template>
    <div id="addressBook">
        <v-layout row wrap justify-center align-center>
            <v-flex xs12>
                <template v-if="addressList.length">
                    <div v-for="(entry,index) in addressList">
                        <Address :addressId="entry.address" :publicKey="entry.publicKey" :privateKey="entry.privateKey"
                                 :autoFetch="entry.autoFetch">
                            <template slot="mainAction" slot-scope="{ getAdddresAndTxns ,addressKeysLoaded}">
                                <v-text-field
                                        hide-details
                                        :append-icon="addressKeysLoaded? 'fa-lock' : 'search'"
                                        :disabled="addressKeysLoaded"
                                        @click:append="getAdddresAndTxns"
                                        @keyup.enter.capture="getAdddresAndTxns"
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

                            <template slot="addressKeyLoadedAction" slot-scope="{publicKey,privateKey,address}">
                                <v-btn @click="signTxn = true">
                                    Send Txn
                                </v-btn>
                                <v-dialog v-model="signTxn" transition="dialog-bottom-transition">
                                    <TransactionsSign :address="address" :privateKey="privateKey"
                                                      :publicKey="publicKey"
                                                        :resetToggle="signTxn"
                                    >
                                        <template slot="txnSentAction"
                                                  slot-scope="{txnSent,amount,recipient,txnSentResult}">
                                            You sent {{amount}} to {{recipient}}
                                            <code>{{txnSentResult}}</code>
                                            <v-btn @click="signTxn=false">Close</v-btn>
                                        </template>
                                    </TransactionsSign>
                                </v-dialog>
                            </template>
                        </Address>
                    </div>
                </template>
            </v-flex>
            <v-flex xs12>
		<v-layout row wrap align-end justify-end>
			<v-flex xs2>
				<v-menu top right>
                	    		<v-btn slot="activator" icon fab bottom right color="red">
                	    		    <v-icon>fa-plus</v-icon>
                	    		</v-btn>
                	    		<v-list>
                	    		    <v-list-tile @click="addAddress('')">
                	    		        <v-list-tile-avatar>
                	    		            <v-icon>fa-search</v-icon>
                	    		        </v-list-tile-avatar>
                	    		        <v-list-tile-title>Search</v-list-tile-title>
                	    		    </v-list-tile>
                	    		    <v-list-tile @click="importDialog = true">
                	    		        <v-list-tile-avatar>
                	    		            <v-icon>fa-file-import</v-icon>
                	    		        </v-list-tile-avatar>
                	    		        <v-list-tile-title>Import Keys</v-list-tile-title>
                	    		    </v-list-tile>
                	    		    <v-list-tile @click="toggleCreateNewDialog(true)">
                	    		        <v-list-tile-avatar>
                	    		            <v-icon>fa-plus</v-icon>
                	    		        </v-list-tile-avatar>
                	    		        <v-list-tile-title>Create New</v-list-tile-title>
                	    		    </v-list-tile>
                	    		</v-list>
                		</v-menu>
			</v-flex>
		</v-layout>
            </v-flex>
        </v-layout>

        <v-dialog v-model="createDialog" fullscreen transition="dialog-bottom-transition">
            <NewAddress :resetToggle="createDialog">
                <template slot="cancel">
                    <v-btn @click="createDialog = false">Cancel and Close</v-btn>
                </template>
                <template slot="finalAction" slot-scope="{addressKeys}">
                    <v-btn @click="addAddress(addressKeys)">Add to AddressBook</v-btn>
                    <v-btn @click="createDialog = false">Close</v-btn>

                </template>
            </NewAddress>
        </v-dialog>
        <v-dialog v-model="importDialog" transition="dialog-bottom-transition">
            <ImportDer :resetToggle="importDialog">
                <template slot="derLoadedActions" slot-scope="{privateKey,publicKey,address}">
                    <v-btn @click="addAddress({privateKey,publicKey,address,autoFetch:true})">Add to AddressBook</v-btn>
                </template>
            </ImportDer>
        </v-dialog>

    </div>

</template>

<script>
    import Address from '@/components/Address'
    import NewAddress from '@/components/NewAddress'
    import ImportDer from '@/components/ImportDer'
    import TransactionsSign from '@/components/TransactionsSign'

    export default {
        name: 'AddressBook',
        components: {Address, NewAddress, ImportDer, TransactionsSign},
        mixins: [],
        data() {
            return {
                addressList: [{addressId: null, autoFetch: false}],
                importDialog: false,
                createDialog: false,
                signTxn: false,
            }
        },
        provide() {
            return {
                // addAddress: this.addAddress,
                // removeAddress: this.removeAddress
            }
        },
        computed: {},
        methods: {
            toggleCreateNewDialog(value = false) {
                this.createDialog = value
            },

            addAddress({address, publicKey = null, privateKey = null, autoFetch = false} = {}) {
                this.addressList.push({address, publicKey, privateKey, autoFetch})
            },
            removeAddress(index) {
                console.log(index)
                this.addressList.splice(index, 1)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
