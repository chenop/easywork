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
                    scope.data = {
                        user: userId,
                        fileName: fileName,
                        fileData: fileData,
                        skills: skills
                    };
                    $localForage.setItem(userId, scope.data);
                }

                // TODO chen this part use the old parser - use the createCv and get the skills!
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
                                scope.data = createdCv.data;
                                $localForage.setItem(userId, createdCv.data);
                            });
                    };
                    fileReader.readAsDataURL(file); // Reading the file as base64
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
