'use strict';

var SEND_BUTTON_STR = 'שלח';

angular.module('easywork')
    .controller('HeaderController', function ($scope, authService, appManager, dataManager, $uibModal, $location, common, $window) {
        $scope.isError = false;
        $scope.authService = authService;
        $scope.dataManager = dataManager;
        $scope.appManager = appManager;
        $scope.user = authService.getActiveUser();

        $scope.$watch('authService.getActiveUser()', function(value) {
            $scope.user = value;
        })

        dataManager.getFiltersData()
            .then(function(result) {
                $scope.areas = result.data.areas;
                $scope.technologies = result.data.technologies;
            });

        $scope.getDisplayName = function() {
            return $scope.user.name ? $scope.user.name : $scope.user.email;
        }

        $scope.send = function () {
            appManager.send();
        }

        $scope.publishJob = function () {
            if (!authService.isLoggedIn()) {
                $scope.openLoginDialog(function () {
                    $location.path('/content_manager/' + common.CONTENT_TYPE.JOB.value)
                });
            }
        }

        function openDialog(selectedTab) {
            var modalInstance = $uibModal.open({
                templateUrl: '/views/users/loginRegister.html',
                controller: 'LoginRegisterCtrl',
                resolve: {
                    selectedTab: function () {
                        return selectedTab;
                    }
                }
            });

            modalInstance.result
                .then(function (username) {
                        console.log('User: ' + username + ' has been registered');
                    },
                    function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
        }

        $scope.openRegisterDialog = function () {
            openDialog(1);
        }

        $scope.openLoginDialog = function () {
            openDialog(0);
        }


        $scope.shouldDisableSend = function () {
            return appManager.getSelectedCompaniesCount() == 0;
        }

        $scope.technologies_select2Options = dataManager.getTechnologiesSelect2Options();
        $scope.areas_select2Options = dataManager.getAreasSelect2Options();

        $scope.logout = function () {
            authService.logout();
            $location.path('/');
        }

        $scope.$watch('appManager.getSelectedCompanies()', function () {

            // Update send button label
            $scope.sendButtonLabel = SEND_BUTTON_STR;
            if (appManager.getSelectedCompaniesCount() > 0) {
                $scope.sendButtonLabel += ' (' + appManager.getSelectedCompaniesCount();
                $scope.sendButtonLabel += $window.innerWidth > 577 ?  ' חברות)' : ')';
            }
        }, true);

    }
);
