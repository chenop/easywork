/**
 * Created by Chen on 17/03/14.
 */

angular.module('easywork')
    .controller('JobCtrl', function ($scope, dataManager, common, appManager, $timeout) {


        appManager.addSelectionChangedListener(function (selectedEntity) {
            $timeout(function () {
                // Using timeout since we want to this to happen after the initialization of the dataManager.getUser()...
                // I know... not the best practice ever...
                $scope.job = selectedEntity;
                $timeout(function () {
                    $('#jobName').select();
                }, 100);

            })
        })
//        $scope.$on('listSelectionChanged', function (event, selectedEntity) {
//            $scope.job = selectedEntity;
//            $timeout(function () {
//                $('#jobName').select();
//            }, 100);
//        });

        $scope.createJob = function () {
            var company = appManager.getActiveCompanyId();
            var job = {
                name: "Untitled",
                company: company,
                code: "",
                description: ""
            };

            dataManager.createEntity(common.CONTENT_TYPE.JOB, job)
                .success(function (entity) {
                    $scope.$emit('dataChanged', entity);
                    $scope.job = entity;
                    $timeout(function () {
                        $('#jobName').select();
                    }, 100);
                });
        }

        $scope.updateJob = function (event) {
            dataManager.updateJob($scope.job)
                .success(function (entity) {
                    $scope.$emit('dataChanged', entity);
                });
        }

        $scope.deleteJob = function () {
            $scope.$emit('deleteEntityClicked', appManager.getSelectedEntity());
        }

    }
);




