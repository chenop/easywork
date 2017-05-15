/**
 * Created by Chen.Oppenhaim on 5/14/2017.
 */

(function (angular) {
	'use strict';

	function DashboardContentController($scope, dataManager, appManager, common, $stateParams, $state, utils) {
		var ctrl = this;

		// ctrl.isLoading = false;

		// $scope.$watch('appManager.getLoadingIndicatorVisibility()', function (value) {
		// 	console.log("getLoadingIndicatorVisibility: " + value);
		// 	ctrl.isLoading = value;
		// })

		// ctrl.$onChanges = function (changes) {
		// 	if (changes.isLoading)
		// 		ctrl.isLoading = changes.isLoading.currentValue;
		// };
		//
		// function setSelectedEntity(entity) {
		// 	if (ctrl.entities != undefined && ctrl.entities.length > 0) {
		// 		if (entity == null) {
		// 			entity = ctrl.entities[0];
		// 		}
		// 		appManager.setSelectedEntity(entity);
		// 		return entity;
		// 	}
		// 	return null;
		// }
		//
		// function refreshEntities(contentTypeName, nextEntityIdToSelect) {
		// 	if (contentTypeName == undefined) {
		// 		contentTypeName = appManager.getCurrentContentType().name;
		// 	}
		//
		// 	switch (contentTypeName) {
		//
		// 		case common.CONTENT_TYPE.JOB.name:
		// 			getJobs().then(function (entites) {
		// 				onEntitiesFetch(common.CONTENT_TYPE.JOB, entites, nextEntityIdToSelect);
		// 			});
		// 			break;
		//
		// 		case common.CONTENT_TYPE.COMPANY.name:
		// 			getCompanies().then(function (entites) {
		// 				onEntitiesFetch(common.CONTENT_TYPE.COMPANY, entites, nextEntityIdToSelect);
		// 			});
		// 			break;
		//
		// 		case common.CONTENT_TYPE.USER.name:
		// 			getUsers().then(function (entites) {
		// 				onEntitiesFetch(common.CONTENT_TYPE.USER, entites, nextEntityIdToSelect);
		// 			});
		// 			break;
		// 		case common.CONTENT_TYPE.CV.name:
		// 			getCvs().then(function (entites) {
		// 				onEntitiesFetch(common.CONTENT_TYPE.CV, entites, nextEntityIdToSelect);
		// 			});
		// 			break;
		// 	}
		// }
		//
		// function onEntitiesFetch(entityType, entites, nextEntityIdToSelect) {
		// 	ctrl.entities = entites;
		// 	appManager.setCurrentContentType(entityType);
		// 	handleSelection(nextEntityIdToSelect);
		// }
		//
		// $scope.$on('deleteEntityClicked', function (event, entity) {
		// 	var index = appManager.getIndexOf(ctrl.entities, entity);
		// 	ctrl.deleteEntity(entity, index);
		// })
		//
		// function isLastEntity(index) {
		// 	return index == ctrl.entities.length - 1;
		// }
		//
		// function prepareNextEntityToSelect(index) {
		// 	if (index === undefined)
		// 		return ctrl.entities[0];
		//
		// 	if (ctrl.entities != undefined) {
		// 		if (!isLastEntity(index)) {
		// 			index++;
		// 		}
		// 		else if (index != 0) {
		// 			index--;
		// 		}
		// 		return ctrl.entities[index];
		// 	}
		//
		// 	return null;
		// }
		//
		// function deleteEntity(entity, index) {
		// 	common.openYesNoModal("האם אתה בטוח?", function () {
		// 		var contentType = appManager.getCurrentContentType();
		// 		var nextEntityToSelect = prepareNextEntityToSelect(index);
		// 		utils.removeObject(ctrl.entities, entity);
		//
		// 		handleSelection(nextEntityToSelect._id);
		// 		dataManager.deleteEntity(contentType, entity._id);
		// 	})
		// }
		//
		// function isSelected(entity) {
		// 	var selectedEntity = appManager.getSelectedEntity();
		// 	if (entity == undefined || selectedEntity == undefined)
		// 		return false;
		// 	return selectedEntity._id == entity._id;
		// }
		//
		// function setSelected(entity, $index) {
		// 	// handleSelection(entity._id);
		// }
		//
		// $scope.$on('dataChanged', function (event, entityToUpdate) {
		// 	//refreshEntities(contentTypeName, entity._id);
		//
		// 	for (var i = 0; i < ctrl.entities.length; i++) {
		// 		var entity = ctrl.entities[i];
		//
		// 		if (entity._id === entityToUpdate._id) {
		// 			entity = entityToUpdate;
		// 			return;
		// 		}
		// 	}
		// })

	}

	DashboardContentController.$inject = ['$scope', 'dataManager', 'appManager', 'common', '$stateParams', '$state', 'utils'];

	angular.module('easywork').component('dashboardContent', {
		templateUrl: '/views/admin/dashboard-content.html',
		controller: DashboardContentController,
		bindings: {
			entities: '<'
		},
	});
})(window.angular);


