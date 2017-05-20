/**
 * Created by Chen.Oppenhaim on 5/14/2017.
 */

(function (angular) {
	'use strict';

	function DashboardContentController(dataManager, $state, EContentType, debounce) {
		var ctrl = this;

		ctrl.$onInit = function () {
			var isPublic = ctrl.contentType === EContentType.Company || ctrl.contentType === EContentType.Job;
			dataManager.getEntities(isPublic, ctrl.contentType)
				.then(function (entities) {
					ctrl.entities = entities;
				})
		}

		ctrl.onUpdate = function (entity) {
			debounce(function () {
				dataManager.updateEntity(ctrl.contentType, entity);
			}, 300, false)();
		}

		ctrl.entitySelected = function (entity) {
			$state.go("dashboard." + entity.contentType + ".id", {
				entityId: entity.id,
				onUpdate: ctrl.onUpdate
			})
		}
	}

	// DashboardContentController.$inject = ['dataManager', '$state', 'EContentType'];

	angular.module('easywork').component('dashboardContent', {
		templateUrl: '/views/admin/dashboard-content.html',
		controller: DashboardContentController,
		bindings: {
			contentType: '<',
		},
	});
})(window.angular);


