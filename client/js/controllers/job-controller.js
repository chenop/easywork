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
            });

            if ($scope.job && $scope.job.company) {
                $scope.jobCompanyId = $scope.job.company;
            }

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

        $scope.skill_select2Options = {
            'multiple': true,
            'width': '83.33333%'
        };

        $scope.select2Options = {
            width: '83.33333%',
            minimumResultsForSearch: -1 // Disable the search field in the combo box
        };

        var debounceUpdateJob = debounce(function() {
            $scope.job.company = $scope.jobCompanyId; // Update the selected company;
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




