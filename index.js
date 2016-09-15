const SYMBOL_ITERATOR = Symbol.iterator

module.exports = class Middleware extends Array {

  [SYMBOL_ITERATOR] () {
    return this
  }

  next (i = 0, context, last, done = false, called = false, fn) {
    done = i > this.length
    if (done) return { done }

    fn = this[i] || last

    return {
      done,
      value: fn && fn(context, () => {
        if (called) throw new Error('next() called multiple times')
        called = true
        return Promise.resolve(this.next(i + 1, context, last).value)
      })
    }
  }

  compose (context, last) {
    try {
      return Promise.resolve(this[SYMBOL_ITERATOR]().next(0, context, last).value)
    } catch (err) {
      return Promise.reject(err)
    }
  }

}
