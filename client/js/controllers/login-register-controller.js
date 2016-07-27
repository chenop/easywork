'use strict';
/**
 * Created by Chen on 06/06/2014.
 */
angular.module('easywork')
    .controller('LoginRegisterCtrl', function ($scope, $uibModalInstance, selectedTab, loginRegisterService, $rootScope) {
        $scope.tabs = [
            {title: 'כניסה', template: '/views/users/login.html', active: false},
            {title: 'הרשמה', template: '/views/users/register.html', active: false}
        ];

        $scope.activeTab = selectedTab;
        loginRegisterService.activeTab = selectedTab;

        $rootScope.$on('tabChanged', function (event, selectedTab) {
            $scope.activeTab = selectedTab;
        })
        $scope.modIns = $uibModalInstance;
    });


