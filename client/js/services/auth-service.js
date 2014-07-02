'use strict';

/* Services */

angular.module('easywork.services.auth', ['ngCookies'])
    .factory('authService', function ($http, $cookieStore) {

        var accessLevels = routingConfig.accessLevels
            , userRoles = routingConfig.userRoles
            , ANONYMOUS = {username: '', role: "public"}
            , activeUser = $cookieStore.get('user') || angular.copy(ANONYMOUS);

        function setActiveUser(user) {
            angular.extend(activeUser, user); // Shallow copy - just switch the references
        }

        var isAuthorize = function(accessLevel, role) {
            if(role === undefined) {
                role = activeUser.role;
            }

            return accessLevels[accessLevel].bitMask & userRoles[role].bitMask;
        }

        var isLoggedIn = function (user) {
            if (user === undefined) {
                user = activeUser;
            }
            return user.role !== userRoles.public.title;
        };

        var getActiveUser = function () {
            return activeUser;
        }

        var register = function (user) {

            return $http({
                method: 'POST',
                url: '/api/register',
                data: user
            }).success(function(user) {
                setActiveUser(user);
            });
        };

        var logIn = function (user) {

            return $http({
                method: 'POST',
                url: '/api/login',
                data: user
            }).success(function(user) {
                setActiveUser(user);
            });
        };

        var logOut = function () {
            return $http.get("/logout")
                .success(function() {
                    setActiveUser(ANONYMOUS);
                    $cookieStore.remove('user');
                });
        };

        return {
            register: register
            , logIn: logIn
            , logOut: logOut
            , isLoggedIn: isLoggedIn
            , isAuthorize: isAuthorize
            , getActiveUser: getActiveUser
        }
    });