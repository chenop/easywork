/**
 * Created by Chen.Oppenhaim on 5/18/2016.
 */

angular.module('easywork').controller('cvDetailsCtrl', function ($scope, appManager, $stateParams) {
        var selectedEntity = appManager.getSelectedEntity();
        var entityId = $stateParams.entityId;
        refreshUser(selectedEntity);

        function refreshUser(selectedEntity) {
            if (selectedEntity == null)
                return;

            $scope.cv = selectedEntity;
        }
    }
);
