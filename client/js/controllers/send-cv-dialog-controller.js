/**
 * Created by Chen on 13/08/2015.
 */

angular.module('easywork')
    .controller('SendCvDialogCtrl', function ($scope, $modalInstance, $localForage, mailService, selectedCompanies, userId) {
        $scope.modIns = $modalInstance;
        $scope.userId = (!userId) ? "anonymous" : userId;
        initCvData($scope.userId);
        
        $scope.isSendEnable = function () {
            return $scope.cvData != null && $scope.cvData.fileName != null;
        }

        $scope.sendCV = function () {
            mailService.sendMail(selectedCompanies, $scope.cvData);
            $modalInstance.close();
        }

        function initCvData() {
            // todo if (isLoggedIn) {  $scope.cvData = user.cvData; return; };
            $localForage.getItem($scope.userId)
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