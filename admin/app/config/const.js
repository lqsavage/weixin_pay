const dev_api_url = 'http://localhost:8888/pay/rest/'
let prod_api_url = 'http://api.diandianyy.com/pay/rest/'
let prod_api_hostname = 'api.diandianyy.com'
let API_URL_GRAPHQL = 'http://api.diandianyy.com/pay/graphql'
let HEALTH_API_URL = 'http://api.diandianyy.com/health/'
let HEALTH_ENTITIES = ['channel', 'feed', 'subscription']
// const API_URL = navigator.userAgent === 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/603.2.5 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.5' ? dev_api_url : prod_api_url

/**
 **  如果用户在浏览器地址栏输入的地址为http://10.1.200.27:8980 , 则将接口指定为 10.1.200.26:5555
 **  如果用户在浏览器地址栏输入的地址为http://172.16.200.5:8980, 则将接口指定为 172.16.200.15:5555
 **/
if(window.location.hostname === '10.1.200.27')  {
  prod_api_url = 'http://10.1.200.27/pay/rest/'
  prod_api_hostname = '10.1.200.27'
  API_URL_GRAPHQL = 'http://10.1.200.27/pay/graphql'
  HEALTH_API_URL = 'http://10.1.200.27/health/'
}
if(window.location.hostname === '172.16.200.5') {
  prod_api_url = 'http://172.16.200.5/pay/rest/'
  prod_api_hostname = '172.16.200.5'
  API_URL_GRAPHQL = 'http://172.16.200.5/pay/graphql'
  HEALTH_API_URL = 'http://172.16.200.5/health/'
}
if(window.location.hostname === '10.1.201.201') {
  prod_api_url = `http://${window.location.hostname}/pay/rest/`
  prod_api_hostname = window.location.hostname
  API_URL_GRAPHQL = `http://${window.location.hostname}/pay/graphql`
  HEALTH_API_URL = `http://${window.location.hostname}/health/`
}
if(window.location.hostname === '0.0.0.0') {
  prod_api_url = `http://${window.location.hostname}/pay/rest/`
  prod_api_hostname = window.location.hostname
  API_URL_GRAPHQL = `http://${window.location.hostname}/pay/graphql`
  HEALTH_API_URL = `http://${window.location.hostname}/health/`
}
let API_URL= prod_api_url


const API_MAP = {
  url: [
    {k: /followup_task_aweek|followup_task_today|followup_task_overdue|followup_task_tomorrow/, v: 'followup_task'},
    {k: /return_mention_aweek|return_mention_today|return_mention_overdue|return_mention_tomorrow/, v: 'return_mention'},
    {k: /dealer_dept|transfer_dept/, v: 'dept'},
    {k: 'followuper', v: 'adminer'},
    {k: 'dealer', v: 'adminer'},
    //{k: 'medical_item', v: 'diagnose_item'},
    //{k: 'medical_record', v: 'diagnose_record'},
    {k: /stat_satisfaction|book_for_pat|modify_password/, v: 'diagnose_item'},//不存在的k
    {k: /suggestion_in_feedback|complaint_in_feedback/, v: 'feedback'},
  ],
  //param: [
  //  {k: 'eq.gte.', v: 'gte.'},
  //  {k: 'eq.lte.', v: 'lte.'},
  //  {k: 'eq.gt.', v: 'gt.'},
  //  {k: 'eq.lt.', v: 'lt.'},
  //  {k: 'eq.neq.', v: 'neq.'},
  //  {k: 'eq.like.', v: 'like.'},
  //  {k: 'eq.ilike.', v: 'ilike.'},
  //  {k: 'eq.is.', v: 'is.'},
  //  {k: 'eq.in.', v: 'in.'},
  //  {k: 'eq.@@.', v: '@@.'},
  //  {k: 'eq.@>.', v: '@>.'},
  //  {k: 'eq.<@.', v: '<@.'},
  //  {k: 'eq.not.', v: 'not.'},
  //]
}


export {
	API_URL, //api接口地址
  API_URL_GRAPHQL,
  HEALTH_API_URL,
  HEALTH_ENTITIES,
  API_MAP,
  prod_api_hostname
}