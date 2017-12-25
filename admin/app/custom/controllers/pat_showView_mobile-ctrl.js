
export default function (angularModule) {
  angularModule.controller('pat_showView_mobile', ['$scope', 'Restangular', 'notification','$http', function ($scope, Restangular, notification, $http) {

    this.openPhoneUiWithId = id => {
      if (!id) return alert('该患者没有填写手机号!')
      id && $scope.$root.$broadcast('openPhoneUiWithId', id)
    }

  }])
}