/**
 * Created by Chen on 27/11/2016.
 */

angular.module('easywork')
	.factory('apiHelper', function ($http) {
		function prefix(isPublic) {
			return isPublic ? "/public/" : "/api/";
		}

		function get(isPublic, url, params) {
			if (!params)
				params = {};

			return $http.get(prefix(isPublic) + url, params);
		}

		function post(isPublic, url, data) {
			return $http.post(prefix(isPublic) + url, data);
		}

		function put(isPublic, url, data) {
			return $http.put(prefix(isPublic) + url, data);
		}

		function delete1(isPublic, url) {
			return $http.delete(prefix(isPublic) + url);
		}

		return {
			get: get
			, post: post
			, put: put
			, delete1: delete1
		}
	});

