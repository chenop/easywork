'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('easywork',
    [
        , 'ui.bootstrap'
        , 'angular-growl'
        , 'ngRoute'
        , 'ngCookies'
        , 'angularFileUpload'
        , 'ui.select2'
        , 'ngAnimate']
);

app.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, $httpProvider) {

        $routeProvider
            .when('/', { templateUrl: '/views/home.html', access: 'public'})
            .when('/test', {redirectTo: '/content_manager'})
            .when('/login', { templateUrl: '/views/users/login.html', access: 'public' })
            .when("/my_company", {templateUrl: '/views/companies/company.html', access: 'jobProvider'})
            .when("/job_full", {templateUrl: '/views/jobs/job-full.html', access: 'public'})
//            .when("/company", {
//                templateUrl: '/views/companies/company.html',
//                access: 'jobProvider',
//                resolve: {
//                    mode: function () {
//                        return "DASHBOARD";
//                    }
//                }
//            })
            .when("/content_manager/:contentType?", { templateUrl: '/views/admin/dashboard.html', access: 'jobProvider' })
            .when("/companies", { templateUrl: '/views/jobs/job-board.html', access: 'jobSeeker' })
            .when('/user_details', { templateUrl: '/views/users/user.html', access: 'jobSeeker' })
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
                        if (response.status === 401) {
                            $location.url('/login');
                        }
                        return $q.reject(response);
                    }
                );
            }
        });

        //================================================
        // Add an interceptor for handling session time out - redirect to login when access denied
        //================================================
        $httpProvider.interceptors.push(function ($rootScope, $q, $location) {
            return {
                'responseError': function (response) {
                    if ((response.status === 401 || response.status === 403) && $location.path() !== '/login') {
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        });
    }])
    .run(function ($rootScope, $route, $location, authService) {
        $rootScope.$on('$routeChangeStart', function (ev, next, current) {
            // We need the path component of `next`. We can either process `next` and
            // spit out its path component, or simply use $location.path(). I go with
            // the latter.
//            var nextPath = $location.path();
//            var nextRoute = $route.routes[nextPath]
//
//            console.log(nextRoute.access); // There you go!

// ---------------------------------------------------------------

            //noinspection JSUnresolvedVariable
            if (!authService.isAuthorize(next.access)) {
                console.log("Seems like you tried accessing a route you don't have access to...");
//                $rootScope.error = "Seems like you tried accessing a route you don't have access to...";
//                event.preventDefault();

//                if(fromState.url === '^') {
//                    if(Auth.isLoggedIn()) {
//                        $state.go('user.home');
//                    } else {
//                        $rootScope.error = null;
//                        $state.go('anon.login');
//                    }
//                }
            }
        });
    });

// a Fix for holder
//app.directive('bsHolder', [function () {
//    return {
//        link: function (scope, element, attrs) {
//            Holder.run(element);
//        }
//    };
//}]);

