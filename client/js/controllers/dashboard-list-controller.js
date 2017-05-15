// (function (angular) {
// 	'use strict';
//
// 	function DashboardListController($scope, $element, $attrs) {
//
// 		var contentTypeName = $stateParams.contentTypeName;
// 		var selectedEntityId = $stateParams.entityId;
// 		$scope.appManager = appManager;
// 		$scope.isLoading = false;
//
// 		refreshEntities(contentTypeName, selectedEntityId);
// 		$scope.$watch('appManager.getLoadingIndicatorVisibility()', function (value) {
// 			$scope.isLoading = value;
// 		})
//
// 		function setSelectedEntity(entity) {
// 			if ($scope.entities != undefined && $scope.entities.length > 0) {
// 				if (entity == null) {
// 					entity = $scope.entities[0];
// 				}
// 				appManager.setSelectedEntity(entity);
// 				return entity;
// 			}
// 			return null;
// 		}
//
// 		function handleSelection(entityId) {
// 			var contentType = appManager.getCurrentContentType();
// 			if (utils.isUndefined($scope.entities) || $scope.entities.length === 0) {
// 				$state.go("dashboard.list.empty");
// 			}
// 			else if (!entityId || entityId === '-1') {
// 				// Just take the first entity
// 				var entity = $scope.entities[0];
// 				setSelectedEntity(entity);
// 				$state.go("dashboard.list." + contentType.name, {entityId: entity._id});
// 			}
// 			else {
// 				// Need to select the entity
// 				var selectedEntity = getEntity($scope.entities, entityId);
// 				setSelectedEntity(selectedEntity);
// 				$state.go("dashboard.list." + contentType.name, {entityId: selectedEntity._id});
// 			}
// 		}
//
// 		function getEntity(entities, id) {
// 			for (var index in entities) {
// 				if (entities.hasOwnProperty(index)) {
// 					var entity = entities[index];
// 					if (entity._id === id) {
// 						return entity;
// 					}
// 				}
// 			}
// 			return null;
// 		}
//
// 		function refreshEntities(contentTypeName, nextEntityIdToSelect) {
// 			if (contentTypeName == undefined) {
// 				contentTypeName = appManager.getCurrentContentType().name;
// 			}
//
// 			switch (contentTypeName) {
//
// 				case common.CONTENT_TYPE.JOB.name:
// 					getJobs().then(function (entites) {
// 						onEntitiesFetch(common.CONTENT_TYPE.JOB, entites, nextEntityIdToSelect);
// 					});
// 					break;
//
// 				case common.CONTENT_TYPE.COMPANY.name:
// 					getCompanies().then(function (entites) {
// 						onEntitiesFetch(common.CONTENT_TYPE.COMPANY, entites, nextEntityIdToSelect);
// 					});
// 					break;
//
// 				case common.CONTENT_TYPE.USER.name:
// 					getUsers().then(function (entites) {
// 						onEntitiesFetch(common.CONTENT_TYPE.USER, entites, nextEntityIdToSelect);
// 					});
// 					break;
// 				case common.CONTENT_TYPE.CV.name:
// 					getCvs().then(function (entites) {
// 						onEntitiesFetch(common.CONTENT_TYPE.CV, entites, nextEntityIdToSelect);
// 					});
// 					break;
// 			}
// 		}
//
// 		function onEntitiesFetch(entityType, entites, nextEntityIdToSelect) {
// 			$scope.entities = entites;
// 			appManager.setCurrentContentType(entityType);
// 			handleSelection(nextEntityIdToSelect);
// 		}
//
// 		function getCompanies() {
// 			return dataManager.getCompanies();
// 		};
//
// 		function getJobs() {
// 			if (appManager.getActiveUser().role == "admin") {
// 				return dataManager.getJobs();
// 			}
// 			else {
// 				var companyId = appManager.getActiveCompanyId();
// 				return dataManager.getJobs(companyId);
// 			}
// 		};
//
// 		function getUsers() {
// 			return dataManager.getUsers();
// 		};
//
// 		function getCvs() {
// 			return dataManager.getCvs();
// 		};
//
// 		$scope.$on('deleteEntityClicked', function (event, entity) {
// 			var index = appManager.getIndexOf($scope.entities, entity);
// 			$scope.deleteEntity(entity, index);
// 		})
//
// 		function isLastEntity(index) {
// 			return index == $scope.entities.length - 1;
// 		}
//
// 		function prepareNextEntityToSelect(index) {
// 			if (index === undefined)
// 				return $scope.entities[0];
//
// 			if ($scope.entities != undefined) {
// 				if (!isLastEntity(index)) {
// 					index++;
// 				}
// 				else if (index != 0) {
// 					index--;
// 				}
// 				return $scope.entities[index];
// 			}
//
// 			return null;
// 		}
//
// 		$scope.deleteEntity = function (entity, index) {
// 			common.openYesNoModal("האם אתה בטוח?", function () {
// 				var contentType = appManager.getCurrentContentType();
// 				var nextEntityToSelect = prepareNextEntityToSelect(index);
// 				utils.removeObject($scope.entities, entity);
//
// 				handleSelection(nextEntityToSelect._id);
// 				dataManager.deleteEntity(contentType, entity._id);
// 			})
// 		}
//
// 		$scope.isSelected = function (entity) {
// 			var selectedEntity = appManager.getSelectedEntity();
// 			if (entity == undefined || selectedEntity == undefined)
// 				return false;
// 			return selectedEntity._id == entity._id;
// 		}
//
// 		$scope.setSelected = function (entity, $index) {
// 			handleSelection(entity._id);
// 		}
//
// 		$scope.$on('dataChanged', function (event, entityToUpdate) {
// 			//refreshEntities(contentTypeName, entity._id);
//
// 			for (var i = 0; i < $scope.entities.length; i++) {
// 				var entity = $scope.entities[i];
//
// 				if (entity._id === entityToUpdate._id) {
// 					entity = entityToUpdate;
// 					return;
// 				}
// 			}
// 		})
//
// 		$scope.getDisplayName = function (entity) {
// 			switch (entity.contentType) {
// 				case common.EContentType.Job:
// 				case common.EContentType.Company:
// 					return entity.name;
// 				case common.EContentType.User:
// 					return entity.name || entity.email;
// 				case common.EContentType.CV:
// 					return entity.fileName;
// 			}
// 		}
// 	}
//
// 	DashboardListController.$inject = ['$scope', 'dataManager', 'appManager', 'common', '$stateParams', '$state', 'utils'];
//
// 	angular.module('easywork').component('dashboardList', {
// 		templateUrl: 'dashboard-list.html',
// 		controller: DashboardListController
// 	});
// })(window.angular);
//
