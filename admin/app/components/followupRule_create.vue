<template>
    <div class="followup-create">
        <div class="row padding-T10 padding-B10 followup-create-header clearfix">
            <h4 class="pull-left">新建随访规则</h4>
            <div class="pull-right">
                <button class="btn btn-default" @click="handleSave">保存</button>
                <button class="btn btn-default margin-L10" @click="handleCancel">取消</button>
            </div>
        </div>
        <form class="form-horizontal followup-create-form center-block">
            <div class="form-group">
                <label class="col-sm-2 control-label">规则名称</label>
                <div class="col-sm-10">

                    <input type="text" v-model="name" class="form-control" placeholder="如：全院满意度随访">
                </div>
            </div>
            <div class="form-group">
                <label  class="col-sm-2 control-label">匹配条件</label>
            </div>
            <div class="form-group">
                <label  class="col-sm-2 control-label">科室</label>
                <div class="col-sm-10">
                    <select class="form-control" v-model="deptId">
                        <option v-for="item in allDepts" :value="item.id" :key="item.id">{{ item.name }}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">医生</label>
                <div class="col-sm-10">
                    <select class="form-control" v-model="docId">
                        <option v-for="item in allDocs" :value="item.id" :key="item.id">{{ item.name }}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">诊断项目</label>
                <div class="col-sm-10">
                    <select class="form-control" v-model="medicalItemId">
                        <option v-for="item in allMedicalItems" :value="item.id" :key="item.id">{{ item.name }}</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">分配随访员</label>
            </div>
            <div class="form-group">
                <label class="col-sm-2 control-label">随访员</label>
                <div class="col-sm-10">
                    <select class="form-control" v-model="followuperId">
                        <option v-for="item in allFollowupers" :value="item.id" :key="item.id">{{ item.name }}</option>
                    </select>
                </div>
            </div>
            <div>
                <div class="form-group">
                    <label class="col-sm-2 control-label">随访计划</label>
                </div>
                <div v-for="(plan, index) in followupPlans" :key="index">
                    <div class="form-group">
                        <label class="col-sm-2 control-label">{{ (index + 1) + '.' }}</label>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">回访时间</label>
                        <div class="col-sm-10">
                            <select class="form-control" v-model="followupPlans[index].planDaysAfter">
                                <option v-for="item in allplanDaysAfters" :value="item.id" :key="item.id">{{ item.name }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label">问卷关联</label>
                        <div class="col-sm-10">
                            <select class="form-control" v-model="followupPlans[index].surveyId">
                                <option v-for="item in allSurveys" :value="item.id" :key="item.id">{{ item.title }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-default" @click="addPlan">添加计划</button>
        </form>
    </div>
</template>
<script>
import { agent } from '../utils/request'
import async from 'async'
  export default{
    data (){
      return {
        name: '', // 规则名称
        docId: '',
        deptId: '',
        medicalItemId: '',
        followuperId: '',
        surveyId: '',
        planDaysAfter: '',
        allDocs: [], // 医生表
        allDepts: [], // 科室表
        allMedicalItems: [], // 随访项目表
        allFollowupers: [], // 随访人员表
        allSurveys: [], // 问卷表
        allplanDaysAfters: [
          { id: 1, name: "3天后" },
          { id: 2, name: "7天后" },
          { id: 3, name: "10天后" },
          { id: 4, name: "15天后" },
          { id: 5, name: "30天后" },
          { id: 6, name: "60天后" },
          { id: 7, name: "90天后" },
          { id: 8, name: "120天后" },
          { id: 9, name: "180天后" }
        ], // 回访时间
        followupPlans: [ // 随访计划数组
        ],
      }
    },
    created: function () {
      async.parallel([
        () => {
          agent
            .get('dept')
            .end((req, res) => { this.allDepts = res.body })
        },
        () => {
          agent
            .get('doc')
            .end((req, res) => { this.allDocs = res.body })
        },
        () => {
          agent
            .get('medical_item')
            .end((req, res) => { this.allMedicalItems = res.body })
        },
        () => {
          agent
            .get('adminer')
            .end((req, res) => { this.allFollowupers = res.body })
        },
        () => {
          agent
            .get('survey')
            .end((req, res) => { this.allSurveys = res.body })
        }
        
      ])
    },
    methods: {
      addPlan: function () {
        this.followupPlans.push({ planDaysAfter: '', surveyId: '' });
      },
      handleCancel: function () {
        window.location = '#/followup_rule/list';
      },
      handleSave: function () {
        let followupRuleId = null
        async.waterfall([
          // 新增随访规则
          (callback) => {
            agent
              .post('followup_rule')
              .set({ Prefer: 'return=representation' })
              .send({
                name: this.name,
                dept_id: this.deptId,
                doc_id: this.docId,
                enable: true,
                medical_item_id: this.medicalItemId,
                followuper_id: this.followuperId,
              })
              .end((req, res) => {
                followupRuleId = res.body[0].id
                console.log('followupRuleId1',followupRuleId)
              })

          },
          // 跟据获得的随访规则id,遍历增加随访计划  
          (followupRuleId, callback) => {
            this.followupPlans.forEach( item => {
            agent
              .post('followup_plan')
              .send({
                followup_rule_id: followupRuleId,
                survey_id: item.surveyId,
                plan_days_after: item.planDaysAfter,
                enable: true
              })
              .end((req, res) => {})
            })
          }
        ], (err, result) => {
            history.go(-1) // 刷新页面
        })
      }
    }
  }
</script>
<style>
    .followup-create .margin-L10{
        margin-left: 10px;
    }
    .followup-create .padding-T10{
        padding-top: 10px;
    }
    .followup-create .padding-B10{
        padding-bottom: 10px;
    }
    .followup-create .followup-create-header{
        border-bottom: 1px solid #eee;
    }
    .followup-create .followup-create-form{
        margin-top: 30px;
        max-width: 650px;
        min-width: 500px;
    }
</style>