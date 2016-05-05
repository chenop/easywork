/**
 * Created by Chen on 01/05/2015.
 */
angular.module('easywork')
    .directive('userCard', function () {
        return {
            restrict: 'E',
            scope: {
                user: '='
            },
            templateUrl: '/views/users/user-card.html',
            link: function (scope, element, attrs) {
            }
        }
    })
    .directive('userSkillTag', function (dataManager) {
        return {
            restrict: 'E',
            scope: {
                requiredSkill: '=',
                user: '='
            },
            controller: function($scope, $uibModal) {
            },
            template: '<span class="skill-tag"><i class="glyphicon glyphicon-tag skill-icon"></i>{{::requiredSkill}}</span>'
        }
    })
