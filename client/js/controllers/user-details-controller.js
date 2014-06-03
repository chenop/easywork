'use strict';

var userDetailsModule = angular.module('userDetailsModule',
    ['angularFileUpload'
        , 'ui.select2'
        , 'easywork.services.appManager'
        , 'easywork.services.auth'
        , 'easywork.services.cvParser'
    ]);

userDetailsModule.controller('userDetailsCtrl',
    [
        '$scope'
        , '$upload'
        , '$http'
        , 'appManager'
        , 'authService'
        , '$location'
        , 'cvParser'
    , function ($scope, $upload, $http, appManager, authService, $location, cvParser) {

        fetchActiveUser();

        appManager.addSelectionChangeListener(function (selectedEntity) {
            getUserDetails(selectedEntity._id).then(function (result) {
                $scope.user = result.data;
            });
        })

        function getUserDetails(id) {
            return $http.get('./api/user/' + id);
        }

        $scope.welcome = "אנא הכנס פרטים:";
        $scope.select2Options = {
            width: 200,
            minimumResultsForSearch: -1 // Disable the search field in the combo box
        };

        var default_message = 'Hi,\nI am interested in open positions in your company.\nContact information can be found in my CV which is attached.\n\nBest Regards,\n';

        $scope.user = {
            name: '',
            username: '',
            email: '',
            role: '',
            message: default_message,
            experience: '',
            file: ''
        };

        $scope.updateUser = function () {
            var id = appManager.getActiveUserId();
            $http.put('./api/user/' + id, $scope.user)
                .success(
                function () {
                    $location.path("/");
                }
            );
        }

        $scope.$watch('user.name', function (value) {
            if (value) {
                $scope.user.message = default_message + value;
            }
        }, true);

        function fetchActiveUser() {
            var activeEntityId = appManager.getActiveUserId();
            if (activeEntityId !== undefined) {
                getUserDetails(activeEntityId).then(function (result) {
                    $scope.user = result.data;
                    $scope.skills = result.data.skills;
                });
            }
        }

        /**
         * $files: an array of files selected, each file has name, size, and type.
         * @param $files
         * @param activeUser
         */
        function sendCVToServer($files, skills, activeUser) {
            for (var i = 0; i < $files.length; i++) {
                var $file = $files[i];
                console.log("file: " + i + ", name: " + $file.name);
                $scope.upload = $upload.upload({
                    url: '/api/upload', //upload.php script, node.js route, or servlet url
                    method: 'POST',
                    data: {user: activeUser, skills: skills},
                    file: $file
                }).progress(function (evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function (data, status, headers, config) {
                    fetchActiveUser();
                    console.log("what data" + data);
                }).error(function(err) {
                    console.log("upload finish with err" + err);
                });
            }
        }

        $scope.onFileSelect = function ($files) {
            var activeUser = authService.getActiveUser();
            cvParser.parseCV($files[0]).
                then(function(skills) {
                    sendCVToServer($files, skills, activeUser);
                })
        };
    }]);