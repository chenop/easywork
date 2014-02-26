'use strict';

var SEND_BUTTON_STR = 'שלח';

var homeController = angular.module('easywork.controllers.home', ['ui.select2', 'easywork.services.appManager']);

homeController.controller('homeCtrl', ['$scope', '$http', 'appManager',
	function ($scope, $http, appManager) {
		appManager.setDisplaySearchBarInHeader(false);

		$scope.sendButtonLabel = SEND_BUTTON_STR;

	}
]
);

