/** @namespace require */
/** @namespace localStorage.dfyyCrmAdmin_userInfo */

var userInfo = JSON.parse( localStorage.dfyyCrmAdmin_userInfo || '{"user":0}' )
var role = userInfo.user ? userInfo.user.role : null
role || (self.location = './login.html')

import ngAdmin from 'ng-admin'
import 'ngVue'
import './css/app.styl'

const app = angular.module('app', [ngAdmin, 'ngVue', 'restangular'])
app.config(['RestangularProvider', '$httpProvider', require('./utils/interceptor.js')]) // http拦截器
app.config(['NgAdminConfigurationProvider', require('./config/config.js')]) // 内容配置
app.config(['$translateProvider', require('./config/translator.js')]) // 本地化
app.directive('dashboard', require('./dashboard/dashboard')) //dashboard指令

//filters
let lambda = require('./custom/lambda')
for(let i in lambda) app.filter( i, () => lambda[i] )

//angular controllers
const controllerNames = [
//   'modify-password-ctrl',
//   'consult-reply-view-ctrl',
//   'phone-ctrl',
//   'pat_showView_mobile-ctrl',
   'username-ctrl',
//   'alert-ctrl',
//   'survey-stat',
 ]
 controllerNames.forEach( name => {
   require(`./custom/controllers/${name}`)(app)
 })
//
// //vue components
// const componentNames = [
// 	'survey_show',
// 	'survey_edit',
// 	'survey_result_show',
// 	'followupRule_create',
// 	'followupRule_edit',
// 	'followup_task_show',
// 	'followup_task_edit',
// 	'pat_list_tag',
// 	'pat_list_add_tag',
// 	'stat_satisfaction',
// 	'book_for_pat',
// 	'feedback_list_add_reply',
// 	'push_by_tag'
// ]
// componentNames.forEach( name => {
// 	app.value(name, require(`./components/${name}.vue`))
// })