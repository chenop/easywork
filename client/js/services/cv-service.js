/**
 * Created by Chen.Oppenhaim on 5/25/2016.
 */

angular.module('easywork')
	.constant('ANONYMOUS', "anonymous")
	.factory('cvService', function (Upload, localStorageService, dataManager, utils, ANONYMOUS, $uibModal, $rootScope) {

		var ESTATUS = {
			NO_CV: 0,
			UPLOADING_CV: 1,
			GOT_CV: 2
		};

		var cvStatus;// = ESTATUS.NO_CV;

		function getCvByUserId(userId) {
			var cv = localStorageService.get(userId)
			if (isCvValid(cv)) {
				$rootScope.$broadcast('cvUploaded', cv);
				return Promise.resolve(cv);
			}

			if (!isValidUserId(userId)) {
				return Promise.reject();
			}

			return dataManager.getCvByUserId(userId)
				.then(function (cv) {
					$rootScope.$broadcast('cvUploaded', cv);
					return cv;
				})
				.catch(function () {
					return Promise.reject();
				})
		}

		function isCvValid(cv) {
			return cv && cv.fileData && cv.fileName;
		}

		function isValidUserId(userId) {
			return (!utils.isEmpty(userId) && userId !== ANONYMOUS);
		}

		function uploadFile(file, userId) {
			if (!file)
				return Promise.reject();

			return Upload.base64DataUrl(file)
				.then(function (dataUrl) {
					return Upload.upload({
						url: 'public/cv',
						data: {file: file, data: dataUrl, userId: userId}
					}).then(function (response) {
						var cv = response.data;
						$rootScope.$broadcast('cvUploaded', cv);
						return cv;
					}, function (response) {
						//if (response.status > 0)
						//    $scope.errorMsg = response.status + ': ' + response.data;
					}, function (evt) {
						file.progress = Math.min(100, parseInt(100.0 *
							evt.loaded / evt.total));
					});
				})
		}

		function convertBase64ToBlob(b64Data, contentType, sliceSize) {
			contentType = contentType || '';
			sliceSize = sliceSize || 512;

			var byteCharacters = atob(b64Data);
			var byteArrays = [];

			for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
				var slice = byteCharacters.slice(offset, offset + sliceSize);

				var byteNumbers = new Array(slice.length);
				for (var i = 0; i < slice.length; i++) {
					byteNumbers[i] = slice.charCodeAt(i);
				}

				var byteArray = new Uint8Array(byteNumbers);

				byteArrays.push(byteArray);
			}

			var blob = new Blob(byteArrays, {type: contentType});
			return blob;
		}

		function openCvDocViewModal(cv) {
			$uibModal.open({
				template: '<cv cv="cv"/>',
				controller: function ($scope) {
					$scope.cv = cv;
				}
			});
		}

		function getCvEmail(userId) {
			if (!userId)
				return Promise.reject();

			return getCvByUserId(userId)
				.then(function (cv) {
					if (!cv)
						return Promise.reject();
					;

					return cv.email;
				});
		}

		function setCVStatus(value) {
			this.cvStatus = value;
		}

		return {
			uploadFile: uploadFile
			, convertBase64ToBlob: convertBase64ToBlob
			, getCvByUserId: getCvByUserId
			, openCvDocViewModal: openCvDocViewModal
			, getCvEmail: getCvEmail
			, setCVStatus: setCVStatus
			, cvStatus: cvStatus
			, ESTATUS: ESTATUS
		}
	});

