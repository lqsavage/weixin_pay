const router = require('koa-router')()
const xml = require('../middleware/xml')

router.get('/', xml, (ctx, next) => {
  ctx.body = ctx.xml
  console.log('body', ctx)
})

module.exports = router
