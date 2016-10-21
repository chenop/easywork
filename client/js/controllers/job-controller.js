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

        function init() {
            var entityId = $stateParams.entityId;
            $scope.job = appManager.getSelectedEntity();
            refreshJob($scope.job);
            dataManager.getFiltersData()
                .then(function (result) {
                    $scope.skills = result.data.skills
                });

            dataManager.getCompanies().then(function(result) {
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
        }

        function refreshJob(selectedEntity) {
            if (selectedEntity == null)
                return;

            $scope.job = selectedEntity;
            $timeout(function () {
                $('#jobName').select();
            }, 100);
        }

        var debounceUpdateJob = debounce(function() {
            $scope.job.company = $scope.jobCompany._id; // Update the selected company;
            return dataManager.updateJob($scope.job)
                .success(function (entity) {
                    $scope.$emit('dataChanged', entity);
                });
        }, 300, false);

        $scope.updateJob = function () {
            debounceUpdateJob();
        }

        $scope.deleteJob = function () {
            //appManager.deleteJob
            $scope.$emit('deleteEntityClicked', appManager.getSelectedEntity());
        }

        // TODO continue from here - isRelevant?!?!? - should be done in server!!! are you fetching all users!!?!?!?!?
        // TODO for every change in skills display the relevant users with limit!!!
        // TODO Implement getCandidates(filter)
        $scope.isRelevant = function(user) {
            if ($rootScope.isEmpty($scope.job.skills))
                return true;

            var matchesCounter = 0;

            for (var i = 0; i < $scope.job.skills.length; i++) {
                var skill = $scope.job.skills[i];

                if (user.skills && user.skills.contains(skill))
                    matchesCounter++;
            }
            return (matchesCounter === $scope.job.skills.length )
        }
    }
);




