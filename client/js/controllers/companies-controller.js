'use strict';


var companiesController = angular.module('easywork.controllers.companies', ['ui.select2', 'easywork.services.mail', 'easywork.services.appManager']);

companiesController.controller('CompanyListCtrl', ['$scope', '$http', 'mailService', 'appManager', '$modal',
    function ($scope, $http, mailService, appManager, $modal) {
        getCompanies().then(function (result) {
            $scope.companies = result.data;
        });

        appManager.setDisplaySearchBarInHeader(true);

        appManager.disableSend = false;

        $scope.title = "Companies List";

        $scope.$watch('companies|filter:{selected:true}', function (nv) {
            if (nv == undefined)
                return;
            var selection = nv.map(function (company) {
                return company;
            });
            appManager.setSelection(selection);
        }, true);

// watch the selectAll checkBox for changes
        $scope.$watch('shouldSelectAll', function () {
            if ($scope.companies == undefined)
                return;
            for (var i = 0; i < $scope.companies.length; i++) {
                $scope.companies[i].selected = $scope.shouldSelectAll;
            }
        }, true);

        $scope.isRelevant = function (company) {
            return (superbag(company.addresses, appManager.selectedAreas) && superbag(company.technologies, appManager.selectedTechnologies));
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

        function getCompanies() {
            return $http.get('/api/companies');
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

        $scope.showDetails = function (company) {
            var job = {
                title: "Job of your life"
                , description: "Doing nothing...."
            }
            var modalInstance = $modal.open({
                templateUrl: '/views/jobs/job.html',
                controller: 'jobCtrl',
                resolve: {
                    company: function() {
                        return company;
                    },
                    job: function() {
                        return job;
                    }
                }

            });

            modalInstance.result.then(function (username) {
                console.log('User: ' + username + ' has logged in');
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }
    }
]
);

