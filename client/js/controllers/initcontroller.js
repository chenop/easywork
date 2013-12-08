var initController = angular.module('initController', []);

initController.controller('initController', ['$scope', '$location',
  function($scope, $location) {
  $scope.animate_direction = 'rtl';

  $scope.isRTL = function() {
    return $scope.animate_direction === 'rtl';
  }

  $scope.isLTR = function() {
    return $scope.animate_direction === 'ltr';
  }

  $scope.go = function (path, direction) {
    $scope.animate_direction = direction;
    $location.path(path);
  }
}]);
