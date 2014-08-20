'use strict';


angular.module('easywork')
    .controller('JobsBoardCtrl', function ($scope, $http, mailService, dataManager, appManager, $modal) {
        dataManager.getAllJobs().then(function(jobs) {
            $scope.jobs = jobs.data;
            angular.forEach($scope.jobs, function(job, key) {
                // TODO not ideal... why i dont have the image from the first call?
                dataManager.getCompanyLogo(job.company._id, job.company)
                    .then(function(data) {
                        if (job.company.logo === undefined) {
                            job.company.logo = {};
                        }
                        job.company.logo.data = data;
                    })
            })
        })

        appManager.setDisplaySearchBarInHeader(true);

        appManager.disableSend = false;

        $scope.$watch('jobs|filter:{selected:true}', function (nv) {
            if (nv === undefined) {
                return;
            }
            var selection = nv.map(function (job) {
                return job;
            });
            appManager.setSelection(selection);
        }, true);

        // watch the selectAll checkBox for changes
        $scope.shouldSelectAll = null;
        $scope.$watch('shouldSelectAll', function () {
            if ($scope.jobs === undefined) {
                return;
            }
            for (var i = 0; i < $scope.jobs.length; i++) {
                $scope.jobs[i].selected = $scope.shouldSelectAll;
            }
        }, true);

        $scope.isRelevant = function (job) {
            if ((appManager.selectedAreas.length === 0) && (appManager.selectedTechnologies.length === 0))
                return true;
            return (appManager.selectedAreas.indexOf(job.city) >= 0 && (superbag(job.technologies, appManager.selectedTechnologies)));
        };

        // TODO - This check can be optimize - like sorting alphabetically or do hash-mapping of first letter (hash['i'] -> ['Intel']'.
        function superbag(superSet, subSet) {
            if (superSet == undefined || subSet == undefined)
                return true;
            if (subSet.length == 0)
                return true;
            var i, j;
            for (i = 0; i < subSet.length; i++) {
                for (j = 0; j < superSet.length; j++) {
                    if (subSet[i] == superSet[j])
                        return true;
                }
            }
            return false;
        }

        $scope.search = function () {
            console.log("search, disable:" + appManager.disableSend);

            mailService.sendMail(appManager.selection);
        }

        $scope.toggleSelected = function (company) {
            var selected = company.selected;
            if (selected == undefined || selected == false) {
                company.selected = true;
            }
            else {
                company.selected = false;
            }
        }

        $scope.showDetails = function (job) {
            var modalInstance = $modal.open({
                templateUrl: '/views/jobs/job-full.html',
                controller: 'JobFullCtrl',
                windowClass: 'job-full-dialog',
                resolve: {
                    job: function() {
                        return job;
                    }
                }

            });

            modalInstance.result.then(function (username) {
                if (username != undefined)
                    console.log('User: ' + username + ' has logged in');
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
    }
);

