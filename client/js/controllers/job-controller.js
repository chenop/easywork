/**
 * Created by Chen on 17/03/14.
 */

Array.prototype.contains = function(elm) {
    for ( var i = 0, _len = this.length; i < _len; i++ ) {
        if (this[i].toUpperCase() === elm.toUpperCase())
            return true;
    }
    return false;
}

angular.module('easywork')
    .controller('JobCtrl', function ($scope, dataManager, common, appManager, $timeout, $stateParams, $rootScope, debounce) {

        init();

        function refreshJob(selectedEntity) {
            if (selectedEntity == null)
                return;

            $scope.job = selectedEntity;
            $timeout(function () {
                $('#jobName').select();
            }, 100);
        }

        var debounceUpdateJob = debounce(function() {
            if (!$scope.jobCompany || !$scope.jobCompany._id)
                return;

            $scope.job.company = $scope.jobCompany._id; // Update the selected company;
            return dataManager.updateJob($scope.job)
                .then(function (entity) {
                    $scope.$emit('dataChanged', entity);
                });
        }, 300, false);

        $scope.updateSkill = function() {
            $scope.updateJob();
            getCvs();
        }
        $scope.updateJob = function () {
            debounceUpdateJob();
        }

        $scope.deleteJob = function () {
            //appManager.deleteJob
            $scope.$emit('deleteEntityClicked', appManager.getSelectedEntity());
        }

        function getCvs() {
            if (!$scope.job || !$scope.job.skills || $scope.job.skills.length === 0) {
                $scope.candidateTitle = "אין מועמדים";
                return;
            }

            $scope.candidateTitle = "המתן...";
            return dataManager.getCvs($scope.job.skills)
                .then(function (cvs) {
                    if (!cvs || cvs.length === 0) {
                        $scope.candidateTitle = "אין מועמדים";
                        cvs = {};
                    }
                    else
                        $scope.candidateTitle = "מועמדים " + cvs.length;
                    $scope.cvs = cvs;
                });
        }

        function init() {
            $scope.job = appManager.getSelectedEntity();
            refreshJob($scope.job);
            dataManager.getFiltersData()
                .then(function (result) {
                    $scope.skills = result.data.skills
                });

            dataManager.getCompanies()
                .then(function (result) {
                    $scope.companies = result;

                    if ($scope.job) {
                        var filteredArray = $scope.companies.filter(function (company) {
                            return company._id === $scope.job.company;
                        });

                        if (filteredArray.length === 1) {
                            $scope.jobCompany = filteredArray[0];
                        }
                    }
                });

            dataManager.getUsers()
                .then(function(users) {
                    $scope.users = users;
                });

            getCvs();
        }

    }
);




