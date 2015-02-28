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
    .controller('CompaniesBoardCtrl', function ($scope, $http, mailService, dataManager, appManager, $modal) {
        function setLogo(company, data) {
            if ((typeof company.logo === 'undefined') || company.logo === null) {
                company.logo = {};
            }
            company.logo.data = data;
        }

        function setEmptyLogo(company) {
            setLogo(company, 'http://placehold.it/150x150.jpg&text=Logo..');
            company.logo.shape = 'round';
        }

        dataManager.getAllCompanies().then(function (companies) {
            $scope.companies = companies.data;
            angular.forEach($scope.companies, function (company ) {
                if (company.isLogoExists) {
                    dataManager.getCompanyLogo(company._id, company)
                        .then(function (data) {
                            setLogo(company, data);
                        })
                }
                else {
                    setEmptyLogo(company);
                }
            });
        });

        appManager.setDisplaySearchBarInHeader(true);

        appManager.disableSend = false;

        $scope.isLogoExists = function(company) {
            return company.logo && company.logo.data && company.logo.data.length > 0;
        }

        $scope.$watch('companies|filter:{selected:true}', function (nv) {
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
            if ($scope.companies === undefined) {
                return;
            }
            for (var i = 0; i < $scope.companies.length; i++) {
                $scope.companies[i].selected = $scope.shouldSelectAll;
            }
        }, true);

        function isAreaMatch(company) {
            for (var i = 0; i < company.addresses.length; i++) {
                var address = company.addresses[i];

                if (appManager.selectedAreas.indexOf(address) >= 0)
                    return true;
            }
            return false;
        }

        $scope.isRelevant = function (company) {
            if ((appManager.selectedAreas.length === 0) && (appManager.selectedTechnologies.length === 0))
                return true;

            var isAreasMatch = isAreaMatch(company);
            var isTechMatch = (superbag(company.technologies, appManager.selectedTechnologies));
            if (isAreasMatch && appManager.selectedTechnologies.length === 0)
                return true;
            if (isTechMatch && appManager.selectedAreas.length === 0)
                return true;

            return (isAreasMatch && isTechMatch);
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

        $scope.showDetails = function (company, event) {
            // Do not propagate the event to the table
            if(event){
                event.stopPropagation();
                event.preventDefault();
            }
            var modalInstance = $modal.open({
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

