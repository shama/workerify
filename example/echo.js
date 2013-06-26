// echo back messages
self.onmessage = function(event) {
  self.postMessage(event.data)
}
