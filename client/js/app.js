'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('easywork',
	[
		'easywork.services.appManager'
		, 'easywork.controllers.header'
		, 'easywork.services.auth'
		, 'easywork.controllers.home'
		, 'easywork.controllers.company'
		, 'companyListModule'
		, 'userDetailsModule'
        , 'ngRoute', 'ngAnimate']
);

app.config(['$routeProvider', '$locationProvider', '$httpProvider',
	function ($routeProvider, $locationProvider, $httpProvider) {
		$routeProvider
			.when('/', { templateUrl: '/views/home.html'})
			.when('/test', { templateUrl: '/views/users/login.html' })
			.when('/login', { templateUrl: '/views/users/login.html' })
			.when('/signup', { templateUrl: '/views/users/signup.html' })
			.when("/company", { templateUrl: '/views/companies/company.html' })
			.when("/companies", { templateUrl: '/views/companies/companies.html' })
			.when('/user_details', { templateUrl: '/views/users/details.html' })
			.otherwise({ redirectTo: '/' });

		$locationProvider.html5Mode(true);

		//================================================
		// Add an interceptor for AJAX errors
		//================================================
		$httpProvider.responseInterceptors.push(function ($q, $location) {
			return function (promise) {
				return promise.then(
					// Success: just return the response
					function (response) {
						return response;
					},
					// Error: check the error status to get only the 401
					function (response) {
						if (response.status === 401)
							$location.url('/login');
						return $q.reject(response);
					}
				);
			}
		});
	}]);
// a Fix for holder
app.directive('bsHolder', [function () {
    return {
        link: function (scope, element, attrs) {
            Holder.run(element);
        }
    };
}]);

