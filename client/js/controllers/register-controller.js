'use strict';

angular.module('easywork.controllers.header')
    .controller('registerCtrl', function ($scope, authService, appManager) {
        var defaultMessage = appManager.defaultMessage;

        var modalInstance = $scope.modalInstance;
        $scope.user = {};
        $scope.user.name = null;
        $scope.user.username = null;
        $scope.user.password = null;
        $scope.user.email = null;
        $scope.user.message = defaultMessage;
        $scope.err = undefined;

        $scope.select2Options = {
            width: 200,
            minimumResultsForSearch: -1 // Disable the search field in the combo box
        };

        $scope.isPasswordsEqual = function() {
            return $scope.user.password == $scope.user.retypePassword;
        }

        $scope.$watch('user.name', function (value) {
            if (value) {
                $scope.user.message = defaultMessage + value;
            }
        }, true);

        $scope.cancel = function () {
            modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.hitEnter = function (evt) {
            if (angular.equals(evt.keyCode, 13) && !(angular.equals($scope.username, null) || angular.equals($scope.username, ''))) {
                $scope.register();
            }
        }; // end hitEnter

        $scope.register = function () {

            var user = $scope.user;

            authService.register(user)
                .success(
                function () {
                    modalInstance.close(user.username);
                }
            ).error(
                function (err) {
                    $scope.err = err;
                    console.log(err);
                }
            );
        }
    }
);
