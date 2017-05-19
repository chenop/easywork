/**
 * Created by Chen on 14/05/2017.
 */

(function (angular) {
	'use strict';

	function DashboardListController(EContentType, common, utils, dataManager, $stateParams, $state) {
		var ctrl = this;

		ctrl.$onChanges = function (changes) {
			if (changes.entities && changes.entities.currentValue) {
				var entityToSelect = analyzeEntityToSelect(ctrl.contentType, $stateParams.entityId);

				if (entityToSelect)
					ctrl.setSelected(entityToSelect);
			}
		};

		// TODO that should be outside the list component - entity to select should be provided to the entities list
		function analyzeEntityToSelect(contentType, entityId) {
			if (entityId)
				return null; //entityToSelect = appManager.getEntity(contentType, $stateParams.entityId)
			else
				return ctrl.entities[0];
		}

		ctrl.isSelected = function (entity) {
			var selectedEntity = ctrl.selectedEntity;
			if (entity == undefined || selectedEntity == undefined)
				return false;
			return selectedEntity._id == entity._id;
		}

		ctrl.setSelected = function (entity, $index) {
			ctrl.selectedEntity = entity;
			ctrl.onEntitySelect({entity: entity});
		}

		ctrl.getDisplayName = function (entity) {
			switch (entity.contentType) {
				case EContentType.Job:
				case EContentType.Company:
					return entity.name;
				case EContentType.User:
					return entity.name || entity.email;
				case EContentType.Cv:
					return entity.fileName;
			}
		}

		ctrl.deleteEntity = function (entity, index) {
			if (!entity)
				return;

			common.openYesNoModal("האם אתה בטוח?", function () {
				var nextEntityToSelect = prepareNextEntityToSelect(index);
				utils.removeObject(ctrl.entities, entity);

				ctrl.selectedEntity = nextEntityToSelect;
				dataManager.deleteEntity(entity.contentType, entity.id);
			})
		}

		function prepareNextEntityToSelect(index) {
			if (index === undefined)
				return ctrl.entities[0];

			if (ctrl.entities != undefined) {
				if (!isLastEntity(index)) {
					index++;
				}
				else if (index != 0) {
					index--;
				}
				return ctrl.entities[index];
			}

			return null;
		}

		function isLastEntity(index) {
			return index == ctrl.entities.length - 1;
		}
	}

	DashboardListController.$inject = ['EContentType', 'common', 'utils', 'dataManager', '$stateParams', '$state'];

	angular.module('easywork').component('dashboardList', {
		templateUrl: '/views/admin/dashboard-list.html',
		bindings: {
			entities: '<',
			onEntitySelect: '&'
		},
		controller: DashboardListController
	});
})(window.angular);

