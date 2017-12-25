<template>
   <div class="followup_task_show">
       <div class="row">
           <a class="btn btn-default pull-left back-btn" href="javascript: history.go(-1)">返回</a>
       </div>
       <div v-if="isLoading === true" class="row">
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
                       <p class="col-md-6">随访时间：{{ followupTime }}</p>
                   </div>
               </div>
               <div class="margin-T20">
                   <p>随访录音</p>
                   <table class="table">
                       <thead>
                       <tr>
                           <th>ID</th>
                           <th>拨打时间</th>
                           <th>通话状态</th>
                           <th>通话录音</th>
                       </tr>
                       </thead>
                       <tbody>
                       <tr>
                           <th>1</th>
                           <td>2017/03/04 12:00</td>
                           <td><span style="color: #1b926c">接通</span></td>
                           <td></td>
                       </tr>
                       <tr>
                           <th>2</th>
                           <td>2017/03/04 09:00</td>
                           <td><span style="color: red;">未接通</span></td>
                           <td></td>
                       </tr>
                       </tbody>
                   </table>
               </div>
           </div>
           <div class="col-md-6 right-area">
               <p>随访问卷</p>
               <div class="center-block">
                   <h4 class="text-center">{{ survey.title }}</h4>
                   <div v-if="questionResults.length > 0">
                       <div v-for="(question, index) in survey.questions" :key="index">
                           <p>{{ question.title }}</p>
                           <div v-if="question.types === 'radio'">
                               <div class="radio" v-for="(option, i) in question.options" :key="i">
                                   <label>
                                       <input type="radio" :name="'optionsRadios' + index" :checked="option.id === (questionResults[index].choose_option_ids?questionResults[index].choose_option_ids[0]:'')">{{ option.text}}
                                   </label>
                               </div>
                           </div>
                           <div v-if="question.types === 'check'">
                               <div  class="checkbox" v-for="(option, i) in question.options" :key="i">
                                   <label>
                                       <input type="checkbox" :checked="option.id === (questionResults[index].choose_option_ids?questionResults[index].choose_option_ids[0]:'')">{{ option.text }}
                                   </label>
                               </div>
                           </div>
                           <div v-if="question.types === 'open'">
                               <div>
                                   {{ questionResults[index]?questionResults[index].input : '' }}
                               </div>
                           </div>
                       </div>
                   </div>
                   <!--如果未回答问题-->
                   <div v-else>
                       <div v-for="(question, index) in survey.questions" :key="index">
                           <p>{{ question.title }}</p>
                           <div v-if="question.types === 'radio'">
                               <div class="radio" v-for="(option, i) in question.options" :key="i">
                                   <label>
                                       <input type="radio" :name="'optionsRadios' + index" >{{ option.text}}
                                   </label>
                               </div>
                           </div>
                           <div v-if="question.types === 'check'">
                               <div  class="checkbox" v-for="(option, i) in question.options" :key="i">
                                   <label>
                                       <input type="checkbox" >{{ option.text }}
                                   </label>
                               </div>
                           </div>
                           <div v-if="question.types === 'open'">
                               <div></div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </div>
       <div v-if="isLoading === false">
           正在加载数据……
       </div>
   </div>
</template>
<script>
  import { agent } from '../utils/request'
  import async from 'async'
  import { datePattern } from '../utils/dateFormat';
  import { getAgeByBirthday } from '../utils/getAge';
  const collection = require('lodash/collection')
  export default{
    data (){
      return {
        followuper: { // 随访信息
        },
        followupTime: '', // 随访时间
        medicalItem: { // 项目信息
        },
        questions: { // 问题信息
        },
        dept: { // 科室信息
        },
        pat: { // 患者信息0
        },
        questionResults: [], // 问题答案数组
        isLoading: false, // 请求数据是否加载完成, 防止数据请求未完成，而页面先渲染报错
      }
    },
    props: {
      id: Number,
      followup_task_id: Number
    },
    created: function () {
      this.getSurveyResult();
    },
    components: {},
    computed: {},
    methods: {
      getSurveyResult: function () {
        this.isLoading = false; // 开始请求数据
        // const followupTaskId = this.followup_task_id;
        // const surveyResultId = this.id;
        async.parallel([
          (cb) => {
            agent
              .get('followup_task')  
              .query({ id: 'eq.' + this.followup_task_id })
              .query({ select: 'updated_at ,pat(id, name, gender, mobile, birthday), dept(id, name), medical_item(id, name), adminer(id, name), survey(id, title, questions:question(id, types, title, options:option(id, text)))' })
              .end((req, res) => {
                console.log('pat', res.body[0])
                this.pat = res.body[0].pat
                this.dept = res.body[0].dept
                this.medicalItem = res.body[0].medical_item
                this.followuper =  res.body[0].adminer 
                this.survey = res.body[0].survey  
                this.followupTime = res.body[0].updated_at ? datePattern(res.body[0].updated_at, 'yyyy/MM/dd') : '--'
                cb();
              })
          },  
          (cb) => {
            agent  
              .get('question_result')  
              .query({ survey_result_id: 'eq.' + this.id })
              .end((req, res) => {
                // 按问题id重新进行排序(有时候会顺序错乱,导致问题和答案无法对应)
                this.questionResults = collection.sortBy(res.body, (item) => {
                    return item.question_id
                })
                cb();
              })
          }
        ], (err, results) => {
          this.isLoading = true; // 数据加载完成渲染页面
        })
      },
      getAge: function (birthday) {
        return getAgeByBirthday(birthday);
      }
    }
  }
</script>
<style>
   .followup_task_show{
     margin-top: 20px;
   }
  .followup_task_show .margin-T20{
     margin-top: 20px;
  }
  .followup_task_show .left-area{
      border-right: 1px solid #eee;
  }
  .followup_task_show .right-area{
      padding-left: 30px;
  }
  .followup_task_show .back-btn{
      margin-left: 15px;
      margin-bottom: 10px;
  }
</style>