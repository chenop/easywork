/**
 * Created by Chen on 13/08/2015.
 */

angular.module('easywork')
    .controller('UploadCVCtrl', function ($scope, $modalInstance) {
        $scope.modIns = $modalInstance;

        $scope.user = {};
        $scope.user.skills = null;
    })