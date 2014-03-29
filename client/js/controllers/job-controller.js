/**
 * Created by Chen on 17/03/14.
 */

angular.module('easywork.controllers.companies')
    .controller('jobCtrl', function ($scope, authService, $modalInstance, company, job) {
        $scope.job = job;
        $scope.company = company;

        $scope.close = function () {
            $modalInstance.dismiss('closed');
        }; // end close
    }
);




