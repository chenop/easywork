/**
 * Created by Chen.Oppenhaim on 5/18/2016.
 */

angular.module('easywork').controller('cvDetailsCtrl', function ($scope, appManager, dataManager, $stateParams, FileSaver, Blob, $sce, cvService) {
    var selectedEntity = appManager.getSelectedEntity();
    var entityId = $stateParams.entityId;
    $scope.url = "http://docs.google.com/gview?url=http://easywork.herokuapp.com/api/cv/download/" + entityId + "&embedded=true";

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

    refreshUser(selectedEntity);

    function refreshUser(selectedEntity) {
        if (selectedEntity == null)
            return;

        $scope.cv = selectedEntity;
    };

    $scope.refreshSkills = function() {
        $scope.isLoading = true;
        dataManager.analyzeCv($scope.cv.id)
            .then(function (cv) {
                $scope.cv.skills = cv.skills;
                $scope.isLoading = false;
            })
    }

    $scope.downloadCv = function () {
        dataManager.getCv(entityId)
            .then(function(cv) {
                var blob = cvService.convertBase64ToBlob(cv.fileData, cv.fileType);
                FileSaver.saveAs(blob, cv.fileName);
            })
    }
});
