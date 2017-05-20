/**
 * Created by Chen.Oppenhaim on 5/14/2017.
 */

(function (angular) {
	'use strict';

	function DashboardContentController(dataManager, $state, $stateParams) {
		var ctrl = this;

		ctrl.$onInit = function () {
			dataManager.getEntities(ctrl.contentType)
				.then(function (entities) {
					ctrl.entities = entities;
				})
		}

		ctrl.onUpdate = function (entity) {
			return dataManager.updateEntity(ctrl.contentType, entity);
		}

		ctrl.entitySelected = function (entity) {
			$state.go("dashboard." + entity.contentType + ".id", {
				company: entity,
				entityId: entity.id,
				onUpdate: ctrl.onUpdate
			})
		}
	}

	DashboardContentController.$inject = ['dataManager', '$state', '$stateParams'];

	angular.module('easywork').component('dashboardContent', {
		templateUrl: '/views/admin/dashboard-content.html',
		controller: DashboardContentController,
		bindings: {
			contentType: '<',
		},
	});
})(window.angular);


