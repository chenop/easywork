'use strict';

var SEARCH_BUTTON_STR = 'חפש';

angular.module('easywork.services.appManager', ['easywork.services.auth'])
	.factory('appManager', function (authService) {

        var selection = [];
        var selectedTechnologies = [];
        var selectedAreas = [];
        var disableSend = false;
		var displaySearchBarInHeader = true;
        var _selectedEntity;

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
            // TODO should be
            // if (userRole == jobProvider)
            //      return user.companyID
            // else
            //      return selectedEntity
            // NOT SURE...
            var activeUser = authService.getActiveUser();
            if (activeUser !== undefined) {
                return activeUser.id;
            }
        }

        var getActiveEntityId = function() {
            var selectedEntity = getSelectedEntity();
            if (selectedEntity !== undefined && selectedEntity._id !== undefined) {
                return selectedEntity._id;
            }
            return null;
        }

        var selectionChangeListeners = [];

        var addSelectionChangeListener = function(listener) {
            selectionChangeListeners.push(listener);
        }

        var fireSelectionChanged = function() {
            angular.forEach(selectionChangeListeners, function(listener) {
                listener(getSelectedEntity());
            })
        };

        var setSelectedEntity = function(selectedEntity) {
            _selectedEntity = selectedEntity;
            fireSelectionChanged();
        }

		var getSelectedEntity = function() {
            return _selectedEntity;
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
            , getActiveEntityId: getActiveEntityId
            , getActiveUserId: getActiveUserId
            , setSelectedEntity: setSelectedEntity
            , getSelectedEntity: getSelectedEntity
            , addSelectionChangeListener: addSelectionChangeListener
            , fireSelectionChanged: fireSelectionChanged
		}
	}
);
