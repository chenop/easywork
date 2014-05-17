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
    .controller('loginCtrl', function ($scope, authService, $modalInstance) {

        $scope.input = {};
        $scope.input.username = null;
        $scope.input.password = null;
        $scope.input.rememeberMe = null;
        $scope.input.err = undefined;

        $scope.cancel = function () {
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.hitEnter = function ($event) {
            if (angular.equals($event.keyCode, 13) && !(angular.equals($scope.input.username, null) || angular.equals($scope.input.username, '')))
                $scope.login();
        }; // end hitEnter

        $scope.login = function () {
            var user = {
                username: $scope.input.username,
                password: $scope.input.password
            }

            authService.logIn(user)
                .success(
                function () {
                    authService.setAuthenticate(true);
                    $modalInstance.close(user.username);
                    if (!$scope.$$phase) { // If digest not in progress
                        $scope.$apply();
                    }
                }
            ).error(
                function (err) {
                    $scope.err = err;
                    console.log(err);
                    authService.setAuthenticate(false);
                }
            );
        }
    }
);
