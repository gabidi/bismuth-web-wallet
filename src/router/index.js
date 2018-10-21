import Vue from 'vue'
import Router from 'vue-router'
import Address from '@/components/Address'
import Landing from '@/components/Landing'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: Landing,
      component: Landing
    },
    {
      path: '/address/:addressId?',
      name: 'Address',
      props: (route) => {
        return {
          autoFetch: !!route.query.autoFetch,
          addressId: route.params.addressId
        }
      },
      component: Address
    }
  ]
})
