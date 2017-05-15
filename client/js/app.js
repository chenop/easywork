'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('easywork',
	[
		, 'ui.bootstrap'
		, 'ngMessages'
		, 'ui.router'
		, 'ngCookies'
		, 'ngFileUpload'
		, 'ui.select'
		, 'ngAnimate'
		, 'LocalStorageModule'
		, 'toaster'
		, 'ngFileSaver'
		, 'feedback.module'
	]
);

app.config(
	function ($locationProvider, $stateProvider, $urlRouterProvider) {
		//
		// For any unmatched url, redirect to /state1
		$urlRouterProvider.otherwise("/home");
		//
		// Now set up the states
		$stateProvider
			.state('home', {
				url: "/home?token",
				templateUrl: "/views/home.html"
			})
			.state('my_company', {
				url: "/my_company",
				templateUrl: "/views/companies/company.html",
				isDashboard: false
			})
			.state('dashboard', {
				abstract: true,
				url: "/dashboard",
				component: "dashboard",
				isDashboard: true
			})
			.state('dashboard.job', {
				// url: "/job/:entityId",
				url: "/job",
				// templateUrl: "/views/jobs/job.html",
				component: "dashboardContent",
				contentTypeName: "job",
				resolve: {
					entities: function (appManager) {
						return appManager.getJobs()
							.then(function (jobs) {
								return jobs;
							});
					}
				}
			})
			.state('dashboard.company', {
				// url: "/company/:entityId",
				url: "/company",
				// templateUrl: "/views/companies/company.html",
				component: "dashboardContent",
				isDashboard: true,
				contentTypeName: "company",
				resolve: {
					entities: function (appManager) {
						return appManager.getCompanies();
					}
				}
			})
			.state('dashboard.user', {
				// url: "/user/:entityId",
				url: "/user/",
				// templateUrl: "/views/users/user.html",
				component: "dashboardContent",
				contentTypeName: "user",
				isDashboard: true,
				resolve: {
					entities: function (appManager) {
						return appManager.getUsers();
					}
				}
			})
			.state('dashboard.cv', {
				url: "/cv",
				// url: "/cv/:entityId",
				// templateUrl: "/views/cvs/cv.html",
				component: "dashboardContent",
				contentTypeName: "cv",
				isDashboard: true,
				resolve: {
					entities: function (appManager) {
						return appManager.getCvs();
					}
				}
			})
			.state('dashboard.list.empty', {
				url: "/list/empty",
				templateUrl: "/views/admin/empty.html"
			})
			.state('unsuscribe', {
				url: "/company/:companyId/unsuscribe",
				templateUrl: "/views/companies/unsuscribe.html"
			})
			.state('company-board', {
				url: "/company-board",
				templateUrl: "/views/companies/company-board.html"
			})
			.state('user_details', {
				url: "/user_details",
				templateUrl: "/views/users/user.html",
				isDashboard: false
			})
			.state('terms_agreement', {
				url: "/terms_agreement",
				templateUrl: "/views/admin/terms-agreement.html",
				isDashboard: false
			})

		$locationProvider.html5Mode(true).hashPrefix('!')
	})
	.config(function ($httpProvider) {
		$httpProvider.interceptors.push('AuthInterceptor');
	})
	.factory('AuthInterceptor', ['$q', '$location', 'localStorageService', '$injector',
		function ($q, $location, localStorageService, $injector) {
			return {
				'request': function (config) {

					if (localStorageService.get('token')) {
						config.headers.authorization = 'Bearer ' + localStorageService.get('token');
					}
					return config || $q.when(config);
				},
				responseError: function (error) {
					if (error.status === 401) // 401 status should be dealt by the controller
						return $q.reject(error);

					console.log("Found responseError: ", error);
					var common = $injector.get('common');

					common.openErrorModal(error);
					$location.path('/');
					return $q.reject(error);
				}
			}
		}]);
