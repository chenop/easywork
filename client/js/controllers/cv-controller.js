/**
 * Created by Chen.Oppenhaim on 5/18/2016.
 */

angular.module('easywork').controller('cvDetailsCtrl', function ($scope, appManager, dataManager, $stateParams, FileSaver, Blob, $sce, cvService) {
    $scope.cv = appManager.getSelectedEntity();
});
