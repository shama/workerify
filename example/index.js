var workerstream = require('workerstream')

// inline the worker with the workerify keyword
var echo = workerify './echo.js'
var worker = workerstream(echo)

// If we get messages from the worker
worker.on('data', function(data) {
  msg(data)
})

// Write some messages to echo back
worker.write({sending: 'message to worker'})
worker.write({echo: 'hi'})
worker.write({yep: 'it worked'})

// print helper
function msg(str) {
  document.body.innerHTML = document.body.innerHTML + '<br/>\n' + JSON.stringify(str)
}
