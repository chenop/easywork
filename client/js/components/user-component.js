(function (angular) {
	'use strict';

	function UserController($scope, $timeout, common, appManager) {
		var ctrl = this;

		ctrl.$onInit = function () {
			setCursorInName();
		}

		function setCursorInName() {
			$timeout(function () {
				$('#userName').select();
			}, 100);
		}

		$scope.$watch('user.name', function (value) {
			if (value) {
				ctrl.user.message = common.DEFAULT_MESSAGE + value;
			}
		}, true);

		ctrl.updateUser = function () {
			return ctrl.onUpdate({entity: ctrl.user});
		}

		ctrl.updateRole = function (newRole) {
			if (!ctrl.user) {
				return;
			}

			ctrl.user.role = newRole;
			appManager.setActiveUser(ctrl.user);
			ctrl.updateUser();
		}

		ctrl.isAllowToSwitchRole = function (currentUser, newRole) {
			return (currentUser._id != appManager.getActiveUserId() || currentUser.role !== 'admin');
		}
	}

	angular.module('easywork').component('user', {
		templateUrl: '/views/users/user.html',
		controller: UserController,
		bindings: {
			user: '<',
			companies: '<',
			entityId: '<', // Used for the url
			onUpdate: '&'
		},
	});
})(window.angular);

