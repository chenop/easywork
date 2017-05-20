/**
 * Created by Chen on 17/03/14.
 */

'use strict';


(function (angular) {
	'use strict';


	Array.prototype.contains = function (elm) {
		for (var i = 0, _len = this.length; i < _len; i++) {
			if (this[i].toUpperCase() === elm.toUpperCase())
				return true;
		}
		return false;
	}

	function JobController($scope, dataManager, common, appManager, $timeout, $stateParams, $rootScope, debounce) {
		var ctrl = this;

		ctrl.$onInit = function () {
			setCursorInJobName();
			getCvs();
		}

		function setCursorInJobName() {
			$timeout(function () {
				$('#jobName').select();
			}, 100);
		}

		ctrl.updateSkill = function () {
			ctrl.updateJob();
			getCvs();
		}

		ctrl.updateJob = function () {
			debounceUpdateJob();
		}

		var debounceUpdateJob = debounce(function () {
			return ctrl.onUpdate({entity: ctrl.job});
		}, 300, false);


		// ctrl.deleteJob = function () {
		// 	//appManager.deleteJob
		// 	ctrl.$emit('deleteEntityClicked', appManager.getSelectedEntity());
		// }

		function getCvs() {
			if (!ctrl.job || !ctrl.job.skills || ctrl.job.skills.length === 0) {
				ctrl.candidateTitle = "אין מועמדים";
				return;
			}

			ctrl.candidateTitle = "המתן...";
			return dataManager.getCvs(ctrl.job.skills)
				.then(function (cvs) {
					if (!cvs || cvs.length === 0) {
						ctrl.candidateTitle = "אין מועמדים";
						cvs = {};
					}
					else
						ctrl.candidateTitle = "מועמדים " + cvs.length;
					ctrl.cvs = cvs;
				});
		}
	}

	angular.module('easywork').component('job', {
		templateUrl: '/views/jobs/job.html',
		controller: JobController,
		bindings: {
			job: '<',
			skills: '<',
			companies: '<',
			entityId: '<', // Used for the url
			onUpdate: '&'
		},
	});
})(window.angular);




