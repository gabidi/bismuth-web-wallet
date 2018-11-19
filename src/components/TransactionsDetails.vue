<template>
    <v-card id="txnDetailsInfo" flat>
        <v-container
                fluid
                grid-list-lg
        >
            <v-layout row wrap>
                <v-flex xs6 offset-xs1>
                    <div class="headline">blockHeight
                        <v-tooltip bottom>
                            <v-btn slot="activator" flat icon medium dark @click="copyToClipBoard">
                                <v-icon>assignment</v-icon>
                            </v-btn>
                            <span>Copy to clipboard.</span>
                        </v-tooltip>
                    </div>
                    <div>{{txn.blockHeight}}</div>
                    <div class="headline">Reward</div>
                    <div>{{txn.reward}}</div>
                </v-flex>
                <v-flex xs5>
                    <v-card>
                        <v-layout>
                            <v-flex xs12>
                                <v-card-title primary-title>
                                    <div class="headline">Signature</div>

                                </v-card-title>
                                <code>{{txn.signature}}</code>

                            </v-flex>
                        </v-layout>
                    </v-card>
                    <v-card>
                        <v-layout>
                            <v-flex xs12>
                                <v-card-title primary-title>
                                    <div class="headline">blockHash</div>

                                </v-card-title>
                                <code>{{txn.blockHash}}</code>

                            </v-flex>
                        </v-layout>
                    </v-card>
                    <v-card>
                        <v-layout>
                            <v-flex xs12>
                                <v-card-title primary-title>
                                    <div class="headline">publicKey</div>

                                </v-card-title>
                                <code>{{txn.publicKey}}</code>

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
  name: 'TranscationsDetails',
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
