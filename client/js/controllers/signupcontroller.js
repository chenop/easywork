'use strict';

var signup = angular.module('easywork.controllers.signup', [ ])

signup.factory('signupService', function ($http) {
	return {
		createUser: function (user) {
			return $http({
				method: 'POST',
				url: '/api/signup',
				data: user
			});
		}
	}
});

signup.controller('SignupCtrl', function ($scope, $http, signupService) {

//		if (!!$scope.auth) {
//			$location.path('/');
//		}

//		$scope.$on('angularFireAuth:login', function () {
//			$location.path('/');
//		})

		$scope.err = null;

//		$scope.login = function (callback) {
//			$scope.err = null;
//			loginService.login($scope.email, $scope.pass, '/', function (err, user) {
//				$scope.err = err || null;
//				typeof(callback) === 'function' && callback(err, user);
//			});
//		};


		$scope.createAccount = function () {
			if (!$scope.email) {
				$scope.err = 'Please enter an email address';
			}
			else if (!$scope.pass) {
				$scope.err = 'Please enter a password';
			}
			else {

				var user = {
					email: $scope.email,
					username: $scope.username,
					password: $scope.pass
				};
				signupService.createUser(user);
			}
		}
	}
);