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
                    <v-icon><img src="assets/bismuth_logo_128.png"></v-icon></v-toolbar-side-icon>
                <v-toolbar-title class="mr-5 align-center">
                    <span class="title" color="deep-purple accent-4">Bismuth Apps - Alpha  - DO NOT USE.</span>
                </v-toolbar-title>
                <v-spacer></v-spacer>
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
  data: () => ({
    drawer: false,
    items: [
      {icon: 'subscriptions', text: 'Address', link: 'address'},
      {icon: 'history', text: 'Transaction History'}
    ],
    addressBook: [
      {picture: 28, text: 'John'},
      {picture: 38, text: 'Sarah'},
      {picture: 78, text: 'Kim'}
    ]
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
