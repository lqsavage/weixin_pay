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
    .label('应用')
  var order_no        = nga.field('order_no')
  var amount          = nga.field('amount')
  var body            = nga.field('body').label('描述')
  var openid          = nga.field('openid')
  var client_ip       = nga.field('client_ip')
  var trade_type      = nga.field('trade_type')
  var amount_refunded = nga.field('amount_refunded')
  var clientstatus_ip = nga.field('status')
  var failure_msg     = nga.field('failure_msg')
  var paid_at         = nga.field('paid_at', 'datetime')
  var created_at      = nga.field('created_at', 'datetime')
  var updated_at      = nga.field('updated_at', 'datetime')

  var tempFiled = nga.field('', 'template').template(
    entry => `
<div>
    <table class="common-listView-tempFiled">
        <tr><td>{{ 'amount'      | dictionary }}</td><td>{{ entry.values.amount      | dictionary}}</td></tr>
        <tr><td>{{ 'order_no'    | dictionary }}</td><td>{{ entry.values.order_no    | dictionary}}</td></tr>
        <tr><td>{{ '描述'         | dictionary }}</td><td>{{ entry.values.body        | dictionary}}</td></tr>
        <tr><td>{{ 'status'      | dictionary }}</td><td>{{ entry.values.status      | dictionary}}</td></tr>
        <tr><td>{{ 'failure_msg' | dictionary }}</td><td>{{ entry.values.failure_msg | dictionary}}</td></tr>
        <tr><td>{{ 'paid_at'     | dictionary }}</td><td>{{ entry.values.paid_at     | dateTime}}</td></tr>
    </table>
</div>
    `
  ).label(' ')


  this.e.properties = [id, appid, order_no, amount, body, openid, client_ip, trade_type, amount_refunded, clientstatus_ip, failure_msg, paid_at, created_at, updated_at,]
  this.e.listView().fields([id, appid, tempFiled, created_at])
  this.e.showView().fields(this.e.properties)
  this.e.title = '支付'
  this.e.menuRole = ['followuper', 'super_admin', 'kf', 'doc', 'hos_admin', 'dept_admin']
  this.e.icon = 'fa-street-view'
  this.e.listView().filters([...this.e.properties, nga.custom.searchField(nga) ])
  return this
}