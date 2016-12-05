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
    .controller('loginCtrl', function ($scope, authService, $localForage, loginRegisterService, utils) {

        var SOMETHING_WENT_WRONG_MSG = "Oops, Something went wrong!";
        var vm = this;

        var modIns = $scope.modIns;
        vm.user = {};
        vm.user.email = null;
        vm.user.password = null;
        vm.user.rememeberMe = null;
        vm.errorMessage = null;

        $localForage.getItem('rememeberMeData').then(function(rememeberMeData) {
            if (!rememeberMeData)
                return;

            if (!rememeberMeData.enable)
                return;

            vm.rememeberMe = rememeberMeData.enable;
            vm.user.email = rememeberMeData.email;
        });

        function handleRmemberMe() {
            var rememeberMeData = {
                enable: vm.rememeberMe
            }

            if (vm.rememeberMe && vm.user.email) {
                rememeberMeData.email = vm.user.email;
            }

            $localForage.setItem('rememeberMeData', rememeberMeData);
        }

            vm.submit = function () {
                var user = {
                    email: vm.user.email,
                    password: vm.user.password
                }

                handleRmemberMe();

                return authService.logIn(user)
                    .then(function () {
                        if (modIns) {
                            modIns.close(user.username);
                        }
                        modIns = undefined; // Bug Fix - prevent from closing again the modal
                        //$location.path('/');
                        return user;
                    }
                    , function (err) {
                            if ((err == undefined) || (err === "")) {
                                vm.errorMessage = SOMETHING_WENT_WRONG_MSG;
                            }
                            else {
                                vm.errorMessage = err.message;
                            }
                        }
                    );
            }

        vm.shouldDisable = function() {
            return utils.isEmpty(vm.user.email) || utils.isEmpty(vm.user.password)
        }

        vm.switchToRegister = function() {
            loginRegisterService.changeTab(1);
        }
    }
);
