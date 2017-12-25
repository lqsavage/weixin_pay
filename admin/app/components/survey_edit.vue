<template>
    <div class="survey-edit">
        <div class="row survey-edit-header padding-B10 padding-T10">
            <a class="btn btn-default pull-left back-btn" @click="historyBack()">返回</a>
            <input type="text" v-model="surveyTitle" class="center-block input-lg text-center" style="width: 360px;">
        </div>
        <div class="margin-T20 ">
            <div class="row margin-T10 margin-B10 table-header">
                <p class="col-md-2 col">排序</p>
                <p class="col-md-6 col">问题</p>
                <p class="col-md-2 col">是否多选</p>
                <p class="col-md-2 col">是否开放问题</p>
            </div>
            <div class="margin-T10 table-body" v-if="isLoading" v-for="(question, index) in questions" :key="question.id" >
                <div class="row">
                    <div class="col-md-2 col" style="line-height: 34px">{{ index + 1 }}</div>
                    <div class="col-md-6 col">
                        <input type="text" v-model="questions[index].title" class="form-control">
                    </div>
                    <div class="col-md-2 col">
                        <div :class="['switch', [questions[index].types==='check'?'switch-on':'switch-off']]" @click="changeType(index)">
                            <div :class="[questions[index].types==='check'? 'switch-cycle-on':'switch-cycle-off', 'switch-cycle']"></div>
                        </div>
                    </div>
                    <div class="col-md-2 col">
                        <div :class="['switch', [questions[index].types==='open'?'switch-on':'switch-off']]" @click="changeTypeToOpen(index)">
                            <div :class="[questions[index].types==='open'? 'switch-cycle-on':'switch-cycle-off', 'switch-cycle']"></div>
                        </div>
                        <div style="display: none;" description="问题全部展开">{{showOptions[index].isShowOption = true}}</div>
                        <span :class="[showOptions[index].isShowOption===true?'glyphicon-menu-up':'glyphicon-menu-down', 'pull-right', 'glyphicon' , 'arrow']" @click="ShowOption(index)"></span>
                    </div>
                </div>
                <div class="drop-down row margin-B20" v-show="showOptions[index].isShowOption">
                    <div class="col-md-10 col-md-offset-2">
                        <div class="row margin-T10 margin-B10 table-header" >
                            <p class="col-md-1 col">排序</p>
                            <p class="col-md-6 col">选项</p>
                            <p class="col-md-2 col">分值</p>
                        </div>
                        <div class="margin-T10 row" v-for="(option, i) in options[index]" :key="option.id">
                            <div class="col-md-1 col" style="line-height: 34px">{{ options[index][i].sequence }}</div>
                            <div class="col-md-6 col">
                                <input type="text" v-model="options[index][i].text" class="form-control">
                            </div>
                            <div class="col-md-2 col">
                                <input type="text" v-model="options[index][i].point" class="form-control">
                            </div>
                        </div>
                        <div class="row clearfix margin-T20">
                            <button class="btn btn-default pull-left" @click="addOption(index, question.id)">添加选项</button>
                            <button class="btn btn-primary pull-right" @click="handleUpdate(questions[index], options[index])">保存</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="margin-T20 row">
            <button class="btn btn-default" @click="addQuestion">添加问题</button>
        </div>
    </div>
</template>

<script>
  import { agent } from '../utils/request'
  export default {
    data(){
      return {
        surveyTitle: this.title,
        showOptions: [], // 用于储存是否显示下拉option
        isLoading: false, // 判断获取数据是否完成,防止数据未获取完成而先渲染页面造成的数据报错
        questions: [], // 问题列表
        options: [[]] // 问题选项列表
      }
    },
    props: {
      id: Number, //要查看或修改的当前实体id
      title: String
    },
    created: function () {
      this.getQuestions();
    },
    methods: {
      getQuestions: function () { // 获取问题及选项列表
        // 获取surveyId
       // const id = this.id;
       console.log('get')
        agent
          .get('survey')
          .query({ id: 'eq.' + this.id })
          .query({
            select: 'id, title, questions:question(id, survey_id, title, types, options:option(id, question_id, text, sequence, point))'
          })
          .end((req, res) => {
            if(res.ok){
              const questions = res.body[0].questions
              // 初始化时添加isShowOption属性，用于下拉option显示隐藏, 由于是嵌套数据无法实现双向绑定，所以需要重新遍历出来
              // 每次获取问题列表时，初始化各个数组，防止添加问题按钮点击后重新获取数组时，原先的无法清除
              this.showOptions = []
              this.questions = []
              this.options = [[]]
              questions.forEach((question, index) => {
                this.showOptions.push({ id: question.id, isShowOption: false })
                this.questions.push({ id: question.id, surveyId: question.survey_id, title: question.title, types: question.types })
                this.options[index] = []
                const options = question.options
                // 遍历出每个问题的options
                options.forEach(option => {
                  this.options[index].push({ id: option.id, questionId: option.question_id, text: option.text, sequence: option.sequence, point: option.point })
                })
                this.isLoading = true;
              })
            }
          })
      },
      ShowOption: function (index) {
        // 显示获取隐藏下拉options
        this.showOptions[index].isShowOption = !this.showOptions[index].isShowOption;
      },
      addOption: function (index, question_id) { // 添加选项
        const length = this.options[index].length;
        agent
          .post('option')
          .set({ Prefer: 'return=representation' })
          .send({
            question_id: question_id,
            text: '',
            sequence: length + 1,
            point: '0'
          })
          .end((req, res) => {
            if(res.ok){
              const option = res.body[0]
              this.options[index].push({ 
                id: option.id,
                text: option.text,
                sequence: option.sequence,
                point: option.point
              })
              this.$set(this.options, index, this.options[index])
            }
          })
      },
      addQuestion: function () { // 添加问题
        const surveyId = this.id; // 获取问卷id
        agent
          .post('question')
          .set({ Prefer: 'return=representation' })
          .send({
            survey_id: this.id,
            title: '',
            types: 'radio'
          })
          .end((req, res) => {
            // 当问题添加成功后，为快速开发这里不再进行push到数组的操作，直接重新获取问题列表
            if(res.ok){
              const data = res.body[0]
              this.showOptions.push({ id: data.id, isShowOption: false })
              this.questions.push({ id: data.id, surveyId: data.survey_id, title: data.title, types: data.types });
            }
          })
      },
      handleUpdate: function (question, option) {
        if(question){
          this.updateQuestion(question);
        }
        if(option){
          this.updateOption(option);
        }
      },
      updateQuestion: function (question) { // 更新问题和对应option
        agent
          .patch('question')
          .query({ id: 'eq.' + question.id })
          .send({
            title: question.title,
            types: question.types
          })
          .end((req, res) => {})
      },
      updateOption: function (option) {
        if(option && option instanceof Array){
          option.forEach(item => {
            agent
              .patch('option')
              .query({ id: 'eq.' + item.id })
              .send({
                text: item.text,
                sequence: item.sequence,
                point: item.point
              })
              .end((req, res) => {})
          })
        }
      },
      changeType: function (index) {
        if(this.questions[index].types === 'check'){
          this.questions[index].types = 'radio';
        } else {
          this.questions[index].types = 'check';
        }
      },
      changeTypeToOpen: function(index){
        if(this.questions[index].types === 'open'){
          this.questions[index].types = 'radio';
        } else {
          this.questions[index].types = 'open';
        }
      },
      updateSurveyTitle: function () { // 更新问卷标题

      },
      historyBack: function () {
        history.go(-1)
      }
    }
  }
</script>

<style>
    .survey-edit .margin-T20{
        margin-top: 20px;
    }
    .survey-edit .margin-T10{
        margin-top: 10px;
    }
    .survey-edit .margin-B10{
        margin-top: 10px;
    }
    .survey-edit .margin-B20{
        margin-bottom: 20px;
    }
    .survey-edit .padding-T10{
        padding-top: 10px;
    }
    .survey-edit .padding-B10{
        padding-bottom: 10px;
    }
    .survey-edit .survey-edit-header{
        border-bottom: 1px solid #eee;
        position: relative;
    }
    .survey-edit .back-btn{
        position: absolute;
    }
    .survey-edit .input-lg{
        border-radius: 0;
    }
    .survey-edit .table-header{
        border-bottom: 1px solid #eee;
    }
    .survey-edit .table-body{
        border-bottom: 1px solid #eee;
    }
    .survey-edit .col{
        padding-left: 0;
        position: relative;
    }
    .switch{
        cursor: pointer;
        width: 40px;
        height: 20px;
        margin-top: 7px;
        box-sizing: border-box;
        border-radius: 15px;
        border: 1px solid transparent;
        position: relative;
        transition: 0.2s;
        -webkit-transition: 0.2s;
        -moz-transition: 0.2s;
        -ms-transition: 0.2s;
        -o-transition: 0.2s;
    }
    .switch-off {
        background: gray;
    }
    .switch-on{
        background: #34a782;
    }
    .switch-cycle{
        width: 18px;
        height: 18px;
        position: absolute;
        background: #fff;
        transition: 0.2s;
        border-radius: 50%;
        -webkit-transition: 0.2s;
        -moz-transition: 0.2s;
        -ms-transition: 0.2s;
        -o-transition: 0.2s;
    }
    .switch-cycle-off{
        left: 0;
    }
    .switch-cycle-on{
        left: 20px
    }
    .survey-edit .arrow{
        position: absolute;
        right: 15px;
        top: 7px;
        cursor: pointer;
    }
    .survey-edit .arrow-close{
        -webkit-transform: rotate(-90deg);
        -moz-transform: rotate(-90deg);
        -ms-transform: rotate(-90deg);
        -o-transform: rotate(-90deg);
        transform: rotate(-90deg);
    }
    .survey-edit .arrow-open{
        -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        transform: rotate(90deg);
    }
</style>