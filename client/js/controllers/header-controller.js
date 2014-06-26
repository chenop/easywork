'use strict';

var SEND_BUTTON_STR = 'שלח';

angular.module('easywork.controllers.header', ['easywork.services.auth',
        'easywork.services.appManager', 'easywork.services.dataManager',
    'ui.bootstrap', 'angular-growl', 'ngAnimate'])
    .controller('headerController', function ($scope, authService, appManager, dataManager, $modal, $location, growl) {
            $scope.isError = false;
            $scope.user = authService.getActiveUser();
            $scope.authService = authService;
            $scope.dataManager = dataManager;
            $scope.appManager = appManager;

            dataManager.getFiltersData()
                .success(function (result) {
                    $scope.areas = result.areas;
                    $scope.technologies = result.technologies;
                }
            );

            $scope.send = function() {
                if (!authService.isLoggedIn()) {
                    $scope.openLoginDialog(function () {
                        console.log("Sending!");
                        growl.addSuccessMessage("CVs were sent!",  {ttl: 2000});
                    });
                }
                else
                    growl.addSuccessMessage("CVs were sent!",  {ttl: 2000});
            }

            $scope.openLoginDialog = function(callBack) {

                var modalInstance = $modal.open({
                    templateUrl: '/views/users/loginRegister.html',
                    controller: 'LoginRegisterCtrl',
                    resolve: {
                        selectedTab: function () {
                            return 0;
                        }
                    }
                });

                modalInstance.result.then(function (username) {
                    if (username != undefined)
                        console.log('User: ' + username + ' has logged in');
                    if (callBack !== undefined)
                        callBack();
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }

            $scope.openRegisterDialog = function() {

                var modalInstance = $modal.open({
                    templateUrl: '/views/users/loginRegister.html',
                    controller: 'LoginRegisterCtrl',
                    resolve: {
                        selectedTab: function () {
                            return 1;
                        }
                    }
                });

                modalInstance.result.then(function (username) {
                    console.log('User: ' + username + ' has been registered');
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }

            $scope.shouldDisableSend = function() {
                return appManager.getSelectionCount() == 0;
            }

            $scope.technologies_select2Options = dataManager.getTechnologiesSelect2Options();
            $scope.areas_select2Options = dataManager.getAreasSelect2Options();

            $scope.logout = function () {
                authService.logOut()
                    .success(function(data) {
                        $location.path('/');
                    });
            }

            $scope.$watch('appManager.getSelection()', function () {

                // Update send button label
                $scope.sendButtonLabel = SEND_BUTTON_STR;
                if (appManager.getSelectionCount() > 0) {
                    $scope.sendButtonLabel += ' (' + appManager.getSelectionCount()  + ' משרות)';
                }
            }, true);

        }
);
