'use strict'

const Benchmark = require('benchmark')
const compose = require('koa-compose')
const Middleware = require('..')

const suite = new Benchmark.Suite()

const EXP = 10 // 1024

console.log('1024 middlewares')

suite
  .add(
    'koa-compose',
    deferred => {
      const logic = () => Promise.resolve(true)

      const fn = (ctx, next) => {
        return logic()
          .then(next)
          .then(logic)
      }

      const count = Math.pow(2, EXP)
      const arr = []
      for (let i = 0; i < count; i++) {
        arr.push(fn)
      }
      compose(arr)({}).then(() => deferred.resolve())
    },
    {
      defer: true
    }
  )
  .add(
    'trek-middleware',
    deferred => {
      const logic = () => Promise.resolve(true)

      const fn = (ctx, next) => {
        return logic()
          .then(next)
          .then(logic)
      }

      const count = Math.pow(2, EXP)
      const middleware = new Middleware()
      for (let i = 0; i < count; i++) {
        middleware.push(fn)
      }
      middleware.compose({}).then(() => deferred.resolve())
    },
    {
      defer: true
    }
  )
  .on('cycle', event => {
    console.log(String(event.target))
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({
    async: true
  })
