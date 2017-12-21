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
    let id        = ctx.request.body.pay_appid
    let openid    = ctx.request.body.openid
    let amount    = ctx.request.body.amount
    let desc      = ctx.request.body.desc
    let client_ip = ctx.request.body.client_ip

    //查询app相关信息
    let app    = await knex('app').where({ id }).first()
    let appid  = app.wx_appid
    let key    = app.api_key
    let mch_id = app.mchid

    //参数校验
    if (appid && openid && amount) {

        //生成随机字符串
        let md5sum = crypto.createHash('md5')
        let ran = Math.round(Math.random() * 10000) + ''
        md5sum.update(ran)
        let str = md5sum.digest('hex')
        console.log('str', str)

        //生成订单号
        let partner_trade_no = new Date().getTime() + 'wx' + ran

        //生成企业付款订单
        await knex('transfer').insert({
            id         : partner_trade_no,
            appid      : id,
            amount     : amount,
            description: desc || '提现',
            openid     : openid,
            client_ip  : client_ip
        })

        let opt = {
            mch_appid       : appid,
            mchid           : mch_id,
            nonce_str       : str,
            desc            : desc || '提现',
            partner_trade_no: partner_trade_no,
            amount          : amount,
            spbill_create_ip: client_ip,
            check_name      : 'NO_CHECK',
            openid          : openid,
            created_at: new Date(),
            transaction_id: ''
        }

        //生成签名
        let stringA = `
            amount            = ${amount}
            &check_name       = NO_CHECK
            &desc             = ${opt.desc}
            &mch_appid        = ${appid}
            &mchid            = ${mch_id}
            &nonce_str        = ${str}
            &openid           = ${openid}
            &partner_trade_no = ${partner_trade_no}
            &spbill_create_ip = ${client_ip}
            &key              = ${key}
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
                            .post('https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers') 
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
        if (result.result_code[0] == 'SUCCESS') {
            ctx.body = 'success'
            await knex('transfer').update({ status: 'paid' }).where({ id: partner_trade_no})
        }else{
            ctx.body = result.return_msg[0]
            await knex('transfer').update({ status: 'failed', failure_msg: result.return_msg[0] }).where({ id: partner_trade_no })
        }

    } else ctx.body = '参数有误'
})

module.exports = router