<template>
    <v-card id="txnPrimaryInfo" flat>
        <v-container
                fluid
                grid-list-lg
        >
            <v-layout row wrap>
                <v-flex xs6 offset-xs1>
                    <div class="headline">Transaction Id
                        <v-tooltip bottom>
                            <v-btn slot="activator" flat icon medium dark @click="copyToClipboard(txn.txnId)">
                                <v-icon>assignment</v-icon>
                            </v-btn>
                            <span>Copy to clipboard.</span>
                        </v-tooltip>
                    </div>
                    <div>{{txn.txnId}}</div>
                    <div class="headline">Date Time</div>
                    <div>{{new Date(txn.timestamp*1000).toString()}}</div>
                </v-flex>
                <v-flex xs5>
                    <v-card>
                        <v-layout>
                            <v-flex xs5 align-center justify-center>
                                <v-avatar :tile="true" size="64" dark>
                                    <v-icon large>{{getTxnTypeIcon(txn.txnType)}}
                                    </v-icon>
                                </v-avatar>
                            </v-flex>
                            <v-flex xs7>
                                <v-card-title primary-title>
                                    <div>
                                        <div class="headline">{{txn.txnType}}</div>
                                        <div>{{txn.openField}}</div>
                                    </div>
                                </v-card-title>
                                <v-card-actions>
<!--
                                    <v-btn>{{ txn.txnType === 'message' ? 'Reply' : 'Send to Address'}}</v-btn>
-->
                                    <v-btn :to="{path: `/txns/${txn.txnId}`}">details</v-btn>
                                </v-card-actions>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>
<script>
import bismuthHelpers from '../models/bismuthMixins'

export default {
  name: 'TranscationsPrimary',
  props: ['txn'],
  mixins: [bismuthHelpers],
  async mounted () {
  },
  data () {
    return {}
  },
  filters: {},
  computed: {},
  watch: {},
  methods: {
    copyToClipBoard () {
    }
  }
}
</script>
