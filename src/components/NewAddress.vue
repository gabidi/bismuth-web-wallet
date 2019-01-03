<template>
    <v-flex xs12 v-on:mousemove="makeEntropy">
        <v-stepper v-model="e1">
            <v-stepper-header>
                <v-stepper-step :complete="e1 > 1" step="1">Seeding your Address</v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="e1 > 2" step="2">Generating Address</v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="3">Save your info !</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-card
                            class="mb-5"
                            color="grey lighten-1"
                            height="200px"
                    >
                        <v-card-title>
                                    <span class="headline">
                                        Generate your wallet by moving your mouse.
                                    </span>
                        </v-card-title>
                        <v-card-text>
                            <v-layout row wrap justify-space-around>
                                <template v-if="!entropyStarted">
                                    <v-flex xs12>
                                        <v-card>
                                            <v-card-title class="headline warning">
                                                <v-icon>fa-exclamation</v-icon>
                                                <span class="title">
                                                Please remember to save a copy of the wallet you generate
                                            </span>
                                            </v-card-title>
                                            <v-card-text class="body-2">
                                                Make sure to export your keys when you finish generating your
                                                Address and save
                                                the file in a safe place !
                                                <span class=".font-weight-bold">
                                                            Failing to do so can result in permanent loss of funds !
                                                        </span>
                                            </v-card-text>
                                            <v-card-actions align-center>
                                                <v-spacer></v-spacer>
                                                <v-btn @click="startEntropy">Click here and then
                                                    start moving
                                                    your mouse!
                                                </v-btn>

                                            </v-card-actions>
                                        </v-card>
                                    </v-flex>

                                </template>
                                <template v-if="entropyStarted && !entropyDone">
                                    <v-flex xs12>
                                        <v-progress-linear
                                                color="error"
                                                height="20"
                                                :value="entropyProgress"
                                        ></v-progress-linear>
                                        <p class="title">
                                            {{entropyProgress}}
                                            Keep moving your mouse until the red bar is full !

                                        </p>
                                    </v-flex>
                                    <v-flex xs12>
                                        <p class="title">
                                        </p>
                                        <v-chip label color="blue" text-color="white" v-if="entropyProgressInt > 30">
                                            Thats it ! Keep going
                                            <v-icon right>fa-chevron-right</v-icon>
                                        </v-chip>
                                        <v-chip label color="purple" text-color="white" v-if="entropyProgressInt > 66">
                                            Almost there
                                            <v-icon>chevron-square-right</v-icon>
                                        </v-chip>
                                    </v-flex>
                                </template>
                                <template v-if="entropyDone">
                                    <v-flex xs12 class="success">
                                        <v-chip color="green" text-color="white" v-if="entropyProgressInt > 66">
                                            <v-icon left>fa-check</v-icon>
                                            Well done Click continue to generate your keys
                                        </v-chip>
                                    </v-flex>
                                </template>
                            </v-layout>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn
                                    color="primary"
                                    :disabled="!entropyDone"
                                    @click="stepGenSeed"
                            >
                                Enter a password
                            </v-btn>

                            <slot name="cancel">
                            </slot>
                        </v-card-actions>
                    </v-card>
                </v-stepper-content>

                <v-stepper-content step="2">
                    <v-card
                            class="mb-5"
                            color="grey lighten-1"
                            height="200px"
                    >
                        <v-card-title>
                            {{twelveWordSeed}}
                        </v-card-title>

                        <v-text-field
                                v-model="password"
                                :append-icon="passwordShow ? 'visibility_off' : 'visibility'"
                                :rules="[passwordRules.required, passwordRules.min]"
                                :type="passwordShow ? 'text' : 'password'"
                                name="input-10-1"
                                label="Normal with hint text"
                                hint="At least 8 characters"
                                counter
                                @click:append="show1 = !show1"
                        ></v-text-field>

                        <v-card-actions>
                            <v-btn
                                    :disbaled="password.length < 8"
                                    color="primary"
                                    @click="stepGenKeys"
                            >
                                Generate my Keys !
                            </v-btn>

                            <v-btn flat @click="e1--">Back</v-btn>
                        </v-card-actions>
                    </v-card>

                </v-stepper-content>

                <v-stepper-content step="3">
                    <template v-if="generatingKeys">
                        <v-card
                                class="mb-5"
                                color="grey lighten-1"
                                height="200px"
                        >

                            <v-progress-circular :indeterminate="true"/>
                            Your keys are being generated , here are some cool facts:

                        </v-card>
                    </template>
                    <template v-else>
                        <v-card>
                            <code>{{addressKeys.address}}</code>
                            <v-textarea
                                    :value="addressKeys.privateKey"
                                    label="Message"
                                    counter
                                    maxlength="120"
                                    full-width
                                    single-line
                            ></v-textarea>
                            <v-textarea
                                    :value="addressKeys.publicKey"
                                    label="Message"
                                    counter
                                    maxlength="120"
                                    full-width
                                    single-line
                            ></v-textarea>
                            <v-card-actions>

                                <v-btn
                                        color="primary"
                                        @click="exportKeys"
                                        :disabled="generatingKeys"
                                >
                                    Save to File
                                </v-btn>

                                <slot name="finalAction" :addressKeys="addressKeys" :keysHaveBeenSaved="keysHaveBeenSaved">
                                </slot>
                            </v-card-actions>
                        </v-card>
                    </template>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </v-flex>
</template>

<script>
import { seed, entropy, generate } from 'bismuth-js-crypto'
import bismuthHelpers from '../models/bismuthMixins'

export default {

  name: 'NewAddress',
  components: {},
  mixins: [bismuthHelpers],
  props: ['resetToggle'],
  mounted () {
  },
  data () {
    return {
      e1: 1,
      entropyStarted: false,
      entropyProgress: '0',
      entropy: null,
      twelveWordSeed: '',
      mnemonicDisplayEnabled: false,
      password: '',
      passwordShow: false,
      passwordRules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters'
      },
      addressKeys: {},
      generatingKeys: false,
      keysHaveBeenSaved: false
    }
  },
  filters: {},
  computed: {
    entropyDone () {
      return this.entropyStarted && this.entropyProgress === '100%'
    },
    entropyProgressInt () {
      if (!this.entropyProgress || this.entropyProgress.length < 1) {
        return null
      }
      return parseInt(this.entropyProgress.slice(0, -1))
    }
  },
  watch: {
    resetToggle () {
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  },
  methods: {
    exportKeys () {
      this.exportToFile({
        PrivateKey: this.addressKeys.privateKey,
        PublicKey: this.addressKeys.publicKey,
        Address: this.addressKeys.address
      }, `${this.addressKeys.address}-keys.json`)
      this.keysHaveBeenSaved = true
    },
    stepGenSeed () {
      this.makeMnemonicFromEntropySha()
      if (this.e1 < 2) this.e1 = 2
    },
    async stepGenKeys () {
      this.e1 = 3
      this.generatingKeys = true
      this.$nextTick(async () => {
        await this.makeKeysFromMneomic()
        this.generatingKeys = false
      })
    },
    startEntropy () {
      this.entropy = entropy()
      this.entropyStarted = true
    },
    makeEntropy (e) {
      if (!this.entropyStarted || !this.entropy) {
        return
      }
      this.entropy.entropyFromCoordinates(e)
      this.entropyProgress = this.entropy.getSeedingPercent()
    },
    makeMnemonicFromEntropySha () {
      if (!this.entropy || !this.entropy.seedingDone()) {
        console.error('Seeding isn done,buggingout')
        return
      }
      this.twelveWordSeed = seed.makeMnemonicFromEntropySha(this.entropy.getPoolSha256())
    },
    async makeKeysFromMneomic () {
      if (!this.twelveWordSeed && !this.password) {
        console.error('Twelve words not detected !')
        return
      }
      const prng = seed.makeSeededPrngFromMneomic(this.twelveWordSeed, this.password)
      const { generateKeysInSteps } = generate({ prng })
      const { privateKey, publicKey, address } = await generateKeysInSteps()
      this.$set(this.addressKeys, 'publicKey', publicKey)
      this.$set(this.addressKeys, 'privateKey', privateKey)
      this.$set(this.addressKeys, 'address', address)
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
