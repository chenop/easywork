'use strict';

angular.module('easywork')
    .filter("linkFixer", function () {
        var startWith = function (str, startString) {
            if (!str)
                return;
            return str.indexOf(startString) == 0;
        };

        return function (link) {
            var result;
            var startingUrl = "http://";
            if (startWith(link, "www")) {
                result = startingUrl + link;
            } else {
                result = link;
            }
            return result;
        }
    })
    .directive('stopPropagation', function() {
        return function(scope, element, attrs) {
            $(element).click(function(event) {
                event.stopPropagation();
            });
        }
    })
    .controller('CompaniesBoardCtrl', function ($scope, $http, mailService, dataManager, appManager, $uibModal, utils) {
        var prepareFormattedLocation = function (location) {
            if (!utils.isEmpty(location.street) && !utils.isEmpty(location.city)) {
                return (location.street + ", " + location.city);
            }

            if (!utils.isEmpty(location.city)) {
                return location.city;
            }

            if (!utils.isEmpty(location.street)) {
                return location.street;
            }
        };

        $scope.isLoading = true;
        dataManager.getCompanies(true).then(function (companies) {
            $scope.companies = companies;
            angular.forEach($scope.companies, function (company, key) {

                angular.forEach(company.locations, function(location) {
                    location.formattedLocation = prepareFormattedLocation(location);
                })
            });
            $scope.isLoading = false;
        });

        appManager.setDisplaySearchBarInHeader(true);
        appManager.disableSend = false;

        $scope.$watch('companies|filter:{selected:true}', function (nv) {
            if (nv === undefined) {
                return;
            }
            var selection = nv.map(function (company) {
                return company;
            });
            appManager.setSelectedCompanies(selection);
        }, true);

        // watch the selectAll checkBox for changes
        $scope.isSelectAll = false;
        $scope.$watch('isSelectAll', function () {
            if ($scope.companies === undefined) {
                return;
            }
            for (var i = 0; i < $scope.companies.length; i++) {
                var company = $scope.companies[i];
                if (!$scope.isRelevant(company))
                    continue;

                company.selected = $scope.isSelectAll;
            }
        }, true);

        function isAreaMatch(company) {
            for (var i = 0; i < company.locations.length; i++) {
                var location = company.locations[i];

                if (appManager.selectedAreas.indexOf(location.city) >= 0)
                    return true;
            }
            return false;
        }

        $scope.isRelevant = function (company) {
            if ((appManager.selectedAreas.length === 0) && (appManager.selectedTechnologies.length === 0))
                return true;

            return isAreaMatch(company);
            //var isTechMatch = (superbag(company.technologies, appManager.selectedTechnologies));

            //if (isAreasMatch && appManager.selectedTechnologies.length === 0)
            //    return true;
            //if (isTechMatch && appManager.selectedAreas.length === 0)
            //    return true;
            //
            //return (isAreasMatch && isTechMatch);
        };

        // TODO - This check can be optimize - like sorting alphabetically or do hash-mapping of first letter (hash['i'] -> ['Intel']'.
        function superbag(superSet, subSet) {
            if (superSet == undefined || subSet == undefined)
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

        $scope.toggleSelected = function (company) {
            var selected = company.selected;
            if (selected == undefined || selected == false) {
                company.selected = true;
            }
            else {
                company.selected = false;
            }
        }

        $scope.toggleSelectAll = function () {
            $scope.isSelectAll = !($scope.isSelectAll)
        }

        $scope.showJobDetails = function (job, event) {
            // Do not propagate the event to the table
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }
            var modalInstance = $uibModal.open({
                templateUrl: '/views/companies/company-details.html',
                controller: 'CompanyDetailsCtrl',
                windowClass: 'company-details-dialog',
                resolve: {
                    company: function() {
                        return company;
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

        $scope.showDetails = function (company, event) {
            // Do not propagate the event to the table
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }
            var modalInstance = $uibModal.open({
                templateUrl: '/views/companies/company-details.html',
                controller: 'CompanyDetailsCtrl',
                windowClass: 'company-details-dialog',
                resolve: {
                    company: function() {
                        return company;
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

