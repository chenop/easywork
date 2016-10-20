/**
 * Created by Chen on 19/10/2016.
 */

angular.module('easywork')
	.controller('FooterController', function ($scope, dataManager, toaster) {
		$scope.sendFeedback = function(data) {
			dataManager.sendFeedback(data);
			toaster.pop('success', "אנחנו מודים לך על המשוב!");
		}
	});
