'use strict';

angular.module('easywork')
	.factory('appManager', function (authService) {

        var selection = [];
        var selectedTechnologies = [];
        var selectedAreas = [];
        var disableSend = false;
		var displaySearchBarInHeader = true;
        var _selectedEntity;
        var default_message = 'Hi,\nI am interested in open positions in your company.\nContact information can be found in my CV which is attached.\n\nBest Regards,\n';
        var _listeners = [];

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

        var getActiveCompanyId = function() {
            var activeUser = authService.getActiveUser();
            if (activeUser == undefined)
                return;
            return JSON.parse(activeUser.company);
        }

        var getIndexOf = function(entities, entity) {
            for (var index = 0; index < entities.length; ++index) {
                if (entities[index]._id === entity._id) {
                    return index;
                }
            }
        }

        var setSelectedEntity = function(selectedEntity, $index) {
            _selectedEntity = selectedEntity;
            if ($index !== undefined) {
                _selectedEntity.index = $index;
                fireSelectionChanged();
            }
        }

		var getSelectedEntity = function() {
            return _selectedEntity;
        }

        var fireSelectionChanged = function() {
            if (_listeners.length == 0) {
                return;
            }
            angular.forEach(_listeners, function(listener) {
                listener(_selectedEntity);
            });

        }
        var addSelectionChangedListener = function(listener) {
            _listeners.push(listener);
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
            , setSelectedEntity: setSelectedEntity
            , selectedEntity: _selectedEntity
            , getSelectedEntity: getSelectedEntity
            , defaultMessage: default_message
            , getIndexOf: getIndexOf
            , fireSelectionChanged: fireSelectionChanged
            , addSelectionChangedListener: addSelectionChangedListener
        }
	}
);
