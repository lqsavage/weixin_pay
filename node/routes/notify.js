const router = require('koa-router')()
const knex = require('../utils/knexfile')
const request = require('superagent')
const crypto = require('crypto')

router.post('/', async (ctx, next) => {
  let body = ctx.request.body.xml
  console.log('body', body)
  //查询订单
  let order_no = body.out_trade_no[0]
  let order = await knex('recharge').where({ order_no }).first()
  console.log('order', order)
  let app = await knex('app').where({ wx_appid: body.appid[0] }).first()
  console.log('order', app)
  //退款通知
  if (body.req_info){
    let stringA = new Buffer(body.req_info[0], 'base64').toString()
    let md5sum = crypto.createHash('md5')
    md5sum.update(app.api_key)
    let key = md5sum.digest('hex').toLowerCase()
    decipher = crypto.Decipher('aes-256-cbc', key)
    // 使用BASE64对密文进行解码，然后AES-CBC解密
    // decipher.setAutoPadding(false)
    let msg = decipher.update(stringA, 'base64', 'utf8') + decipher.final('utf8')
    console.log('msg', msg)

  }else{
    if (body.result_code[0] == 'SUCCESS') {
      if(order.status == 'pending'){
        await knex('recharge').update({ status: 'paid', paid_at: new Date() }).where({ order_no })
        for (i of app.notify_url){
          await request('POST', i).send({ "type": "charge.succeeded", order_no, openid: body.openid[0], amount: body.total_fee[0] })
        }
      }else {
        //不做任何处理
      }
    }else{
      await knex('recharge').update({ status: 'failed', failure_msg: body.return_msg[0] }).where({ order_no })
      for (i of app.notify_url) {
        await request('POST', i).send({ "type": "charge.failed", order_no, failure_msg: body.return_msg[0]})
      }
    }
  }
  ctx.body = `<xml>
                <return_code><![CDATA[SUCCESS]]></return_code>
                <return_msg><![CDATA[OK]]></return_msg>
              </xml>`
})

module.exports = router
