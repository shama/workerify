var browserify = require('browserify')
var through = require('through')
var falafel = require('falafel')
var strescape = require('jsesc')
var path = require('path')
var fs = require('fs')

module.exports = function(file) {
  if (!/\.(js|coffee)$/.test(file)) return through()
  var cwd = path.dirname(file)
  var data = ''
  return through(write, end)
  function write(buf) { data += buf }
  function end() {
    var self = this, i = 0, allDone = false, output, vars = Object.create(null)

    function done() {
      i--
      if (allDone && i < 1) {
        self.queue(String(output))
        self.queue(null)
      }
    }

    // Collect vars
    falafel(data, {isKeyword:isKeyword}, function(node) {
      if (isVarLiteral(node)) {
        vars[node.id.name] = node.init.value
      }
    })

    // process source
    output = falafel(data, {isKeyword:isKeyword}, function(node) {
      var filename = false, withWorker = false, asModule = false
      if (isWorkerifyKeyword(node)) {
        filename = node.argument.value
      } else if (isWorker(node)) {
        withWorker = true
        if (node.arguments[0].type === 'Literal') {
          filename = node.arguments[0].value
        }
        if (node.arguments[0].type === 'Identifier' && vars[node.arguments[0].name]) {
          filename = vars[node.arguments[0].name]
        }
        if(isModuleMode(node)) {
            asModule = true;
        }
      }
      // browserify and update node
      if (filename !== false) {
        i++
        var resolvedFile = resolveEntry(filename, cwd);

        self.emit('file', resolvedFile)

        bfy(resolvedFile, function(err, data) {
          node.update(makeBlob(data, withWorker, asModule))
          done()
        })
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

function isKeyword(id) {
  if (id === 'workerify') return true
}

function isWorker(node) {
  return node.type === 'NewExpression'
    && node.callee
    && node.callee.type === 'Identifier'
    && node.callee.name === 'Worker'
}

function isModuleMode(node) {
  return node.arguments.length > 1
    && node.arguments[1].type === 'ObjectExpression'
    && node.arguments[1].properties
    && node.arguments[1].properties.length > 0
    && node.arguments[1].properties[0].key.name === 'type'
    && node.arguments[1].properties[0].value.value === 'module'
}

function isVarLiteral(node) {
  return node.type === 'VariableDeclarator'
    && node.init
    && node.init.type === 'Literal'
}

function isWorkerifyKeyword(node) {
  return node.type === 'UnaryExpression'
    && node.operator === 'workerify'
    && node.argument.type === 'Literal'
}

function makeBlob(str, withWorker, asModule) {
  var src = '(window.URL || window.webkitURL).createObjectURL(new Blob([""],{type:"text/javascript"}))'
  if (withWorker === true && asModule) src = 'new Worker(' + src + ', {type: "module"})'
  else if(withWorker === true) src = 'new Worker(' + src + ')'
  return falafel(src, function(node) {
    if (node.type === 'Literal' && node.value === '') {
      node.update(strescape(str, {'wrap': true}))
    }
  })
}

function resolveEntry(entry, cwd) {
  if (entry.slice(0, 2) !== './') {
    entry = './node_modules/' + entry
  }

  return path.join(cwd, entry);
}

// TODO: get process.argv browserify args
function bfy(entry, done) {
  var data = ''
  var b = browserify();

  b.add(entry)
  var bundle = b.bundle()
  bundle.on('data', function(buf) { data += buf })
  bundle.on('end', function() { done(null, data) })
}
