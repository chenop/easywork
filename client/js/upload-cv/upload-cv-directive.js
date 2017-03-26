/**
 * Created by Chen.Oppenhaim on 8/14/2015.
 */

angular.module('easywork')
    .directive('uploadCv', function (cvService, dataManager, Upload, localStorageService, utils, ANONYMOUS) {
        return {
            restrict: 'EA',
            scope: {
                cv: "=",
                userId: "&"
            },
            templateUrl: '/js/upload-cv/uploadCv.html',
            controller : ["$scope", function($scope) {
                $scope.ESTATUS = cvService.ESTATUS;
                $scope.cvService = cvService;

                var userId = $scope.userId();
                userId = (!userId) ? ANONYMOUS : userId;

                initCvData();

                $scope.isSkillsExists = function()  {
                    if (!$scope.cv)
                        return false;

                    return !(utils.isEmptyArray($scope.cv.skills));
                }

                function initCvData() {
                    cvService.getCvByUserId(userId)
                        .then(function (cv) {
                            if (cv) {
                                $scope.cv = cv;
                            }

                            cvService.setCVStatus(($scope.cv) ? $scope.ESTATUS.GOT_CV : $scope.ESTATUS.NO_CV);
                        })
                        .catch(function error(err) {
                            cvService.setCVStatus($scope.ESTATUS.NO_CV);
                        });
                }

                function OnCvDataChanged(cv) {
                    $scope.cv = cv;

                    localStorageService.set(userId, $scope.cv);
                    cvService.setCVStatus(($scope.cv) ? $scope.ESTATUS.GOT_CV : $scope.ESTATUS.NO_CV);
                }

                $scope.onFileSelect = function (file) {
                    if (!file) {
                        cvService.setCVStatus($scope.ESTATUS.NO_CV);
                        return;
                    }

                    cvService.setCVStatus($scope.ESTATUS.UPLOADING_CV);
                    cvService.uploadFile(file, userId)
                        .then(function(createdCv) {
                            OnCvDataChanged(createdCv);
                        });
                }
            }],
            link: function (scope, element, attrs) {
            }
        }
    })
