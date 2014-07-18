'use strict';

angular.module('easywork')
    .controller('userDetailsCtrl'
    , function ($scope, $upload, $http, appManager, authService, $location, cvParser, dataManager, $timeout) {

        var userId = appManager.getActiveUserId();
        dataManager.getUser(userId).
            success(function (result) {
                $scope.user = result;
            })

        appManager.addSelectionChangedListener(function (selectedEntity) {
            $timeout(function () {
                // Using timeout since we want to this to happen after the initialization of the dataManager.getUser()...
                // I know... not the best practice ever...
                $scope.user = selectedEntity;
                $timeout(function () {
                    $('#userName').select();
                }, 100);

            })
        })

//        $scope.$on('listSelectionChanged', function (event, selectedEntity) {
//            $scope.user = selectedEntity;
//            $timeout(function () {
//                $('#userName').select();
//            }, 100);
//        });

        $scope.addUser = function () {
            var user = {
                name: "Untitled User",
                username: '',
                email: '',
                role: '',
                message: default_message,
                experience: '',
                company: null,
                file: ''
            };

            dataManager.createUser(user)
                .success(function (entity) {
                    $scope.$emit('dataChanged', entity);
                    $scope.user = entity;
                    $timeout(function () {
                        $('#userName').select();
                    }, 100);
                });
        }

        function getUserDetails(id) {
            return $http.get('/api/user/' + id);
        }

        $scope.welcome = "אנא הכנס פרטים:";
        $scope.select2Options = {
            width: 200,
            minimumResultsForSearch: -1 // Disable the search field in the combo box
        };

        var default_message = appManager.defaultMessage;

        $scope.userRoles = routingConfig.rolesArray;

        $scope.$watch('user.name', function (value) {
            if (value) {
                $scope.user.message = default_message + value;
            }
        }, true);

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
                    console.log("what data" + data);
                }).error(function (err) {
                    console.log("upload finish with err" + err);
                });
            }
        }

        $scope.onFileSelect = function ($files) {
            var activeUser = authService.getActiveUser();
            cvParser.parseCV($files[0]).
                then(function (skills) {
                    sendCVToServer($files, skills, activeUser);
                })
        };

        $scope.updateUser = function (event) {
            dataManager.updateUser($scope.user)
                .success(function (entity) {
                    $scope.$emit('dataChanged', entity);
                });
        }

        $scope.deleteUser = function () {
            $scope.$emit('deleteEntityClicked', appManager.getSelectedEntity());
        }
    }
);