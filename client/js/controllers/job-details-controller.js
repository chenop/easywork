'use strict';

angular.module('easywork')
    .controller('JobDetailsCtrl', function ($scope, $http, dataManager, data) {
        $scope.company = data.company;
        $scope.requiredSkill = data.requiredSkill;

        dataManager.getJobsBySkill($scope.requiredSkill,$scope.company._id).
            then(function (data) {
                console.log($scope.requiredSkill);
                if (data && data.data && data.data.length > 0 && data.data[0].name) {
                    $scope.job = data.data[0];
                }
                else {
                    console.log('company was not found');
                }
            });
    });