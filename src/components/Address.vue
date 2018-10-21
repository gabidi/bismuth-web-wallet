<template>
    <div id="address">
        <v-container fluid grid-list-md>
            <v-layout row wrap>
                <v-flex d-flex xs12>
                    <v-toolbar id="addressDataTableToolbar">

                        <v-text-field
                                hide-details
                                prepend-icon="search"
                                @click:prepend="getAdddresAndTxns"
                                single-line
                                v-model="address"
                                placeholder="Enter a Bismuth address"
                        ></v-text-field>

                        <v-spacer></v-spacer>

                        <v-toolbar-items v-if="addressBalance.balance">
                            <v-btn>
                                <v-icon color="green darken-2">account_balance</v-icon>
                                {{addressBalance.balance.toFixed(2)}}
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-menu offset-x left bottom>
                                <v-btn
                                        icon
                                        slot="activator">
                                    <v-icon>more_vert</v-icon>
                                </v-btn>
                                <v-list dense>
                                    <v-list-tile @click="()=>addressExtraInfo.show = !addressExtraInfo.show">
                                        <v-list-tile-title>
                                            {{ (addressExtraInfo.show) ? 'Hide' : 'Show'}}
                                        </v-list-tile-title>
                                    </v-list-tile>
                                    <v-list-tile>
                                        <v-list-tile-title>Clear</v-list-tile-title>
                                    </v-list-tile>
                                    <v-divider></v-divider>
                                    <v-list-tile>
                                        <v-list-tile-title>Make Alias</v-list-tile-title>
                                    </v-list-tile>
                                    <v-list-tile>
                                        <v-list-tile-title>Import Keys</v-list-tile-title>
                                    </v-list-tile>

                                </v-list>
                            </v-menu>

                        </v-toolbar-items>
                        <v-toolbar-items v-else>
                            <v-btn icon fab top right color="red">
                                <v-icon>add</v-icon>
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                </v-flex>
                <template v-if="addressExtraInfo.show">
                    <v-flex id="addressDataTableAddressExtraInfo"
                            v-if="addressIsValid && addressBalance.balance" d-flex xs12>
                        <v-layout row wrap>
                            <v-flex id="addressExtraInfoBalance" d-flex xs6 md6>
                                <v-card>
                                    <v-card-title primary-title>
                                        <div>
                                            <div class="headline">
                                                <v-icon color="green">account_balance</v-icon>
                                                {{addressBalance.balance}}
                                            </div>
                                            <div>Balance</div>
                                        </div>
                                    </v-card-title>
                                </v-card>
                            </v-flex>
                            <v-flex id="addressExtraInfoDetails" d-flex xs6 md6>
                                <v-layout row wrap>
                                    <v-flex d-flex>
                                        <v-card>
                                            <v-card-title primary-title>
                                                <div>
                                                    <div class="headline">
                                                        <v-icon color="green">chevron_right</v-icon>
                                                        {{addressBalance.totalCredits.toFixed(2)}}
                                                    </div>
                                                    <div>Total Credits</div>
                                                </div>
                                            </v-card-title>
                                        </v-card>
                                    </v-flex>
                                    <v-flex d-flex>

                                        <v-card>
                                            <v-card-title primary-title>
                                                <div>
                                                    <div class="headline">
                                                        <v-icon color="red">chevron_left</v-icon>
                                                        {{addressBalance.totalDebits.toFixed(2)}}
                                                    </div>
                                                    <div>Total Debits</div>
                                                </div>
                                            </v-card-title>
                                        </v-card>
                                    </v-flex>
                                    <v-flex d-flex>
                                        <v-card>
                                            <v-card-title primary-title>
                                                <div>
                                                    <div class="headline">
                                                        <v-icon>local_atm</v-icon>
                                                        {{addressBalance.totalFees.toFixed(2)}}
                                                    </div>
                                                    <div>Total Fees Paid</div>
                                                </div>
                                            </v-card-title>
                                        </v-card>
                                    </v-flex>
                                    <v-flex d-flex>
                                        <v-card>
                                            {{addressBalance.totalRewards}}
                                            Total Rewards
                                        </v-card>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 id="addressDataTable" v-if="addressTxnList.length">
                        <v-data-table
                                :headers="[
              { text: 'Block Height' , value: 'blockHeight'},
              { text: 'Txn Direction' , value: 'direction'},
              { text: 'Date' , value: 'timestamp'},
              { text: 'Origin' , value: 'address'},
              { text: 'Recipient' , value: 'recipient'},
              { text: 'Amount' , value: 'amount'},
              { text: 'Fee' , value: 'fee'},
              { text: 'Actions' , value: 'actions', sortable: false, align: center},

           /*   { text: 'reward' , value: 'reward'},
              { text: 'operation' , value: 'operation'},*/
            ]"
                                :items="addressTxnList"
                                hide-actions
                                item-key="blockHeight"
                        >
                            <template slot="items" slot-scope="props">
                                <tr @click="props.expanded = !props.expanded">
                                    <td>{{ props.item.blockHeight }}</td>
                                    <td class="text-xs-right">
                                        <v-icon :color="props.item.direction === 'incoming' ? 'green' : 'red' ">
                                            {{(props.item.direction === 'incoming' ? 'chevron_right': 'chevron_left')}}
                                        </v-icon>
                                    </td>
                                    <td class="text-xs-right">{{ props.item.relativeTime }}</td>
                                    <td class="text-xs-right">{{ props.item.address }}</td>
                                    <td class="text-xs-right">{{ props.item.recipient }}</td>
                                    <td class="text-xs-right">{{ props.item.amount }}</td>
                                    <td class="text-xs-right">{{ props.item.fee }}</td>
                                    <!-- @todo These functions !-->
                                    <td class="text-xs-center">
                                        <v-menu offset-x left bottom>
                                            <v-btn
                                                    icon
                                                    slot="activator">
                                                <v-icon>more_vert</v-icon>
                                            </v-btn>
                                            <v-list dense>
                                                <v-list-tile>
                                                    <v-list-tile-title>Transaction Details</v-list-tile-title>
                                                </v-list-tile>
                                                <v-list-tile>
                                                    <v-list-tile-title>Goto Origin</v-list-tile-title>
                                                </v-list-tile>
                                                <v-list-tile>
                                                    <v-list-tile-title>Goto Recepient</v-list-tile-title>
                                                </v-list-tile>
                                            </v-list>
                                        </v-menu>
                                    </td>

                                    <!--                  <td class="text-xs-right">{{ props.item.reward }}</td>
                                                      <td class="text-xs-right">{{ props.item.operation }}</td>-->
                                </tr>
                            </template>
                            <!--<template slot="expand" slot-scope="props">
                                <v-card flat>
                                    <v-card-actions>

                                        <td></td>
                                        <td>
                                            <v-btn>
                                                Check Txn Details
                                            </v-btn>
                                        </td>
                                        <td></td>
                                        <td class="text-xs-right">
                                            <v-btn>
                                                View Origin Account
                                            </v-btn>
                                        </td>
                                        <td class="text-xs-right">
                                            <v-btn>
                                                View Reciept Account
                                            </v-btn>
                                        </td>
                                    </v-card-actions>
                                </v-card>
                            </template>-->
                        </v-data-table>
                    </v-flex>
                </template>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
  import TimeAgo from 'javascript-time-ago'
  import en from 'javascript-time-ago/locale/en'

  TimeAgo.locale(en)
  const timeAgo = new TimeAgo('en-US')
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
      addressExtraInfo: {
        show: true
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
        this.isLoading = true
        const addressTxnList = await (await this.$sdk).getAddressTxnList(this.address, this.txnListLimit)
        this.isLoading = false
        if (addressTxnList.length) {
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
            relativeTime: timeAgo.format(parseFloat(timestamp) * 1000, 'twitter'),
            direction: (recipient === this.address) ? 'incoming' : 'outgoing'
          }))
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
