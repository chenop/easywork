'use strict';

angular.module('easywork')
	.factory('appManager', function (authService, common, growl, $modal) {

        var selection = [];
        var selectedTechnologies = [];
        var selectedAreas = [];
        var disableSend = false;
		var displaySearchBarInHeader = true;
        var _selectedEntity;
        var currentContentType = common.CONTENT_TYPE.COMPANY;
        var default_message = 'Hi,\nI am interested in open positions in your company.\nContact information can be found in my CV which is attached.\n\nBest Regards,\n';

        var getSelectionCount = function() {
            return selection.length;
        }

        var getSelection = function() {
            return selection;
        }

        var setSelection = function(newSelection) {
            selection = newSelection;
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

        function uploadCVDialog(callBack) {
            var modalInstance = $modal.open({
                templateUrl: '/views/users/uploadCvDialog.html',
                controller: 'UploadCvDialogCtrl'
            });

            modalInstance.result.then(function () {
                if (callBack !== undefined)
                    callBack();
            });
        }

        function send() {
            if (!authService.isLoggedIn()) {
                uploadCVDialog(function() {
                    if (appManager.isUserDetailsCompleted()) {
                                console.log("Sending!");
                                growl.addSuccessMessage("CVs were sent!", {ttl: 2000});
                            }
                            else {
                                openUserDetailsDialog(function() {

                                });
                            }
                })
                //openLoginDialog(function () {
                //    if (appManager.isUserDetailsCompleted()) {
                //        console.log("Sending!");
                //        growl.addSuccessMessage("CVs were sent!", {ttl: 2000});
                //    }
                //    else {
                //        openUserDetailsDialog(function() {
                //
                //        });
                //    }
                //});
            }
            else
                growl.addSuccessMessage("CVs were sent!", {ttl: 2000});
        }

        function openLoginDialog (callBack) {

            var modalInstance = $modal.open({
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

        return {
			shouldDisplaySearchBarInHeader: shouldDisplaySearchBarInHeader
			, setDisplaySearchBarInHeader: setDisplaySearchBarInHeader
            , getSelectionCount: getSelectionCount
            , selectedTechnologies: selectedTechnologies
            , selectedAreas: selectedAreas
            , getSelection: getSelection
            , setSelection: setSelection
            , disableSend: disableSend
            , getActiveCompanyId: getActiveCompanyId
            , getActiveUserId: getActiveUserId
            , getActiveUser: getActiveUser
            , setActiveUser: setActiveUser
            , setSelectedEntity: setSelectedEntity
            , selectedEntity: _selectedEntity
            , getSelectedEntity: getSelectedEntity
            , defaultMessage: default_message
            , getIndexOf: getIndexOf
            , getCurrentContentType: getCurrentContentType
            , setCurrentContentType: setCurrentContentType
            , isUserDetailsCompleted : isUserDetailsCompleted
            , send: send
        }
	}
);
