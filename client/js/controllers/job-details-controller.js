'use strict';

angular.module('easywork')
	.controller('JobDetailsCtrl', function ($scope, $http, dataManager, data) {
		$scope.company = data.company;
		$scope.requiredSkill = data.requiredSkill;

		dataManager.getJobsByCompanyAndSkill($scope.requiredSkill, $scope.company._id)
			.then(function (jobs) {
				if (jobs && jobs.length > 0 && jobs[0].name) {
					$scope.job = jobs[0];
				}
				else {
					console.log('company was not found');
				}
			});
	});