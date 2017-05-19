/**
 * Created by Chen on 14/05/2017.
 */

(function (angular) {
	'use strict';

	function DashboardHeaderController($scope, authService, appManager, dataManager, common, $state, $stateParams) {
		var ctrl = this;

		appManager.setDisplaySearchBarInHeader(false);
		ctrl.contentTypeSelect = function (newContentTypeName) {
			ctrl.onContentTypeSelect({type: newContentTypeName});
		}

		// var contentTypeName = $stateParams.contentTypeName;
		// ctrl.contentTypeSelected(contentTypeName);

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

		function getContentType(contentTypeName) {
			switch (contentTypeName) {
				case common.CONTENT_TYPE.COMPANY.name:
					return common.CONTENT_TYPE.COMPANY;
				case common.CONTENT_TYPE.JOB.name:
					return common.CONTENT_TYPE.JOB;
				case common.CONTENT_TYPE.USER.name:
					return common.CONTENT_TYPE.USER;
				case common.CONTENT_TYPE.CV.name:
					return common.CONTENT_TYPE.CV;
			}
		}
	}

	DashboardHeaderController.$inject = ['$scope', 'authService', 'appManager', 'dataManager', 'common', '$state', '$stateParams'];

	angular.module('easywork').component('dashboardHeader', {
		templateUrl: '/views/admin/dashboard-header.html',
		bindings: {
			onContentTypeSelect: '&',
			contentType: '<'
		},
		controller: DashboardHeaderController
	});
})(window.angular);

