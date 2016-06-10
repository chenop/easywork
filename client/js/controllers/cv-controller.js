/**
 * Created by Chen.Oppenhaim on 5/18/2016.
 */

angular.module('easywork').controller('cvDetailsCtrl', function ($scope, appManager, dataManager, $stateParams, FileSaver, Blob) {
    var selectedEntity = appManager.getSelectedEntity();
    var entityId = $stateParams.entityId;
    refreshUser(selectedEntity);

    function refreshUser(selectedEntity) {
        if (selectedEntity == null)
            return;

        $scope.cv = selectedEntity;
    };

    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    $scope.downloadCv = function () {
        dataManager.getCv(entityId)
            .then(function(cv) {
                var blob = b64toBlob(cv.fileDataBase64, cv.fileType);
                FileSaver.saveAs(blob, cv.fileName);
            })
    }
});
