/**
 * Created by Chen.Oppenhaim on 5/14/2017.
 */

(function (angular) {
	'use strict';

	function DashboardListController(dataManager, appManager, $state) {
		var ctrl = this;
		console.log(ctrl);
	}

	DashboardListController.$inject = ['dataManager', 'appManager', '$state'];

	angular.module('easywork').component('dashboardList', {
		templateUrl: '/views/admin/dashboard-list.html',
		bindings: {
			entities: '<'
		},
		controller: DashboardListController
	});
})(window.angular);


