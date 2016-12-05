/**
 * Created by Chen on 01/05/2015.
 */
angular.module('easywork')
    .directive('companyCard', function ($rootScope, utils) {
        return {
            restrict: 'E',
            scope: {
                company: '='
            },
            templateUrl: '/views/companies/company-card.html',
            link: function (scope, element, attrs) {
                scope.isEmpty = utils.isEmpty;
            }
        }
    })
    .directive('skillTag', function (dataManager) {
        return {
            restrict: 'E',
            scope: {
                requiredSkill: '=',
                company: '='
            },
            controller: function($scope, $uibModal) {
                $scope.showJobDetails = function (company, event) {
                    // Do not propagate the event to the table
                    if(event){
                        event.stopPropagation();
                        event.preventDefault();
                    }

                    var modalInstance = $uibModal.open({
                        templateUrl: '/views/jobs/job-details.html',
                        controller: 'JobDetailsCtrl',
                        windowClass: 'company-details-dialog',
                        resolve: {
                            data: function() {
                                return {
                                    company: company
                                    , requiredSkill: $scope.requiredSkill
                                }
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
