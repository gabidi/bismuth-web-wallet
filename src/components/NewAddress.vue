<template>
    <v-card v-on:mousemove="makeEntropy">
        <v-flex xs12>
            <v-stepper v-model="e1">
                <v-stepper-header>
                    <v-stepper-step :complete="e1 > 1" step="1">Seeding your Address</v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step :complete="e1 > 2" step="2">Generating Address</v-stepper-step>

                </v-stepper-header>

                <v-stepper-items>
                    <v-stepper-content step="1">
                        <v-card
                                class="mb-5"
                                height="300px"
                        >
                            <v-card-title>
                                    <span class="headline">
                                        Generate Wallet Entropy
                                    </span>
                            </v-card-title>
                            <v-card-text>
                                <v-layout row wrap justify-space-around>
                                    <template v-if="!entropyStarted">
                                        <v-flex xs12>
                                            <p class="subheading">The first step to generating a secure wallet is to
                                                start with truly random Data. Moving your mouse around like monkey does
                                                the trick :)</p>
                                        </v-flex>
                                        <v-btn
                                                right
                                                color="primary"
                                                :disabled="entropyStarted"
                                                @click="startEntropy"
                                        >
                                            Click here to start generating your wallet !
                                        </v-btn>
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
                                                Keep moving your mouse in random manner until the red bar is full !

                                            </p>
                                        </v-flex>
                                        <v-flex xs12>
                                            <p class="title">
                                            </p>
                                            <v-chip label color="blue" text-color="white"
                                                    v-if="entropyProgressInt > 30">
                                                Thats it ! Keep going
                                                <v-icon right>fa-chevron-right</v-icon>
                                            </v-chip>
                                            <v-chip label color="purple" text-color="white"
                                                    v-if="entropyProgressInt > 66">
                                                Almost there
                                                <v-icon right>fa-chevron-right</v-icon>
                                            </v-chip>
                                        </v-flex>
                                    </template>
                                    <template v-if="entropyDone">
                                        <v-flex xs12 class="success">
                                            <v-layout row wrap>

                                                <v-flex xs1>
                                                    <v-chip color="green" text-color="white"
                                                            v-if="entropyProgressInt > 66">
                                                        <v-icon left large>fa-check</v-icon>
                                                    </v-chip>
                                                </v-flex>
                                                <v-flex xs8>
                                                    <p class="headline">Well done ! You've made enough randomness to
                                                        move on</p>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                        <v-btn
                                                right
                                                color="primary"
                                                :disabled="!entropyDone"
                                                @click="stepGenSeed"
                                        >
                                            Click here to continue!
                                        </v-btn>
                                    </template>
                                </v-layout>
                            </v-card-text>
                        </v-card>
                        <slot name="cancel">
                        </slot>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <v-card
                                class="mb-5"
                                height="100%"
                        >
                            <v-card-title>
                                <p class="headline">Key Generation and Storage</p>
                            </v-card-title>

                            <v-card-text>
                                <template v-if="!generatingKeys && !hasKeys">
                                    <v-layout row wrap space-round>

                                        <v-flex xs12>
                                            <p class="subheading">In order to provide the maximum security possible when
                                                creating your wallet , please enter a password that will be used as part
                                                of
                                                the key creation process.
                                            </p>
                                        </v-flex>
                                        <v-flex xs4>
                                            <v-text-field
                                                    v-model="password"
                                                    :append-icon="passwordShow ? 'visibility_off' : 'visibility'"
                                                    :rules="[passwordRules.required, passwordRules.min]"
                                                    :type="passwordShow ? 'text' : 'password'"
                                                    name="passwordInput"
                                                    label="Enter a secure password"
                                                    hint="At least 8 characters,"
                                                    counter
                                                    @click:append="showPassword = !showPassword"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs4>
                                            <v-btn
                                                    :disabled="password.length < 8"
                                                    color="primary"
                                                    @click="stepGenKeys"
                                            >
                                                Generate my Keys !
                                            </v-btn>
                                        </v-flex>
                                        <v-flex xs12>
                                            <p class="warning subheading">It's important to remember the password you
                                                use in order to able to recover your keys using your twelve word
                                                seed </p>
                                        </v-flex>
                                    </v-layout>

                                </template>

                                <template v-if="generatingKeys">
                                    <v-flex xs12>
                                        <v-layout row wrap>
                                            <v-flex xs1>
                                                <v-progress-circular
                                                        :size="70"
                                                        :width="7"
                                                        color="purple"
                                                        :indeterminate="true"/>
                                            </v-flex>
                                            <v-flex xs11>
                                                <p class="subheading">Your keys are being generated, this might take a
                                                    few
                                                    minutes depending on your device's speed. The screen will
                                                    automatically
                                                    update when this is done.</p>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>
                                </template>
                                <v-flex xs12 v-if="generatingKeys || hasKeys" mt-2 mb-2>
                                    <v-card>
                                        <v-card-title><span class="title">
                                            <template v-if="generatingKeys">
                                                While you wait ...
                                            </template>
                                            Like or Hate this App?</span></v-card-title>
                                        <v-card-text>
                                            <p class="subheading">
                                                Your feed back is essential !
                                                <a href="https://github.com/gabidi/bismuth-web-wallet" target="new">Star
                                                    github or open an issue with a suggestion!</a>
                                                (Opens in new window)
                                            </p>
                                        </v-card-text>
                                    </v-card>
                                </v-flex>
                                <template v-if="!generatingKeys && hasKeys">
                                    <v-flex xs12>
                                        <v-card>
                                            <v-card-title><span class="headline">Your Address & Keys are Ready !</span>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-layout row wrap>
                                                    <v-flex xs12>
                                                        <v-card>
                                                            <v-card-text>
                                                                <v-layout row wrap>
                                                                    <v-flex xs12>
                                                                        Your twelve word seed:
                                                                        <v-chip v-for="(word) in twelveWordSeed.split(' ')">
                                                                            {{word}}
                                                                        </v-chip>
                                                                    </v-flex>
                                                                    <v-flex xs12>
                                                                        <p>The combination of your tweleve word seed and
                                                                            your
                                                                            password
                                                                            (entered
                                                                            previously) can be used to recreate your
                                                                            address
                                                                            and
                                                                            keys </p>
                                                                    </v-flex>
                                                                </v-layout>
                                                            </v-card-text>
                                                        </v-card>
                                                    </v-flex>
                                                    <v-divider></v-divider>
                                                    <v-flex xs12>
                                                        <v-card>
                                                            <v-card-title>Your Bismuth address:
                                                                <code>{{addressKeys.address}}</code></v-card-title>
                                                            <v-card-text>
                                                                <v-layout>
                                                                    <v-flex xs6>
                                                                        <v-textarea
                                                                                :value="addressKeys.privateKey"
                                                                                label="Message"
                                                                                counter
                                                                                maxlength="120"
                                                                                full-width
                                                                                single-line
                                                                        ></v-textarea>
                                                                    </v-flex>
                                                                    <v-flex xs6>
                                                                        <v-textarea
                                                                                :value="addressKeys.publicKey"
                                                                                label="Message"
                                                                                counter
                                                                                maxlength="120"
                                                                                full-width
                                                                                single-line
                                                                        ></v-textarea>
                                                                    </v-flex>
                                                                </v-layout>
                                                            </v-card-text>
                                                            <v-card-actions>
                                                                <v-btn
                                                                        color="primary"
                                                                        @click="exportKeys"
                                                                        :disabled="generatingKeys"
                                                                >
                                                                    Save to File
                                                                </v-btn>

                                                                <slot name="finalAction" :addressKeys="addressKeys"
                                                                      :keysHaveBeenSaved="keysHaveBeenSaved">
                                                                </slot>
                                                            </v-card-actions>
                                                        </v-card>
                                                    </v-flex>
                                                </v-layout>
                                            </v-card-text>
                                        </v-card>
                                    </v-flex>
                                </template>
                            </v-card-text>
                        </v-card>

                    </v-stepper-content>

                    <v-stepper-content step="3"></v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-flex>
        <v-dialog :value="showUserConfirmDialog" :persistent="true" width="400">
            <v-flex xs12>
                <v-card>
                    <v-card-title class="headline warning">
                        <p class="title">
                            LOSS OF FUNDS WARNING
                        </p>
                    </v-card-title>
                    <v-card-text class="body-2">
                        <v-layout row wrap>
                            <v-flex xs12>
                                <ul>
                                    <li>This is BETA software, the security of keys generated by this wallet has not
                                        been
                                        validated !
                                        We highly recommend you generate your wallet using the Python implmentation and
                                        import
                                        the der for use in the web wallet
                                    </li>

                                    <li>
                                        Due to the above addresses generated by this wallet should not used for long
                                        term storage, but for testing and
                                        temporary.
                                    </li>

                                    <li>Make sure to export your keys when you finish generating your
                                        Address and save
                                        the file in a safe place !
                                    </li>
                                </ul>
                            </v-flex>

                            <v-flex xs12>
                                <p class="headline">Failing to read and respect the above will result in permanent loss
                                    of funds
                                    !</p>
                            </v-flex>

                        </v-layout>
                    </v-card-text>
                    <v-card-actions align-center>
                        <v-spacer></v-spacer>
                        <v-btn @click="startEntropy">I understand</v-btn>

                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-dialog>
    </v-card>
</template>

<script>
import { seed, entropy, generate } from 'bismuth-js-crypto'
import bismuthHelpers from '../models/bismuthMixins'

const initialState = () => ({
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
  keysHaveBeenSaved: false,
  showUserConfirmDialog: false,
  showPassword: false
})
export default {

  name: 'NewAddress',
  components: {},
  mixins: [bismuthHelpers],
  props: ['resetToggle'],
  mounted () {
    this.$nextTick(() => this.showUserConfirmDialog = true)
  },
  beforeDestroy () {
    this.entropyStarted = false
  },
  data: initialState,
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
    },
    hasKeys () {
      return this.addressKeys && this.addressKeys.privateKey && this.addressKeys.publicKey && this.addressKeys.address
    }
  },
  watch: {
    resetToggle () {
      Object.assign(this.$data, initialState.apply(this))
    }
  },
  methods: {
    exportKeys () {
      this.exportToFile({
        "Private Key": this.addressKeys.privateKey,
        "Public Key": this.addressKeys.publicKey,
        Address: this.addressKeys.address
      }, `${this.addressKeys.address}-keys.json`)
      this.keysHaveBeenSaved = true
    },
    stepGenSeed () {
      this.makeMnemonicFromEntropySha()
      if (this.e1 < 2) this.e1 = 2
    },
    async stepGenKeys () {
      this.generatingKeys = true
      this.$nextTick(async () => {
        await this.makeKeysFromMneomic()
        this.generatingKeys = false
      })
    },
    startEntropy () {
      this.showUserConfirmDialog = false
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
