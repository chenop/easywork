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
                /**
                 * $files: an array of files selected, each file has name, size, and type.
                 * @param fileData
                 * @param skills
                 * @param activeUserId
                 */
                function sendCVToServer(fileName, fileData, skills, activeUserId) {
                    // TODO chen No active user! where to upload?!? need localStorage (I guess...)
                    scope.upload = $upload.upload({
                        url: '/api/user/cv-upload/' + activeUserId, //upload.php script, node.js route, or servlet url
                        method: 'POST',
                        data: {
                            data: fileData, // File as base64
                            skills: skills,
                            fileName: fileName
                        }
                    }).progress(function (evt) {
//                 console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (skills, status, headers, config) {
//                 console.log("skills: " + skills);
                        return skills;
                    }).error(function (err) {
                        console.log("upload finish with err" + err);
                    });
                    return scope.upload;
                }

                var saveCvData = function (file, fileData, skills) {
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
                                    saveCvData(file, e.target.result, skills);
                                    //sendCVToServer(file.name, e.target.result, skills, activeUserId)
                                    //    .then(function(skills) {
                                    //        scope.skills = skills;
                                    //    });
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
