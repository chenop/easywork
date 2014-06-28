'use strict';

angular.module('easywork.controllers.header')

    // Put the focus on the username textfield
    .directive('autoFocus', function ($timeout) {
        return {
            restrict: 'AC',
            link: function (_scope, _element) {
                $timeout(function () {
                    _element[0].focus();
                }, 0);
            }
        };
    })
    .controller('loginCtrl', function ($scope, authService) {

        var SOMETHING_WENT_WRONG_MSG = "Oops, Something went wrong!";
        var modalInstance = $scope.modalInstance;
        $scope.input = {};
        $scope.input.username = null;
        $scope.input.password = null;
        $scope.input.rememeberMe = null;
        $scope.errorMessage = null;

        $scope.hasError = function() {
            return true;//$scope.errorMessage != null;
        }
        $scope.cancel = function () {
            modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.hitEnter = function ($event) {
            if (angular.equals($event.keyCode, 13) && !(angular.equals($scope.input.username, null) || angular.equals($scope.input.username, '')))
                $scope.login();
        };

        $scope.login = function () {
            var user = {
                username: $scope.input.username,
                password: $scope.input.password
            }

            authService.logIn(user)
                .success(
                function () {
                    modalInstance.close(user.username);
                }
            ).error(
                function (err) {
                    if ((err == undefined) || (err === "")) {
                        $scope.errorMessage = SOMETHING_WENT_WRONG_MSG;
                    }
                    else {
                        $scope.errorMessage = err.message;
                    }
                }
            );
        }
    }
);
