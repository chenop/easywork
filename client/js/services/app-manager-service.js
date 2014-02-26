'use strict';

angular.module('easywork.services.appManager', [])
	.factory('appManager', function ($location) {

//		$scope.animate_direction = 'rtl';

//		$scope.isRTL = function () {
//			return $scope.animate_direction === 'rtl';
//		}
//
//		$scope.isLTR = function () {
//			return $scope.animate_direction === 'ltr';
//		}
//
//		$scope.go = function (path, direction) {
//			$scope.animate_direction = direction;
//			$location.path(path);
//		}

		var displaySearchBarInHeader = true;

		var setDisplaySearchBarInHeader = function(disp1) {
			displaySearchBarInHeader = disp1;
		}

		var shouldDisplaySearchBarInHeader = function() {
			return displaySearchBarInHeader;
		}

		return {
			shouldDisplaySearchBarInHeader: shouldDisplaySearchBarInHeader,
			setDisplaySearchBarInHeader: setDisplaySearchBarInHeader
		}
	}
);
