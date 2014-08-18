/**
 * Created by Chen on 17/03/14.
 */

angular.module('easywork')
    .controller('JobCtrl', function ($scope, dataManager, common, appManager, $timeout) {



        function refreshJob(selectedEntity) {
            if (selectedEntity == null)
                return;

            $scope.job = selectedEntity;
            $timeout(function () {
                $('#jobName').select();
            }, 100);
        }

        refreshJob(appManager.getSelectedEntity());
        $scope.$on('selectionChanged', function (event, selectedEntity) {
            refreshJob(selectedEntity);
        })

        dataManager.getFiltersData()
            .success(function (result) {
                $scope.technologies = result.technologies;
            }
        );

        $scope.technologies_select2Options = {
            'multiple': true,
            'width': '83.33333%'
        };

        $scope.createJob = function () {
            var company = appManager.getActiveCompanyId();
            var job = {
                name: "Untitled",
                company: company,
                code: "",
                city: '',
                technologies: '',
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




