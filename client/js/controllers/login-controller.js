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
    .controller('loginCtrl', function ($scope, authService, $localForage, loginRegisterService) {

        var SOMETHING_WENT_WRONG_MSG = "Oops, Something went wrong!";
        var modIns = $scope.modIns;
        $scope.user = {};
        $scope.user.email = null;
        $scope.user.password = null;
        $scope.user.rememeberMe = null;
        $scope.errorMessage = null;

        $localForage.getItem('rememeberMeData').then(function(rememeberMeData) {
            if (!rememeberMeData)
                return;

            if (!rememeberMeData.enable)
                return;

            $scope.rememeberMe = rememeberMeData.enable;
            $scope.user.email = rememeberMeData.email;
        });

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
            if (angular.equals($event.keyCode, 13) && !(angular.equals($scope.user.username, null) || angular.equals($scope.input.username, '')))
                $scope.submit();
        };

        function handleRmemberMe() {
            var rememeberMeData = {
                enable: $scope.rememeberMe
            }

            if ($scope.rememeberMe && $scope.user.email) {
                rememeberMeData.email = $scope.user.email;
            }

            $localForage.setItem('rememeberMeData', rememeberMeData);
        }

            $scope.submit = function () {
                var user = {
                    username: $scope.user.email,
                    password: $scope.user.password
                }

                handleRmemberMe();

                return authService.logIn(user)
                    .success(function () {
                        if (modIns) {
                            modIns.close(user.email);
//                        console.log("login - modIns.close");
                        }
                        modIns = undefined; // Bug Fix - prevent from closing again the modal
                        //$location.path('/');
                        return user;
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

        $scope.shouldDisable = function() {
            return $scope.isEmpty($scope.user.email) || $scope.isEmpty($scope.user.password)
        }

        $scope.switchToRegister = function() {
            loginRegisterService.changeTab(1);
        }
    }
);
