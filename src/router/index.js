import Vue from 'vue'
import Router from 'vue-router'
import AddressBook from '@/components/AddressBook'
import NewAddress from '@/components/NewAddress'
import Landing from '@/components/Landing'
import Transactions from '@/components/Transactions'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/txns/:txnId/:txnAddresses?',
      name: 'Transactions',
      component: Transactions,
      props: route => {
        return {
          autoFetch: !!route.query.autoFetch,
          txnId: route.params.txnId,
          txnAddresses: route.params.txnAddresses | undefined
        }
      }
    },
    {
      path: '/',
      name: 'AddressBook',
      props: route => {
        return {
          autoFetch: !!route.query.autoFetch,
          addressId: route.params.addressId
        }
      },
      component: AddressBook
    }

  ]
})
