'use strict';

var SEND_BUTTON_STR = 'שלח';

angular.module('easywork')
    .controller('HeaderController', function ($scope, authService, appManager, dataManager, $modal, $location, common) {
        $scope.isError = false;
        $scope.user = authService.getActiveUser();
        $scope.authService = authService;
        $scope.dataManager = dataManager;
        $scope.appManager = appManager;

        dataManager.getFiltersData()
            .then(function(result) {
                $scope.areas = result.data.areas;
                $scope.technologies = result.data.technologies;
            });

        $scope.getDisplayName = function() {
            var activeUser = authService.getActiveUser();
            return activeUser.name ? activeUser.name : activeUser.email;
        }

        var openUserDetailsDialog = function (callBack) {
            var modalInstance = $modal.open({
                templateUrl: '/views/users/user.html'
            });

            modalInstance.result.then(function (username) {
                if (callBack !== undefined)
                    callBack();
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

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
            var modalInstance = $modal.open({
                templateUrl: '/views/users/loginRegister.html',
                controller: 'LoginRegisterCtrl',
                resolve: {
                    selectedTab: function () {
                        return selectedTab;
                    }
                }
            });

            modalInstance.result.then(function (username) {
                console.log('User: ' + username + ' has been registered');
            }, function () {
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
            authService.logOut()
                .success(function () {
                    $location.path('/');
                });
        }

        $scope.$watch('appManager.getSelectedCompanies()', function () {

            // Update send button label
            $scope.sendButtonLabel = SEND_BUTTON_STR;
            if (appManager.getSelectedCompaniesCount() > 0) {
                $scope.sendButtonLabel += ' (' + appManager.getSelectedCompaniesCount() + ' משרות)';
            }
        }, true);

    }
);
