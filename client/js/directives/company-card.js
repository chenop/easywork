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
            link: function (scope, element, attrs) {
                scope.isEmpty = $rootScope.isEmpty;
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
            template: '<span><a class="skill-tag" ng-click="showJobDetails(requiredSkill, company)"><i class="glyphicon glyphicon-tag skill-icon"></i>{{::requiredSkill}}</a></span>',
            link: function (scope, element, attrs) {
                scope.showJobDetails = function () {
                    dataManager.getJobsBySkill(scope.requiredSkill,scope.company._id).
                        then(function (data) {
                            console.log(scope.requiredSkill, data.data[0].name);
                        })
                }
            }
        }
    })
