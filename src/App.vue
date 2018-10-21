<template>
    <div id="app">
        <v-app
                dark
                id="inspire"
        >
            <v-navigation-drawer
                    fixed
                    clipped
                    v-model="drawer"
                    app
            >
                <v-list dense>
                    <v-list-tile v-for="item in items" :key="item.text"  @click="" :to="item.link">
                            <v-list-tile-action>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ item.text }}
                                </v-list-tile-title>
                            </v-list-tile-content>
                    </v-list-tile>
                    <v-subheader class="mt-3 grey--text text--darken-1">Address Book</v-subheader>
                    <v-list>
                        <v-list-tile v-for="item in addressBook" :key="item.text" avatar @click="">
                            <v-list-tile-avatar>
                                <img :src="`https://randomuser.me/api/portraits/women/${item.picture}.jpg`" alt="">
                            </v-list-tile-avatar>
                            <v-list-tile-title v-text="item.text"></v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                    <v-list-tile class="mt-3" @click="">
                        <v-list-tile-action>
                            <v-icon color="grey darken-1">add_circle_outline</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title class="grey--text text--darken-1">Browse Chain</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon color="grey darken-1">settings</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title class="grey--text text--darken-1">Wallet Settings</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>
            <v-toolbar
                    color="blue-grey darken-4"
                    dense
                    fixed
                    clipped-left
                    app
            >
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
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
    drawer: true,
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
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
