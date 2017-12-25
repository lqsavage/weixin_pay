
## 安装
$ npm i
## 如何运行
```
$ make run
或
$ npm start
或
$ ./node_modules/.bin/webpack-dev-server --host=0.0.0.0 --port 8980 --progress --colors --devtool cheap-module-inline-source-map --hot --inline
```
- linux下如无法build，尝试：
```bash
$ npm i -g npm
$ npm i -g webpack
$ npm i -g webpack-dev-server
$ npm i -g node-sass
```
- visit: http://localhost:8980
 
## 演示部署
```
npm run build
或
./node_modules/.bin/webpack-dev-server --host=0.0.0.0 --port 8980 --progress --colors --devtool cheap-module-inline-source-map --hot --inline </dev/null >crm-admin-ng.log 2>&1 &
```
## todo 

- 菜单定位丢失
- 文件上传

# nga框架原生方法
- App
- Entity
  - url 可对实体所有请求进行过滤，这样可以避免写太多不必要的数据视图，如
  ```
  var e          = nga.entity('feedback').url('/feedback?type=eq.suggestion')
  ```
- Field
  - editable: 该字段在editView中不可编辑
  ```
  var dealer_id  = nga.field('dealer_id').editable(false)
  ```
- View
  - 永久过滤（副作用：过滤操作时也无法更改，要listView首次加载时过滤恐怕得用prepare(Function)）
  ```
  listView.permanentFilters({
    enable:true
  })
  ```

# nga框架增强

 - 不会影响框架原有功能, 可以在任何地方插入原有官方写法

## nga.custom
  - 可在浏览器通过打印nga查看
    
## [nga配置](https://ng-admin-book.marmelab.com/doc/reference/Application.html)
- `var app = nga.application( appName )
    .baseApiUrl( url );`<br/>
    其中, `appName` 为应用程序标题, `url`为restful接口根目录

## [entity(实体)](https://ng-admin-book.marmelab.com/doc/reference/Entity.html)
- 首先, 你要为entity做一些[基本配置](https://ng-admin-book.marmelab.com/doc/reference/Entity.html)
- 然后, 你要为entity配置一些[`view`(视图)](https://ng-admin-book.marmelab.com/doc/reference/View.html)<br/>
官方写法: 如`listView().fields( [field1 , field2, field3, ...])`<br/>
增强写法: `listView.fields = [field1 , field2, field3, ...]` TODO: (暂未封装完成)
- entities统一放在`app/entities/` 文件夹中, 现在实例化一个entity, 假设命名为`e`, 可对`e`的属性进行如下配置:<br/>

 ```
| property   | type   | range          | required | default    | example          |
|------------|--------|----------------|----------|------------|------------------|
| title      | String | string         | N        | netityName | '用户管理'        |
| parentMenu | String | parentMenu     | N        | null       | 'base'           |
| menuRole   | Array  | string         | N        | null       | ['super_admin']  |
| icon       | String | nga-icon-class | N        | 'fa-users' | 'fa-street-view' |
```

- 不配置`e.parentMenu`, 实体不会在左侧菜单显示(指定的父级菜单下), 若父级菜单不存在, 同样不会显示
- 不配置`e.menuRole`, 不会在菜单中显示
- 一个实体要在左侧菜单中显示, 需同时配置 `e.parentMenu`和`e.menuRole`
 
## [field(字段)](https://ng-admin-book.marmelab.com/doc/reference/Field.html#field-configuration)<br/>
- 官方写法: `nga.field( name, type )`<br/>
- 对`field`的`label`实现了增强, 当`name`与数据字典匹配成功时, `label`将会被修改为数据字典中对应的值, 但仍可按官方方法自定义
- dashboardView中的field暂时无法使用增强

---
对`type`实现了增强<br/>
- 当字段类型为`reference`时:<br/>
自动引用, 不再需要额外运行`field.targetEntity()`和`field.targetField()`方法, 请求时将去掉字段名后面的`_id`
- 当字段类型为`choice`时:<br/>
若`name`可在`nga.cunstom.choices`处匹配到对应的choices, 不再需要运行`field.choices([choice1, choice2, ...])`方法
- 当字段名包含`image`或`avator`时:
<br/>将会自动返回一个`<img/>`标签, 目前给标签加一个通用cssClass和一个专用cssClass, 即`image-field`和`{fieldName}-image-field`, 详见`app/cunstom/field`文件夹

---
搜索字段:<br/>
- 搜索字段是`listview.filters([field1, field2, ...])`参数中的一项<br/>
- 运行`nga.custom.searchField(nga, fieldName + '_FOR_SEARCH', placeholder)`来生成, 字段名必须以`_FOR_SEARCH`结尾或者不指定<br/>
- 其中`nga`是必要参数, 参数二为空时, 将模糊搜索多个字段, 需服务端对应的entity支持, 参数三为空时, `placeholder`为'搜索'二字<br/>
- 触发搜索请求时, 字段名后面的`_FOR_SEARCH`会被忽略, 不会被带到服务器

## dictionary(字典)
- 字典内容详见`app/cunstom/dictionary`文件夹
- 使用`nga.cunstom.dictionary(word)`来使用字典
- 字段名的转换在字典中维护
- nga.cunstom.choices中的label也维护在字典中

## [ng-vue](https://github.com/ngVue/ngVue)
- nga任何可使用template的地方, 均可使用vue模块
- someentity.js  
```
	entity.showView().fields([id]).template('<vue-component name="suvey_show" vprops="entry.values" watch-depth="value" />')
```
- or some.html
```
  <div class="" ng-controller="helloController as ctrl"> //非必须
      <vue-component name="helloComponent" vprops="ctrl.person" watch-depth="value" />
  </div>
```
- main.js  
```
	// 非必须
	myApp.controller('helloController', function () {
	  this.person = {
	    firstName: 'the',
	    lastName: 'world'
	  }
	})
	// 输入元件并注入到全局
	import helloComponent from './app/components/HelloComponent.vue'
	myApp.value('helloComponent', helloComponent)
```

@see: https://ng-admin-book.marmelab.com/doc/Theming.html#customizing-the-view-template-for-a-given-entity  
@see: https://github.com/ngVue/ngVue  
@see: https://github.com/Maopy/via  
@see: https://github.com/ngReact/ngReact  


- 注意：自定义页面是依附于已有view-controller(如showView)，故不需要另外定义controller
- 注意：根据View类型的不同，vprops（即ng-controller的model）的值会不同，具体可使用chrome上的batarang工具查看

## 请求
- 所有的`PUT`请求将被替换成`PATCH`请求, 但该`PUT`的其他参数不变


## 开发过程示例图
![img](http://img.diandianys.com/I_lQscweu_1RJ7jN.png)
## 明确不支持IE6
![img](http://img.diandianys.com/I_lRZIgXI_1sjUfN.png)