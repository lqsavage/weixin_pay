const Koa        = require('koa')
const app        = new Koa()
const json       = require('koa-json')
const onerror    = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger     = require('koa-logger')
const cors       = require('koa-cors')
const xmlParser = require('koa-xml-body')
const router = require('koa-router')()

const notify     = require('./routes/notify')
const pay        = require('./routes/pay')
const transfer   = require('./routes/transfer')
const refund     = require('./routes/refund')

// error handler
onerror(app)

// middlewares
app.use(xmlParser())
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(cors())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
router.get('/', (ctx, next) => {
  ctx.body = '欢迎调用微信支付平台api接口！'
})

router.use('/notify', notify.routes(), notify.allowedMethods())
router.use('/transfer', transfer.routes(), transfer.allowedMethods())
router.use('/refund', refund.routes(), refund.allowedMethods())
router.use('/pay', pay.routes(), pay.allowedMethods())

app.use(router.routes(), router.allowedMethods())

module.exports = app
