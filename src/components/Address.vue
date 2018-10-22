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
                                @keyup.enter.capture="getAdddresAndTxns"
                                single-line
                                v-model="address"
                                placeholder="Enter a Bismuth address"
                        ></v-text-field>

                        <v-spacer></v-spacer>

                        <v-toolbar-items v-if="addressBalance.balance">
                            <v-btn @click="getAdddresAndTxns">
                                <v-icon color="deep-purple accent-2">account_balance</v-icon>
                                {{addressBalance.balance.toFixed(2)}}
                            </v-btn>

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
                                    <v-list-tile @click="reset">
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
                            <v-flex id="addressExtraInfoBalance" d-flex xs6 md4>
                                <v-card>
                                    <v-card-title primary-title>
                                        <div>
                                            <div class="display-2">
                                                <v-icon color="deep-purple accent-2" large>account_balance</v-icon>
                                                {{addressBalance.balance}}
                                            </div>
                                            <div class="headline">Balance</div>
                                        </div>
                                    </v-card-title>
                                </v-card>
                            </v-flex>
                            <v-flex id="addressExtraInfoDetails" d-flex xs6 md6 offset-md2>
                                <v-layout row wrap>
                                    <v-flex d-flex>
                                        <v-card>
                                            <v-card-title primary-title>
                                                <div>
                                                    <div class="headline">
                                                        <v-icon color="green" large>chevron_right</v-icon>
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
                                                        <v-icon color="red" large>chevron_left</v-icon>
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
                    <v-flex xs12 id="addressDataTable" v-if="addressTxnList.length">
                        <v-data-table
                                :headers="[
              { text: 'Block Height' , value: 'blockHeight', align: 'left'},
              { text: 'Type' , value: 'direction', align: 'center' },
              { text: 'Date' , value: 'timestamp', align: 'center'},
              { text: 'Origin' , value: 'address'},
              { text: 'Recipient' , value: 'recipient'},
              { text: 'Amount' , value: 'amount'},
              { text: 'Fee' , value: 'fee'},
              { text: 'Actions' , value: 'actions', sortable: false, align: 'center'},
            ]"
                                :items="addressTxnListToDisplay"
                                item-key="blockHeight"
                                :pagination="{sortBy: 'blockHeight',descending : true, rowsPerPage: -1}"
                                hide-actions
                        >
                            <template slot="items" slot-scope="props">
                                <tr>
                                    <td class="text-xs-center">{{ props.item.blockHeight }}</td>
                                    <td class="text-xs-center">
                                        <v-icon :color="props.item.direction === 'incoming' ? 'green' : 'red' ">
                                            {{(props.item.direction === 'incoming' ? 'chevron_right': 'chevron_left')}}
                                        </v-icon>

                                        <v-icon v-if="props.item.txnTypeIcon !== 'unknown'" color="blue-grey darken-1">
                                            {{ props.item.txnTypeIcon}}
                                        </v-icon>
                                    </td>
                                    <td class="text-xs-right">{{ props.item.relativeTime }}</td>
                                    <td class="text-xs-right">
                                        {{ showFullAddress ? props.item.address :   $options.filters.firstLastFour(props.item.address) }}
                                    </td>
                                    <td class="text-xs-right">
                                        {{ showFullAddress ? props.item.recipient : $options.filters.firstLastFour(props.item.recipient) }}
                                    </td>
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
                                                <v-list-tile :to="{ path: `${props.item.address}?autoFetch=true`}">
                                                    <v-list-tile-title>
                                                        Goto Origin
                                                    </v-list-tile-title>
                                                </v-list-tile>
                                                <v-list-tile :to="{ path: `${props.item.recipient}?autoFetch=true`}">
                                                    <v-list-tile-title>Goto Recepient</v-list-tile-title>
                                                </v-list-tile>
                                            </v-list>
                                        </v-menu>
                                    </td>
                                </tr>
                            </template>
                        </v-data-table>
                    </v-flex>
                </template>
            </v-layout>
        </v-container>
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
    </div>
</template>

<script>
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.locale(en);
const timeAgo = new TimeAgo("en-US");
export default {
  name: "Address",
  props: ["addressId", "autoFetch"],
  async mounted() {
    if (this.autoFetch && this.addressIsValid) {
      await this.getAdddresAndTxns();
    }
  },
  data() {
    return {
      address: this.addressId || null,
      isLoading: false,
      rules: {
        length: len => v =>
          (v || "").length === len ||
          `Invalid character length, required ${len}`,
        address: v =>
          (v || "").match(/^[a-f0-9]{56}$/) ||
          "Bismuth Address should be Alphanumeric and 56 chars long",
        required: v => !!v || "This field is required"
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
      txnListShowFullAddress: true,
      txnListFilters: [
        '{"type": "direction" , "value": "incoming"}',
        '{"type": "direction" , "value": "outgoing"}'
      ],
      addressTxnList: []
    };
  },
  filters: {
    firstLastFour(s) {
      return `${s.slice(0, 4)} ... ${s.slice(-4)}`;
    }
  },
  computed: {
    /**
     * FIXME Quick hack for slot scope  on $parent data for databale
     */
    showFullAddress() {
      return this.txnListShowFullAddress;
    },
    addressIsValid() {
      return this.address && this.rules.address(this.address).length === 1;
    },
    addressTxnListToDisplay() {
      let txnsToShow = this.addressTxnList;

      if (this.txnListFilters.length) {
        const filters = this.txnListFilters.map(JSON.parse);
        txnsToShow = txnsToShow.filter(t =>
          // Using some for 'OR'
          filters.some(({ type, value }) => t[type] === value)
        );
      }
      return txnsToShow;
    },
    showLoadDialog() {
      return this.isLoading;
    }
  },
  watch: {
    addressId: {
      async handler(n, o) {
        if (this.autoFetch && n !== o) {
          console.log("add", n, o);

          this.address = n;
          await this.getAdddresAndTxns();
        }
      }
    },
    txnListLimit: {
      async handler(n, o) {
        if (n !== o) {
          await this.getAddressTxns();
        }
      }
    }
  },
  methods: {
    reset() {
      // FIXME Remove this before production
      this.addressTxnList = [];
      this.addressBalance = {
        balance: null,
        totalDebits: null,
        totalCredits: null,
        totalFees: null,
        totalRewards: null,
        balanceNotInMempool: null
      };
    },
    async getAddress() {
      this.isLoading = true;
      const [
        balance,
        totalCredits,
        totalDebits,
        totalFees,
        totalRewards,
        balanceNotInMempool
      ] = (await (await this.$sdk).getAddressBalance(this.address)).map(
        parseFloat
      );
      this.isLoading = false;
      this.addressBalance.balance = balance;
      this.addressBalance.totalDebits = totalDebits;
      this.addressBalance.totalCredits = totalCredits;
      this.addressBalance.totalFees = totalFees;
      this.addressBalance.totalRewards = totalRewards;
      this.addressBalance.balanceNotInMempool = balanceNotInMempool;
    },
    /**
     * @Todo move this to model
     * @param operation
     * @param openField
     */
    getTxnType({ operation, openField }) {
      if (openField.indexOf("msg=") === 0) {
        return "message";
      }
      const type = operation.match(
        /^([token|hypernode|tx]+){1}:*([a-zA-Z]+)*.*$/
      );
      if (type) {
        const [, txnNameSpace, txnNameSpaceType] = type;
        return txnNameSpace;
      }

      if (!operation || parseInt(operation) === 0) {
        return "normal";
      }
      console.warn("Got unknown TXN type", { operation, openField, type });
      return "unknown";
    },
    getTxnTypeIcon(txnType) {
      switch (txnType) {
        case "normal":
          return "format_bold";
        case "token":
          return "star_border";
        case "message":
          return "sms";
        default:
          return "unknown";
      }
    },
    async getAddressTxns() {
      let addressTxnList;
      try {
        this.isLoading = true;
        addressTxnList = await (await this.$sdk).getAddressTxnList(
          this.address,
          this.txnListLimit
        );
      } catch (err) {
        console.error("getAddressTxns", { err });
      } finally {
        this.isLoading = false;
      }
      if (addressTxnList.length) {
        this.addressTxnList = addressTxnList.map(
          ([
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
            openField
          ]) => {
            const txnType = this.getTxnType({ operation, openField });

            return {
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
              relativeTime: timeAgo.format(
                parseFloat(timestamp) * 1000,
                "twitter"
              ),
              direction: recipient === this.address ? "incoming" : "outgoing",
              txnType,
              txnTypeIcon: this.getTxnTypeIcon(txnType)
            };
          }
        );
      }
    },
    async getAdddresAndTxns() {
      // FIXME the way we stub the socket for once makes it impossible to do parrallel calls ://
      await this.getAddress().then(this.getAddressTxns);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
