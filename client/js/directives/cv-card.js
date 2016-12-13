/**
 * Created by Chen on 01/05/2015.
 */
angular.module('easywork')
    .directive('cvCard', function () {
        return {
            restrict: 'E',
            scope: {
                cv: '='
            },
            templateUrl: '/views/cvs/cv-card.html',
            link: function (scope, element, attrs) {
            }
        }
    })
    .directive('cvSkillTag', function (dataManager) {
        return {
            restrict: 'E',
            scope: {
                requiredSkill: '=',
                cv: '='
            },
            controller: function($scope, $uibModal) {
            },
            template: '<span class="skill-tag"><i class="glyphicon glyphicon-tag skill-icon"></i><span style="margin-right: 5px">{{::requiredSkill}}</span></span>'
        }
    })
