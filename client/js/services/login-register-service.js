/**
 * Created by Chen on 11/09/2014.
 */

angular.module('easywork')
    .factory('loginRegisterService', function ($rootScope) {

        var activeTab = 0;

        var getActiveTab = function () {
            return activeTab;
        };

        var changeTab = function(newActiveTab) {
            $rootScope.$emit('tabChanged', newActiveTab);
        }
        return {
            changeTab: changeTab
        }
    });
