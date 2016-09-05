module.exports = class Middleware extends Array {

  next (i, context, nextFunc) {
    i |= 0
    const fn = this[i] || nextFunc
    let nextCalled = false

    return fn && fn(context, () => {
      if (nextCalled) {
        throw new Error('next() called multiple times')
      }
      nextCalled = true
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
