import Vue from 'vue'
import Router from 'vue-router'
import Address from '@/components/Address'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/address',
      name: 'Address',
      component: Address
    }
  ]
})
