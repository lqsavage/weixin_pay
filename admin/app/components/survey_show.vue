<template>
    <div class="survey-edit">
        <div class="row survey-edit-header padding-B10 padding-T10">
            <a class="btn btn-default pull-left back-btn" href="javascript: history.go(-1)">返回</a>
            <h4 class="center-block text-center">{{surveyTitle}}</h4>
            <a class="btn btn-default pull-right back-btn" @click="toEditionView()" style="margin-left: 70px; margin-top: -39px;">编辑</a>
        </div>
        <div class="margin-T20 ">
            <div class="row margin-T10 margin-B10 table-header">
                <p class="col-md-2 col">排序</p>
                <p class="col-md-6 col">问题</p>
                <p class="col-md-2 col">是否多选</p>
                <p class="col-md-2 col">是否开放问题</p>
            </div>
            <div class="margin-T10 table-body" v-for="(question, index) in questions" :key="question.id" v-if="isLoading">
                <div class="row">
                    <div class="col-md-2 col" style="line-height: 34px">{{ index + 1 }}</div>
                    <div class="col-md-6 col">
                        <!--<input type="text" v-model="questions[index].title" class="form-control" readonly>-->
                        {{ questions[index].title }}
                    </div>
                    <div class="col-md-2 col">
                        <!--div :class="['switch', [questions[index].types==='check'?'switch-on':'switch-off']]" >
                            <div :class="[questions[index].types==='check'? 'switch-cycle-on':'switch-cycle-off', 'switch-cycle']"></div>
                        </div-->
                        <input class="big" type="checkbox" :value="questions[index].types==='check' ? true : false" disabled>
                    </div>
                    <div class="col-md-2 col">
                        <!--div class="switch switch-off">
                            <div class="switch-cycle switch-cycle-off"></div>
                        </div-->
                        <input class="big" type="checkbox" :value="questions[index].types==='check'" disabled>
                        <div style="display: none;" description="问题全部展开">{{showOptions[index].isShowOption = true}}</div>
                        <!--span :class="[showOptions[index].isShowOption===true?'glyphicon-menu-up':'glyphicon-menu-down', 'pull-right', 'glyphicon' , 'arrow']" @click="ShowOption(index)"></span-->
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
                            <div class="col-md-6 col" style="line-height: 34px">
                                <!--<input type="text" v-model="options[index][i].text" class="form-control" readonly>-->
                                {{ options[index][i].text }}
                            </div>
                            <div class="col-md-2 col" style="line-height: 34px">
                                <!--<input type="text" v-model="options[index][i].point" class="form-control" readonly>-->
                                {{ options[index][i].point }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
      toEditionView: function () {
        window.location.href = window.location.href.replace('show', 'edit')
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
        font-size: 18px;
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