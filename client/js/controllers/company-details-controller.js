'use strict';

angular.module('easywork')
    .controller('CompanyDetailsCtrl', function ($scope, $http, company) {
        $scope.company = company;
    });