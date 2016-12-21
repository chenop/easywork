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
                $scope.STATUS = {
                    NO_CV: 0,
                    UPLOADING_CV: 1,
                    GOT_CV: 2
                }

                var userId = $scope.userId();
                userId = (!userId) ? ANONYMOUS : userId;

                initCvData();

                $scope.isSkillsExists = function()  {
                    if (!$scope.cv)
                        return false;

                    return !(utils.isEmptyArray($scope.cv.skills));
                }

                $scope.$watch('cv', function(value) {
                    if (!value)
                        return;
                    $scope.cv = value;
                })

                function initCvData() {
                    // todo if (isLoggedIn) {  $scope.cvData = user.cvData; return; };

                    cvService.getCvByUserId(userId)
                        .then(function (cv) {
                            if (cv) {
                                $scope.cv = {
                                    fileName: cv.fileName,
                                    fileData: cv.fileData,
                                    skills: cv.skills
                                };
                            }

                            $scope.status = ($scope.cv) ? $scope.STATUS.GOT_CV : $scope.STATUS.NO_CV;
                        })
                        .catch(function error(err) {
                            $scope.status = $scope.STATUS.NO_CV;
                        });
                }

                function OnCvDataChanged(cv) {
                    $scope.cv = cv;

                    localStorageService.set(userId, $scope.cv);
                    $scope.status = ($scope.cv) ? $scope.STATUS.GOT_CV : $scope.STATUS.NO_CV;
                }

                $scope.onFileSelect = function (file) {
                    if (!file) {
                        $scope.status = $scope.STATUS.NO_CV;
                        return;
                    }

                    $scope.status = $scope.STATUS.UPLOADING_CV;
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
