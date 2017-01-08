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
            templateUrl: '/views/users/cv-card.html',
			controller: function($scope, cvService) {
				$scope.cardClicked = function() {
					cvService.openCvDocViewModal($scope.cv);
				}
			},
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
            template: '<span class="skill-tag"><i class="glyphicon glyphicon-tag skill-icon"></i>{{::requiredSkill}}</span>'
        }
    })
