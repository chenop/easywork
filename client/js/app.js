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
        , 'LocalForageModule'
        , 'LocalStorageModule'
        , 'toaster'
        , 'ngFileSaver'
        , 'feedback.module'
    ]
);

app.config(
    function($locationProvider, $stateProvider, $urlRouterProvider) {
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
            .state('login', {
                url: "/login",
                templateUrl: "/views/users/login.html"
            })
            .state('my_company', {
                url: "/my_company",
                templateUrl: "/views/companies/company.html",
                isDashboard: false
            })
            .state('job_full', {
                url: "/job_full",
                templateUrl: "/views/jobs/job-full.html"
            })
            .state('dashboard', {
                url: "/dashboard/:contentTypeName",
                templateUrl: "/views/admin/dashboard.html",
                isDashboard: true
            })
            .state('dashboard.list', {
                url: "/:selectedEntityId",
                templateUrl: "/views/admin/dashboard-list.html"
            })
            .state('dashboard.list.job', {
                url: "/job/:entityId",
                templateUrl: "/views/jobs/job.html"
            })
            .state('dashboard.list.company', {
                url: "/company/:entityId",
                templateUrl: "/views/companies/company.html",
                isDashboard: true
            })
            .state('dashboard.list.user', {
                url: "/user/:entityId",
                templateUrl: "/views/users/user.html",
                isDashboard: true
            })
            .state('dashboard.list.cv', {
                url: "/cv/:entityId",
                templateUrl: "/views/cvs/cv.html",
                isDashboard: true
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
            .state('register', {             // DEBUG ONLY
                url: "/register",
                templateUrl: "/views/users/register.html",
                isDashboard: false
            })
            .state('login1', {             // DEBUG ONLY
                url: "/login",
                templateUrl: "/views/users/login.html",
                isDashboard: false
            })

        $locationProvider.html5Mode(true).hashPrefix('!')
    })

    .run(function ($rootScope) {
        $rootScope.isUndefined = function(value){return typeof value === 'undefined';}
        $rootScope.isDefined = function(value){return typeof value !== 'undefined';}
        $rootScope.isEmpty = function(value) {
            if (Array.isArray(value)) {
                return (value.length == 0)
            }
            else { // primitive or single object
                return $rootScope.isUndefined(value) || value === '' || value === null || value !== value;
            }
        };
        $rootScope.removeObject = function(array, object) {
            if ($rootScope.isEmpty(array))
                return array;

            var index = array.indexOf(object);
            if (index !== -1) {
                array.splice(index, 1);
            }
            return array;
        }

    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    })
    .factory('AuthInterceptor', [ '$q', '$location', 'localStorageService', '$injector',
        function ($q, $location, localStorageService, $injector) {
            return {
                'request': function (config) {

                    if (localStorageService.get('token')) {
                        config.headers.authorization = 'Bearer ' + localStorageService.get('token');
                    }
                    return config || $q.when(config);
                },
                responseError: function(error) {

                    console.log("Found responseError: ", error);
                    var common = $injector.get('common');

                    common.openErrorModal(error);
                    $location.path('/');
                    return $q.reject(error);
                }
            }
        }]);
