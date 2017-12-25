const router = require('koa-router')()
const knex = require('../utils/knexfile')
const request = require('superagent')
const crypto = require('crypto')
const xmlParser = require('../utils/xmlParser')

router.post('/', async (ctx, next) => {
  let body = ctx.request.body.xml
  console.log('body', body)
  //查询订单

  let app = await knex('app').where({ wx_appid: body.appid[0] }).first()
  console.log('app', app)
  //退款通知
  if (body.req_info){
    let md5sum = crypto.createHash('md5')
    md5sum.update(app.api_key)
    let key = md5sum.digest('hex').toLowerCase()
    let decipher = crypto.createDecipheriv('aes-256-ecb', key, '')
    decipher.setAutoPadding(false)
    let msg = decipher.update(body.req_info[0], 'base64', 'utf8')
    msg += decipher.final('utf8')
    console.log('msg', msg)
    let xml = await xmlParser(msg)
    console.log('xml', xml)
    if (xml.refund_status && xml.refund_status[0] == 'SUCCESS'){
      await knex('refund').update({ status: 'succeeded', succeeded_at: new Date() }).where({ id: xml.out_refund_no[0] })
      await knex('recharge').update({ status: 'refunded' }).increment('amount_refunded', xml.refund_fee[0]).where({ id: xml.out_trade_no[0]})
      for (i of app.notify_url) {
        await request('POST', i).send({ "type": "refund.succeeded", order_no: xml.out_trade_no[0], refund_amount: xml.refund_fee[0] })
      }
    }else {
      await knex('refund').update({ status: 'failed', failure_msg: xml.return_msg[0] }).where({ id: xml.out_refund_no[0] })
      for (i of app.notify_url) {
        await request('POST', i).send({ "type": "refund.failed", order_no: xml.out_trade_no[0], failure_msg: xml.return_msg[0] })
      }
    }
  }else{
    let order_no = body.out_trade_no[0]
    let order = await knex('recharge').where({ order_no }).first()
    console.log('order', order)
    if (body.return_code[0] == 'SUCCESS') {
      if(order.status == 'pending'){
        await knex('recharge').update({ status: 'paid', paid_at: new Date() }).where({ order_no })
        for (i of app.notify_url){
          console.log('notify_url_recharge_success:' i)
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
