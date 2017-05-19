/**
 * Created by Chen.Oppenhaim on 5/14/2017.
 */

(function (angular) {
	'use strict';

	function DashboardContentController(appManager, $state) {
		var ctrl = this;

		ctrl.$onInit = function () {
			appManager.contentTypeSelected(ctrl.contentType)
				.then(function (entities) {
					ctrl.entities = entities;
				})
		}

		ctrl.onUpdate = function (entity) {
			console.log("updating " + entity.name);
		}

		ctrl.entitySelected = function (entity) {
			$state.go("dashboard." + entity.contentType + ".id", {
				company: entity,
				entityId: entity.id,
				onUpdate: ctrl.onUpdate
			})
		}
	}

	DashboardContentController.$inject = ['appManager', '$state'];

	angular.module('easywork').component('dashboardContent', {
		templateUrl: '/views/admin/dashboard-content.html',
		controller: DashboardContentController,
		bindings: {
			entities: '<',
			contentType: '<',
			entityId: '<',
		},
	});
})(window.angular);


