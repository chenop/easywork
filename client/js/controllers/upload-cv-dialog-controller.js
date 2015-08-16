/**
 * Created by Chen on 13/08/2015.
 */

angular.module('easywork')
    .controller('UploadCvDialogCtrl', function ($scope, $modalInstance, mailService, appManager) {
        $scope.modIns = $modalInstance;
        $scope.cvfile = null;

        $scope.isSendEnable = function() {
            return $scope.cvfile != null;
        }

        $scope.sendCV = function() {
            mailService.sendMail(appManager.selection);
        }
    });