const Middleware = require('..')

const middleware = new Middleware()

middleware.push((ctx, next) => {
  ctx.arr.push(1)
  return next().then(() => {
    ctx.arr.push(6)
  })
})

middleware.push((ctx, next) => {
  ctx.arr.push(2)
  return next().then(() => {
    ctx.arr.push(5)
  })
})

middleware.push((ctx, next) => {
  ctx.arr.push(3)
  return next().then(() => {
    ctx.arr.push(4)
  })
})

const ctx = { arr: [] }
middleware
  .compose(ctx)
  .then(() => {
    console.log(ctx.arr.toString() === '1,2,3,4,5,6')
  })
