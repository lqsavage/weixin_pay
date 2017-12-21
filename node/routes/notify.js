const router = require('koa-router')()
const xml = require('../middleware/xml')

router.get('/', xml, async (ctx, next) => {
  let body = ctx.xml
  console.log('body', ctx)
})

module.exports = router
