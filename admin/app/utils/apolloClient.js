/**
 * Created by Administrator on 2017/6/26.
 * graphql请求方法
 */
import { ApolloClient, createNetworkInterface } from 'apollo-client'
const userInfo = JSON.parse(localStorage.dfyyCrmAdmin_userInfo || '{"user":0}');
const networkInterface = createNetworkInterface({
    uri: require('../config/const').API_URL_GRAPHQL,
    transportBatching: true
})
networkInterface.use([{
  applyMiddleware(req, next){
    if(!req.options.headers){
     // req.options.headers = {} // 如果没有headers则穿件
    }
    //req.options.headers.Authorization = 'Bearer ' + userInfo.jwt_token
    next()
  }
}])
const apolloClient = new ApolloClient({
  networkInterface,
  connectToDevTools: true
 });
export default apolloClient;