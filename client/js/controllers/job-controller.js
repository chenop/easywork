/**
 * Created by Chen on 17/03/14.
 */

angular.module('easywork')
    .controller('JobCtrl', function ($scope, dataManager, common, appManager, $timeout) {
        $scope.job = appManager.getSelectedEntity();

        $scope.addJob = function () {
            var activeUserId = appManager.getActiveUserId();
            var job = {
                name: "Untitled",
                userId: activeUserId,
                code: "",
                description: ""
            };

            dataManager.createEntity(common.CONTENT_TYPE.JOB, job)
                .success(function (entity) {
                    $scope.$emit('dataChanged', entity);
                });

        }

        $scope.$on('listSelectionChanged', function (event, selectedEntity) {
            $scope.job = selectedEntity;
            $timeout(function () {
                $('#jobName').select();
            }, 100);
        });

        $scope.updateJob = function (event) {
            dataManager.updateJob($scope.job)
                .success(function (entity) {
                    $scope.$emit('dataChanged', entity);
                });
        }
    }
);




