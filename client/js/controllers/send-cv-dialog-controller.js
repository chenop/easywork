/**
 * Created by Chen on 13/08/2015.
 */

angular.module('easywork')
    .controller('SendCvDialogCtrl', function ($scope, $uibModalInstance, appManager, cvService) {
        $scope.modIns = $uibModalInstance;
        $scope.userId = appManager.getActiveUserId();
        $scope.cvService = cvService;

        $scope.$on('cvUploaded', function(event, cv) {
            if (!cv)
                return;

            $scope.cvData = cv;
        });

        cvService.getCvEmail($scope.userId)
            .then(function(email) {
                $scope.cvData.email = email;
            });

        $scope.isSendEnable = function () {
            return $scope.cvData != null && $scope.cvData.fileName != null && $scope.termsAgree;
        }

        $scope.sendCV = function () {
            $uibModalInstance.close($scope.cvData);
        }

        $scope.close = function() {
            $uibModalInstance.close();
        }
    });