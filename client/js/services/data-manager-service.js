/**
 * Created by Chen on 06/03/14.
 */

angular.module('easywork.services.dataManager', [])
    .factory('dataManager', function ($http) {

        var getFiltersData = function () {
            return $http.get('./api/filtersData/');
        }

        var getService = function() {
            return service;
        }

        var getTechnologiesSelect2Options = function() {
            return {
                'multiple': true
            };
        }

        var getAreasSelect2Options = function() {
            return {
                'multiple': true
            };
        }

        return {
            getFiltersData: getFiltersData
            , getTechnologiesSelect2Options: getTechnologiesSelect2Options
            , getAreasSelect2Options: getAreasSelect2Options
            , getService: getService
        }
    }
);



