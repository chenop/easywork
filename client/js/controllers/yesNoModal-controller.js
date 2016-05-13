/**
 * Created by Chen on 13/05/2016.
 */

angular.module('easywork').controller('YesNoModalCtrl', function ($scope, $uibModalInstance, common, text) {

    $scope.text = text;

    $scope.onYes = function () {
        $uibModalInstance.close(common.MODAL_RESULT.YES);
    };

    $scope.onNo = function () {
        $uibModalInstance.close(common.MODAL_RESULT.NO);
    };
});