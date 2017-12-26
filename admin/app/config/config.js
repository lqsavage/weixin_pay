import entities from './entities.js'
import { agent } from '../utils/request'
import { API_URL } from './const.js'

window.agent = agent

export default function(NgAdminConfigurationProvider) {
  var userInfo = JSON.parse( localStorage.dfyyCrmAdmin_userInfo || '{"user":{}}' )
  userInfo.user.role = 'super_admin'
  var role = userInfo.user ? userInfo.user.role : null
  if(!role){
    //alert('获取用户角色失败，请重新登录!')
    self.location = './login.html'
  }


  var nga = window.nga = NgAdminConfigurationProvider;
  var app = window.app = nga
    .application(document.title = '点点云科室支付管理系统')
    .baseApiUrl(API_URL)
    .header(require('../custom/html/header.html'))
    .debug(true)
  nga.custom = {
    dictionary    : require('../custom/dictionary'),
    fieldBatchTask: require('../custom/fieldBatchTask'),
    searchField   : require('../custom/search/field'),
    choices       : require('../custom/choices'),
    replyButton   : require('../custom/html/reply-button.html'),
    entityConstructor: require('../custom/entity-constructor'),
    userInfo      : userInfo
  }

  var menu = nga.menu()
  // 加主菜单
  //var menuCatalogs = {
  //  home: (function(nga){
  //    var item  = nga.menu().title('系统概览').icon('<span class="fa fa-newspaper-o fa-fw"></span>').link('/dashboard')
  //    item.name = 'home'
  //    item.menuRole = ['followuper', 'super_admin', 'kf', 'doc', 'hos_admin', 'dept_admin']
  //    return item
  //  })(nga),
  //  base: (function(nga){
  //    var item  = nga.menu().title('基础管理').icon('<span class="fa fa-cogs fa-fw"></span>')
  //    item.name = 'base'
  //    item.menuRole = ['followuper', 'super_admin', 'kf', 'doc', 'hos_admin', 'dept_admin']
  //    return item
  //  })(nga),
  //}
  //for(var i in menuCatalogs){
  //  var menuCatalog =  menuCatalogs[i]
  //  menuCatalog.menuRole
  //    && menuCatalog.menuRole.length
  //    && menuCatalog.menuRole.indexOf(nga.custom.userInfo.user.role) > -1
  //    && menu.addChild(menuCatalog)
  //  menuCatalog = null
  //}
  app.menu(menu)


  // 批量配置&添加菜单&实体 要先拦截entities进行配置, 修改后再添加到app中
  for (var k in entities) {

    var ngaEntity = entities[k](nga).e || entities[k](nga)

    //创建菜单项并加到分类,

    let menuItem =           nga.menu()
      .title( ngaEntity.title || ngaEntity._name )
      .icon('<span class="fa '+ (ngaEntity.icon || 'fa-users') +' fa-fw"></span>')
      .link('/' + ngaEntity._name + '/list')
      //修复路由不在列表页时菜单active不应用的问题, (作用域问题)
      .active( function(){
        return window.location.href.split('#/').length > 1 && window.location.href.split('#/')[1].split('/')[0] === this._link.split('/')[1]
      })


    if( ngaEntity.menuRole && ngaEntity.menuRole.length && ngaEntity.menuRole.indexOf(nga.custom.userInfo.user.role) > -1 ) {
      if( ngaEntity.parentMenu ){
        for (let i = 0; i < menu._children.length; i++)
          ngaEntity.parentMenu === menu._children[i].name && menu._children[i].addChild(menuItem)
      } else {
        menu.addChild(menuItem)
      }

    }


    //设置listView分页的默认每页个数为10
    //ngaEntity.views.ListView.perPage = function (num) {
    //  if (!arguments.length) return ngaEntity.ListViewPerPage || 10
    //  this._perPage = arguments[0]
    //  return this
    //}

    ngaEntity.views.ListView.perPage( ngaEntity.ListViewPerPage || 10 )

    var timeFilters = [
      nga.field('created_at_LTE', 'datetime').label('结束时间').pinned(true),
      nga.field('created_at_GTE', 'datetime').label('开始时间').pinned(true),
      nga.field('updated_at_LTE', 'datetime'),
      nga.field('updated_at_GTE', 'datetime'),
    ]
    //listView过滤


    //listView filters
    if( !ngaEntity.noListFilter ){
      ngaEntity.views.ListView._filters.length || ngaEntity.listView().filters([...ngaEntity.views.ListView._fields])
      ngaEntity.listView().filters([ ...ngaEntity.listView()._filters, ...timeFilters ])
      ngaEntity.listView()._filters.forEach( field => nga.custom.fieldBatchTask(nga, field))
    }

    //listView listActions
    ngaEntity.noListAction || !ngaEntity.views.ListView._listActions || ngaEntity.views.ListView._listActions.length === 0
    && ngaEntity.listView().listActions(['show', 'edit', 'delete'])

    //覆盖CreateView提交数据成功函数
    ngaEntity.views.CreateView.onSubmitSuccess(['progression', 'notification', '$state', 'entry', 'entity', function(progression, notification, $state, entry, entity) {
      progression.done()
      //notification.log(`${entry._identifierValue}  .`, { addnCls: 'humane-flatty-success' })
      //$state.go($state.get('list'), { entity: entity.name() })
      window.location.href = '#/' + arguments[4]._name + '/show/' + arguments[3].values['0.id']
      return false
    }])

    for (var viewName in ngaEntity.views) {

      //views命名
      ngaEntity.views[viewName].title(ngaEntity.title || k)

      //处理字段
      ngaEntity.views[viewName]._fields.forEach(i => nga.custom.fieldBatchTask(nga,i) )

    }
    ngaEntity.properties.forEach( i => nga.custom.fieldBatchTask(nga,i) )
    //添加实体
    app.addEntity(ngaEntity)
    k = null
    ngaEntity = null
  }
  //app.dashboard(require('../dashboard/config')(nga, app))
  nga.dashboard().template('app._title')
  //配置错误提示
  app._errorMessage = app.defaultErrorMessage = function defaultErrorMessage(response) {
    let message = response.data && response.data.message || '操作失败!'
    message = message
      .replace( '在字段', '')
      .replace( '中空值违反了非空约束', '不能为空')
      .replace( '关系 "', '"')
      .replace( 'failed to parse filter', '无法解析过滤条件:')
      .replace( '\\"', '"')
      .replace( 'permission denied for schema ', '您的账户没有权限操作')
      .replace( 'JWT invalid', '认证信息有误, 请重新登录!')

    ;( message.indexOf('permission denied for schema') > -1 )
      && (message = '没有权限!')

    if( message.indexOf('column') > -1 && message.indexOf('of relation') && message.indexOf('does not exist') ){
      message = `"${ message.split('"')[3]}"中没有字段"${ message.split('"')[1]}"`
    } else if( message.indexOf('column ') > -1 && message.indexOf(' does not exist') > -1 ){
      //column table_grant.created_at does not exist
      message =
        `"${message.split('column ')[1].split(' does not exist')[0].split('.')[0]}"` +
        `的"${message.split('column ')[1].split(' does not exist')[0].split('.')[1]}"字段不存在`
    }

    if( message.indexOf('permission denied for relation ') > -1 ){
      message = `没有权限对"${message.split('permission denied for relation ')[1]}"进行此操作`
    }

    if( message.indexOf('new row violates row-level security policy for table ') > -1 ){
      message = `没有权限对这一条记录进行此操作`
      //message = `没有权限对${message.split('new row violates row-level security policy for table ')[1]}的这条记录进行此操作`
    }

    if( message.indexOf('update or delete on table ') > -1 && message.indexOf(' violates foreign key constraint ') > -1  && message.indexOf(' on table ') > -1 ){
      message = `至少有一个"${message.split('"')[5]}"依赖此对象, 请先将其删除, 才能删除此对象`
    }

    for( let key in nga.custom.dictionary.keys )
      message = message.replace( `"${key}"`, `"${nga.custom.dictionary(key)}"` )
    console.log(message)
    return message
  }

  nga.configure(app)
}
