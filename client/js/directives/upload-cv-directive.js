/**
 * Created by Chen.Oppenhaim on 8/14/2015.
 */

angular.module('easywork')
    .directive('uploadCv', function (cvParser, appManager, $upload, $localForage) {
        return {
            restrict: 'EA',
            scope: {
                data: "="
            },
            templateUrl: '/views/users/uploadCv.html',
            link: function (scope, element, attrs) {
                var saveLocallyCvData = function (file, fileData, skills) {
                    var cvData = {
                        file: file,
                        fileData: fileData,
                        skills: skills
                    };
                    $localForage.setItem('cvData', cvData);
                };

                function OnCvDataChanged(file, skills) {
                    scope.data = {
                            file: file,
                            skills: skills
                        };
                }

                scope.onFileSelect = function ($files) {
                    var file = $files[0];
                        cvParser.parseCV(file).
                            then(function (skills) {
                                var fileReader = new FileReader();
                                fileReader.readAsDataURL(file); // Reading the file as base64
                                fileReader.onload = function (e) {
                                scope.$apply(function () {
                                    OnCvDataChanged(file, skills);
                                });
                                    saveLocallyCvData(file, e.target.result, skills);
                                }
                            })

                }

                scope.deleteCV = function (event) {
                    scope.data.skills = null;
                    scope.data.file = null;
                    $localForage.setItem('cvData', null);

                    if (event) {
                        event.stopPropagation();
                        event.preventDefault();
                    }

                    var activeUserId = appManager.getActiveUserId();
                    if (!activeUserId)
                        return;
                    //$http.post('/api/user/cv-delete/' + activeUserId)
                    //    .success(function(user) {
                    //        $scope.user = user;
                    //    });
                }

            }
        }
    })
