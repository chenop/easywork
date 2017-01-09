/**
 * Created by Chen on 30/05/14.
 *
 * Directive that will determine if the DOM element will be displayed according to its access level
 * Example:
 * <li access-level="public" active-user="authService.getActiveUser()"><a href="" ng-click="logout()">Logout</a></li>
 */
'use strict';

angular.module('easywork')
    .directive('accessLevel', function (authService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var prevDisp = element.css('display')
                    , userRole
                    , accessLevel;

                scope.$watch('authService.getActiveUser().role', function () {
                    var activeUser = authService.getActiveUser();
                    if (activeUser === undefined) {
                        console.log("activeUser not defined")
                        return;
                    }
                    if (activeUser.role) {
                        userRole = activeUser.role;
                    }
                    updateCSS();
                }, true);

                attrs.$observe('accessLevel', function (al) {
                    if (al) {
//                        accessLevel = scope.$eval(al);
                        accessLevel = al;
                    }
                    updateCSS();
                });

                function updateCSS() {
                    if (userRole && accessLevel) {
                        if (!authService.isAuthorize(accessLevel, userRole)) {
                            element.css('display', 'none');
                        }
                        else {
                            element.css('display', prevDisp);
                        }
                    }
                }
            }
        };
    })
    // Put the focus on the username textfield
    .directive('autoFocus', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link : function($scope, $element) {
                $timeout(function() {
                    $element[0].focus();
                    $element[0].select();
                }, 200);
            }
        }
    }])
    .directive('loading', [function() {
        return {
            return: 'E',
            template: '<div id="loading-wrapper"><div id="spinner"><i class="fa fa-refresh fa-spin fa-4x"></i></div></div>',
            link: function (scope, element, attrs) {
            }
        }
    }])
	.directive('iframeOnload', [function(){
		return {
			scope: {
				callBack: '&iframeOnload'
			},
			link: function(scope, element, attrs){
				element.on('load', function(){
					return scope.callBack();
				})
			}
		}}])


