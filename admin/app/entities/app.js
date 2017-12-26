/**
 * Created by yezq on 2017/6/22.
 */
export default function(nga){
  this.eName = 'app'
  this.e         = nga.entity(this.eName).readOnly(true)
  var id         = nga.field('id')
  var wx_appid   = nga.field('wx_appid')
  var mchid      = nga.field('mchid')
  var name       = nga.field('name')
  var cert_path  = nga.field('cert_path')
  var api_key    = nga.field('api_key')
  var notify_url = nga.field('notify_url')
  var created_at = nga.field('created_at', 'datetime')
  var updated_at = nga.field('updated_at', 'datetime')

  var tempFiled = nga.field('', 'template').template(
    entry => `
<div>
    <table class="common-listView-tempFiled">
        <tr><td>{{ 'name'       | dictionary }}</td><td>{{ entry.values.name       | dictionary }}</td></tr>
        <tr><td>{{ 'mchid'      | dictionary }}</td><td>{{ entry.values.mchid      | dictionary }}</td></tr>
        <tr><td>{{ 'wx_appid'   | dictionary }}</td><td>{{ entry.values.wx_appid   | dictionary }}</td></tr>
        <tr><td>{{ 'cert_path'  | dictionary }}</td><td>{{ entry.values.cert_path  | dictionary }}</td></tr>
        <tr><td>{{ 'api_key'    | dictionary }}</td><td>{{ entry.values.api_key    | dictionary }}</td></tr>
        <tr><td>{{ 'notify_url' | dictionary }}</td><td>{{ entry.values.notify_url | dictionary }}</td></tr>
    </table>
</div>
    `
  ).label(' ')

  this.e.properties = [wx_appid, mchid, name, cert_path, api_key, notify_url, created_at, updated_at]
  this.e.listView().fields([id, tempFiled, created_at])
  this.e.showView().fields(this.e.properties)
  this.e.title = '应用'
  this.e.menuRole = ['followuper', 'super_admin', 'kf', 'doc', 'hos_admin', 'dept_admin']
  this.e.icon = 'fa-street-view'
  this.e.listView().filters([...this.e.properties ])
  return this
}