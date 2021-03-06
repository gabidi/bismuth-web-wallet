import '@babel/polyfill'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './plugins/vuetify'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import sdk from './models/bismuthSdk'
import Vuetify from 'vuetify'
import VueNumeric from 'vue-numeric'

import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(Vuex)
Vue.use(Vuetify)
Vue.use(VueNumeric)
Vue.config.productionTip = false
const server = `wss://ws.sifir.io/bismuth-wallet`;
// const server = 'ws://localhost:8089'
//
/* eslint-disable no-new */
new Vue({
  render: h => h(App),
  router,
  sdk: sdk({ server }),
  components: { App },
  template: '<App/>'
}).$mount('#app')
