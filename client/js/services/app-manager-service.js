'use strict';

var SEARCH_BUTTON_STR = 'חפש';

angular.module('easywork.services.appManager', [])
	.factory('appManager', function () {

        var selection = [];
        var selectedTechnologies = [];
        var selectedAreas = [];
        var disableSend = false;
		var displaySearchBarInHeader = true;



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

		return {
			shouldDisplaySearchBarInHeader: shouldDisplaySearchBarInHeader
			, setDisplaySearchBarInHeader: setDisplaySearchBarInHeader
            , getSelectionCount: getSelectionCount
            , selectedTechnologies: selectedTechnologies
            , selectedAreas: selectedAreas
            , getSelection: getSelection
            , setSelection: setSelection
            , disableSend: disableSend
		}
	}
);
