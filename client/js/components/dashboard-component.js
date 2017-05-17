/**
 * Created by Chen on 29/03/14.
 */

(function (angular) {
	'use strict';

	function DashboardController(appManager, $state) {
		var ctrl = this;

		appManager.setDisplaySearchBarInHeader(false);

		this.addEntity = function () {
			appManager.createEmptyEntity(this.contentType.name)
				.then(function (result) {
					$state.go("dashboard.list", {
						"contentTypeName": this.contentType.name
						, "selectedEntityId": result.data._id
					});
				})
		}
	}

	DashboardController.$inject = ['appManager', '$state'];

	angular.module('easywork').component('dashboard', {
		templateUrl: '/views/admin/dashboard.html',
		controller: DashboardController,
		binding: {
			entityId: '<'
		}
	});
})(window.angular);
