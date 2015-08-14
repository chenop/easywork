/**
 * Created by Chen.Oppenhaim on 8/14/2015.
 */

angular.module('easywork')
    .directive('uploadCv', function () {
        return {
            restrict: 'E',
            scope: {
            },
            controller: function($scope, cvParser, appManager, $upload) {
                $scope.user = {};
                $scope.user.skills = null;

                /**
                 * $files: an array of files selected, each file has name, size, and type.
                 * @param fileData
                 * @param skills
                 * @param activeUserId
                 */
                function sendCVToServer(fileName, fileData, skills, activeUserId) {
                    // TODO chen No active user! where to upload?!? need localStorage (I guess...)
                    $scope.upload = $upload.upload({
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

                        // If file is undefined init it
                        if (skills !== undefined) {
                            $scope.user.skills = skills;
                        }
                        return skills;
                    }).error(function (err) {
                        console.log("upload finish with err" + err);
                    });
                    return $scope.upload;
                }

                $scope.onFileSelect = function ($files) {
                    var activeUserId = appManager.getActiveUserId();
                    cvParser.parseCV($files[0]).
                        then(function (skills) {
                            var file = $files[0];
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file); // Reading the file as base64
                            fileReader.onload = function (e) {
                                sendCVToServer(file.name, e.target.result, skills, activeUserId)
                                    .then(function() {
                                        $scope.user.fileName = file.name;
                                    });
                            }

                        })
                }
            },
            templateUrl: '/views/users/uploadCv.html',
            link: function (scope, element, attrs) {
            }
        }
    })
