/**
 * Created by Chen.Oppenhaim on 5/14/2016.
 */

angular.module("easywork")
.controller("unsubscribeController", function($stateParams, dataManager, $scope) {
    var companyId = $stateParams.companyId;

    dataManager.getCompany(companyId)
        .then(function(company) {
            if (!company || !company.name)
                $scope.companyName = 'Company';
            else
                $scope.companyName = company.name;
        })

    dataManager.setPublish(companyId, false);
});