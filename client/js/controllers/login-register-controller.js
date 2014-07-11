'use strict';
/**
 * Created by Chen on 06/06/2014.
 */
angular.module('easywork')
    .controller('LoginRegisterCtrl', function ($scope, $modalInstance, selectedTab) {
    $scope.tabs = [
        {title: 'Login', template: '/views/users/login.html', active:false},
        {title: 'Register', template: '/views/users/register.html', active:false}
    ];

    $scope.tabs[selectedTab].active = true;
    $scope.modIns = $modalInstance;
});


