import test from 'ava'
import Middleware from '..'

test.beforeEach(t => {
  t.context = new Middleware()
})

test.skip('should an array-like object', t => {
  const middleware = t.context
  t.true(middleware instanceof Middleware)
  t.true(middleware instanceof Array)
})
