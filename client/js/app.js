'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('fantasyApp',
  [
   'fantasyApp.controllers.header'
  , 'fantasyApp.controllers.signin'
  , 'fantasyApp.controllers.signup'
  , 'companyListModule'
  , 'userDetailsModule'
  , 'firebase'
    , 'ui.bootstrap', 'ngRoute', 'ngAnimate']
  );

app.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/',                        { templateUrl: '/views/default.html' })
        .when('/signin',                  { templateUrl: '/views/users/signin.html' })
        .when('/signup',                  { templateUrl: '/views/users/signup.html' })
        .when("/companies",               { templateUrl: '/views/companies/list.html' })
        .when('/user_details',            { templateUrl: '/views/users/details.html' })
        .otherwise(                       { redirectTo: '/' });

      $locationProvider.html5Mode(true);
    }])

//  establish authentication
  .run(['angularFireAuth', 'FBURL', '$rootScope',
    function (angularFireAuth, FBURL, $rootScope) {
      angularFireAuth.initialize(new Firebase(FBURL), {scope: $rootScope, name: 'auth', path: '/signin'});
      $rootScope.FBURL = FBURL;
    }])

  // your Firebase URL goes here
  .constant('FBURL', 'https://chenop-firebase-tutorial.firebaseio.com/');

