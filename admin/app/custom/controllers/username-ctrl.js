/** @namespace window.onJsSendMessageToCpp */
/** @namespace data.post_phone_record */
/** @namespace data.post_phone_record.remote_uri */
/** @namespace data.post_phone_record.call_state */
/** @namespace data.patch_phone_record.end_time */
export default function (angularModule) {

  angularModule.controller('username', ['$scope', function($scope) {
    var userInfo = JSON.parse( localStorage.dfyyCrmAdmin_userInfo || '{"user":0}' )
    $scope.username = userInfo.user.name || '管理员'
  }])
}