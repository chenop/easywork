/**
 * Created by Chen on 14/05/2017.
 */

(function (angular) {
	'use strict';

	function DashboardHeaderController($scope, EContentType, appManager, dataManager, common, $state, $stateParams) {
		var ctrl = this;

		ctrl.EContentType = EContentType;
		appManager.setDisplaySearchBarInHeader(false);

		// ctrl.contentTypeSelect = function (newContentType) {
		// 	ctrl.contentType = newContentType; // Check - do we need it? I think it would change when parent will update contentType
		// 	ctrl.onContentTypeSelect({type: newContentType});
		// }

		ctrl.select2Options = dataManager.getDashboardSelect2Options();

		ctrl.addEntity = function () {
			appManager.createEmptyEntity(ctrl.contentType.name)
				.then(function (result) {
					debugger;
					$state.go("dashboard.list", {
						"contentTypeName": ctrl.contentType.name
						, "selectedEntityId": result.data._id
					});
				})
		}
	}

	DashboardHeaderController.$inject = ['$scope', 'EContentType', 'appManager', 'dataManager', 'common', '$state', '$stateParams'];

	angular.module('easywork').component('dashboardHeader', {
		templateUrl: '/views/admin/dashboard-header.html',
		bindings: {
			onContentTypeSelect: '&',
			contentType: '<'
		},
		controller: DashboardHeaderController
	});
})(window.angular);

