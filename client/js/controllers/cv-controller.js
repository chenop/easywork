/**
 * Created by Chen.Oppenhaim on 5/18/2016.
 */

angular.module('easywork').controller('cvDetailsCtrl', function ($scope, appManager, $stateParams, $window) {
    var selectedEntity = appManager.getSelectedEntity();
    var entityId = $stateParams.entityId;
    refreshUser(selectedEntity);

    function refreshUser(selectedEntity) {
        if (selectedEntity == null)
            return;

        $scope.cv = selectedEntity;
    };

    $scope.downloadCv = function () {
        var anchor = angular.element('<a/>');
        anchor.attr({
            href: 'data:attachment/doc;charset=utf-8,' + encodeURI(selectedEntity.data),
            target: '_blank',
            download: 'filename.doc'
        })[0].click();

        //var data = 'some data here...',
        //    blob = new Blob([selectedEntity.data]),
        //    url = $window.URL || $window.webkitURL;
        //var objectURL = url.createObjectURL(blob);
        //window.open(objectURL);
    }
});
