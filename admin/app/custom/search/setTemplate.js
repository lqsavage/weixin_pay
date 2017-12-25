
/**
 * @name setSearchTemplate
 * @author admin@yeernet.com
 * @createdAt 2017-07-04 14:46
 * @lastModified 2017-07-04 14:46

 * @function
 * @param {string} placeholder
 * @return html template string
 */

export default function(placeholder){
  return `
<div class="input-group">
  <input type="text" ng-model="value" placeholder="搜索` + (placeholder || '') + `" class="form-control"/>
  <span class="input-group-addon">
    <i class="glyphicon glyphicon-search"></i>
  </span>
</div>
`
}