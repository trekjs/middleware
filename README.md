# Middleware

The Modern (ES6) Middleware Composition.


## Installation

```console
$ npm install trek-middleware --save
```


## Examples

```js
const co = require('co')
const Middleware = require('trek-middleware')
const middleware = new Middleware()

middleware.push((ctx, next) => {
  ctx.arr.push(1)
  return next().then(() => {
    ctx.arr.push(6)
  })
})

middleware.push(async (ctx, next) => {
  ctx.arr.push(2)
  await next()
  ctx.arr.push(5)
})

middleware.push(co.wrap(function * (ctx, next) {
  ctx.arr.push(3)
  yield next()
  ctx.arr.push(4)
}))

const ctx = { arr: [] }
middleware.compose(ctx).then(() => {
  console.log(ctx.arr.toString() === '1,2,3,4,5,6')
})
```


## Benchmarks

```console
$ npm run bench
```

Resoults from https://travis-ci.org/trekjs/middleware.

```
          trek-middleware
     wait » (fn * 1)          94,938 op/s » (fn * 1)
     wait » (fn * 2)          55,602 op/s » (fn * 2)
     wait » (fn * 4)          29,875 op/s » (fn * 4)
     wait » (fn * 8)          15,619 op/s » (fn * 8)
     wait » (fn * 16)           8,056 op/s » (fn * 16)
     wait » (fn * 32)           4,012 op/s » (fn * 32)
     wait » (fn * 64)           1,998 op/s » (fn * 64)
     wait » (fn * 128)           1,000 op/s » (fn * 128)
     wait » (fn * 256)             494 op/s » (fn * 256)
     wait » (fn * 512)             249 op/s » (fn * 512)
     wait » (fn * 1024)             122 op/s » (fn * 1024)

          koa-compose
     wait » (fn * 1)          92,671 op/s » (fn * 1)
     wait » (fn * 2)          53,197 op/s » (fn * 2)
     wait » (fn * 4)          28,830 op/s » (fn * 4)
     wait » (fn * 8)          15,166 op/s » (fn * 8)
     wait » (fn * 16)           7,737 op/s » (fn * 16)
     wait » (fn * 32)           3,882 op/s » (fn * 32)
     wait » (fn * 64)           1,927 op/s » (fn * 64)
     wait » (fn * 128)             956 op/s » (fn * 128)
     wait » (fn * 256)             487 op/s » (fn * 256)
     wait » (fn * 512)             133 op/s » (fn * 512)
     wait » (fn * 1024)              66 op/s » (fn * 1024)
```


## Badges

[![Build Status](https://travis-ci.org/trekjs/middleware.svg?branch=master)](https://travis-ci.org/trekjs/middleware)
[![codecov](https://codecov.io/gh/trekjs/middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/trekjs/middleware)
![](https://img.shields.io/badge/license-MIT-blue.svg)


---

> [fundon.me](https://fundon.me) &nbsp;&middot;&nbsp;
> GitHub [@fundon](https://github.com/fundon) &nbsp;&middot;&nbsp;
> Twitter [@_fundon](https://twitter.com/_fundon)
