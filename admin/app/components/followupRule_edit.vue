<template>
    <div class="followup-create">
        <div class="row padding-T10 padding-B10 followup-create-header clearfix">
            <h4 class="pull-left">编辑随访规则</h4>
            <div class="pull-right">
                <button class="btn btn-default" @click="handleSave">保存</button>
                <button class="btn btn-default margin-L10" @click="handleCancel">取消</button>
            </div>
        </div>
        <form action="" class="form-horizontal followup-create-form center-block">
            <div class="form-group">
                <label class="col-sm-2 control-label">规则名称</label>
                <div class="col-sm-10">
                    <input type="text" v-model="ruleName" class="form-control" placeholder="如：全院满意度随访">
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
                        <label class="col-sm-2 control-label">几天后回访</label>
                        <div class="col-sm-10">
                            <!--select class="form-control" v-model="followupPlans[index].planDaysAfter">
                                <option v-for="item in allplanDaysAfters" :value="item.id" :key="item.id">{{ item.name }}</option>
                            </select-->
                            <input class="form-control ng-pristine ng-valid ng-valid-pattern ng-valid-minlength ng-valid-maxlength ng-valid-required ng-touched"  v-model="followupPlans[index].planDaysAfter"/>
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
            <div class="p4"></div>
        </form>
    </div>
</template>
<script>
import Vue from 'vue'
import { agent } from '../utils/request'
import async from 'async'
  export default{
    data (){
      return {
        ruleName: this.name, // 规则名称
        docId: this.doc_id,
        deptId: this.dept_id,
        medicalItemId: this.medical_item_id,
        followuperId: this.followuper_id,
        planEnable: this.enable,
        allDocs: [], // 医生表
        allDepts: [], // 科室表
        allMedicalItems: [], // 随访项目表
        allFollowupers: [], // 随访人员表
        allSurveys: [], // 问卷表
        allplanDaysAfters: [ // 回访时间
          { id: 1, name: "1天后" },
          { id: 2, name: "2天后" },
          { id: 3, name: "3天后" },
          { id: 4, name: "4天后" },
          { id: 5, name: "5天后" },
          { id: 6, name: "6天后" },
          { id: 7, name: "7天后" },
          { id: 8, name: "8天后" },
          { id: 9, name: "9天后" }
        ], // 回访时间
        followupPlans: [{}],// 随访计划数组 
      }
    },
    props: {
      id: { required: true },
      name: { required: true },
      doc_id: { required: true },
      dept_id: { required: true },
      medical_item_id: { required: true },
      followuper_id: { required: true },
      enable: { required: true }
    },
    created: function () {
      const followupRuleId = this.id
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
        },
        () => {
          agent
            .get('followup_plan')
            .query({ followup_rule_id: 'eq.' + this.id })
            .query({ 
              select: 'id, plan_days_after, survey(id)'
             })
            .end((req, res) => {
              this.followupPlans = []
              res.body.forEach(item => {
                this.followupPlans.push({ planDaysAfter: item.plan_days_after, surveyId: item.survey.id, planId: item.id });
              })
            })
        },
      ])
    },
    methods: {
      addPlan: function () { // 添加随访计划
        const followupRuleId = this.id
        const surveyId = 1
        const planDaysAfter = 1 // 不能为空
        agent
          .post('followup_plan')
          .set({ Prefer: 'return=representation' })
          .send({
            followup_rule_id: followupRuleId,
            enable: true,
            survey_id: surveyId,
            plan_days_after: planDaysAfter,
          })
          .end((req, res) => {
            if(res.ok)
              this.followupPlans.push({ planDaysAfter: '', surveyId: '', planId: res.body[0].id });
          })
      },
      handleCancel: function () {
        window.location = '#/followup_rule/list';
      },
      handleSave: function () {
        // 更新随访规则
        async.series([
          (callback) => {
            agent
             .patch('followup_rule')
             .set({ Prefer: 'return=representation' })
             .query({ id: 'eq.' + this.id })
             .send({
               name: this.ruleName,
               dept_id: this.deptId,
               doc_id: this.docId,
               medical_item_id: this.medicalItemId,
               followuper_id: this.followuperId
            })
            .end((req, res) => {console.log(111)})
          },
        // 遍历更新随访计划 
        this.followupPlans.forEach(item => {
          agent
            .patch('followup_plan')
            .set({ Prefer: 'return=representation' })
            .query({ id: 'eq.' + item.planId })
            .send({
              survey_id: item.surveyId,
              plan_days_after: item.planDaysAfter
            })
            .end((req, res) => {})
          })
        ])
        history.go(-1)
      }
    }
  }
</script>
<style>
    .followup-create .margin-L10{
        margin-left: 10px;
    }
    .followup-create .margin-R10{
        margin-right: 10px;
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