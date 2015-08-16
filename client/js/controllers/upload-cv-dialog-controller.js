/**
 * Created by Chen on 13/08/2015.
 */

angular.module('easywork')
    .controller('UploadCvDialogCtrl', function ($scope, $modalInstance, mailService, appManager) {
        $scope.modIns = $modalInstance;
        $scope.uploadCvData = {};

        $scope.isSendEnable = function() {
            return $scope.uploadCvData != null && $scope.uploadCvData.file != null;
        }

        $scope.sendCV = function() {
            //mailService.sendMail(appManager.selection);
            $modalInstance.close();
        }
    });