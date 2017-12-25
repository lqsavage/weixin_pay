/**
 * 服务器请求工具
 */
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import Axios from 'axios'
import { API_URL } from '../config/const.js'

const userInfo = JSON.parse(localStorage.dfyyCrmAdmin_userInfo || '{"user":0}');

/**
 * superagent
 * @see: https://github.com/visionmedia/superagent/issues/907
 */
const agent = require('superagent-use')(require('superagent'));
agent
  .use(request => {
    request.url = (request.url.indexOf('//') < 0 ? API_URL : '') + request.url
    request.url.indexOf('/health/channel') < 0 && request.set({ Authorization: 'Bearer ' + userInfo.jwt_token }) //TODO: 服务端做好之后jwt要加回去
    return request
  })
  .use(request => {
    request.on('response', response => {
      if(!response.ok){
        alert(response.statusCode === 401 ? '认证未通过, 无法执行该操作!' : response.text)
      }
      return response
    })
  })

/**
 * graphql
 */
const networkInterface = createNetworkInterface({
    uri: require('../config/const').API_URL_GRAPHQL,
    transportBatching: true
})
// jwt 授权验证中间件
const authMid = {
  applyMiddleware(req, next){
    // if(!req.options.headers){
    //   req.options.headers = {} // 如果没有headers则创建
    // }
    // req.options.headers.Authorization = 'Bearer ' + userInfo.jwt_token
    next()
  }
}
// 返回结果错误报告中间件(还需要调整)
const errAfterMid = {
  applyAfterware({ response }, next){
    if(response.status >= 400){
      console.log(response)
      alert(response)
    }
    next()
  }
}
// 使用中间件
networkInterface.use([authMid]).useAfter([errAfterMid])
const apollo = new ApolloClient({
  networkInterface,
  connectToDevTools: true
 });

/**
 * axios
 */
Axios.interceptors.request.use(config => {
  config.headers.Authorization = 'Bearer ' + userInfo.jwt_token
  return config
}, error => {
  return Promise.reject(error)
})
const axios = function ( method="post", params="", data={},  url="") {
  return Axios({
    url: API_URL + url,
    method: method.toLowerCase(),
    params: params,
    data: data,
  })
}

export { apollo, agent, axios };