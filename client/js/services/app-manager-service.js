'use strict';

angular.module('easywork')
	.factory('appManager', function (authService, common, $uibModal, $rootScope, toaster, mailService, dataManager) {

        var selectedCompanies = [];
        var selectedTechnologies = [];
        var selectedAreas = [];
        var disableSend = false;
		var displaySearchBarInHeader = true;
        var _selectedEntity;
        var currentContentType = common.CONTENT_TYPE.COMPANY;

        $rootScope.$on('dataChanged', function (event, entity) {
            handleActiveUser(entity);
        })

        var handleActiveUser = function(entity) {
            var activeUser = getActiveUser();
            if (activeUser._id === entity._id) {
                setActiveUser(entity);
            }
        }

        var getSelectedCompaniesCount = function() {
            return selectedCompanies.length;
        }

        var getSelectedCompanies = function() {
            return selectedCompanies;
        }

        var setSelectedCompanies = function(pSelectedCompanies) {
            selectedCompanies = pSelectedCompanies;
        }

		var setDisplaySearchBarInHeader = function(disp1) {
			displaySearchBarInHeader = disp1;
		}

		var shouldDisplaySearchBarInHeader = function() {
			return displaySearchBarInHeader;
		}

        var getActiveUserId = function() {
            var activeUser = getActiveUser();
            if (activeUser !== undefined) {
                return activeUser._id;
            }
        }

        var getActiveUser = function() {
            return authService.getActiveUser();
        }

        var setActiveUser = function(user) {
            return authService.setActiveUser(user);
        }

        var getActiveCompanyId = function() {
            var activeUser = authService.getActiveUser();
            if (activeUser == undefined)
                return;
//            return JSON.parse(activeUser.company);
            return activeUser.company;
        }

        var getIndexOf = function(entities, entity) {
            for (var index = 0; index < entities.length; ++index) {
                if (entities[index]._id === entity._id) {
                    return index;
                }
            }
        }


        var setSelectedEntity = function(selectedEntity) {
            _selectedEntity = selectedEntity;
        }

		var getSelectedEntity = function() {
            return _selectedEntity;
        }

        function getCurrentContentType() {
            return currentContentType;
        }

        function setCurrentContentType(contentType) {
            currentContentType = contentType;
        }

        function isUserDetailsCompleted() {
            var user = getActiveUser();
            return (user.name && user.email && user.fileName);
        }

        function sendCVDialog(callBack) {
            var modalInstance = $uibModal.open({
                templateUrl: '/views/users/sendCvDialog.html',
                controller: 'SendCvDialogCtrl',
                resolve: {
                    userId: function() {
                        return getActiveUserId()
                    }
                }

            });

            modalInstance.result.then(function (cvData) {
                if (cvData) {
                    mailService.sendMail(selectedCompanies, cvData);
                    	//.then(function(result) {
							if (callBack)
                        		callBack();
						//});
                }

                modalInstance.close();
            });
        }

        function send() {
            sendCVDialog(function () {
                toaster.pop('success', "קו\"ח נשלחו בהצלחה!");
            })
        }

        function openLoginDialog (callBack) {

            var modalInstance = $uibModal.open({
                templateUrl: '/views/users/loginRegister.html',
                controller: 'LoginRegisterCtrl',
                resolve: {
                    selectedTab: function () {
                        return 0;
                    }
                }
            });

            modalInstance.result.then(function (username) {
                if (username != undefined)
                    console.log('User: ' + username + ' has logged in');
                if (callBack !== undefined)
                    callBack();
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

        function createEmptyEntity(contentTypeName) {
            var entity;

            switch (contentTypeName) {

                case common.CONTENT_TYPE.JOB.name:
                    var company = getActiveCompanyId();
                    entity = dataManager.createEmptyJob(company)
                    return dataManager.createJob(entity);
                case common.CONTENT_TYPE.COMPANY.name:
                    entity = dataManager.createEmptyCompany()
                    entity.ownerId = getActiveUserId();
                    return dataManager.createCompany(entity);
                case common.CONTENT_TYPE.USER.name:
                    entity = dataManager.createEmptyUser()
                    return dataManager.createUser(entity);
            }
        }

        function getRelevantEntityId(isDashboard, entityId){
                    if (isDashboard) {
                        var selectedEntity = getSelectedEntity();
                        entityId = selectedEntity._id;
                    } else {
                        entityId = (!entityId) ? getActiveUserId() : entityId;
                        }
                        return entityId;
                    }

        function getRelevantEntity(isDashboard, entityId, contentTypeName) {
            entityId = getRelevantEntityId(isDashboard, entityId);

            switch (contentTypeName) {

                case common.CONTENT_TYPE.JOB.name:
                    return dataManager.getJob(entityId);
                case common.CONTENT_TYPE.COMPANY.name:
                    return dataManager.getCompany(entityId);
                case common.CONTENT_TYPE.USER.name:
                    return dataManager.getUser(entityId);
            }
        }

        return {
			shouldDisplaySearchBarInHeader: shouldDisplaySearchBarInHeader
			, setDisplaySearchBarInHeader: setDisplaySearchBarInHeader
            , getSelectedCompaniesCount: getSelectedCompaniesCount
            , selectedTechnologies: selectedTechnologies
            , selectedAreas: selectedAreas
            , getSelectedCompanies: getSelectedCompanies
            , setSelectedCompanies: setSelectedCompanies
            , disableSend: disableSend
            , getActiveCompanyId: getActiveCompanyId
            , getActiveUserId: getActiveUserId
            , getActiveUser: getActiveUser
            , setActiveUser: setActiveUser
            , setSelectedEntity: setSelectedEntity
            , selectedEntity: _selectedEntity
            , getSelectedEntity: getSelectedEntity
            , getIndexOf: getIndexOf
            , getCurrentContentType: getCurrentContentType
            , setCurrentContentType: setCurrentContentType
            , isUserDetailsCompleted : isUserDetailsCompleted
            , send: send
            , getRelevantEntity: getRelevantEntity
            , getRelevantEntityId: getRelevantEntityId
            , createEmptyEntity: createEmptyEntity
        }
	}
);
