import test from 'ava'
import co from 'co'
import Middleware from '..'

test.beforeEach(t => {
  t.context = new Middleware()
})

test('should return result and not throws', async t => {
  const middleware = t.context

  await t.notThrows(middleware.compose())
})

test('should return result and throws', async t => {
  const middleware = t.context
  middleware.push((ctx, next) => {
    ctx.a = 1
    next()
    next()
  })
  await t.throws(middleware.compose({}), 'next() called multiple times')
})

test('should work with 0 middleware', async t => {
  const middleware = t.context

  const res = await middleware.compose({})
  t.is(res, void 0)
})

test('should work when yielding at the end of the stack', async t => {
  const middleware = t.context
  let called = false

  middleware.push(async (ctx, next) => {
    await next()
    called = true
  })

  await middleware.compose({})
  t.true(called)
})

test('should reject on errors in middleware', async t => {
  const middleware = t.context

  middleware.push(async (ctx, next) => {
    throw new Error()
  })

  await middleware
    .compose({})
    .then(() => {
      throw new Error('promise was not rejected')
    })
    .catch(err => {
      t.is(err.message, '')
      t.true(err instanceof Error)
    })
})

test('should keep the context', async t => {
  const middleware = t.context
  const ctx = {}

  middleware.push(async (ctx2, next) => {
    await next()
    t.is(ctx, ctx2)
  })

  middleware.push((ctx2, next) => {
    return next().then(() => t.is(ctx, ctx2))
  })

  middleware.push(
    co.wrap(function*(ctx2, next) {
      yield next()
      t.is(ctx, ctx2)
    })
  )

  await middleware.compose(ctx)
})

test('should catch downstream errors', async t => {
  const middleware = t.context
  const arr = []

  middleware.push(async (ctx, next) => {
    arr.push(1)
    try {
      arr.push(6)
      await next()
      arr.push(7)
    } catch (err) {
      arr.push(2)
    }
    arr.push(3)
  })

  middleware.push(async (ctx, next) => {
    arr.push(4)
    throw new Error()
  })

  await middleware.compose({})
  t.deepEqual(arr, [1, 6, 4, 2, 3])
})

test('should compose w/ next', async t => {
  const middleware = t.context
  let called = false

  await middleware.compose({}, async (ctx, next) => {
    called = true
  })
  t.true(called)
})

test('should handle errors in wrapped non-async functions', async t => {
  const middleware = t.context

  middleware.push(() => {
    throw new Error()
  })

  try {
    await middleware.compose({}).then(() => {
      throw new Error('promise was not rejected')
    })
  } catch (err) {
    t.is(err.message, '')
    t.true(err instanceof Error)
  }
})

test('should compose w/ other compositions', async t => {
  const ctx = []
  const m0 = Middleware.from([
    (ctx, next) => {
      ctx.push(1)
      return next()
    },
    (ctx, next) => {
      ctx.push(2)
      return next()
    }
  ])
  const m1 = Middleware.from([
    (ctx, next) => {
      ctx.push(3)
      return next()
    }
  ])

  await m0.compose(ctx).then(() => m1.compose(ctx))
  t.deepEqual(ctx, [1, 2, 3])
})

test('should return last return value', async t => {
  const middleware = t.context

  middleware.push(async (ctx, next) => {
    const val = await next()
    t.is(val, 2)
    return 1
  })

  middleware.push(async (ctx, next) => {
    const val = await next()
    t.is(val, 0)
    return 2
  })

  const next = () => 0
  const res0 = await middleware.compose({}, next)
  t.is(res0, 1)

  const res1 = await middleware.compose({}, next)
  t.is(res1, 1)
})

test('should not enter an infinite loop', async t => {
  const ctx = {
    middleware: 0,
    next: 0
  }
  const middleware = Middleware.from([
    (ctx, next) => {
      ctx.middleware++
      return next()
    }
  ])

  await middleware.compose(ctx, (ctx, next) => {
    ctx.next++
    return next()
  })

  t.deepEqual(ctx, {
    middleware: 1,
    next: 1
  })
})
