/**
 * Created by Chen.Oppenhaim on 1/8/2017.
 */
(function (angular) {
	'use strict';
	function CvController($sce, FileSaver, dataManager, cvService) {
		var ctrl = this;

		ctrl.$onInit = function () {
			var cvId = ctrl.cv.id;
			// ctrl.url = "http://docs.google.com/gview?url=http://www.easywork.co.il/public/cv/download/" + cvId + "&embedded=true";
			// ctrl.url = "https://docs.google.com/viewerng/viewer?url=http://www.easywork.co.il/public/cv/download/" + cvId + "&embedded=true";

			// http://stackoverflow.com/questions/27957766/how-to-render-word-documentdoc-docx-in-browser-using-javascript
			ctrl.url = "https://view.officeapps.live.com/op/embed.aspx?src=http://www.easywork.co.il/public/cv/download/" + cvId + "&embedded=true";
		}

		ctrl.trustSrc = function (src) {
			return $sce.trustAsResourceUrl(src);
		}

		ctrl.refreshSkills = function () {
			ctrl.isLoading = true;
			dataManager.analyzeCv(ctrl.cv.id)
				.then(function (cv) {
					ctrl.cv.skills = cv.skills;
					ctrl.isLoading = false;
				})
		}

		ctrl.downloadCv = function () {
			dataManager.getCv(ctrl.cv.id)
				.then(function (cv) {
					var blob = cvService.convertBase64ToBlob(cv.fileData, cv.fileType);
					FileSaver.saveAs(blob, cv.fileName);
				})
		}
	}

	angular.module('easywork').component('cv', {
		templateUrl: '/js/cv-doc-view/cv-doc-view.html',
		controller: CvController,
		bindings: {
			cv: '<',
			entityId: '<', // Used for the url
		},
	});
})(window.angular);

