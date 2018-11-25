<template>
    <div id="newAddressStepper">
        <v-layout v-on:mousemove="makeEntropy">
            <v-flex xs12>
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
                            <v-progress-linear
                                    color="error"
                                    height="20"
                                    :value="entropyProgress"
                            ></v-progress-linear>

                            <v-alert warning>Save your key blah blah, only you can access it blah blah I understand
                            </v-alert>
                            <v-btn v-if="!entropyStarted" @click="startEntropy">Click here then move your mouse !
                            </v-btn>
                            <template v-if="entropyStarted && !entropyDone">
                                <template v-if="entropyProgressInt > 10">
                                     Keep going !
                                </template>
                                <span class="title">{{entropyProgress}}</span>
                                <span class="subheading">Keep moving your mouse until the red bar is full !</span>
                            </template>
                            <template v-if="entropyDone">
                                <span class="title">DONE !! Click continue to generate your keys</span>
                            </template>
                        </v-card>

                        <v-btn
                                color="primary"
                                :disabled="!entropyDone"
                                @click="stepGenSeed"
                        >
                            Enter a password
                        </v-btn>

                        <v-btn flat>Cancel</v-btn>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <v-card
                                class="mb-5"
                                color="grey lighten-1"
                                height="200px"
                        >
                            {{twelveWordSeed}}

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


                        </v-card>


                        <v-btn
                                :disbaled="password.length < 8"
                                color="primary"
                                @click="stepGenKeys"
                        >
                            Generate my Keys !
                        </v-btn>

                        <v-btn flat>Cancel</v-btn>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <v-card v-if="generatingKeys"
                                class="mb-5"
                                color="grey lighten-1"
                                height="200px"
                        >

                            <v-progress-circular :indeterminate="true"/>
                            Your keys are being generated , here are some cool facts:


                        </v-card>
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
                            </v-card>
                        </template>


                        <v-btn
                                color="primary"
                                @click="e1 = 1"
                                :disabled="generatingKeys"
                        >
                            Save my Keys
                        </v-btn>

                        <slot name="action">
                            <v-btn flat>Add to wallet Address</v-btn>
                        </slot>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
            </v-flex>
        </v-layout>

    </div>
</template>

<script>
    import {seed, entropy, generate} from 'bismuth-js-crypto'

    export default {

        name: 'NewAddress',
        components: {},
        mixins: [],
        props: [],
        mounted() {
        },
        data() {
            return {
                e1: 1,
                entropyStarted: false,
                entropyProgress: "0",
                entropy: null,
                twelveWordSeed: '',
                password: '',
                passwordShow: false,
                passwordRules: {
                    required: value => !!value || 'Required.',
                    min: v => v.length >= 8 || 'Min 8 characters',
                },
                addressKeys: {},
                generatingKeys: false,
            }
        },
        filters: {},
        computed: {
            entropyDone() {
                return this.entropyStarted && this.entropyProgress === '100%'
            },
            entropyProgressInt(){
                if(!this.entropyProgress || this.entropyProgress.length < 1)
                    return null
               return parseInt(this.entropyProgress.slice(0,-1))
            }
        },
        watch: {},
        methods: {
            stepGenSeed() {
                this.makeMnemonicFromEntropySha();
                if (this.e1 < 2) this.e1 = 2

            },
            async stepGenKeys() {
                this.e1 = 3;
                this.generatingKeys = true;
                this.$nextTick(async () => {
                    await this.makeKeysFromMneomic();
                    this.generatingKeys = false;
                })


            },
            startEntropy() {
                this.entropy = entropy()
                this.entropyStarted = true
            },
            makeEntropy(e) {
                if (!this.entropyStarted || !this.entropy)
                    return;
                this.entropy.entropyFromCoordinates(e)
                this.entropyProgress = this.entropy.getSeedingPercent()
            },
            makeMnemonicFromEntropySha() {
                if (!this.entropy || !this.entropy.seedingDone()) {
                    console.error('Seeding isn done,buggingout');
                    return;
                }
                this.twelveWordSeed = seed.makeMnemonicFromEntropySha(this.entropy.getPoolSha256())
            },
            async makeKeysFromMneomic() {
                if (!this.twelveWordSeed && !this.password) {
                    console.error("Twelve words not detected !")
                    return;
                }
                const prng = seed.makeSeededPrngFromMneomic(this.twelveWordSeed, this.password)
                const {generateKeys} = generate({prng})
                const {privateKey, publicKey, address} = await generateKeys()
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
