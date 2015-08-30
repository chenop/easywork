/**
 * Created by Chen on 13/08/2015.
 */

angular.module('easywork')
    .controller('UploadCvDialogCtrl', function ($scope, $modalInstance, $localForage, mailService, selectedCompanies) {
        $scope.modIns = $modalInstance;
        initCvData();
        
        $scope.isSendEnable = function () {
            return $scope.cvData != null && $scope.cvData.file != null;
        }

        $scope.sendCV = function () {
            mailService.sendMail(selectedCompanies, $scope.cvData);
            $modalInstance.close();
        }

        function initCvData() {
            $localForage.getItem('cvData')
                .then(function (cvData) {
                    if (!cvData)
                        return {};
                    $scope.cvData = {
                        file: cvData.file,
                        fileData: cvData.fileData,
                        skills: cvData.skills
                    };
                });
        }
    });