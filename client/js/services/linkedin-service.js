/**
 * Created by Chen on 29/09/2014.
 */

angular.module('easywork')
	.config(function ($httpProvider) {
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	})
	.factory('linkedIn', function ($http, $rootScope) {
			function linkedInLogin() {
				$http.get('/auth/linkedin')
					.then(function (result) {
						console.log(result);
					})
			}

			function linkedInConnect() {

				// TODO trying get authorization code...
				// https://developer.linkedin.com/documents/authentication
				$http({
					method: 'GET',
					url: 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=773ypiul1vn3og&state=DCEEFWF45453sdffef424&redirect_uri=http://localhost:3000',
//                headers: {
//                    "Access-Control-Allow-Origin": "*"
////                    , "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
//                    , "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE"
//                    , "Access-Control-Allow-Credentials": "true"
////                    "Content-Type": "application/json"
//                }
				})
					.then(function (result) {
						console.log(result);
					}, function (err, status, headers, config) {
						console.log(err)
					});
			}

			return {
				linkedInConnect: linkedInConnect
				, linkedInLogin: linkedInLogin
			}
		}
	);

