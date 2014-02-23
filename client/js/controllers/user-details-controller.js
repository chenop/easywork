'use strict';

var userDetailsModule = angular.module('userDetailsModule', ['angularFileUpload', 'ui.select2', 'easywork.services.auth']);

userDetailsModule.controller('userDetailsCtrl', ['$scope', '$upload', '$http', 'authService', '$location',
	function ($scope, $upload, $http, authService, $location) {

		getUserDetails().then(function (result) {
			$scope.user = result.data;
		});

		function getUserDetails() {
			var user = authService.getActiveUser();
			return $http.get('./api/user/' + user.id);
		}

		$scope.welcome = "אנא הכנס פרטים:";
		$scope.select2Options = {
			width: 200,
			minimumResultsForSearch: -1 // Disable the search field in the combo box
		};

		var default_message = 'Hi,\nI am interested in open positions in your company.\nContact information can be found in my CV which is attached.\n\nBest Regards,\n';

		$scope.user = {
			name: '',
			username: '',
			email: '',
			message: default_message,
			experience: '',
			file: ''
		};

		$scope.updateUser = function () {
			var user = authService.getActiveUser();
			$http.put('./api/user/' + user.id, $scope.user)
				.success(
				function () {
					$location.path("/");
				}
			);
		}

		$scope.$watch('user.name', function (value) {
			if (value) {
				$scope.user.message = default_message + value;
			}
		}, true);

		$scope.onFileSelect = function ($files) {
			var activeUser = authService.getActiveUser();
			//$files: an array of files selected, each file has name, size, and type.
			for (var i = 0; i < $files.length; i++) {
				var $file = $files[i];
				console.log("file: " + i + ", name: " + $file.name);
				$scope.upload = $upload.upload({
					url: './api/upload', //upload.php script, node.js route, or servlet url
					method: 'POST',
//        headers: {'headerKey': 'headerValue'}, withCredential: true,
					data: {user: activeUser},
					file: $file
					/* set file formData name for 'Content-Desposition' header. Default: 'file' */
					//fileFormDataName: myFile,
					/* customize how data is added to formData. See #40#issuecomment-28612000 for example */
					//formDataAppender: function(formData, key, val){}
				}).progress(function (evt) {
						console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
					}).success(function (data, status, headers, config) {
						$scope.uploadedFiles.push(angular.copy($files[index]));
						console.log("what data" + data);
					});
				//.error(...)
				//.then(success, error, progress);
			}
		};
	}]);