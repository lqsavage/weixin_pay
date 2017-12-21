const router    = require('koa-router')()
const knex      = require('../utils/knexfile')
const request   = require('superagent')
const crypto    = require('crypto')
const xml2js    = require('xml2js')
const builder   = new xml2js.Builder({ rootName: 'xml' })
const xmlParser = require('../utils/xmlParser')
const payUrl    = require('../config/constant')

router.post('/', async (ctx, next) => {

    //获取请求参数
    let id        = ctx.request.body.pay_appid
    let openid    = ctx.request.body.openid
    let amount    = ctx.request.body.amount
    let body      = ctx.request.body.body
    let client_ip = ctx.request.body.client_ip

    //查询app相关信息
    let app    = await knex('app').where({ id }).first()
    console.log('app', app)
    let appid  = app.wx_appid
    let key    = app.api_key
    let mch_id = app.mchid

    if (appid && openid && amount) {

        //生成随机字符串
        let md5sum = crypto.createHash('md5')
        let ran = Math.round(Math.random() * 10000) + ''
        md5sum.update(ran)
        let str = md5sum.digest('hex')
        console.log('str', str)

        //生成订单号
        let out_trade_no = new Date().getTime() + 'wx' + ran

        //生成支付订单
        let order = (await knex('recharge').insert({
            id        : out_trade_no,
            appid     : id,
            order_no  : out_trade_no,
            amount    : amount,
            body      : body || '充值',
            openid    : openid,
            client_ip : client_ip,
            trade_type: 'JSAPI'
        }).returning('*'))[0]

        let opt = {
            appid           : appid,
            mch_id          : mch_id,
            nonce_str       : str,
            body            : body || '充值',
            out_trade_no    : out_trade_no,
            total_fee       : amount,
            spbill_create_ip: client_ip,
            notify_url      : payUrl + '/notify',
            trade_type      : 'JSAPI',
            openid          : openid
        }

        //生成调用接口签名
        let stringA = `
            appid             = ${appid}
            &body             = ${opt.body}
            &mch_id           = ${mch_id}
            &nonce_str        = ${str}
            &notify_url       = ${opt.notify_url}
            &openid           = ${openid}
            &out_trade_no     = ${out_trade_no}
            &spbill_create_ip = ${client_ip}
            &total_fee        = ${amount}
            &trade_type       = ${opt.trade_type}
            &key              = ${key}
            `.replace(/\n|\s/g, '')
        console.log('string', stringA)
        
        let md5 = crypto.createHash('md5')
        md5.update(stringA)
        let sign = md5.digest('hex').toUpperCase()
        console.log('sign', sign)

        //生成xml
        opt = Object.assign(opt, { sign: sign })
        let xml = builder.buildObject(opt);
        console.log('xml', xml)

        //调用统一下单接口
        let res = await request
                        .post('https://api.mch.weixin.qq.com/pay/unifiedorder')
                        .set('Content-Type', 'application/xml')
                        .send(xml)
        console.log('res', res.text)
        let result = await xmlParser(res.text)
        let timeStamp = parseInt(new Date().getTime() / 1000)

        if (result.return_code[0] == 'SUCCESS') {
            //生成支付用签名
            let string = `
                appId      = ${appid}
                &nonceStr  = ${str}
                &package   = prepay_id = ${result.prepay_id[0]}
                &signType  = MD5
                &timeStamp = ${timeStamp}
                &key       = ${key}
                `
            md5 = crypto.createHash('md5')
            md5.update(string)
            let paySign = md5.digest('hex').toUpperCase()

            order.recharge = {
                appId: appid,
                timeStamp: timeStamp,
                nonceStr: opt.nonce_str,
                package: `prepay_id=${result.prepay_id[0]}`,
                paySign: paySign,
                signType: 'MD5'
            }
            //返回
            ctx.body = order
        } else{
            ctx.body = (result.return_msg[0])
            await knex('recharge').update({ status: 'failed', failure_msg: result.return_msg[0] }).where({ id: out_trade_no })
        } 
    } else ctx.body = '参数有误'
})

module.exports = router