<template>
    <div id="app">
        <v-app
                dark
                id="bis_wallet"
        >
            <v-toolbar
                    color="blue-grey darken-4"
                    dense
                    fixed
                    clipped-left
                    app
            >
                <v-toolbar-side-icon>
                    <v-avatar :tile="false" :size="32">
                        <img src="./assets/64x64.png" alt="Bismuth Logo">
                    </v-avatar>
                </v-toolbar-side-icon>
                <v-toolbar-title class="mr-5 align-center">
                    <span class="title" color="deep-purple accent-4">Bismuth Wallet - Beta </span>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-icon small color="green">
                    fa-link
                </v-icon>
                <span class="caption" v-if="difficulty">
                    NodeVersion: {{nodeVersion}}
                    BlockNumber : {{blockHeight}} ,
		    MemPool: , Difficulty: <VueNumeric read-only :precision="2" :value="difficulty"></VueNumeric> ,
		    Network HashRate : <VueNumeric read-only :precision="2" :value="networkHashRate"> </VueNumeric>
		</span>

            </v-toolbar>
            <v-content>
                <router-view/>
            </v-content>
        </v-app>
    </div>
</template>

<script>
export default {
  name: 'App',
  mounted: async function () {
    try {
      let [
        Address,
        NodesCount,
        NodesList,
        ThreadsCount,
        Uptime,
        PeersConsensus,
        PeersConsensusPct,
        nodeVersion,
        [difficulty, difficulty_dropped, time_to_generate, diff_previous_block, block_time, networkHashRate, diff_adjustment, blockHeight],
        ServerTimestamp] = await (await this.$sdk).getStatus()

      this.difficulty = difficulty
      this.nodeVersion = nodeVersion
      this.blockHeight = blockHeight
      this.networkHashRate = networkHashRate
    } catch (err) {
      console.error('Error getting node status', err)
    }
  },
  data: () => ({
    difficulty: null,
    nodeVersion: null

  }),
  props: {
    source: String
  }
}

</script>

<style>
    /*#app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }*/
</style>
