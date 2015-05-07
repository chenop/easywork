/**
 * Created by Chen on 01/05/2015.
 */
angular.module('easywork')
    .directive('companyCard', function ($rootScope) {
        return {
            restrict: 'E',
            scope: {
                company: '='
            },
            templateUrl: '/views/companies/company-card.html',
            link: function(scope, element, attrs) {
                    scope.isEmpty = $rootScope.isEmpty;
            }
        }
    })
    .directive('skillTag', function() {
        return {
            restrict: 'E',
            scope: {
                requiredSkill: '=',
                company: '='
            },
            controller: function($scope, $modal) {
                $scope.showJobDetails = function (company, event) {
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
                    });
                }

            },
            template: '<span class="skill-tag"><a ng-click="showJobDetails(company, $event)"><i class="glyphicon glyphicon-tag skill-icon"></i>{{::requiredSkill}}</a></span>'
        }
    })
