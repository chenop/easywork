/**
 * Created by Chen on 29/03/14.
 */

//angular.module('easywork')
//	.controller('DashboardCtrl', function ($scope, authService, appManager, dataManager, common, $state, $stateParams) {
(function (angular) {
	'use strict';

	function DashboardController(dataManager, appManager, $state) {
		var ctrl = this;
		appManager.setDisplaySearchBarInHeader(false);
		//$scope.contentTypeSelected = function(newContentTypeName) {
		//    $scope.contentType = getContentType(newContentTypeName);
		//
		//    $state.go("dashboard.list", {
		//        "contentTypeName": newContentTypeName
		//        , "selectedEntityId" : '-1'
		//    });
		//}

		this.contentType = $state.current.contentTypeName;
		//this.contentTypeSelected(contentTypeName);

		this.select2Options = dataManager.getDashboardSelect2Options();

		this.addEntity = function () {
			appManager.createEmptyEntity(this.contentType.name)
				.then(function (result) {
					$state.go("dashboard.list", {
						"contentTypeName": this.contentType.name
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

	DashboardController.$inject = ['dataManager', 'appManager', '$state'];

	angular.module('easywork').component('dashboard', {
		templateUrl: '/views/admin/dashboard.html',
		controller: DashboardController
	});
})(window.angular);
