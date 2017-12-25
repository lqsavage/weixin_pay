<template>
    <div class="survey-result-edit">
        <div class="row">
            <a class="btn btn-default pull-left back-btn" href="javascript: history.go(-1)">返回</a>
            <a class="btn btn-default pull-left back-btn ml2" @click="openPhoneUiWithId(pat.id)">发送号码至拨号器</a>
        </div>
        <div v-if="isLoaded === true" class="row">
            <div class="col-md-6 left-area">


                <div>
                    <p>基本信息</p>
                    <div>
                        <p class="col-md-6">姓名：{{ pat.name }}</p>
                        <p class="col-md-6">性别：{{ pat.gender === 'M' ? '男' : '女' }}</p>
                    </div>
                    <div>
                        <p class="col-md-6">年龄：{{ getAge(pat.birthday) }}</p>
                        <p class="col-md-6">手机：{{ pat.mobile }}</p>
                    </div>
                    <div>
                        <p class="col-md-6">科室：{{ dept.name }}</p>
                        <p class="col-md-6">项目：{{ medicalItem.name }}</p>
                    </div>
                    <div>
                        <p class="col-md-6">随访员：{{ followuper.name }}</p>
                    </div>
                </div>


                <div class="margin-T20">
                    <p>随访录音</p>
                    <table class="table">
                        <thead>
                        <tr>
                            <th>拨打时间</th>
                            <th>通话状态</th>
                            <th>通话录音</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="i in call_records">
                            <td>{{ new Date(i.created_at).toLocaleString() }}</td>
                            <td>{{ nga ? nga.custom.dictionary( i.call_state ) : i.call_state }}</td>
                            <td>{{ i.rec_file }}</td>
                        </tr>
                        <tr v-if="!call_records || !call_records.length">
                            <td colspan="3">该号码暂无通话记录</td>
                        </tr>
                        </tbody>
                    </table>
                </div>


            </div>



            <div class="col-md-6 right-area">
                <p>随访问卷</p>
                <div class="center-block">
                    <h4 class="text-center">{{ survey.title }}</h4>
                    <div>
                        <div v-for="(question, index) in survey.questions" :key="index">
                            <p>{{ question.title }}</p>
                            <div v-if="question.types === 'radio'">
                                <div class="radio" v-for="(option, i) in question.options" :key="i">
                                    <label>
                                        <input type="radio"
                                               :name="'optionsOfQuestion' + index"
                                               :data-option-id="option.id"
                                               :radiogroup="'optionsOfQuestion' + index"
                                               :checked="question.result.choose_option_ids && question.result.choose_option_ids.indexOf(option.id) > -1"
                                               @change="saveChange(index, i, question.types)"
                                        >{{ option.text }}
                                    </label>
                                </div>
                            </div>
                            <div v-if="question.types === 'check'">
                                <div class="checkbox" v-for="(option, i) in question.options" :key="i">
                                    <label>
                                        <input type="checkbox"
                                               :name="'optionsOfQuestion' + index"
                                               :data-option-id="option.id"
                                               :checked="question.result.choose_option_ids && question.result.choose_option_ids.indexOf(option.id) > -1"
                                               @change="saveChange(index, i, question.types)"
                                        >{{ option.text }}
                                    </label>
                                </div>
                            </div>
                            <div v-if="question.types === 'open'">
                                <div>
                                    <textarea class="flex10"
                                              style="min-height: 100px;"
                                              :code="question.result.input = question.result.input || '请输入内容'"
                                              v-model="question.result.input"
                                              @keyup="saveChange(index, 0, question.types)"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="red big"><br>* 若您修改了问卷结果, 将会实时保存</div>
                    </div>
                    <!--如果未回答问题-->
                    <!--div v-else>
                        <div v-for="(question, index) in survey.questions" :key="index">
                            <p>{{ question.title }}</p>
                            <div v-if="question.types === 'radio'">
                                <div class="radio" v-for="(option, i) in question.options" :key="i">
                                    <label>
                                        <input type="radio" :name="'optionsRadios' + index">{{ option.text}}
                                    </label>
                                </div>
                            </div>
                            <div v-if="question.types === 'check'">
                                <div class="checkbox" v-for="(option, i) in question.options" :key="i">
                                    <label>
                                        <input type="checkbox">{{ option.text }}
                                    </label>
                                </div>
                            </div>
                            <div v-if="question.types === 'open'">
                                <div></div>
                            </div>
                        </div>
                    </div-->
                </div>
            </div>





        </div>
        <div v-if="isLoaded === false">
            正在加载数据……
        </div>
        <div style="height: 100px;"></div>
    </div>
</template>

<script>
  import {agent} from '../utils/request'
  import async from 'async'
  import {datePattern} from '../utils/dateFormat';
  import {getAgeByBirthday} from '../utils/getAge';
  import question_result from "../entities/question_result"
  const collection = require('lodash/collection')
  function removeItemsByValueFormArray (array, value){
    for(var k in array)
      array[k] === value && array.splice(k, 1)
  }
  let _this
  var select= (
    `
*,
pat(*),
dept(*),
medical_item(*),
followuper:adminer(*),
survey(
    *,
    questions:question(*, options:option(*))
)
`
  )
  export default {
    data() {
      return {
        followupTask   : {},
        pat            : {},
        dept           : {},
        medicalItem    : {},
        followuper     : {},
        survey         : {questions: []},
        survey_result  : {id: null},
        questions      : {}, // 问题信息
        questionResults: [], // 问题答案数组
        isLoaded       : false, // 请求数据是否加载完成, 防止数据请求未完成，而页面先渲染报错,
        call_records   : [],
        nga            : window.nga || undefined,
        select         : select,
      }
    },
    props: {
      id: Number,
    },
    created: function () {
      _this = this
      this.isLoaded = false;
      this.getFollowupTask()
    },
    watch: {
      pat: function( v, o ){
        if( !this.pat.mobile ) return alert('患者无手机号码, 无法获取通话记录')
          agent
            .get('call_record')
            .query({remote_uri: 'eq.' + this.pat.mobile})
            .end((err, res)=>{ this.call_records = res && res.body || [] })
      },
    },
    methods: {
      getFollowupTask: function () {
        console.log('run getFollowupTask!')
        agent
          .get('followup_task')
          .query({id: 'eq.' + this.id})
          .query({select: this.select.replace(/[\r\n]/g, '')})
          .end((req, res) => {
            console.log('followupTask', res.body[0])
            var result        = res.body && res.body[0]
            this.followupTask = result || {}
            this.pat          = result.pat || {}
            this.dept         = result.dept || {}
            this.medicalItem  = result.medicalItem || {}
            this.followuper   = result.followuper || {}
            this.survey       = res.body[0].survey || {}
            this.getSurveyResult()
          })

      },
      getSurveyResult: function () {
        console.log('run getSurveyResult!')
        agent
          .get('survey_result')
          .query({followup_task_id: 'eq.' + this.id})
          .end((req, res) => {
            console.log('survey_result:', res.body[0] )
            res.body
            && res.body[0]
            && (this.survey_result = res.body[0])
            && this.get_question_result()

            res.body && res.body[0] || this.postSurveyResult( this.get_question_result )
          })

      },
      postSurveyResult: function (cb) {
        console.log('run postSurveyResult!')
        agent
          .post('survey_result')
          .send({
            survey_id       : this.followupTask.survey_id,
            pat_id          : this.followupTask.pat_id,
            doc_id          : this.followupTask.doc_id,
            followup_task_id: this.followupTask.id,
          })
          .end((err, res) => {
            console.log(err, res)
            this.survey_result = res.body
            typeof cb === 'function' && cb()
          })
      },
      get_question_result(){
        console.log('run get_question_result!')
        console.log('this.survey.questions', this.survey.questions)
        let request_finished_times = 0
        for(let i in this.survey.questions){
          let question = this.survey.questions[i]
          agent
            .get('question_result')
            .query({survey_result_id: 'eq.' + this.survey_result.id})
            .query({question_id: 'eq.' + question.id})
            .end((err, res)=>{

              res.body && res.body[0]
              && (question.result = res.body[0])
              && request_finished_times++
              && _this.survey.questions.length === request_finished_times
              && (_this.isLoaded = true)

              //没有问题结果就新建
              res.body
              && res.body.length ===0
              && !question.result
              && agent
                .post('question_result')
                .set('Prefer', 'return=representation')
                .send({
                  pat_id: this.pat.id,
                  survey_result_id : this.survey_result.id,
                  question_id: question.id,
                  choose_option_ids: {},
                  input: ''
                })
                .end( (err, res) => {

                  res.body && res.body[0]
                  && (question.result = res.body[0])
                  && request_finished_times++

                  _this.survey.questions.length === request_finished_times && (_this.isLoaded = true)

                })

              console.log(_this.survey.questions.length, request_finished_times)
            })
        }
        return;
        //原先错误的获取方法
        agent
          .get('question_result')
          .query({survey_result_id: 'eq.' + this.survey_result.id})
          .end((err, res) => {
            console.log('question_result', res.body)
            // 按问题id重新进行排序(有时候会顺序错乱,导致问题和答案无法对应)
            //Array === res.body.constructor &&
            console.log(res.body.length, this.survey.questions.length)
            if (res.body && res.body.length < this.survey.questions.length) return this.get_question_result()
            this.questionResults = collection.sortBy(res.body, (item) => {
              return item.question_id
            })
            this.isLoaded = true;
          })
      },
      getAge: function (birthday) {
        return getAgeByBirthday(birthday);
      },
      openPhoneUiWithId(id) {
        if (!id) return alert('该患者没有填写手机号!')
        var $scope = angular.element( document.querySelector('[ng-controller="phone as phone"]') ).scope()

        $scope.$apply(function () {
          $scope.phone.openPhoneUiWithId(id)
        })
      },
      saveChange(index, i, type){
        let questionResult = this.survey.questions[index].result

        if(type !== 'open') {
          let optionId = this.survey.questions[index].options[i].id
          let dom      = document.querySelector(`[data-option-id="${optionId}"]`)
          type === 'radio' && (questionResult.choose_option_ids = [optionId])
          if(type === 'check')
            dom.checked
              ? questionResult.choose_option_ids.push(optionId) && questionResult.choose_option_ids.sort()
              : removeItemsByValueFormArray(questionResult.choose_option_ids, optionId)
        }

        let patchData = type === 'open'
          ? {input: questionResult.input}
          : {choose_option_ids: `{${questionResult.choose_option_ids}}`}

        agent
          .patch("question_result?id=eq." + questionResult.id)
          .send(patchData)
          .end((err, res) => err && alert(`问题${index}保存失败!`))

      },
    }
  }
</script>

<style>
    .survey-result-edit {
        margin-top: 20px;
    }

    .survey-result-edit .margin-T20 {
        margin-top: 20px;
    }

    .survey-result-edit .left-area {
        border-right: 1px solid #eee;
    }

    .survey-result-edit .right-area {
        padding-left: 30px;
    }

    .survey-result-edit .back-btn {
        margin-left: 15px;
        margin-bottom: 10px;
    }
</style>