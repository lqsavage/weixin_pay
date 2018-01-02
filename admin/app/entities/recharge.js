/**
 * Created by yezq on 2017/6/22.
 */
export default function(nga){
  this.eName = 'recharge'
  this.e         = nga.entity(this.eName).readOnly(true)
  var id              = nga.field('id')
  var appid           = nga.field('appid', 'reference')
    .targetEntity(nga.entity('app'))
    .targetField(nga.field('name'))
    .label('商户')
  var order_no        = nga.field('order_no')
  var amount = nga.field('amount', 'template').label('金额(元)').template(entry => `<span>${entry.values.amount/100}</span>` )
  var body            = nga.field('body').label('描述')
  var openid          = nga.field('openid')
  var client_ip       = nga.field('client_ip')
  var trade_type      = nga.field('trade_type')
  var amount_refunded = nga.field('amount_refunded').label('退款金额')
  var status = nga.field('status', 'choice').label('支付状态').choices([
    { value: 'paid', label: '已支付' },
    { value: 'pending', label: '未支付' }
  ])
  var failure_msg     = nga.field('failure_msg')
  var paid_at         = nga.field('paid_at', 'datetime')
  var created_at      = nga.field('created_at', 'datetime')
  var updated_at      = nga.field('updated_at', 'datetime')


  this.e.properties = [appid]
  this.e.listView().fields([appid, amount, status, order_no, body, amount_refunded, created_at])
  this.e.exportView().fields([
    appid,
    nga.field('amount', 'template').label('金额(元)').template(entry => entry.values.amount / 100),
    order_no,
    body,
    amount_refunded,
    created_at
  ])

  this.e.title = '支付'
  this.e.menuRole = ['followuper', 'super_admin', 'kf', 'doc', 'hos_admin', 'dept_admin']
  this.e.icon = 'fa-street-view'
  this.e.listView().filters([appid.pinned(true)])
  return this
}