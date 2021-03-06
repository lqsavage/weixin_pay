const router    = require('koa-router')()
const knex      = require('../utils/knexfile')
const request   = require('superagent')
const crypto    = require('crypto')
const xml2js    = require('xml2js')
const builder   = new xml2js.Builder({ rootName: 'xml' })
const xmlParser = require('../utils/xmlParser')
const fs        = require('fs')

router.post('/', async (ctx, next) => {

    //获取请求参数
    let id          = ctx.request.body.pay_appid
    let recharge_id = ctx.request.body.recharge_id
    let amount      = ctx.request.body.amount

    //查询app及recharge相关信息
    let app      = await knex('app').where({ id }).first()
    let appid    = app.wx_appid
    let key      = app.api_key
    let mch_id   = app.mchid
    let recharge = await knex('recharge').where({ id: recharge_id }).first()

    //参数校验
    if (appid && recharge_id && amount) {

        //生成随机字符串
        let md5sum = crypto.createHash('md5')
        let ran = Math.round(Math.random() * 10000) + ''
        md5sum.update(ran)
        let str = md5sum.digest('hex')
        console.log('str', str)

        //生成退款订单号
        let out_refund_no = new Date().getTime() + 'wx' + ran

        //生成退款订单
        await knex('refund').insert({
            id: out_refund_no,
            appid      : id,
            recharge_id: recharge_id,
            amount     : amount,
            created_at : new Date()
        })

        let opt = {
            appid        : appid,
            mch_id       : mch_id,
            nonce_str    : str,
            out_refund_no: out_refund_no,
            out_trade_no : recharge_id,
            total_fee    : recharge.amount,
            refund_fee   : amount
        }

        //生成签名
        let stringA = `
            appid           = ${appid}
            &mch_id         = ${mch_id}
            &nonce_str      = ${str}
            &out_refund_no  = ${out_refund_no}
            &out_trade_no   = ${recharge_id}
            &refund_fee     = ${amount}
            &total_fee      = ${recharge.amount}
            &key            = ${key}
        `.replace(/\n|\s/g, '')
        console.log('stringA', stringA)

        let md5 = crypto.createHash('md5')
        md5.update(stringA)
        let sign = md5.digest('hex').toUpperCase()
        console.log('sign', sign)

        //生成xml
        opt = Object.assign(opt, { sign: sign })
        let xml = builder.buildObject(opt);
        console.log('xml', xml)

        let pfx = fs.readFileSync(__dirname + '/../cert/' + app.cert_path + '.p12')
        let res = await request
            .post('https://api.mch.weixin.qq.com/secapi/pay/refund')
            .pfx({
                pfx,
                passphrase: Buffer.from(mch_id)
            })
            .set('Content-Type', 'application/xml')
            .send(xml)
        console.log('res', res.text)

        let result = await xmlParser(res.text)
        console.log('result', result)

        //返回
        if (result.return_code[0] == 'SUCCESS') {
            ctx.body = 'success'
        } else {
            ctx.body = result.return_msg[0]
            await knex('refund').update({ status: 'failed', failure_msg: result.return_msg[0] }).where({ id: out_refund_no })
        }

    } else ctx.body = '参数有误'
})

module.exports = router