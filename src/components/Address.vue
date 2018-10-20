<template>
    <div id="address">
        <v-container>
            <v-layout row wrap>
                <v-flex xs4>
                    <v-card id="addressForm"
                            xs8>
                        <v-system-bar
                                color="deep-purple darken-4"
                                dark
                        >
                            <v-spacer></v-spacer>
                            <v-icon small>mdi-square</v-icon>
                            <v-icon
                                    class="ml-1"
                                    small
                            >mdi-circle
                            </v-icon>
                            <v-icon
                                    class="ml-1"
                                    small
                            >mdi-triangle
                            </v-icon>
                        </v-system-bar>
                        <v-toolbar
                                color="deep-purple accent-4"
                                cards
                                dark
                                flat
                        >
                            <v-btn icon>
                                <v-icon>mdi-arrow-left</v-icon>
                            </v-btn>
                            <v-card-title class="title font-weight-regular">Enter your Address</v-card-title>
                            <v-spacer></v-spacer>
                            <v-btn icon>
                                <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                            <v-btn icon>
                                <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                        </v-toolbar>
                        <v-form
                                class="pa-3 pt-4"
                        >
                            <v-text-field
                                    v-model="address"
                                    :rules="[rules.address,rules.required]"
                                    box
                                    color="deep-purple"
                                    counter="56"
                                    label="Bismuth Address"
                                    style="min-height: 96px"
                                    type="text"
                            ></v-text-field>
                        </v-form>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-btn
                                    flat
                                    @click="reset"
                            >
                                Clear
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                                    :disabled="!addressIsValid"
                                    :loading="isLoading"
                                    class="white--text"
                                    color="deep-purple accent-4"
                                    depressed
                                    @click="getAddress"
                            >Submit
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
                <v-flex xs8>
                    <v-card>
                        <v-list dense v-if="addressIsValid && addressBalance.balance">
                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="indigo">account_balance</v-icon>
                                </v-list-tile-action>

                                <v-list-tile-content>
                                    <v-list-tile-title>{{addressBalance.balance}}</v-list-tile-title>
                                    <v-list-tile-sub-title>Balance</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile @click="getAddressTxns">
                                <v-list-tile-action></v-list-tile-action>

                                <v-list-tile-content>
                                    <v-list-tile-title>{{addressBalance.totalCredits}} /
                                        {{addressBalance.totalDebits}}
                                    </v-list-tile-title>
                                    <v-list-tile-sub-title>Credits / Debits</v-list-tile-sub-title>
                                </v-list-tile-content>

                                <v-list-tile-action>
                                    <v-icon>table</v-icon>
                                </v-list-tile-action>
                            </v-list-tile>

                            <v-divider inset></v-divider>

                            <v-list-tile>
                                <v-list-tile-action>
                                    <v-icon color="indigo">mail</v-icon>
                                </v-list-tile-action>

                                <v-list-tile-content>
                                    <v-list-tile-title>{{addressBalance.totalFees}}</v-list-tile-title>
                                    <v-list-tile-sub-title>Total Fees Paid</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>

                            <v-list-tile @click="">
                                <v-list-tile-action></v-list-tile-action>

                                <v-list-tile-content>
                                    <v-list-tile-title>{{addressBalance.totalRewards}}</v-list-tile-title>
                                    <v-list-tile-sub-title>Total Rewards</v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>

                            <v-divider inset></v-divider>

                            <v-list-tile @click="">
                                <v-list-tile-action>
                                    <v-icon color="indigo">location_on</v-icon>
                                </v-list-tile-action>

                                <v-list-tile-content>
                                    <v-list-tile-title>Address Aliases</v-list-tile-title>
                                    <v-list-tile-sub-title>Click to load known address aliases
                                    </v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-card>
                </v-flex>
                <v-flex xs12>
                    <v-toolbar>

                            <v-text-field
                                    hide-details
                                    prepend-icon="search"
                                    @click:prepend="getAddress"
                                    single-line
                                    v-model="address"
                                    placeholder="Enter a Bismuth address"
                            ></v-text-field>


                        <v-spacer></v-spacer>

                        <v-toolbar-items v-if="addressBalance.balance">
                            <v-btn @click="getAddressTxns">
                                <v-icon>account_balance</v-icon>
                                {{addressBalance.balance}}
                            </v-btn>

                            <v-btn>
                                <v-icon>favorite</v-icon>
                                {{addressBalance.totalCredits.toFixed(2)}} /
                                {{addressBalance.totalDebits.toFixed(2)}}
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-data-table v-if="addressTxnList.length" id="addressTxnTable"
                                  :headers="[
              { text: 'blockHeight' , value: 'blockHeight'},
              { text: 'direction' , value: 'direction'},
              { text: 'timestamp' , value: 'timestamp'},
              { text: 'address' , value: 'address'},
              { text: 'recipient' , value: 'recipient'},
              { text: 'amount' , value: 'amount'},
              { text: 'fee' , value: 'fee'},
              { text: 'reward' , value: 'reward'},
              { text: 'operation' , value: 'operation'},
            ]"
                                  :items="addressTxnList"
                                  hide-actions
                                  item-key="blockHeight"
                    >
                        <template slot="items" slot-scope="props">
                            <tr @click="props.expanded = !props.expanded">
                                <td>{{ props.item.blockHeight }}</td>
                                <td class="text-xs-right">
                                    <v-icon :html="(direction === 'incoming' ? 'chevron_right': 'chevron_left')"></v-icon>
                                </td>
                                <td class="text-xs-right">{{ props.item.timestamp }}</td>
                                <td class="text-xs-right">{{ props.item.address }}</td>
                                <td class="text-xs-right">{{ props.item.recipient }}</td>
                                <td class="text-xs-right">{{ props.item.amount }}</td>
                                <td class="text-xs-right">{{ props.item.fee }}</td>
                                <td class="text-xs-right">{{ props.item.reward }}</td>
                                <td class="text-xs-right">{{ props.item.operation }}</td>
                            </tr>
                        </template>
                        <template slot="expand" slot-scope="props">
                            <v-card flat>
                                <v-card-text>
                                    <td class="text-xs-right">{{ props.item.signature }}</td>
                                    <td class="text-xs-right">{{ props.item.publicKey }}</td>
                                    <td class="text-xs-right">{{ props.item.blockHash }}</td>
                                    <td class="text-xs-right">{{ props.item.operation }}</td>
                                    <td class="text-xs-right">{{ props.item.openField }}</td>
                                </v-card-text>
                            </v-card>
                        </template>
                    </v-data-table>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
export default {
  name: 'Address',
  data: () => ({
    address: null,
    isLoading: false,
    rules: {
      length: len => v => (v || '').length === len || `Invalid character length, required ${len}`,
      address: v => (v || '').match(/^[a-f0-9]{56}$/) ||
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
    txnListLimit: 10,
    addressTxnList: []
  }),
  computed: {
    addressIsValid () {
      return this.address && (this.rules.address(this.address).length === 1)
    }
  },
  methods: {
    reset () {
      // FIXME Remove this before production
      this.address = 'd2f59465568c120a9203f9bd6ba2169b21478f4e7cb713f61eaa1ea0'
      this.addressTxnList = []
      this.addressBalance = {
        balance: null,
        totalDebits: null,
        totalCredits: null,
        totalFees: null,
        totalRewards: null,
        balanceNotInMempool: null
      }
    },
    async getAddress () {
      this.isLoading = true
      const [balance, totalCredits, totalDebits, totalFees, totalRewards, balanceNotInMempool] =
        (await (
          await this.$sdk
        ).getAddressBalance(this.address)).map(parseFloat)
      this.isLoading = false

      this.addressBalance.balance = balance
      this.addressBalance.totalDebits = totalDebits
      this.addressBalance.totalCredits = totalCredits
      this.addressBalance.totalFees = totalFees
      this.addressBalance.totalRewards = totalRewards
      this.addressBalance.balanceNotInMempool = balanceNotInMempool
    },
    async getAddressTxns () {
      const addressTxnList = await (await this.$sdk).getAddressTxnList(this.address, this.txnListLimit)
      this.addressTxnList = addressTxnList.map(([blockHeight, timestamp, address, recipient, amount, signature, publicKey, blockHash, fee, reward, operation, openField]) => ({
        blockHeight,
        timestamp,
        address,
        recipient,
        amount,
        signature,
        publicKey,
        blockHash,
        fee,
        reward,
        operation,
        openField,
        direction: (recipient === this.address) ? 'incoming' : 'outgoing'
      }))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
