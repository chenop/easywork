/**
 * Created by Chen.Oppenhaim on 8/14/2015.
 */

angular.module('easywork')
    .directive('uploadCv', function (cvParser, appManager, $upload, $localForage) {
        return {
            restrict: 'EA',
            scope: {
                data: "=",
                userId: "&"
            },
            templateUrl: '/views/users/uploadCv.html',
            link: function (scope, element, attrs) {
                var userId = scope.userId;

                function OnCvDataChanged(fileName, fileData, skills) {
                    scope.data = {
                            fileName: fileName,
                            fileData: fileData,
                            skills: skills
                        };
                    $localForage.setItem(userId, scope.data );
                }

                scope.onFileSelect = function ($files) {
                    var file = $files[0];
                        cvParser.parseCV(file).
                            then(function (skills) {
                                var fileReader = new FileReader();
                                fileReader.readAsDataURL(file); // Reading the file as base64
                                fileReader.onload = function (e) {
                                    scope.$apply(function () {
                                        OnCvDataChanged(file.name,  e.target.result, skills);
                                    });
                                }
                            })

                }

                scope.deleteCV = function (event) {
                    OnCvDataChanged(null, null, null);

                    if (event) {
                        event.stopPropagation();
                        event.preventDefault();
                    }

                    //var activeUserId = appManager.getActiveUserId();
                    //if (!activeUserId)
                    //    return;
                    //$http.post('/api/user/cv-delete/' + activeUserId)
                    //    .success(function(user) {
                    //        $scope.user = user;
                    //    });
                }

            }
        }
    })
