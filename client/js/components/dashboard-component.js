/**
 * Created by Chen on 29/03/14.
 */

(function (angular) {
	'use strict';

	function DashboardController(appManager, $state, EContentType, $stateParams) {
		var ctrl = this;

		ctrl.$onInit = function () {
			init();
		}

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

		function init() {
			var contentType = $stateParams.contentType;
			var entityId = $stateParams.entityId;

			if (!contentType && !entityId) {
				// url: /dashboard
				ctrl.contentType = EContentType.Company
				$state.go("dashboard." + ctrl.contentType);
				return;
			}

			if (contentType && entityId) {
				// url: /dashboard/:contentType/:entityId
				ctrl.contentType = contentType;
				return;
			}

			if (contentType && !entityId) {
				// url: /dashboard/:contentType
				ctrl.contentType = contentType;
				$state.go("dashboard." + ctrl.contentType);
				return;
			}
		}
	}

	DashboardController.$inject = ['appManager', '$state', 'EContentType', '$stateParams'];

	angular.module('easywork')
		.component('dashboard', {
			templateUrl: '/views/admin/dashboard.html',
			controller: DashboardController,
			binding: {
				contentType: '<'
			}
		});
})(window.angular);
