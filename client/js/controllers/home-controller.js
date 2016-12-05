'use strict';

var SEARCH_BUTTON_STR = 'חפש חברות';

angular.module('easywork')
    .controller('homeCtrl', function ($scope, $http, $location, appManager, dataManager, $stateParams, authService ) {
        appManager.setDisplaySearchBarInHeader(false);
        if ($stateParams.token)
            authService.handleNewToken($stateParams.token, true);

        $scope.dataManager = dataManager;
        $scope.appManager = appManager;
        $scope.searchButtonLabel = SEARCH_BUTTON_STR;

        dataManager.getFiltersData()
            .then(function(result) {
                $scope.areas = result.data.areas;
                $scope.technologies = result.data.technologies;
            });

        $scope.search = function () {
            $location.path('/company-board');
        }
    }
);


