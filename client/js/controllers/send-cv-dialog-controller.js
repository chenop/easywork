/**
 * Created by Chen on 13/08/2015.
 */

angular.module('easywork')
    .controller('SendCvDialogCtrl', function ($scope, $modalInstance, $localForage, mailService, selectedCompanies) {
        $scope.modIns = $modalInstance;
        initCvData();
        
        $scope.isSendEnable = function () {
            return $scope.cvData != null && $scope.cvData.fileName != null;
        }

        $scope.sendCV = function () {
            mailService.sendMail(selectedCompanies, $scope.cvData);
            $modalInstance.close();
        }

        function initCvData() {
            // todo if (isLoggedIn) {  $scope.cvData = user.cvData; return; };
            $localForage.getItem('cvData')
                .then(function (cvData) {
                    if (!cvData)
                        return {};
                    $scope.cvData = {
                        fileName: cvData.fileName,
                        fileData: cvData.fileData,
                        skills: cvData.skills
                    };
                });
        }
    });