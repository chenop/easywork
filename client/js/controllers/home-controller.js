'use strict';

var SEARCH_BUTTON_STR = 'חפש';

angular.module('easywork')
    .controller('homeCtrl', ['$scope', '$http', '$location', 'appManager', 'dataManager',
    function ($scope, $http, $location, appManager, dataManager) {
        appManager.setDisplaySearchBarInHeader(false);

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
]);


