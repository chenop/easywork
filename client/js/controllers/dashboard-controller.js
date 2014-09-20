/**
 * Created by Chen on 29/03/14.
 */

angular.module('easywork')
    .controller('DashboardCtrl', function ($scope, authService, appManager, dataManager, common, $state) {

        appManager.setDisplaySearchBarInHeader(false);
        $scope.contentTypeSelected = function(newContentTypeValue) {
            $scope.contentTypeValue = newContentTypeValue;

            $state.go("dashboard.list", {
                "contentTypeValue": $scope.contentTypeValue
                , "selectedEntityId" : '-1'
            });
        }

        $scope.contentTypeSelected(common.CONTENT_TYPE.COMPANY.value)

        $scope.select2Options = dataManager.getDashboardSelect2Options();

        $scope.addEntity = function() {
            dataManager.createEmptyEntity($scope.contentTypeValue)
                .then(function (result) {
                    $state.go("dashboard.list", {
                        "contentTypeValue": $scope.contentTypeValue
                        , "selectedEntityId" : result.data._id
                    });
                })
        }
    }
);
