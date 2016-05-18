/**
 * Created by Chen on 13/08/2015.
 */

angular.module('easywork')
    .controller('SendCvDialogCtrl', function ($scope, $uibModalInstance, $localForage, userId) {
        $scope.modIns = $uibModalInstance;
        $scope.userId = (!userId) ? "anonymous" : userId;

        $scope.isSendEnable = function () {
            return $scope.cvData != null && $scope.cvData.fileName != null;
        }

        $scope.sendCV = function () {
            $uibModalInstance.close($scope.cvData);
        }

        $scope.close = function() {
            $uibModalInstance.close();
        }
    });