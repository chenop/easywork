'use strict';

angular.module('easywork')
    .controller('JobFullCtrl', function ($scope, $http, job) {
        $scope.job = job;
    });