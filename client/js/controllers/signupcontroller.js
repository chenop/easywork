'use strict';

var signup = angular.module('fantasyApp.controllers.signup', [ ])

signup.factory('signupService', function ($http, $location) {
    return {
        createUser: function (newUser) {
            console.log("inside createUser");
            return $http({
                method: 'POST',
                url: '/api/signup',
                data: newUser
            }).success(function (data, status, headers, config) {
                    $location.path("/");
                }
            );
        }
    }
});

signup.controller('SignupCtrl', function ($scope, $http, loginService, $location, signupService) {

        if (!!$scope.auth) {
            $location.path('/');
        }

        $scope.$on('angularFireAuth:login', function () {
            $location.path('/');
        })

        $scope.err = null;

        $scope.login = function (callback) {
            $scope.err = null;
            loginService.login($scope.email, $scope.pass, '/', function (err, user) {
                $scope.err = err || null;
                typeof(callback) === 'function' && callback(err, user);
            });
        };


        $scope.createAccount = function () {
            console.log("signup start");
            if (!$scope.email) {
                $scope.err = 'Please enter an email address';
            }
            else if (!$scope.pass) {
                $scope.err = 'Please enter a password';
            }
            else {

                var newUser = {
                    email: $scope.email,
                    username: $scope.username,
                    pass: $scope.pass
                };
				signupService.createUser(newUser);
            };
        }
    }
);