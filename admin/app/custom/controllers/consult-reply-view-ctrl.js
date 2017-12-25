/**
 * Created by yezq on 2017/8/01.
 */

function controller($stateParams, notification, Restangular) {
  this.id = $stateParams.id
  this.entityName = $stateParams.entityName
  this.entityTitle = '咨询'
  this.notification = notification
  this.replyContentText = ''
  this[this.entityName] = {}
  this.filters = {}
  this.filters[this.entityName + '_id'] = 'eq.' + this.id

  if(!this.id) return notification.log('获取咨询信息失败!', { addnCls: 'humane-flatty-error' }) && history.go(-1)

  //获取咨询详情
  Restangular.one(this.entityName, this.id)
    .getList()
    .then(res => {
      console.log(res)
      this[this.entityName]= res.data[0]
    })

  //获取回复记录
  //Restangular.one(this.entityName + '_reply')
  //  .getList('', this.filters)
  //  .then(res => {
  //    console.log(res)
  //    this.replyList = res.data
  //  })


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

function provider($stateProvider) {  // TODO: 改成通用replyView
  $stateProvider.state('reply', {
    parent: 'ng-admin',
    url: '/:entityName/reply/:id',
    params: { id: null },
    controller: ['$stateParams', 'notification', 'Restangular', controller],
    controllerAs: 'controller',
    template: require('../html/reply-view.html')
  })
}

export default function (angular) {
  angular.config(['$stateProvider', provider])
}

exports['default']['provider'] = provider
exports['default']['controller'] = controller