/**
 * Created by yezq on 2017/6/22.
 */
export default function(nga){
  this.eName = 'refund'
  this.e         = nga.entity(this.eName)
  var id           = nga.field('id')
  var recharge_id  = nga.field('recharge_id')
  var description  = nga.field('description')
  var status       = nga.field('status')
  var failure_msg  = nga.field('failure_msg')
  var appid        = nga.field('appid')
  var succeeded_at = nga.field('succeeded_at')
  var created_at   = nga.field('created_at', 'datetime')
  var updated_at   = nga.field('updated_at', 'datetime')

  var tempFiled = nga.field('', 'template').template(
    entry => `
<div>
    <table class="common-listView-tempFiled">
        <tr><td>{{ 'recharge_id'  | dictionary }}</td><td>{{ entry.values.recharge_id  | dictionary}}</td></tr>
        <tr><td>{{ 'description'  | dictionary }}</td><td>{{ entry.values.description  | dictionary}}</td></tr>
        <tr><td>{{ 'status'       | dictionary }}</td><td>{{ entry.values.status       | dictionary}}</td></tr>
        <tr><td>{{ 'failure_msg'  | dictionary }}</td><td>{{ entry.values.failure_msg  | dictionary}}</td></tr>
        <tr><td>{{ 'appid'        | dictionary }}</td><td>{{ entry.values.appid        | dictionary}}</td></tr>
        <tr><td>{{ 'succeeded_at' | dictionary }}</td><td>{{ entry.values.succeeded_at | dateTime  }}</td></tr>
    </table>
</div>
    `
  ).label(' ')

  this.properties = [id, recharge_id, description, status, failure_msg, appid, succeeded_at, created_at, updated_at,]
  this.e.listView().fields([id, tempFiled, created_at,])
  this.e.title = '退款'
  this.e.menuRole = ['followuper', 'super_admin', 'kf', 'doc', 'hos_admin', 'dept_admin']
  this.e.icon = 'fa-street-view'
  this.e.listView().filters([...this.properties, nga.custom.searchField(nga) ])
  return this
}