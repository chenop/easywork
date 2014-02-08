'use strict';

angular.module('easywork.controllers.login', ['easywork.services.auth'])
	.controller('loginCtrl', function ($scope, $rootScope, authService, $location) {

		$scope.username = null;
		$scope.pass = null;
		$scope.name = null;
		$scope.err = undefined;

		$scope.login = function () {
			var user = {
				username: $scope.username,
				password: $scope.pass
			}
			authService.logIn(user)
			.success(
				function () {
					$location.path("/");
					authService.setAuthenticate(true);
				}
			).error(
				function (err) {
					$scope.err = err;
					console.log(err);
					authService.setAuthenticate(false);
				});
		}
	}
);
