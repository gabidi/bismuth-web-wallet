import Vue from 'vue'
import {BismuthWSSdk} from 'bismuth-js-sdk'

Vue.mixin({
  beforeCreate () {
    const options = this.$options
    if (options.sdk) {
      this.$sdk = options.sdk
    } else if (options.parent && options.parent.$sdk) {
      this.$sdk = options.parent.$sdk
    }
  }
})

export default ({server, port} = {}) => {
  const socket = new WebSocket(`${ webpackHotUpdate ? 'ws' : 'wss'}://${server}:${port}/web-socket/`)
  // Stub native stuff for API

  socket['once'] = function (event, cb) {
    if (event === 'message') {
      socket.onmessage = function (d) {
        return cb(d.data)
      }
    }
  }
  return new Promise((resolve, reject) => {
    socket.onopen = resolve
  }).then(() => new BismuthWSSdk({verbose: true, socket}))
}
