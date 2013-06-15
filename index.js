var through = require('through')
var esprima = require('esprima')
var estraverse = require('estraverse')
var escodegen = require('escodegen')
var spawn = require('child_process').spawn
var path = require('path')
var fs = require('fs')

var cwd = process.cwd()

module.exports = function(file) {
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
  bfy(filename, [], function(err, data) {
    if (err) return done()
    var blob = esprima.parse('window.URL.createObjectURL(new Blob([""]))')
    blob.body[0].expression.arguments[0].arguments[0].elements[0].value = data
    node.arguments = [blob.body[0].expression]
    done()
  })
}

function whichbfy() {
  var local = path.join(__dirname, 'node_modules/.bin/browserify')
  if (process.platform === 'win32') local += '.cmd'
  return (fs.existsSync(local)) ? local : 'browserify'
}

// TODO: get process.argv browserify args
function bfy(filename, args, done) {
  args.unshift('-e', filename)
  var bundled = ''
  var errors = ''
  var b = spawn(whichbfy(), args, {cwd: cwd})
  b.stderr.on('data', function(buf) { errors += buf })
  b.stdout.on('data', function(buf) { bundled += buf })
  b.on('close', function() {
    if (errors.length > 0) {
      done(errors)
    } else {
      done(null, bundled)
    }
  })
}