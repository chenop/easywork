/**
 * Created by Chen on 29/03/14.
 */

(function (angular) {
	'use strict';

	function DashboardController(dataManager, appManager, $state, common, utils) {
		var ctrl = this;

		appManager.setDisplaySearchBarInHeader(false);

		// ctrl.contentTypeSelect = function (contentType) {
		// 	// ctrl.contentType = getContentType(contentType);
		// 	appManager.contentTypeSelected(contentType)
		// 		.then(function (entities) {
		// 			ctrl.entities = entities;
		// 			appManager.handleSelection("-1", entities, contentType);
		// 			var entityId = utils.isEmptyArray(entities) ? "-1" : entities[0].id;
		//
		// 			$state.go("dashboard." + contentType, {
		// 				"entityId": entityId
		// 			});
		// 		})
		// }

		// ctrl.contentType = $state.current.contentTypeName;
		// ctrl.contentTypeSelect(ctrl.contentType);
		//
		// ctrl.select2Options = dataManager.getDashboardSelect2Options();

		function handleSelection(entityId) {
			debugger;
			var contentType = appManager.getCurrentContentType();
			if (utils.isUndefined(ctrl.entities) || ctrl.entities.length === 0) {
				$state.go("dashboard.list.empty");
			}
			else if (!entityId || entityId === '-1') {
				// Just take the first entity
				var entity = ctrl.entities[0];
				setSelectedEntity(entity);
				$state.go("dashboard." + contentType.name, {entityId: entity._id});
			}
			else {
				// Need to select the entity
				var selectedEntity = getEntity(ctrl.entities, entityId);
				setSelectedEntity(selectedEntity);
				$state.go("dashboard." + contentType.name, {entityId: selectedEntity._id});
			}
		}

		function getCompanies() {
			return dataManager.getCompanies();
		};

		function getJobs() {
			if (appManager.getActiveUser().role == "admin") {
				return dataManager.getJobs();
			}
			else {
				var companyId = appManager.getActiveCompanyId();
				return dataManager.getJobs(companyId);
			}
		};

		function getUsers() {
			return dataManager.getUsers();
		};

		function getCvs() {
			return dataManager.getCvs();
		};

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

	DashboardController.$inject = ['dataManager', 'appManager', '$state', 'common', 'utils'];

	angular.module('easywork').component('dashboard', {
		templateUrl: '/views/admin/dashboard.html',
		controller: DashboardController,
		binding: {
			entityId: '<'
		}
	});
})(window.angular);
