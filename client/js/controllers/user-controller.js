'use strict';

angular.module('easywork')
    .controller('userDetailsCtrl'
        , function ($scope, Upload, $http, appManager, dataManager, $timeout, $state, $stateParams, debounce, common) {

            appManager.setDisplaySearchBarInHeader(false);
            $scope.user = {};
            $scope.user.skills = null;

            $scope.activeUser= appManager.getActiveUser();
            $scope.userId = appManager.getRelevantEntityId($state.current.isDashboard, $stateParams.entityId);

            appManager.getRelevantEntity($state.current.isDashboard, $scope.userId, common.CONTENT_TYPE.USER.name)
                .then(function(user) {
                    refreshUser(user);
                })

            function initCvData(cvData, userId) {
                $scope.cvData = cvData;
                $scope.userId = userId;
            }

            function refreshUser(selectedEntity) {
                if (selectedEntity == null)
                    return;

                $scope.user = selectedEntity;
                initCvData(selectedEntity.cv, selectedEntity._id);
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

            var DEFAULT_MESSAGE = common.DEFAULT_MESSAGE;

            $scope.userRoles = routingConfig.rolesArray;

            dataManager.getCompanies().then(function (result) {
                $scope.companies = result;
            });

            $scope.$watch('user.name', function (value) {
                if (value) {
                    $scope.user.message = DEFAULT_MESSAGE + value;
                }
            }, true);

            /**
             * $files: an array of files selected, each file has name, size, and type.
             * @param fileData
             * @param skills
             * @param activeUserId
             */
            function sendCVToServer(fileName, fileData, activeUserId) {
                $scope.upload = Upload.upload({
                    url: '/api/cv', //upload.php script, node.js route, or servlet url
                    method: 'POST',
                    data: {
                        userId: activeUserId,
                        fileData: fileData, // File as base64
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
                var file = $files[0];
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file); // Reading the file as base64
                fileReader.onload = function (e) {
                    sendCVToServer(file.name, e.target.result, activeUserId)
                        .then(function () {
                            $scope.user.fileName = file.name;
                        });
                }
            }

            var debounceUpdateUser = debounce(function () {
                return dataManager.updateUser($scope.user)
                    .then(function (entity) {
                        $scope.$emit('dataChanged', entity.data);
                    });
            }, 300, false);

            $scope.updateUser = function (event) {
                debounceUpdateUser()
            }

            $scope.deleteUser = function () {
                $scope.$emit('deleteEntityClicked', appManager.getSelectedEntity());
            }

            $scope.deleteCV = function (event) {
                if (event) {
                    event.stopPropagation();
                    event.preventDefault();
                }

                var activeUser = appManager.getActiveUser();
                if (!activeUser)
                    return;

                $http.delete('/api/cv/' + activeUser.cv)
                    .success(function (user) {
                        $scope.user = user;
                    })
            }

            $scope.updateRole = function (newRole) {
                if (!$scope.user) {
                    return;
                }

                $scope.user.role = newRole;
                appManager.setActiveUser($scope.user);
                debounceUpdateUser();
            }

            $scope.isAllowToSwitchRole = function(currentUser, newRole) {
                return (currentUser._id != appManager.getActiveUserId() || currentUser.role !== 'admin');
            }
        }
    );