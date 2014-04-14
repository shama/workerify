var secret = require('./secret')
self.onmessage = function(event) {
  self.postMessage(event.data + ':' + secret)
}
