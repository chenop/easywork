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

        appManager.addSelectionChangeListener(function (selectedEntity) {
            dataManager.getJob(selectedEntity._id).
                success(function (data, status, header, config) {
                    $scope.job = data;
                    $timeout(function () {
                        $('#jobName').select();
                    }, 100);
                }).
                error(function (data, status, header, config) {
                    $scope.job = {};
                });
        })

        $scope.updateJob = function (event) {
            dataManager.updateJob($scope.job)
                .success(function (entity) {
                    $scope.$emit('dataChanged', entity);
                });
        }
    }
);




