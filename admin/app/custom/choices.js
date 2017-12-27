/**
 * Created by yezq on 2017/7/5.
 *
 * 选项支持string和object类型
 * 选项为string时, 将会自动转换为object: {value: 'string'}
 * 选项为object时, 若有object.label, 页面的label为object.label, 否则会在dictionary中匹配label,
 * dictionary匹配失败时, 页面的label为object.value
 *
 * 可在其他地方通过nga.custom.choices调用
 *
 */

var dictionary = require('./dictionary')
var choices    = {
  gender            : ['M', 'F'],
  enable            : ['true', 'false'],
  followupStatusType: ['todo', 'success', 'fail', 'abort'],
  questionType      : ['open', 'check', 'radio'],
  is_finished       : ['true', 'false'],
  is_canceled       : ['true', 'false'],
  is_replied        : ['true', 'false'],
  is_dealed         : ['true', 'false'],
  am_or_pm          : ['am', 'pm'],
  replier_role      : ['pat', 'doc', 'admin'],
  role              : ['kf', 'followuper', 'dept_admin', 'hos_admin', 'super_admin', 'doc'],
  medicalRecordType : ['operation', 'treatment'],
  feedbackType      : ['suggestion', 'complaint'],
  identity_card_type: ['idcard'],
  return_mention_way: [{value: 'msg', label: '微信/短信'}, 'phone'],
  followup_way: [{value: 'msg', label: '微信/短信'}, 'phone'],
  will_not_return_reason: [
    {value: '1', label: '自觉不必复诊'},
    {value: '2', label: '时间安排不过来'},
    {value: '3', label: '对治疗效果不满意'},
    {value: '4', label: '有更好的就诊去处'},
  ],
  status: [
    {value: 'paid', label: '已支付'},
    { value: 'pending', label: '未支付'}
  ],
  consult_purpose: ['illness', 'book', 'operation', 'drug'],
  call_state: ['GRIF_CALL_OUT', 'GRIF_CALL_MISS', 'GRIF_CALL_IN'],
  last_reason: ['Normal call clearing', 'Request Terminated', 'Decline'],
}
choices.pat_gender = choices.gender
choices.medicalItemType = choices.medicalRecordType
for (var i in choices) {
  for(let j = 0; j < choices[i].length; j++) {
    typeof choices[i][j] === 'string' && (choices[i][j] = {value: choices[i][j]})
    choices[i][j].label || (choices[i][j].label = dictionary(choices[i][j].value) || choices[i][j].value)
  }
}

export default choices