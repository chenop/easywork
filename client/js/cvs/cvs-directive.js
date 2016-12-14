/**
 * Created by Chen.Oppenhaim on 8/14/2015.
 */

angular.module('easywork')
    .directive('cvs', function (cvService, dataManager, Upload, localStorageService, utils) {
        return {
            restrict: 'EA',
            scope: {
                mode: "="
            },
            templateUrl: '/js/cvs/cvs.html',
            controller : ["$scope", function($scope) {
                $scope.STATUS = {
                    NO_CVS: 0,
                    UPLOADING_CV: 1,
                    GOT_CV: 2
                }

                $scope.selectedCv= {
                    name: "start"
                };

                initCvData();

                function initCvData() {
                    cvService.getCvByUserId()
                        .then(function (cvs) {
                            if (!cvs) {
                                $scope.status = $scope.STATUS.NO_CV;
                                return;
                            }

                            $scope.cvs = cvs;
                            $scope.status = $scope.STATUS.GOT_CV;
                        })
                        .catch(function error(err) {
                            $scope.status = $scope.STATUS.NO_CV;
                        });
                }

                $scope.displayCv = function(cv) {
                    cvService.showCvDialog(cv);
                }

                $scope.isSkillsExists = function(cv) {
                    if (utils.isUndefined(cv) || utils.isUndefined(cv.skills))
                        return false;

                    return !utils.isEmptyArray(cv.skills);
                }

                function OnCvDataChanged(cv) {
                }

                $scope.onFileSelect = function (file) {
                    //$scope.status = $scope.STATUS.UPLOADING_CV;
                    //cvService.uploadFile(file, userId)
                    //    .then(function(createdCv) {
                    //        OnCvDataChanged(createdCv);
                    //    });
                }

                $scope.deleteCV = function (event) {
                    //if (event) {
                    //    event.stopPropagation();
                    //    event.preventDefault();
                    //}
                    //
                    //dataManager.deleteCv($scope.cv)
                    //OnCvDataChanged(null);
                }

                $scope.hoverIn = function() {
                    this.displayTrash = true;
                }

                $scope.hoverOut = function() {
                    this.displayTrash = false;
                }
            }],
            link: function (scope, element, attrs) {
            }
        }
    })
