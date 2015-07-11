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
    .controller('JobCtrl', function ($scope, dataManager, common, appManager, $timeout, $stateParams, $rootScope) {

        init();

        function init() {
            var entityId = $stateParams.entityId;
            $scope.job = appManager.getSelectedEntity();
            refreshJob($scope.job);
            dataManager.getFiltersData()
                .then(function (result) {
                    $scope.technologies = result.data.technologies
                });

            dataManager.getCompanies().then(function(result) {
                $scope.companies = result;
            });

            if ($scope.job && $scope.job.company) {
                $scope.jobCompanyId = $scope.job.company._id;
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

        $scope.technologies_select2Options = {
            'multiple': true,
            'width': '83.33333%'
        };

        $scope.select2Options = {
            width: '83.33333%',
            minimumResultsForSearch: -1 // Disable the search field in the combo box
        };


        $scope.updateJob = function () {
            $scope.job.company = $scope.jobCompanyId; // Update the selected company;
            dataManager.updateJob($scope.job)
                .success(function (entity) {
                    $scope.$emit('dataChanged', entity);
                });
        }

        $scope.deleteJob = function () {
            $scope.$emit('deleteEntityClicked', appManager.getSelectedEntity());
        }

        $scope.isRelevant = function(user) {
            if ($rootScope.isEmpty($scope.job.technologies))
                return true;

            var matchesCounter = 0;

            for (var i = 0; i < $scope.job.technologies.length; i++) {
                var skill = $scope.job.technologies[i];

                if (user.skills && user.skills.contains(skill))
                    matchesCounter++;
            }
            return (matchesCounter === $scope.job.technologies.length )
        }
    }
);




