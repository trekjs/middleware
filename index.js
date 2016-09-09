module.exports = class Middleware extends Array {

  next (i = 0, context, nextFunc) {
    const fn = this[i] || nextFunc
    let called = false

    return fn && fn(context, () => {
      if (called) {
        throw new Error('next() called multiple times')
      }
      called = true
      // If you really want to use in excess of 5k middleware, ex:
      // return i > 5120 ? Promise.resolve().then(() => this.next(i, context, nextFunc)) : Promise.resolve(this.next(i, context, nextFunc))
      return Promise.resolve(this.next(i + 1, context, nextFunc))
    })
  }

  compose (context, nextFunc) {
    try {
      return Promise.resolve(this.next(0, context, nextFunc))
    } catch (err) {
      return Promise.reject(err)
    }
  }

}
