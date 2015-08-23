'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('easywork',
    [
        , 'ui.bootstrap'
        , 'angular-growl'
        , 'ngMessages'
        , 'ui.router'
        , 'ngCookies'
        , 'angularFileUpload'
        , 'ui.select2'
        , 'ngAnimate'
        , 'LocalForageModule'
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
                url: "/home",
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
            .state('dashboard.list.empty', {
                url: "/list/empty",
                templateUrl: "/views/admin/empty.html"
            })
            .state('job-board', {
                url: "/job-board",
                templateUrl: "/views/jobs/job-board.html"
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
    }

//        //================================================
//        // Add an interceptor for AJAX errors
//        //================================================
//        $httpProvider.responseInterceptors.push(function ($q, $location) {
//            return function (promise) {
//                return promise.then(
//                    // Success: just return the response
//                    function (response) {
//                        return response;
//                    },
//                    // Error: check the error status to get only the 401
//                    function (response) {
//                        if (response.status === 401) {
//                            $location.url('/login');
//                        }
//                        return $q.reject(response);
//                    }
//                );
//            }
//        });
//
//        //================================================
//        // Add an interceptor for handling session time out - redirect to login when access denied
//        //================================================
//        $httpProvider.interceptors.push(function ($rootScope, $q, $location) {
//            return {
//                'responseError': function (response) {
//                    if ((response.status === 401 || response.status === 403) && $location.path() !== '/login') {
//                        $location.path('/login');
//                    }
//                    return $q.reject(response);
//                }
//            };
//        });
//    }
//]
)
    .run(function ($rootScope, $location, authService) {
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            // We need the path component of `next`. We can either process `next` and
            // spit out its path component, or simply use $location.path(). I go with
            // the latter.
//            var nextPath = $location.path();
//            var nextRoute = $route.routes[nextPath]
//
//            console.log(nextRoute.access); // There you go!

// ---------------------------------------------------------------

            if (!authService.isAuthorize(next.access)) {
                console.log("Seems like you tried accessing a route you don't have access to...");
                event.preventDefault();
                if (!authService.isLoggedIn()) {
                    $location.path("/login");
                }
                else
                    $location.path("/");//go('user.home');
            }
        });
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

    });

