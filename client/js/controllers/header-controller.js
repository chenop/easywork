'use strict';

angular.module('easywork.controllers.header', ['easywork.services.auth', 'easywork.services.appManager'])
	.controller('headerController', ['$scope', 'authService', 'appManager', function($scope, authService, appManager) {
		$scope.isError = false;

		$scope.user = authService.getActiveUser();

		$scope.authService = authService;

		$scope.appManager = appManager;
		$scope.logout = function() {
			authService.logOut();
		}

		$scope.selected_domains = [];

		$scope.list_of_domains = ['Java', 'C#', 'Web', 'UI', 'GUI', 'AngularJS', 'HTML', 'CSS', 'C++'];
		$scope.domains_select2Options = {
			'multiple': true
		};
	}])
