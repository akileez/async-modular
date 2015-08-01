var _once = require('../utils/asyncOnce')
var noop = require('../base/noop')
var _keyIterator = require('../utils/asyncKeyIterator')

function eachOfLimit (limit) {
  return function (obj, iterator, callback) {
    callback = _once(callback || noop)
    obj = obj || []

    var nextKey = _keyIterator(obj)

    if (limit <= 0) return callback(null)

    var done = false
    var running = 0
    var errored = false

    (function replenish () {
      if (done && running <= 0) return callback(null)

      while (running < limit && !errored) {
        var key = nextKey()
        if (key === null) {
          done =  true
          if (running <= 0) callback(null)
          return
        }
        running += 1
        iterator(obj[key], key, only_once(function (err) {
          running -= 1
          if (err) {
            callback(err)
            errored = true
          } else {
            replenish()
          }
        }))
      }
    })()
  }
}

module.exports = eachOfLimit
