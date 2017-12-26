/**
 * Created by yezq on 2017/7/5.
 */
let keys = {
  name                    : '名称',
  id                      : '编号',
  gender                  : '性别',
  age                     : '年龄',
  mobile                  : '手机号',
  city                    : '地区',
  identity_card_number    : '身份证号',
  medical_card_number     : '诊疗卡号',
  created_at              : '创建时间',
  created_at_GTE          : '创建时间大于等于',
  created_at_LTE          : '创建时间小于等于',
  updated_at              : '修改时间',
  updated_at_GTE          : '修改时间大于等于',
  updated_at_LTE          : '修改时间小于等于',
  finished_time           : '完成时间',
  finished_date           : '完成日期',
  types                   : '类型',
  type                    : '类型',
  status                  : '状态',
  description             : '描述',
  image                   : '图片',
  enable                  : '是否有效',
  intro                   : '介绍',
  title                   : '标题',
  content                 : '内容',
  pat_name                : '患者姓名',
  pat_identity_card_number: '患者身份证',
  pat_medical_card_number : '患者医保卡',
  pat_gender              : '患者性别',
  pat_age                 : '患者年龄',
  pat_mobile              : '患者手机号',
  pat_openid              : '患者openid',
  doc_name                : '医生姓名',
  dept                    : '科室',
  dept_name               : '科室名称',
  is_finished             : '是否完成',
  is_replied              : '是否回复',
  is_canceled             : '是否取消',
  father_id               : '父级编号',
  images                  : '图片(多张)',
  am_or_pm                : '上午/下午',
  illness                 : '疾病',
  past_history            : '既往病史',
  family_history          : '家族病史',
  allergic_history        : '过敏史',
  see_doc_time            : '就医时间',
  text                    : '文本',
  audio                   : '音频',
  sequence                : '排序',
  point                   : '积分',
  replier_role            : '回复者身份',
  login_name              : '登录名',
  password                : '密码',
  birthday                : '生日',
  avatar                  : '头像',
  plan_days_after         : '多少天后随访',
  role                    : '角色',
  fee                     : '费用',
  input                   : '输入',
  identity_card_type      : '证件类型',
  search                  : '搜索',
  date                    : '日期',
  is_booked               : '是否已被预约',
  book                    : '预约',
  tag                     : '标签',
  medicinal               : '用药/描述',
  drug                    : '药品',
  treatment_times         : '就诊次数',
  purpose                 : '目的',
  msg                     : '消息',
  open                    : '开放',
  check                   : '多选',
  radio                   : '单选',
  suggestion              : '建议',
  complaint               : '投诉',
  is_dealed               : '是否处理',
  deal_result             : '处理结果',
  followup_way            : '随访方式',
  plan_followup_date      : '计划随访日期',
  call_state              : '通话状态',
  start_time              : '开始时间',
  end_time                : '结束状态',
  local_uri               : '本机号码',
  remote_uri              : '对方号码',
  rec_file                : '录音文件',
  last_reason             : '结束原因',
  abort_reason            : '中止原因',

  M                       : '男',
  F                       : '女',
  true                    : '是',
  false                   : '否',
  todo                    : '未开始',
  doing                   : '进行中',
  done                    : '已完成',
  success                 : '成功',
  fail                    : '失败',
  am                      : '上午',
  pm                      : '下午',
  pat                     : '患者',
  doc                     : '医生',
  admin                   : '管理员',
  adminer                 : '管理员',
  kf                      : '客服',
  followuper              : '随访员',
  dept_admin              : '科室管理员',
  hos_admin               : '医院管理员',
  super_admin             : '超级管理员',
  operation               : '手术',
  treatment               : '治疗',
  idcard                  : '身份证',
  medical_record_id       : '诊疗记录',
  return_date             : '复诊日期',
  return_note             : '复诊医嘱',
  return_mention_date     : '计划提醒时间',
  return_mention_way      : '计划提醒方式',
  is_return_mentioned     : '是否已提醒',
  will_return_on_time     : '是否将来复诊',
  will_not_return_reason  : '不来复诊原因',
  phone                   : '电话',
  channel_id              : '频道',
  frequent                : '推送频率',
  subscriber_count        : '订阅人数',
  week_num                : '适用周数',
  month_num               : '适用月数',
  period                  : '适用周期',
  read_count              : '阅读数',
  summary                 : '摘要',
  detail                  : '详情',
  subscribed_at           : '订阅日期',
  child_will_birth_at     : '预产期',
  child_birthed_at        : '婴儿出生日期',
  dealer_dept_id          : '处理部门',
  complaint_type          : '投诉类型',
  succ                    : '成功',
  succeeded               : '成功',
  failed                  : '失败',
  abort                   : '中止',
  consult                 : '咨询',

  //呼叫中心
  connect_duration        : '通话时长',
  total_duration          : '占用时长',
  user_oprt               : '客服操作',
  GRIF_CALL_OUT           : '拨出',
  GRIF_CALL_MISS          : '未接',
  GRIF_CALL_IN            : '呼入',

  'Normal call clearing'  : '正常',
  'Request Terminated'    : '挂断',
  'Decline'               : '拒接',

  //引用id字段使用实体名
  dept_id                 : '科室',
  hos_id                  : '医院',
  pat_id                  : '患者',
  doc_id                  : '医生',
  dealer_id               : '处理者',
  survey_id               : '问卷',
  book_schedule_id        : '挂号排班',
  book_source_id          : '号源',
  medical_item_id         : '诊疗项目',
  followuper_id           : '随访者',
  question_id             : '问题',
  tag_id                  : '标签',
  gb_dept_id              : '国标科室',
  followup_rule_id        : '随访规则',
  followup_task_id        : '随访任务',
  survey_result_id        : '随访结果',
  consult_tag_ids         : '咨询标签',
  feedback_tag_ids        : '反馈标签',
  diagnose_item_id        : '诊断项目',
  diagnose_record_id      : '诊断记录',
  transfer_dept_id        : '转交科室',

  hos                     : '医院',
  dealer                  : '处理者',
  survey                  : '问卷',
  book_schedule           : '挂号排班',
  book_source             : '号源',
  medical_item            : '诊疗项目',
  question                : '问题',
  gb_dept                 : '国标科室',
  followup_rule           : '随访规则',
  followup_task           : '随访任务',
  survey_result           : '随访结果',
  consult_tag             : '咨询标签',
  feedback_tag            : '反馈标签',
  diagnose_item           : '诊断项目',
  diagnose_record         : '诊断记录',
  transfer_dept           : '转交科室',

  return_mention         : '复诊提醒',
  return_mention_today   : '今日提醒',
  return_mention_tomorrow: '明日提醒',
  return_mention_aweek   : '一周后提醒',
  return_mention_overdue : '过期提醒',
  medical_record         : '诊疗记录',
  pat_tag                : '患者标签',
  call_record            : '通话记录',
  book_for_pat           : '快速预约',
  book_record            : '预约记录',
  followup_plan          : '随访任务',
  followup_task_today    : '今日随访',
  followup_task_tomorrow : '明日随访',
  followup_task_aweek    : '一周后随访',
  followup_task_overdue  : '过期随访',
  question_result        : '问题结果',
  suggestion_in_feedback : '建议',
  complaint_in_feedback  : '投诉',
  option                 : '问题选项',
  health_info            : '健康档案',
  health_record          : '健康记录',
  modify_password        : '修改密码',
  dealer_dept            : '处理人科室',
  feedback               : '反馈',
  followup_rate          : '随访率',
  stat_satisfaction      : '数据统计',
  channel                : '频道',
  feed                   : '订阅',
  subscription           : '订阅',
  SELECT                 : '查询',
  INSERT                 : '添加',
  UPDATE                 : '修改',
  DELETE                 : '删除',

  wx_appid       : '微信appid',
  mchid          : '商户id',
  cert_path      : '证书地址',
  notify_url     : '通知地址',
  order_no       : '订单号',
  client_ip      : '客户端ip',
  trade_type     : '交易类型',
  amount_refunded: '已退款金额',
  paid_at        : '支付时间',
  recharge_id    : '支付id',
  appid          : '',
  succeeded_at   : '成功时间',
  openid         : '',
  amount         : '数量',
  failure_msg    : '失败提示',
  paid           : '已支付',
  pending        : '进行中',
}

let dictionary = function(s){
  return keys[s] || s
}

dictionary.keys = keys

export default dictionary