import Vue from 'vue'
import { BismuthWSSdk } from 'bismuth-js-sdk'
Vue.mixin({
  beforeCreate () {
    const options = this.$options
    if (options.sdk) this.$sdk = options.sdk
    else if (options.parent && options.parent.$sdk) {
      this.$sdk = options.parent.$sdk
    }
  }
})

export default ({ server, port } = {}) => {
  const socket = new WebSocket(`ws://${server}:${port}/web-socket/`)
  const cbStack = { message: [], error: [] }
  // Stub native stuff for API
  socket.onmessage = function (d) {
    const cb = cbStack.message.pop()
    return cb(d.data)
  }
  socket.onerror = function (error) {
    const cb = cbStack.error.pop()
    cb(error)
  }
  socket['once'] = function (event, cb) {
    if (event === 'message') {
      cbStack['message'].push(cb)
    } else if (event === 'error') {
      cbStack['error'].push(cb)
    }
  }
  return new Promise((resolve, reject) => {
    socket.onopen = resolve
  }).then(() => new BismuthWSSdk({ verbose: true, socket }))
}
