window.URL = (window.URL || window.webkitURL || window.mozURL)
var test = require('tape')

function testEcho(worker, t)  {
  worker.onmessage = function(e) {
    t.equal(e.data, 'echo:secret')
  }
  worker.postMessage('echo')
}

test('workers get inlined and still work', function(t) {
  t.plan(1)
  testEcho(new Worker('./fixture/echo.js'), t)
})

test('with variable', function(t) {
  t.plan(1)
  var variable = './fixture/echo.js'
  testEcho(new Worker(variable), t)
})

test('with keyword', function(t) {
  t.plan(1)
  var keyword = workerify './fixture/echo.js'
  testEcho(new Worker(keyword), t)
})
