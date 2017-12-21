const router = require('koa-router')()

router.post('/', async (ctx, next) => {
  let body = ctx.request.body
  console.log('body', body)
  ctx.body = body
})

module.exports = router
