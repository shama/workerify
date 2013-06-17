var browserify = require('browserify')
var through = require('through')
var esprima = require('esprima')
var estraverse = require('estraverse')
var escodegen = require('escodegen')
var path = require('path')
var fs = require('fs')

var cwd = process.cwd()

module.exports = function(file) {
  if (!/\.js$/.test(file)) return through()
  cwd = path.dirname(file)
  var data = ''
  return through(write, end)
  function write(buf) { data += buf }
  function end() {
    var self = this
    var ast = esprima.parse(data)
    var i = 0, allDone = false
    function done() {
      i--
      if (allDone && i < 1) {
        self.queue(escodegen.generate(ast))
        self.queue(null)
      }
    }
    var vars = Object.create(null)
    estraverse.replace(ast, {
      enter: function(node) {
        if (isWorker(node)) {
          i++
          shouldTransform = true
          makeBlob(node, done)
        }
      }
    })
    if (i === 0) {
      // no workers found skip
      self.queue(data)
      self.queue(null)
    } else {
      // otherwise ready to finish
      allDone = true
    }
  }
}

// TODO: Detect if Worker parent is top level
// TODO: Detect if Worker argument is an Identifier (variable instead of string)
function isWorker(node) {
  return node.type === 'NewExpression' &&
    node.callee &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'Worker'
}

function makeBlob(node, done) {
  var filename = node.arguments[0].value
  bfy(filename, function(err, data) {
    if (err) return done()
    var blob = esprima.parse('window.URL.createObjectURL(new Blob([""],{type:"text/javascript"}))')
    blob.body[0].expression.arguments[0].arguments[0].elements[0].value = data
    node.arguments = [blob.body[0].expression]
    done()
  })
}

// TODO: get process.argv browserify args
function bfy(entry, done) {
  var data = ''
  var b = browserify();
  if (entry.slice(0, 2) !== './') {
    entry = './node_modules/' + entry
  }
  b.add(path.join(cwd, entry))
  var bundle = b.bundle()
  bundle.on('data', function(buf) { data += buf })
  bundle.on('close', function() { done(null, data) })
}