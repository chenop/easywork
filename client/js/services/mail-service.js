'use strict';

angular.module('easywork')
	.factory('mailService', function ($http, authService, Upload) {

		var sendMail = function (selectedCompanies, cvData) {
			var activeUser = authService.getActiveUser();
			var activeUserId = (activeUser) ? activeUser.id : null;

            sendCVToServer(activeUserId, cvData, selectedCompanies);
		}

        /**
         * $files: an array of files selected, each file has name, size, and type.
         * @param fileData
         * @param skills
         * @param activeUserId
         */
        function sendCVToServer(activeUserId, cvData, selectedCompanies) {

			if (!activeUserId)
				activeUserId = "anonymous";

			return Upload.upload({
				url: '/api/sendMail/' + activeUserId, //upload.php script, node.js route, or servlet url
				method: 'POST',
				data: {
					cvData: cvData,
					selectedCompanies: selectedCompanies
				}
			}).progress(function (evt) {
//                 console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
			}).success(function (skills, status, headers, config) {
//                 console.log("skills: " + skills);
				return skills;
			}).error(function (err) {
				console.log("upload finish with err" + err);
			});
        }

        return {
			sendMail: sendMail
		}
	});