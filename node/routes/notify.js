const router = require('koa-router')()
const xml = require('../middleware/xml')

router.get('/', xml, async (ctx, next) => {
  let body = ctx.xml
  console.log('body', xml)
})

module.exports = router
