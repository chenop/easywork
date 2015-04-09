'use strict';

angular.module('easywork')
    .controller('userDetailsCtrl'
    , function ($scope, $upload, $http, appManager, authService, $location, cvParser, dataManager, $timeout, $state, $stateParams) {

        appManager.setDisplaySearchBarInHeader(false);
        $scope.user = {};
        $scope.user.skills = null;

        if ($state.current.isDashboard) {
            var selectedEntity = appManager.getSelectedEntity();
            var entityId = $stateParams.entityId;
            refreshUser(selectedEntity);
        }
        else {
            var activeUserId = appManager.getActiveUserId();
            dataManager.getUser(activeUserId)
                .then(function(result) {
                    refreshUser(result.data);
                })
        }

        function refreshUser(selectedEntity) {
            if (selectedEntity == null)
                return;

            $scope.user = selectedEntity;
            $timeout(function () {
                $('#userName').select();
            }, 100);
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

        dataManager.getCompanies().then(function(result) {
            $scope.companies = result;
        });

        $scope.$watch('user.name', function (value) {
            if (value) {
                $scope.user.message = default_message + value;
            }
        }, true);

        /**
         * $files: an array of files selected, each file has name, size, and type.
         * @param fileData
         * @param skills
         * @param activeUserId
         */
        function sendCVToServer(fileName, fileData, skills, activeUserId) {
            $scope.upload = $upload.upload({
                url: '/api/user/cv-upload/' + activeUserId, //upload.php script, node.js route, or servlet url
                method: 'POST',
                data: {
                    data: fileData, // File as base64
                    skills: skills,
                    fileName: fileName
                }
            }).progress(function (evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (skills, status, headers, config) {
                console.log("skills: " + skills);

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

        $scope.updateUser = function (event) {
            dataManager.updateUser($scope.user)
                .success(function (entity) {
                    $scope.$emit('dataChanged', entity);
                });
        }

        $scope.deleteUser = function () {
            $scope.$emit('deleteEntityClicked', appManager.getSelectedEntity());
        }

        $scope.deleteCV = function(event) {
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }

            var activeUserId = appManager.getActiveUserId();
            if (!activeUserId)
                return;
            $http.post('/api/user/cv-delete/' + activeUserId)
                .success(function(user) {
                    $scope.user = user;
                })
        }
    }
);