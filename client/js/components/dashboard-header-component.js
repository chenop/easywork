/**
 * Created by Chen on 14/05/2017.
 */

(function (angular) {
	'use strict';

	function DashboardHeaderController(EContentType) {
		var ctrl = this;

		ctrl.EContentType = EContentType;
	}

	angular.module('easywork').component('dashboardHeader', {
		templateUrl: '/views/admin/dashboard-header.html',
		bindings: {
			onAddEntity: '&',
			contentType: '<'
		},
		controller: DashboardHeaderController
	});
})(window.angular);

