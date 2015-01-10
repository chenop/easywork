'use strict';

angular.module('easywork')

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
    .controller('loginCtrl', function ($scope, authService, $location) {

        var SOMETHING_WENT_WRONG_MSG = "Oops, Something went wrong!";
        var modIns = $scope.modIns;
        $scope.input = {};
        $scope.input.username = null;
        $scope.input.password = null;
        $scope.input.rememeberMe = null;
        $scope.errorMessage = null;

        $scope.hasError = function() {
            return true;//$scope.errorMessage != null;
        }
        $scope.cancel = function () {
            if (modIns) {
                modIns.dismiss('canceled');
//                console.log("login - modIns.close");
            }
            modIns = undefined; // Bug Fix - prevent from closing again the modal
        }; // end cancel

        $scope.hitEnter = function ($event) {
            if (angular.equals($event.keyCode, 13) && !(angular.equals($scope.input.username, null) || angular.equals($scope.input.username, '')))
                $scope.submit();
        };

        $scope.submit = function () {
            var user = {
                username: $scope.input.username,
                password: $scope.input.password
            }

            authService.logIn(user)
                .success(function () {
                    if (modIns) {
                        modIns.close(user.username);
//                        console.log("login - modIns.close");
                    }
                    modIns = undefined; // Bug Fix - prevent from closing again the modal
                    $location.path('/');
                })
                .error(function (err) {
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
