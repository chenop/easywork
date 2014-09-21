angular.module('easywork')
    .controller('EmptyCtrl', function ($scope, authService, appManager, dataManager, common, $state) {
        $scope.addEntity = function () {
            var contentType = appManager.getCurrentContentType();
            dataManager.createEmptyEntity(contentType.value)
                .then(function (result) {
                    $state.go("dashboard.list", {
                        "contentTypeValue": contentType.value, "selectedEntityId": result.data._id
                    });
                })
        }
    });