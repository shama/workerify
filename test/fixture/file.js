module.exports = function() {
  var worker = new Worker('./another.js')

  var another = './another.js'
  var worker2 = new Worker(another)
}
