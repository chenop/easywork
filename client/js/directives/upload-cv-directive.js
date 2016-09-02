/**
 * Created by Chen.Oppenhaim on 8/14/2015.
 */

angular.module('easywork')
    .directive('uploadCv', function (cvService, dataManager, Upload, $localForage) {
        return {
            restrict: 'EA',
            scope: {
                cv: "=",
                userId: "&"
            },
            templateUrl: '/views/users/uploadCv.html',
            link: function (scope, element, attrs) {
                scope.STATUS = {
                    NO_CV: 0,
                    UPLOADING_CV: 1,
                    GOT_CV: 2
                }

                var userId = scope.userId();
                userId = (!userId) ? "anonymous" : userId;

                initCvData();

                function initCvData() {
                    // todo if (isLoggedIn) {  $scope.cvData = user.cvData; return; };

                    if (userId) {
                        $localForage.getItem(userId)
                                .then(function (cv) {
                                if (cv) {
                                    scope.cv = {
                                        fileName: cv.fileName,
                                        fileData: cv.fileData,
                                        skills: cv.skills
                                    };
                                }

                                scope.status = (scope.cv) ? scope.STATUS.GOT_CV : scope.STATUS.NO_CV;
                            }, function error(err) {
                                scope.status = scope.STATUS.NO_CV;
                            });
                    }
                    else
                        scope.status = scope.STATUS.NO_CV;

                    scope.$watch('cv', function(value) {
                        scope.cv = value;
                    })
                }

                function OnCvDataChanged(cv) {
                    scope.cv = cv;

                    $localForage.setItem(userId, scope.cv);
                    scope.status = (scope.cv) ? scope.STATUS.GOT_CV : scope.STATUS.NO_CV;
                }

                scope.onFileSelect = function (file) {
                    scope.status = scope.STATUS.UPLOADING_CV;
                    cvService.uploadFile(file, userId)
                        .then(function(createdCv) {
                            OnCvDataChanged(createdCv);
                        });
                }

                scope.deleteCV = function (event) {
                    if (event) {
                        event.stopPropagation();
                        event.preventDefault();
                    }

                    dataManager.deleteCv(scope.cv)
                    OnCvDataChanged(null);
                }

            }
        }
    })
