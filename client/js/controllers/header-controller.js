'use strict';

var SEND_BUTTON_STR = 'שלח';

angular.module('easywork.controllers.header', ['easywork.services.auth',
        'easywork.services.appManager', 'easywork.services.dataManager'])
    .controller('headerController', ['$scope', 'authService', 'appManager', 'dataManager',
        function ($scope, authService, appManager, dataManager) {
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

            $scope.shouldDisableSend = function() {
                return appManager.getSelectionCount() == 0;
            }

            $scope.technologies_select2Options = dataManager.getTechnologiesSelect2Options();
            $scope.areas_select2Options = dataManager.getAreasSelect2Options();

            $scope.logout = function () {
                authService.logOut();
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
