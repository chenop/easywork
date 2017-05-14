/**
 * Created by Chen on 14/05/2017.
 */

(function (angular) {
	'use strict';

	function DashboardHeaderController(dataManager, appManager, $state) {
		var ctrl = this;
		console.log(ctrl);
	}

	DashboardHeaderController.$inject = ['dataManager', 'appManager', '$state'];

	angular.module('easywork').component('dashboardHeader', {
		templateUrl: '/views/admin/dashboard-header.html',
		bindings: {
			onContentTypeSelect: '&',
			contentType: '<'
		},
		controller: DashboardHeaderController
	});
})(window.angular);

