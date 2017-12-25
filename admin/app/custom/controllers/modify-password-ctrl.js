/**
 * Created by yezq on 2017/6/26.
 */

export default function (angularModule) {

  angularModule.controller('modifyPasswordCtrl', ['$scope', 'Restangular', 'notification', function ($scope, Restangular, notification) {
    let userInfo = JSON.parse(localStorage.dfyyCrmAdmin_userInfo || '{"user":0}').user
    /*let adminer  = Restangular.one("adminer", userInfo.id)
      .getList()
      .then(res => {
        $scope.userInfo = res.data[0]
        res.data[0] && ($scope.password = res.data[0].password)
      })*/

    $scope.onModifyPassWordSubmit = function () {
      if(!$scope.password) return notification.log('请输入密码!', { addnCls: 'humane-flatty-error'})
      userInfo.id
      &&
      Restangular.one("adminer", userInfo.id)
        .patch({password: $scope.password})
        .then(res => notification.log('修改成功!', { addnCls: 'humane-flatty-success' }))
      ||
      notification.log('无法读取当前登录用户信息!', { addnCls: 'humane-flatty-error'})
    }

  }])

}