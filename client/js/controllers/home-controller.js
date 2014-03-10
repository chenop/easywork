'use strict';

var SEARCH_BUTTON_STR = 'חפש';

var homeController = angular.module('easywork.controllers.home', ['ui.select2',
    'easywork.services.appManager', 'easywork.services.dataManager']);

homeController.controller('homeCtrl', ['$scope', '$http', '$location', 'appManager', 'dataManager',
    function ($scope, $http, $location, appManager, dataManager) {
        appManager.setDisplaySearchBarInHeader(false);

        $scope.dataManager = dataManager;
        $scope.appManager = appManager;
        $scope.searchButtonLabel = SEARCH_BUTTON_STR;

        dataManager.getFiltersData()
            .success(function (result) {
                $scope.areas = result.areas;
                $scope.technologies = result.technologies;
            }
        );

        $scope.technologies_select2Options = dataManager.getTechnologiesSelect2Options();
        $scope.areas_select2Options = dataManager.getAreasSelect2Options();

        $scope.search = function () {
            $location.path('/companies');
        }
    }
]);


