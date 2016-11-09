angular.module('easywork')
    .controller('EmptyCtrl', function ($scope, authService, appManager, dataManager, common, $state) {
        $scope.addEntity = function () {
            var contentType = appManager.getCurrentContentType();
            appManager.createEmptyEntity(contentType.name)
                .then(function (result) {
                    $state.go("dashboard.list", {
                        "contentTypeValue": contentType.name,
                        "selectedEntityId": result.data._id
                    });
                })
        }
    });