/**
 * Created by Chen.Oppenhaim on 8/14/2015.
 */

angular.module('easywork')
    .directive('uploadCv', function (cvParser, dataManager, $upload, $localForage) {
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

                initCvData();
                var userId = scope.userId();

                function initCvData() {
                    // todo if (isLoggedIn) {  $scope.cvData = user.cvData; return; };
                    $localForage.getItem(scope.userId())
                        .then(function (cv) {
                            if (cv) {
                                scope.cv = {
                                    fileName: cv.fileName,
                                    fileData: cv.fileData,
                                    skills: cv.skills
                                };
                            }

                            scope.status = (scope.cv) ? scope.STATUS.GOT_CV : scope.STATUS.NO_CV;
                        });
                }


                function OnCvDataChanged(cv) {
                    scope.cv = cv;
                    $localForage.setItem(userId, scope.cv);
                    scope.status = (scope.cv) ? scope.STATUS.GOT_CV : scope.STATUS.NO_CV;
                }

                scope.onFileSelect = function ($files) {
                    var file = $files[0];
                    var fileReader = new FileReader();
                    scope.status = scope.STATUS.UPLOADING_CV;
                    fileReader.onload = function (e) {
                        var fileName = file.name;
                        var fileData = e.target.result;
                        
                        var cv = {
                            user: userId,
                            fileName: fileName,
                            fileData: fileData,
                        }
                        dataManager.createCv(cv)
                            .then(function(createdCv) {
                                OnCvDataChanged(createdCv.data);
                            });
                    };
                    fileReader.readAsDataURL(file); // Reading the file as base64
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
