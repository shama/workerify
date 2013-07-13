module.exports = function() {
  var unitialized

  var file = './another.js'

  // With keyword
  var str = workerify './another.js'
  var worker = new Worker(str)

  // Straight string
  var worker2 = new Worker('./another.js')

  // With a variable
  var worker4 = new Worker(file)
}
