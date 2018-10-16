<template>
  <div id="landing"><v-jumbotron>
    <v-container fill-height>
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
          >
            Send BIS
          </v-btn>
          <v-btn
                  class="mx-0"
                  color="primary"
                  large
          >
            Check Txn
          </v-btn>



          <v-divider class="my-3"></v-divider>
          <span class="subheading">BlockNumber : 3434343 , MemPool: , Difficulty: , </span>


        </v-flex>
      </v-layout>
    </v-container>
  </v-jumbotron></div>
</template>

<script>

export default {
  name: 'Landing',
  data: () => ({
    agreement: false,
    bio: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts',
    dialog: false,
    email: undefined,
    form: false,
    isLoading: false,
    password: undefined,
    phone: undefined,
    rules: {
      email: v => (v || '').match(/@/) || 'Please enter a valid email',
      length: len => v => (v || '').length >= len || `Invalid character length, required ${len}`,
      password: v => (v || '').match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/) ||
          'Password must contain an upper case letter, a numeric character, and a special character',
      required: v => !!v || 'This field is required'
    }
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
