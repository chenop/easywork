/**
 * Created by Chen on 29/03/14.
 */

angular.module('easywork')
    .controller('DashboardCtrl', function ($scope, authService, appManager, dataManager, common, $state) {

        appManager.setDisplaySearchBarInHeader(false);
        $scope.contentTypeSelected = function(newContentTypeValue) {
            $scope.contentType = getContentType(newContentTypeValue);

            $state.go("dashboard.list", {
                "contentTypeName": $scope.contentType.name
                , "selectedEntityId" : '-1'
            });
        }

        $scope.contentTypeSelected(common.CONTENT_TYPE.COMPANY.value)

        $scope.select2Options = dataManager.getDashboardSelect2Options();

        $scope.addEntity = function() {
            dataManager.createEmptyEntity($scope.contentTypeValue)
                .then(function (result) {
                    $state.go("dashboard.list", {
                        "contentTypeName": $scope.contentType.name
                        , "selectedEntityId" : result.data._id
                    });
                })
        }

        function getContentType(contentTypeValue) {
            switch(contentTypeValue) {
                case common.CONTENT_TYPE.COMPANY.value:
                    return common.CONTENT_TYPE.COMPANY;
                case common.CONTENT_TYPE.JOB.value:
                    return common.CONTENT_TYPE.JOB;
                case common.CONTENT_TYPE.USER.value:
                    return common.CONTENT_TYPE.USER;
            }
        }
    }
);
