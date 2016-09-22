'use strict'

module.exports = compose

function next (arr, context, last, i = 0, done = false, called = false, fn = undefined) {
  if ((done = i > arr.length)) return

  fn = arr[i] || last

  // https://github.com/rollup/rollup/pull/774
  // The `function` is wrapped in `()` to avoid lazy parsing it.
  return fn && fn(context, (function () {
    if (called) throw new Error('next() called multiple times')
    called = true
    return Promise.resolve(next(arr, context, last, i + 1))
  }))
}

function compose (arr, context, last) {
  try {
    return Promise.resolve(next(arr, context, last, 0))
  } catch (err) {
    return Promise.reject(err)
  }
}
