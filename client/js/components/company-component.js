'use strict';


(function (angular) {
	'use strict';

	function CompanyController(Upload, $timeout, $uibModal, debounce, utils) {
		var ctrl = this;

		ctrl.publish = false;
		ctrl.isLoading = true;

		setCursorInCompanyName();

		function setCursorInCompanyName() {
			$timeout(function () {
				$('#companyName').select();
			}, 100);
		}

		ctrl.displayedImage = "holder.js/100%x100%";

		ctrl.onImageSelect = function ($files) {
			var file = $files[0];
			var fileReader = new FileReader();
			fileReader.readAsDataURL(file); // Reading the image as base64
			fileReader.onload = function (e) {
				ctrl.upload = Upload.upload({
					url: './api/company/logo-upload/' + ctrl.company._id,
					method: 'POST',
					data: e.target.result // Image as base64
				}).progress(function (evt) {
					console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
				}).success(function (data) {
					// If file is undefined init it
					if (ctrl.company.logo === undefined) {
						ctrl.company.logo = {};
					}
					ctrl.company.logo.data = data;
					ctrl.logo = data;

					return data;
				}).error(function (err) {
					console.log("Error:" + err.message);
				})
			}
		}

		var debounceUpdateCompany = debounce(function () {
			if (!ctrl.form.$valid)
				return;

			return ctrl.onUpdate({entity: ctrl.company});
		}, 500, false);

		ctrl.updateCompany = function () {
			debounceUpdateCompany();
		}

		ctrl.addLocation = function () {
			ctrl.company.locations.push({street: "", city: ""});
		}

		ctrl.removeLocation = function ($index) {
			ctrl.company.locations.splice($index, 1);
			ctrl.updateCompany(ctrl.company);
		}

		ctrl.showLogoGallery = function (company) {
			$uibModal.open({
				templateUrl: '/views/companies/logo-gallery.html',
				controller: 'LogoGalleryCtrl',
				resolve: {
					company: function () {
						return company;
					}
				}

			});
		}

		ctrl.isCompanyExist = function () {
			return utils.isDefined(ctrl.company);
		}

		// ctrl.createCompany = function () {
		// 	appManager.createEmptyCompanyForActiveUser()
		// 		.then(function (emptyCompany) {
		// 			ctrl.company = emptyCompany;
		// 		})
		// }
	}

	CompanyController.$inject = ['Upload', '$timeout', '$uibModal', 'debounce', 'utils'];

	angular.module('easywork').component('company', {
		templateUrl: '/views/companies/company.html',
		controller: CompanyController,
		bindings: {
			company: '<',
			entityId: '<', // Used for the url
			onUpdate: '&'
		},
	});
})(window.angular);

