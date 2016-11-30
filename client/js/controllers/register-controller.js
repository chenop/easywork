'use strict';

angular.module('easywork')
    .directive("isEmailExist", function(dataManager, $q) {

        return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, element, attributes, ngModel) {

                ngModel.$asyncValidators.isEmailExist = function(email) {
                    var deferred = $q.defer();
                    dataManager.isEmailExist(email)
                        .then(function(result) {
                            if (result.data)
                                deferred.reject();
                            else
                                deferred.resolve();
                        });
                    return deferred.promise;
                }
            }
        };
    })
    .directive('ngMatch', ['$parse', function ($parse) {

        var directive = {
            link: link,
            restrict: 'A',
            require: '?ngModel'
        };
        return directive;

        function link(scope, elem, attrs, ctrl) {
            // if ngModel is not defined, we don't need to do anything
            if (!ctrl) return;
            if (!attrs['ngMatch']) return;

            var firstPassword = $parse(attrs['ngMatch']);

            var validator = function (value) {
                var temp = firstPassword(scope),
                    v    = value === temp;
                ctrl.$setValidity('match', v);
                return value;
            }

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
            attrs.$observe('ngMatch', function () {
                validator(ctrl.$viewValue);
            });

        }
    }])
    .controller('registerCtrl', function ($scope, authService, common) {
        var defaultMessage = common.DEFAULT_MESSAGE;

        var modIns = $scope.modIns;
        $scope.user = {};
        $scope.user.email = null;
        $scope.user.password = null;
        $scope.user.verifyPassword = null;
        $scope.user.message = defaultMessage;
        $scope.user.role = 'jobSeeker';
        $scope.err = undefined;

        $scope.select2Options = {
            width: 200,
            minimumResultsForSearch: -1 // Disable the search field in the combo box
        };

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
                .then(function () {
                        if (modIns) {
                            modIns.close(user.email);
                        }
                        modIns = undefined; // Bug Fix - prevent from closing again the modal
                    }
                    , function (err) {
                        $scope.err = err;
                        console.log(err);
                    }
                );
        }

        $scope.onFileSelect = function ($files) {
            var file = $files[0];
            $scope.user.fileName = file.name;
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file); // Reading the file as base64
            fileReader.onload = function (e) {
                $scope.user.cv = e.target.result;
            }
        }

        $scope.shouldDisable = function() {
            return $scope.isEmpty($scope.user.email) ||
                $scope.isEmpty($scope.user.password) ||
                $scope.isEmpty($scope.user.verifyPassword) ||
                !$scope.isEmpty($scope.user.password) &&
                !$scope.isEmpty($scope.user.verifyPassword) &&
                $scope.user.password !== $scope.user.verifyPassword;
        }
    }
);
