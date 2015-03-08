'use strict';

angular.module('easywork')
    .controller('LogoGalleryCtrl', function ($scope, $http, company) {
        $scope.company = company;
    });