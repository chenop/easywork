'use strict';

/* Services */

angular.module('easywork.services.auth', ['ngCookies'])
	.factory('authService', function ($http, $cookieStore) {

		var authenticate = false;

		var setAuthenticate = function (newAuthenticate) {
			authenticate = newAuthenticate;
		}

		var isAuthenticated = function () {
			return authenticate || ($cookieStore.get('user') != undefined);
		}

		var getActiveUser = function () {
			if ($cookieStore != undefined) {
				return $cookieStore.get('user');
			}
			return null;
		}

        var register = function (user) {

            return $http({
                method: 'POST',
                url: '/api/signup',
                data: user
            });
        };

		var logIn = function (user) {

			return $http({
				method: 'POST',
				url: '/api/login',
				data: user
			});
		};

		var logOut = function () {
			setAuthenticate(false);
			$cookieStore.remove('user');
			return $http.get("/logout");
		};

		return {
            register: register
			, logIn: logIn
			, logOut: logOut
			, isAuthenticated: isAuthenticated
			, setAuthenticate: setAuthenticate
			, getActiveUser: getActiveUser
		}
	});