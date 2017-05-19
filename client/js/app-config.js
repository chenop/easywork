'use strict';


app.config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
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
			url: "/job",
			component: "dashboardContent",
			resolve: {
				contentType: function (EContentType) {
					return EContentType.Job;
				},
				// entities: function (appManager) {
				// 	return appManager.getJobs();
				// }
			}
		})
		.state('dashboard.job.id', {
			url: "/:entityId",
			templateUrl: "/views/jobs/job.html",
			data: {},
			resolve: {
				selectedEntity: function ($stateParams, dataManager) {
					if ($stateParams.entityId)
						return dataManager.getJob($stateParams.entityId);
					return null;
				}
			}
		})
		.state('dashboard.company', {
			url: "/company",
			component: "dashboardContent",
			resolve: {
				contentType: function (EContentType) {
					return EContentType.Company;
				},
				// entities: function (appManager) {
				// 	return appManager.getCompanies();
				// }
			}
		})
		.state('dashboard.company.id', {
			url: "/:entityId",
			component: "company",
			data: {},
			resolve: {
				company: function ($stateParams, dataManager) {
					if ($stateParams.entityId)
						return dataManager.getCompany($stateParams.entityId);
					return null;
				}
			}
		})
		.state('dashboard.user', {
			url: "/user/",
			component: "dashboardContent",
			contentType: function (EContentType) {
				return EContentType.User;
			}
		})
		.state('dashboard.user.id', {
			url: "/:entityId",
			templateUrl: "/views/users/user.html",
			resolve: {
				selectedEntity: function ($stateParams, dataManager) {
					if ($stateParams.entityId)
						return dataManager.getJob($stateParams.entityId);
					return null;
				}
			}
		})
		.state('dashboard.cv', {
			url: "/cv",
			component: "dashboardContent",
			contentType: function (EContentType) {
				return EContentType.Cv;
			}
		})
		.state('dashboard.cv.id', {
			url: "/:entityId",
			templateUrl: "/views/cvs/cv.html",
			data: {},
			resolve: {
				selectedEntity: function ($stateParams, dataManager) {
					if ($stateParams.entityId)
						return dataManager.getCv($stateParams.entityId);
					return null;
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

	$locationProvider.html5Mode(true).hashPrefix('!');
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
