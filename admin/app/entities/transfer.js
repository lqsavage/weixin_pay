/**
 * Created by yezq on 2017/6/22.
 */
export default function(nga){
  this.eName = 'transfer'
  this.e         = nga.entity(this.eName).readOnly(true)
  var id          = nga.field('id')
  var appid           = nga.field('appid', 'reference')
    .targetEntity(nga.entity('app'))
    .targetField(nga.field('name'))
    .label('商户')
  var openid      = nga.field('openid')
  var amount = nga.field('amount').label('金额(元)').template(entry => `<span>-${entry.values.amount / 100}<span>`)
  var client_ip   = nga.field('client_ip')
  var description = nga.field('description')
  var status = nga.field('status', 'choice').label('支付状态')
  var failure_msg = nga.field('failure_msg')
  var created_at  = nga.field('created_at', 'datetime')
  var updated_at  = nga.field('updated_at', 'datetime')

  var tempFiled = nga.field('', 'template').template(
    entry => `
<div>
    <table class="common-listView-tempFiled">
        <tr><td>{{ 'amount'      | dictionary }}</td><td>{{ entry.values.amount      | dictionary }}</td></tr>
        <tr><td>{{ 'description' | dictionary }}</td><td>{{ entry.values.description | dictionary }}</td></tr>
        <tr><td>{{ 'status'      | dictionary }}</td><td>{{ entry.values.status      | dictionary }}</td></tr>
        <tr><td>{{ 'failure_msg' | dictionary }}</td><td>{{ entry.values.failure_msg | dictionary }}</td></tr>
    </table>
</div>
    `
  ).label(' ')

  this.e.properties = [id, appid, openid, amount, client_ip, description, status, failure_msg, created_at, updated_at,]
  this.e.listView().fields([appid, amount, status, created_at, ])
  this.e.listView().prepare(['Restangular', 'datastore', 'entries', 'Entry', function(Restangular, datastore, entries, Entry) {
    if( entries && entries.length && entries[0] ){
      let count = 0
      entries.forEach( i => i.values.amount && (count += i.values.amount) )
      entries.push({
        values: {
          id          : 'count',
          amount      : count,
          status      : 'total'
        }
      })
    }
  }])
  this.e.showView().fields(this.e.properties)
  this.e.title = '企业付款'
  this.e.menuRole = ['followuper', 'super_admin', 'kf', 'doc', 'hos_admin', 'dept_admin']
  this.e.icon = 'fa-street-view'
  this.e.listView().filters([appid.pinned(true)])
  return this
}