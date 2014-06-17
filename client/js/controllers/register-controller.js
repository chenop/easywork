'use strict';

angular.module('easywork.controllers.header')
    .controller('registerCtrl', function ($scope, authService) {

        var modalInstance = $scope.modalInstance;
        $scope.name = null;
        $scope.username = null;
        $scope.password = null;
        $scope.rememeberMe = null;
        $scope.err = undefined;

        $scope.cancel = function () {
            modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.hitEnter = function (evt) {
            if (angular.equals(evt.keyCode, 13) && !(angular.equals($scope.username, null) || angular.equals($scope.username, ''))) {
                $scope.register();
            }
        }; // end hitEnter

        $scope.register = function () {

            var user = {
                name: this.name,
                username: this.username,
                password: this.password
            }

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
