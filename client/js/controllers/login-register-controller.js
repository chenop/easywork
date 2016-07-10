'use strict';
/**
 * Created by Chen on 06/06/2014.
 */
angular.module('easywork')
    .controller('LoginRegisterCtrl', function ($scope, $uibModalInstance, selectedTab) {
    $scope.tabs = [
        {title: 'כניסה', template: '/views/users/login.html', active:false},
        {title: 'הרשמה', template: '/views/users/register.html', active:false}
    ];

    $scope.activeTab = selectedTab;
    $scope.modIns = $uibModalInstance;
});


