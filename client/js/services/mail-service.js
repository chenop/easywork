'use strict';

angular.module('easywork')
	.factory('mailService', function ($http, authService, Upload, utils, toaster) {

		var sendCv = function (selectedCompanies, cvData) {
			var activeUser = authService.getActiveUser();
			var activeUserId = (activeUser) ? activeUser._id : null;

			sendCVToServer(activeUserId, cvData, selectedCompanies);
		}

		/**
		 * $files: an array of files selected, each file has name, size, and type.
		 * @param fileData
		 * @param skills
		 * @param activeUserId
		 */
		function sendCVToServer(activeUserId, cvData, selectedCompanies) {

			var url = '/public/sendMail/';

			if (!utils.isEmpty(activeUserId))
				url += activeUserId;

			return Upload.upload({
				url: url,
				method: 'POST',
				data: {
					cvData: cvData,
					selectedCompanies: selectedCompanies
				}
			}).progress(function (evt) {
//                 console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
			}).success(function (skills, status, headers, config) {
				toaster.pop('success', "קו\"ח נשלחו בהצלחה!");
				return skills;
			}).error(function (err) {
				toaster.pop('error', "שגיאה ארעה בעת השליחה - אנא שלח פידבק");
				console.log("upload finish with err" + err);
			});
		}

		return {
			sendCv: sendCv
		}
	});