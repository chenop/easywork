'use strict';

angular.module('easywork')
    .controller('registerCtrl', function ($scope, authService, appManager) {
        var defaultMessage = appManager.defaultMessage;

        var modIns = $scope.modIns;
        $scope.user = {};
        $scope.user.email = null;
        $scope.user.password = null;
        $scope.user.verifyPassword = null;
        $scope.user.message = defaultMessage;
        $scope.err = undefined;

        $scope.select2Options = {
            width: 200,
            minimumResultsForSearch: -1 // Disable the search field in the combo box
        };

        $scope.isPasswordsEqual = function() {
            return $scope.user.password == $scope.user.verifyPassword;
        }

        $scope.$watch('user.name', function (value) {
            if (value) {
                $scope.user.message = defaultMessage + value;
            }
        }, true);

        $scope.cancel = function () {
            if (modIns) {
                modIns.dismiss('canceled');
//                console.log("login - modIns.close");
            }
            modIns = undefined; // Bug Fix - prevent from closing again the modal
        }; // end cancel

        $scope.hitEnter = function (evt) {
            if (angular.equals(evt.keyCode, 13) && !(angular.equals($scope.username, null) || angular.equals($scope.username, ''))) {
                $scope.register();
            }
        }; // end hitEnter

        $scope.register = function () {

            var user = $scope.user;

            authService.register(user)
                .success(function () {
                    if (modIns) {
                        modIns.close(user.username);
//                        console.log("login - modIns.close");
                    }
                    modIns = undefined; // Bug Fix - prevent from closing again the modal
                }
            ).error(
                function (err) {
                    $scope.err = err;
                    console.log(err);
                }
            );
        }

        $scope.onFileSelect = function($files) {
            var file = $files[0];
            $scope.user.fileName = file.name;
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file); // Reading the file as base64
            fileReader.onload = function (e) {
                $scope.user.cv = e.target.result;
            }
        }
    }
);
