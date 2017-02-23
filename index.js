'use strict'

module.exports = class Middleware extends Array {

  next (context, last, i = 0, done = false, called = false, fn = undefined) {
    if ((done = i > this.length)) return

    fn = this[i] || last

    return fn && fn(context, () => {
      if (called) throw new Error('next() called multiple times')
      called = true
      return Promise.resolve(this.next(context, last, i + 1))
    })
  }

  compose (context, last) {
    try {
      return Promise.resolve(this.next(context, last))
    } catch (err) {
      return Promise.reject(err)
    }
  }

}
