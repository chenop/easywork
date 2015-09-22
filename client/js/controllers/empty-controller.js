angular.module('easywork')
    .controller('EmptyCtrl', function ($scope, authService, appManager, dataManager, common, $state) {
        $scope.addEntity = function () {
            var contentType = appManager.getCurrentContentType();
            dataManager.createEmptyEntity(contentType.name)
                .then(function (result) {
                    $state.go("dashboard.list", {
                        "contentTypeValue": contentType.name,
                        "selectedEntityId": result.data._id
                    });
                })
        }
    });