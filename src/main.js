// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import sdk from './models/bismuthSdk'
import Vuetify from 'vuetify'
import VueNumeric from 'vue-numeric'

import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader

Vue.use(Vuex)
Vue.use(Vuetify)
Vue.use(VueNumeric)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  sdk: sdk({server: 'localhost', port: 8155}),
  components: { App },
  template: '<App/>'
})
