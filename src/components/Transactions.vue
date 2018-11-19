<template>
    <div>
        <v-layout wrap row>
            <v-flex xs12 v-if="txnData">
                <TranscationsPrimary :txn="txnData"/>
            </v-flex>
            <v-flex x12>
                <TranscationsDetails :txn="txnData"/>
                <!-- Secondary txn info -->
            </v-flex>
        </v-layout>
        <v-dialog
                v-model="loading"
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
import bismuthHelpers from '../models/bismuthMixins'
import TranscationsPrimary from '@/components/TransactionsPrimary'
import TranscationsDetails from '@/components/TransactionsDetails'

export default {
  name: 'Transcations',
  components: {TranscationsPrimary,TranscationsDetails},
  props: ['txnId', 'txn', 'addresses'],
  mixins: [bismuthHelpers],
  async mounted () {
    if (this.txnId) {
      this.getTxn()
    }
  },
  data () {
    return {
      txnData: this.txn,
      loading: false
    }
  },
  filters: {},
  computed: {},
  watch: {},
  methods: {
    async getTxn () {
      this.loading = true
      const txn = await (await this.$sdk).getTransactions(this.txnId)
      if (txn) {
        this.txnData = this.parseTxn(txn)
      }
      this.loading = false
    }
  }
}
</script>
