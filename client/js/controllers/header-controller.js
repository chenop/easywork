'use strict';

angular.module('easywork.controllers.header', ['easywork.services.auth'])
	.controller('headerController', ['$scope', 'authService',function($scope, authService) {
		$scope.isError = false;

		$scope.user = authService.getActiveUser();

		$scope.authService = authService;

		$scope.logout = function() {
			authService.logOut();
		}
	}])
