export default function(nga, admin){
  console.log(nga.custom.userInfo.user.role )

  let dashboard = nga.dashboard()

  let pat = nga.collection(admin.getEntity('pat'))
    .name('pat')
    .title('最新患者')
    .fields([
      // nga.field('avatar', 'template').label('头像').template('<img src={{entry.values.avatar}} style = "width:30px;height:30px;border-radius:15px">'),
      nga.field('name').label('姓名'),
      nga.field('mobile'),
      nga.field('city'),
      nga.field('gender', 'choice')
    ])
    .perPage(9)

  let consult = nga.collection(admin.getEntity('consult'))
    .name('consult')
    .title('最新咨询')
    .fields([
      nga.field('pat_id', 'reference'),
      nga.field('text'),
      nga.field('is_replied', 'boolean')
    ])
    .perPage(9)

  let book_record = nga.collection(admin.getEntity('book_record'))
    .name('book_record')
    .title('最新预约记录')
    .fields([
      nga.field('pat_name').label('患者姓名'),
      nga.field('pat_age'),
      nga.field('pat_gender', 'choice'),
      nga.field('doc_id', 'reference'),
      nga.field('dept_id', 'reference')
    ])
    .perPage(9)

  let suggestion_in_feedback = nga.collection(admin.getEntity('suggestion_in_feedback'))
    .name('suggestion_in_feedback')
    .title('最新建议')
    .fields([
      nga.field('pat_id', 'reference'),
      nga.field('content'),
      nga.field('doc_id', 'reference'),
      nga.field('dept_id', 'reference'),
      nga.field('is_replied', 'boolean')
    ])
    .perPage(9)

  let followup_task = nga.collection(admin.getEntity('followup_task'))
    .name('followup_task')
    .title('最新随访任务')
    .fields([
      nga.field('pat_id', 'reference'),
      nga.field('doc_id', 'reference'),
      nga.field('dept_id', 'reference'),
      nga.field('medical_item_id', 'reference'),
      nga.field('status', 'choice').choices(nga.custom.choices.followupStatusType)
    ])
    .perPage(9)

  let followup_plan = nga.collection(admin.getEntity('followup_plan'))
    .name('followup_plan')
    .title('最新随访计划')
    .fields([
      nga.field('followup_rule_id', 'reference'),
      nga.field('survey_id', 'reference'),
      nga.field('plan_days_after'),
      nga.field('enable', 'boolean')
    ])
    .perPage(9)

  let collections = [pat, consult, book_record, suggestion_in_feedback, followup_task, followup_plan]
  collections.forEach( collection => {
    collection._fields.forEach(i => nga.custom.fieldBatchTask(nga,i) )
    dashboard.addCollection( collection )
  })

  dashboard.template(`
<div class="row dashboard-starter"></div>
<dashboard role="${nga.custom.userInfo.user.role}"></dashboard>
<div class="board_list_deliver" style="padding-bottom:0;"></div>
<div class="row dashboard-content" style="padding-top:20px;">
    <div class="col-lg-6">
        <div class="panel panel-default">
            <ma-dashboard-panel collection="dashboardController.collections.pat" entries="dashboardController.entries.pat" datastore="dashboardController.datastore"></ma-dashboard-panel>
        </div>
    </div>
    <div class="col-lg-6">
        <div class="panel panel-default">
            <ma-dashboard-panel collection="dashboardController.collections.consult" entries="dashboardController.entries.consult" datastore="dashboardController.datastore"></ma-dashboard-panel>
        </div>
    </div>
    <div class="col-lg-6">
        <div class="panel panel-default">
            <ma-dashboard-panel collection="dashboardController.collections.book_record" entries="dashboardController.entries.book_record" datastore="dashboardController.datastore"></ma-dashboard-panel>
        </div>
    </div>
    <div class="col-lg-6">
        <div class="panel panel-default">
            <ma-dashboard-panel collection="dashboardController.collections.suggestion_in_feedback" entries="dashboardController.entries.suggestion_in_feedback" datastore="dashboardController.datastore"></ma-dashboard-panel>
        </div>
    </div>
    <div class="col-lg-6">
        <div class="panel panel-default">
            <ma-dashboard-panel collection="dashboardController.collections.followup_task" entries="dashboardController.entries.followup_task" datastore="dashboardController.datastore"></ma-dashboard-panel>
        </div>
    </div>
    <div class="col-lg-6">
        <div class="panel panel-default">
            <ma-dashboard-panel collection="dashboardController.collections.followup_plan" entries="dashboardController.entries.followup_plan" datastore="dashboardController.datastore"></ma-dashboard-panel>
        </div>
    </div>
</div>
`)

  return dashboard

}