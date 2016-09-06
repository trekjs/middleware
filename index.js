const SYMBOL_ITERATOR = Symbol.iterator

module.exports = class Middleware extends Array {

  [SYMBOL_ITERATOR] () {
    return this
  }

  next (i = 0, context, nextFunc) {
    const fn = this[i] || nextFunc
    let called = false

    return {
      done: i++ === this.length,
      value: fn && fn(context, () => {
        if (called) {
          throw new Error('next() called multiple times')
        }
        called = true
        // If you really want to use in excess of 5k middleware, ex:
        // return i > 5120 ? Promise.resolve().then(() => this.next(i, context, nextFunc).value) : Promise.resolve(this.next(i, context, nextFunc).value)
        return Promise.resolve(this.next(i, context, nextFunc).value)
      })
    }
  }

  compose (context, nextFunc) {
    try {
      return Promise.resolve(this[SYMBOL_ITERATOR]().next(0, context, nextFunc).value)
    } catch (err) {
      return Promise.reject(err)
    }
  }

}
