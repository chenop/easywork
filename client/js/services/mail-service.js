'use strict';

angular.module('easywork.services.mail', ['easywork.services.auth'])
	.factory('mailService', function ($http, authService) {

		var sendMail = function (selected_companies) {
			var activeUser = authService.getActiveUser();
			return $http({
				method: 'POST',
				url: '/api/sendMail',
				data: {userId: activeUser.id, companies:selected_companies}
			});
		}

		return {
			sendMail: sendMail
		}
	});