/**
 * Created by Chen on 14/05/2017.
 */

(function (angular) {
	'use strict';

	function DashboardListController(common) {
		var ctrl = this;

		ctrl.$onChanges = function (changes) {
			if (changes.entities && changes.entities.currentValue)
				ctrl.setSelected(ctrl.entities[0]);
		};

		ctrl.isSelected = function (entity) {
			// var selectedEntity = appManager.getSelectedEntity();
			// if (entity == undefined || selectedEntity == undefined)
			// 	return false;
			// return selectedEntity._id == entity._id;
		}

		ctrl.setSelected = function (entity, $index) {
			console.log("setSelected: " + ctrl.getDisplayName(entity));
			// handleSelection(entity._id);
		}

		ctrl.getDisplayName = function (entity) {
			switch (entity.contentType) {
				case common.EContentType.Job:
				case common.EContentType.Company:
					return entity.name;
				case common.EContentType.User:
					return entity.name || entity.email;
				case common.EContentType.CV:
					return entity.fileName;
			}
		}

		ctrl.deleteEntity = function (entity, index) {
			// common.openYesNoModal("האם אתה בטוח?", function () {
			// 	var contentType = appManager.getCurrentContentType();
			// 	var nextEntityToSelect = prepareNextEntityToSelect(index);
			// 	utils.removeObject(ctrl.entities, entity);
			//
			// 	handleSelection(nextEntityToSelect._id);
			// 	dataManager.deleteEntity(contentType, entity._id);
			// })
		}

	}

	DashboardListController.$inject = ['common'];

	angular.module('easywork').component('dashboardList', {
		templateUrl: '/views/admin/dashboard-list.html',
		bindings: {
			entities: '<'
		},
		controller: DashboardListController
	});
})(window.angular);

