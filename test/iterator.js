import test from 'ava'
import co from 'co'
import Middleware from '..'

test.beforeEach(t => {
  t.context = new Middleware()
})

test('middleware[Symbol.iterator] should a function', t => {
  const middleware = t.context
  t.true('function' === typeof middleware[Symbol.iterator])
})

test('middleware[Symbol.iterator]() should return self', t => {
  const middleware = t.context
  t.is(middleware, middleware[Symbol.iterator]())
})

test('middleware iterator', async t => {
  const middleware = t.context
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

  const iter = middleware[Symbol.iterator]()

  t.true(iter === middleware)
  t.is('function', typeof iter.next)

  const ctx = { arr: [] }

  await middleware.compose(ctx)

  t.deepEqual(ctx.arr, [1, 2, 3, 4, 5, 6])
})
