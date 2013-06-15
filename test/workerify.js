var fs = require('fs')
var path = require('path')
var workerify = require('../')
var fixture = path.join(__dirname, 'fixture/file.js')
var out = path.join(__dirname, 'out/test.js')

var stream = workerify(fixture)
fs.createReadStream(fixture).pipe(stream).pipe(fs.createWriteStream(out))
