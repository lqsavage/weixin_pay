import { API_URL, HEALTH_API_URL, HEALTH_ENTITIES, API_MAP } from '../config/const.js'

export default function(RestangularProvider, $httpProvider) {

  RestangularProvider.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
    headers = headers || {};
    headers['Prefer'] = operation === 'getList' ? 'count=exact' : 'return=representation' //获取列表时, 获取确切计数

    if(operation !== 'getList'){
      if(url.indexOf( what + '/') > -1) {
        let id = url.split(  what + '/' )[1]
        id && (params.id = 'eq.' + id)
        url = url.split(  what + '/' )[0] + what
      }
    }

    if (operation === 'getList') {
      headers['Range-Unit'] = what;
      headers['Range'] = ((params._page - 1) * params._perPage) + '-' + (params._page * params._perPage - 1);
      delete params._page;
      delete params._perPage;

      if (params._sortField) {
        params.order = params._sortField + '.' + params._sortDir.toLowerCase();
        delete params._sortField;
        delete params._sortDir;
      }

      // _filters 移到 query
      if (params._filters) {
        for (var i in params._filters)
          params[i] = 'eq.' + params._filters[i]
        delete params._filters
      }

      if (what == 'recharge') params['status'] = 'eq.paid'
    }

    if(element){
      for(let i in element)
        if(element[i] instanceof Array) {
          element[i] instanceof Array && (element[i] = '{' + element[i].toString() + '}') //postgre传递数组时需改成对象
          /* 上一行如果出错换回这段
          let array = element[i]
          let filtratedArray = []
          array.forEach( i => i !== null && i !== undefined && filtratedArray.push( i ) )
          //array.forEach()
          element[i] = '{' + filtratedArray.toString() + '}' //postgre传递数组时需改成对象
          */
        }
    }
  })

  RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {

    if( operation === 'remove' && response.data && response.data.length === 0 && response.status === 200){
      alert( '删除可能未成功')
    }

    switch (operation) {
      case 'get':
        return data[0]
      case 'getList':
        response.totalCount = response.headers('Content-Range').split('/')[1]
        break
    }
    return data
  })

  RestangularProvider.setErrorInterceptor(function(response, deferred, responseHandler) {
    console.log(arguments)
    if (response.status === 400) {

      //if(response && response.data && response.data.message){
      //  response.data.message = response.data.message.replace( '关系 "', '"')
      //    .replace(/"/g, '')
      //}
    }
    if (response.status === 401) {
      return alert('认证失败, 请重新登录!') //self.location = './login.html'
    }
    if (response.status === 403) {

      //arguments[1].data &&
      //arguments[1].data.message &&
      //arguments[1].data.message.indexOf('permission denied for relation') > -1 && alert('没有权限访问!')

      //return self.location = './login.html'
    }
    if (response.status === 404) {
    }
    if (response.status === 405) {
      return alert('没有权限!')
    }


    return true; // error not handled
  })

  // @see https://github.com/mgonto/restangular/issues/603
  $httpProvider.interceptors.push(function() {
    return {
      request: function(config) {
        //queryString替换
        config.nativeParamSerializer = config.paramSerializer
        config.paramSerializer = () =>
          config.nativeParamSerializer( config.params )
            .replace('_GT=eq.', '=gt.')
            .replace('_LT=eq.', '=lt.')
            .replace('_GTE=eq.', '=gte.')
            .replace('_LTE=eq.', '=lte.')
            .replace('_NEQ=eq.', '=neq.')
            .replace('_LIKE=eq.', '=like.')
            .replace('_ILIKE=eq.', '=ilike.')
            .replace('_IS=eq.', '=is.')
            .replace('_FULL=eq.', '=@@.')
            .replace('_CONTAINS=eq.', '=@>.')
            .replace('_CONTAINED=eq.', '=<@.')
            .replace('_NOT=eq.', '=not.')
            .replace('_IN=eq.', '=in.')

        var userInfo = JSON.parse(localStorage.dfyyCrmAdmin_userInfo || '{"user":0}')

        // config.headers["Authorization"] = 'Bearer ' + userInfo.jwt_token

        //var pattern = /\/(\d+)$/
        //if (pattern.test(config.url)) {
        //  config.params = config.params || {};
        //  config.params['id'] = 'eq.' + pattern.exec(config.url)[1];
        //  config.url = config.url.replace(pattern, '');
        //}

        //if( config.url.indexOf(config.headers['Range-Unit']+ '/') > -1 ){
        //  let id = config.url.split( config.headers['Range-Unit']+ '/' )[1]
        //  if( id ) {
        //    config.params['id'] = 'eq.' + id
        //    config.url = config.url.split( config.headers['Range-Unit']+ '/' )[0] + config.headers['Range-Unit']
        //  }
        //}

        if( config.params && config.params.id ){
          let id = config.params.id.split('eq.')[1]
          if ( config.url.indexOf( '/' + id ) > 0 ){
            config.url = config.url.replace( '/' + id, '' )
          }
        }



        //每个实体都写太麻烦, 统一拦截
        config.method === 'PUT' && (config.method = 'PATCH')


        //使用虚拟字段搜索
        config.params && config.params.search === 'eq.undefined' && delete config.params.search
        if (config.params) {

          for (let paramName in config.params) {
            config.params[paramName] === 'eq.undefined' && delete config.params[paramName]
            if (config.params[paramName] && paramName.indexOf('_FOR_SEARCH') > 0) {
              config.params[paramName.split('_FOR_SEARCH')[0]] = 'ilike.*' + config.params[paramName].toString().split('eq.')[1] + '*'
              delete config.params[paramName]
            }
          }

        }

        if (config.params) {

          for (let paramName in config.params) {
            config.params[paramName] === 'eq.undefined' && delete config.params[paramName]
            //if (config.params[paramName] && config.params[paramName].indexOf('eq.gte.') > -1 ) {
            //  config.params[paramName] =
            //}
            config.params[paramName] = config.params[paramName].replace('+0800 (CST)', '')
            if (config.params[paramName].indexOf('GMT+0800')) config.params[paramName] = config.params[paramName].split('GMT')[0]
          }
        }

        //老版搜索
        //if (config.params && config.params.search) {
//
        //  config.headers["Content-Type"] = "application/json;charset=utf-8"
        //  config.method = 'POST'
        //  config.data = { search: config.params.search.split('eq.')[1] }
        //  if (config.url && config.url.indexOf('/crm/rest/rpc/search') === -1) {
        //    config.url = API_URL + 'rpc/search_' + config.url.split('/crm/rest/')[1] + 's'
        //  }
        //  delete config.params.search
//
        //  config.params && config.params.length === 0 && delete config.params
//
        //}

        //新版搜索
        if (config.params && config.params.search) {

          config.headers["Content-Type"] = "application/json;charset=utf-8"
          config.method = 'POST'
          config.data = {
            rel: config.url.split('/crm/rest/')[1],
            q  : config.params.search.split('eq.')[1],
          }
          if (config.url && config.url.indexOf('/crm/rest/rpc/search') === -1) {
            config.url = API_URL + 'rpc/search'
          }
          delete config.params.search
          delete config.params.order

          config.params && config.params.length === 0 && delete config.params

        }

        API_MAP.url.forEach(i => config.url = config.url.replace( i.k, i.v))

        //匹配到其他服务系统的entity时
        HEALTH_ENTITIES.indexOf( config.url.split( API_URL )[1] ) > -1
        && (config.url = config.url.replace( API_URL, HEALTH_API_URL ))
        && delete config.headers.Authorization
        return config
      }
    }
  })
}
