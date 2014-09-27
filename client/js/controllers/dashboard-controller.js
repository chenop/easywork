/**
 * Created by Chen on 29/03/14.
 */

angular.module('easywork')
    .controller('DashboardCtrl', function ($scope, authService, appManager, dataManager, common, $state, $stateParams) {

        appManager.setDisplaySearchBarInHeader(false);
        $scope.contentTypeSelected = function(newContentTypeName) {
            $scope.contentType = getContentType(newContentTypeName);

            $state.go("dashboard.list", {
                "contentTypeName": newContentTypeName
                , "selectedEntityId" : '-1'
            });
        }

        var contentTypeName = $stateParams.contentTypeName;
        $scope.contentTypeSelected(contentTypeName);

        $scope.select2Options = dataManager.getDashboardSelect2Options();

        $scope.addEntity = function() {
            dataManager.createEmptyEntity($scope.contentType.name)
                .then(function (result) {
                    $state.go("dashboard.list", {
                        "contentTypeName": $scope.contentType.name
                        , "selectedEntityId" : result.data._id
                    });
                })
        }

        function getContentType(contentTypeName) {
            switch(contentTypeName) {
                case common.CONTENT_TYPE.COMPANY.name:
                    return common.CONTENT_TYPE.COMPANY;
                case common.CONTENT_TYPE.JOB.name:
                    return common.CONTENT_TYPE.JOB;
                case common.CONTENT_TYPE.USER.name:
                    return common.CONTENT_TYPE.USER;
            }
        }
    }
);
