/**
 * Created by Chen.Oppenhaim on 8/14/2015.
 */

angular.module('easywork')
    .directive('uploadCv', function (cvParser, dataManager, $upload, $localForage) {
        return {
            restrict: 'EA',
            scope: {
                data: "=",
                userId: "&"
            },
            templateUrl: '/views/users/uploadCv.html',
            link: function (scope, element, attrs) {
                var userId = scope.userId();

                function OnCvDataChanged(fileName, fileData, skills) {
                    scope.cv = {
                        user: userId,
                        fileName: fileName,
                        fileData: fileData,
                        skills: skills
                    };
                    $localForage.setItem(userId, scope.cv);
                }

                scope.onFileSelect = function ($files) {
                    var file = $files[0];
                    var fileReader = new FileReader();
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
                                scope.cv = createdCv.cv;
                                $localForage.setItem(userId, createdCv.cv);
                            });
                    };
                    fileReader.readAsDataURL(file); // Reading the file as base64
                }

                scope.deleteCV = function (event) {
                    if (event) {
                        event.stopPropagation();
                        event.preventDefault();
                    }

                    dataManager.deleteCv($scope.cv)
                    $scope.cv = null;
                }

            }
        }
    })
