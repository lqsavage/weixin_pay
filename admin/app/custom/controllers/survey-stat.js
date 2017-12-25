/**
 * Created by yezq on 2017/8/01.
 */

function controller($stateParams, notification, Restangular) {
  this.id = $stateParams.id
  this.viewTitle = '问卷统计'
  this.notification = notification
  this.replyContentText = ''
  this.entityName = 'survey'
  this.entry = {}
  this.options = {}
  this.option = function (title, data) {
    console.log(arguments)
    return {
      title  : {
        text: title,
        x   : 'center'
      },
      tooltip: {
        trigger  : 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      series : [
        {
          name     : title,
          type     : 'pie',
          radius   : '70%',
          center   : ['50%', '60%'],
          data     : data,
          itemStyle: {
            normal:{
              label:{
                show:true,
                formatter: '{b} : {c} \n ({d}%)'
              },
              labelLine:{
                show:true
              }
            },
            emphasis: {
              shadowBlur   : 10,
              shadowOffsetX: 0,
              shadowColor  : 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ],
    }
  }

  if(!this.id) return notification.log('获取问卷信息失败!', { addnCls: 'humane-flatty-error' }) && history.go(-1)

  //获取问卷详情
  Restangular.one(`survey?id=eq.${$stateParams.id}&select=id, title, questions:question(id, survey_id, title, types, options:option(id, question_id, text, sequence, point))`)
    .getList()
    .then(res => {
      this.entry = res.data[0]
      this.entry.questions && this.entry.questions.length && this.getStat()
    })

  this.getStat = () => {
    this.entry.questions.forEach(question => {
      //order=id.desc&question_id=eq.1

      question.options.forEach( option => this.options[option.id] = option )

      Restangular.one(`v_question_result_ids_count?order=id.desc&question_id=eq.${question.id}&select= count, question:question_id(*), choose_option_ids`)
        .getList()
        .then(res => {
          let data = []

          for(let i = 0; i < res.data.length; i++){
            data[i] = {
              name: (function(_this){
                let str = ''
                let textCount = 0
                res.data[i].choose_option_ids.forEach( optionId => str += (textCount++ ? ', ' : '') + _this.options[optionId].text  )
                return str
              })(this) || '未选择',
              value: res.data[i].count
            }
          }
          question.stat = res.data
          //data.forEach( choose => {
          //  choose.name = choose.text
          //  choose.value = choose.count
          //  //choose.choose_option_ids.forEach( i => i = this.options[i])
          //})
          echarts
            .init(document.getElementById(`survey-stat-question-${question.id}`))
            .setOption(this.option(question.title, data))

        })
    })
  }
  //choose_option_ids
  //count
  //hos_id
  //id
  //question_id

console.log(this)


  this.onSubmit = function () {

    let postData = {
      consult_id  : parseInt(this.id) || null,
      doc_id      : this[this.entityName].doc_id || null,
      hos_id      : this[this.entityName].hos_id || null,
      pat_id      : this[this.entityName].pat_id || null,
      text        : this.replyContentText || null,
      replier_role: "doc"
    }

    this.replyContentText.length
    &&
      Restangular.one(this.entityName + '_reply')
        .post('', postData)
        .then(res => {
          notification.log('发表成功!', { addnCls: 'humane-flatty-success' })
          history.go(-1)
        })
    ||
      notification.log('请输入咨询内容!', { addnCls: 'humane-flatty-error' })

  }

}

function provider($stateProvider) {
  $stateProvider.state('survey-stat', {
    parent: 'ng-admin',
    url: '/survey/stat/:id',
    params: { id: null },
    controller: ['$stateParams', 'notification', 'Restangular', controller],
    controllerAs: 'controller',
    template: require('../html/survey-stat.html')
  })
}

export default function (angular) {
  angular.config(['$stateProvider', provider])
}

exports.default.provider = provider
exports.default.controller = controller