/**
 * Created by Chen on 30/05/14.
 *
 * Directive that will determine if the DOM element will be displayed according to its access level
 * Example:
 * <li access-level="public" active-user="authService.getActiveUser()"><a href="" ng-click="logout()">Logout</a></li>
 */
'use strict';

angular.module('easywork.directives.accessLevel', [])
    .directive('accessLevel', function (authService) {
        return {
            restrict: 'A',
            scope: {
                activeUser: '=activeUser'
            },
            link: function (scope, element, attrs) {
                var prevDisp = element.css('display')
                    , userRole
                    , accessLevel;

                scope.$watch('activeUser', function (activeUser) {
                    if (activeUser === undefined) {
                        console.log("activeUser not defined")
                        return;
                    }
                    if (activeUser.role) {
                        userRole = activeUser.role.title;
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
    });
