const router = require('koa-router')()

router.post('/', async (ctx, next) => {
  let body = ctx.request.body
  console.log('body', ctx)
})

module.exports = router
