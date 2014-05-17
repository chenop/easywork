'use strict';

angular.module('easywork.services.common', [])
	.factory('common', function () {

        var CONTENT_TYPE =
        {
            JOB: {value: 0, name: "job" },
            COMPANY: {value: 1, name: "company" },
            USER: {value: 2, name: "user" }
        };

		return {
            CONTENT_TYPE: CONTENT_TYPE
		}
	});