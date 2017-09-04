/*!
 * middleware
 * Copyright(c) 2015-2017 Fangdun Cai
 * MIT Licensed
 */

'use strict'

module.exports = class Middleware extends Array {
  next(context, last, i, done, called, fn) {
    if ((done = i > this.length)) return

    fn = this[i] || last

    return (
      fn &&
      fn(context, () => {
        if (called) throw new Error('next() called multiple times')
        called = true
        return Promise.resolve(this.next(context, last, i + 1))
      })
    )
  }

  async compose(context, last) {
    return this.next(context, last, 0)
  }
}
