'use strict';

var SEND_BUTTON_STR = 'שלח';

angular.module('easywork.controllers.header', ['easywork.services.auth',
        'easywork.services.appManager', 'easywork.services.dataManager', 'ui.bootstrap'])
    .controller('headerController', ['$scope', 'authService', 'appManager', 'dataManager', '$modal', '$location',
        function ($scope, authService, appManager, dataManager, $modal, $location) {
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
                if (!authService.isAuthenticated()) {
                    $scope.openLoginDialog();
                }
            }

            $scope.message = "Wow!";
            $scope.openLoginDialog = function() {

                var modalInstance = $modal.open({
                    templateUrl: '/views/users/login.html',
                    controller: 'loginCtrl'
//                resolve: {
//                    items: function () {
//                        return $scope.items;
//                    }
//                }
                });

                modalInstance.result.then(function (username) {
                    $log.info('User: ' + username);
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
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
    ])
