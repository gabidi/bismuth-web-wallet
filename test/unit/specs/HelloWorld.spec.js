import Vue from 'vue'
import Address from '@/components/Address'

describe('Address.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Address)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('h1').textContent)
      .to.contain('address')
  })
})
