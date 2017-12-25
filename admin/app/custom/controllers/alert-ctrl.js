export default function (angularModule) {

  angularModule.controller('alert', ['$scope', 'notification', function($scope, notification) {
    window.alert = msg => notification.log(msg, { addnCls: 'humane-flatty-error'})
  }])
}