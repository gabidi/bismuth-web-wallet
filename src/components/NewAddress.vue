<template>
    <div id="newAddressStepper">
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

                        <v-alert warning>Save your key blah blah, only you can access it blah blah I understand</v-alert>
                        <v-btn v-if="!entropyStarted" @click="startEntropy">Start Seed</v-btn>
                        <v-template v-if="entropyStarted">
                            <span class="title">Keep moving your mouse until the red bar is full !</span>
                        </v-template>
                    </v-card>

                    <v-btn
                            color="primary"
                            @click="e1 = 2"
                    >
                        Continue
                    </v-btn>

                    <v-btn flat>Cancel</v-btn>
                </v-stepper-content>

                <v-stepper-content step="2">
                    <v-card
                            class="mb-5"
                            color="grey lighten-1"
                            height="200px"
                    ></v-card>

                    <v-btn
                            color="primary"
                            @click="e1 = 3"
                    >
                        Continue
                    </v-btn>

                    <v-btn flat>Cancel</v-btn>
                </v-stepper-content>

                <v-stepper-content step="3">
                    <v-card
                            class="mb-5"
                            color="grey lighten-1"
                            height="200px"
                    ></v-card>

                    <v-btn
                            color="primary"
                            @click="e1 = 1"
                    >
                        Continue
                    </v-btn>

                    <v-btn flat>Cancel</v-btn>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </div>
</template>

<script>
import crypto from 'bismuth-js-crypto'

export default {

  name: 'NewAddress',
  components: {},
  mixins: [],
  props: [],
  mounted () {
  },
  data () {
    return {
      e1: 1,
      entropyStarted: false,
      entropyProgress: 0,
      entropy: crypto
    }
  },
  filters: {},
  computed: {},
  watch: {
    entropyStarted (v) {
      if (v) {
        window.addEventListener('mousemove', this.makeEntropy)
      } else {
        window.removeEventListener('mousemove', this.makeEntropy)
      }
    }
  },
  methods: {
    startEntropy () {
      this._entropy.pool = []
      this.entropyStarted = true
    },
    makeEntropy (e) {
      console.log(e)
      this.entropy.entropyFromCoordinates(e)
      this.entropyProgress = this.entropy.getSeedingPercent().slice(-1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
