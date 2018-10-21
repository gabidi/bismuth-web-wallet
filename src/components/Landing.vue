<template>
  <div id="landing"><v-jumbotron>
      <v-layout align-center>
        <v-flex>
          <h3 class="display-3">What would you like to do today?</h3>

          <v-btn
                  class="mx-0"
                  color="primary"
                  large
                  to="Address"

          >
            Check Balance
          </v-btn>
          <v-btn
                  class="mx-0"
                  color="primary"
                  large
                  disabled="true"
          >
            Send BIS
          </v-btn>
          <v-btn
                  class="mx-0"
                  color="primary"
                  large
                  disabled="true"
          >
            Check Txn
          </v-btn>

          <v-divider class="my-3"></v-divider>
          <span class="subheading"> NodeVersion: {{nodeVersion}} BlockNumber : {{blockHeight}} , MemPool: , Difficulty: {{difficulty}} , Network HashRate : {{networkHashRate}} </span>

        </v-flex>
      </v-layout>
  </v-jumbotron></div>
</template>

<script>

export default {
  name: 'Landing',
  mounted: async function () {
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
      ServerTimestamp ] = await (await this.$sdk).getStatus()

    this.difficulty = difficulty;
    this.nodeVersion = nodeVersion;
    this.blockHeight = blockHeight;
    this.networkHashRate = networkHashRate;
  },
  data: () => ({
    difficulty: null,
    nodeVersion: null

  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
