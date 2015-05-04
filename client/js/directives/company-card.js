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
                requiredSkill: '='
            },
            template: '<span class="skill-tag"><i class="glyphicon glyphicon-tag skill-icon"></i>{{::requiredSkill}}</span>'
        }
    })
