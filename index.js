'use strict'

module.exports = class Middleware extends Array {

  next (i = 0, context, last, done = false, called = false, fn) {
    done = i > this.length
    if (done) return

    fn = this[i] || last

    return fn && fn(context, () => {
      if (called) throw new Error('next() called multiple times')
      called = true
      return Promise.resolve(this.next(i + 1, context, last))
    })
  }

  compose (context, last) {
    try {
      return Promise.resolve(this.next(0, context, last))
    } catch (err) {
      return Promise.reject(err)
    }
  }

}
