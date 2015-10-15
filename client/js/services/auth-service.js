'use strict';

/* Services */

angular.module('easywork')
    .factory('authService', function ($http, $cookies, $rootScope, $localForage) {

        var cookieActiveUser = $cookies.get('activeUser');
        var accessLevels = routingConfig.accessLevels
            , userRoles = routingConfig.userRoles
            , ANONYMOUS = {username: '', role: "public"}
            , activeUser = (!cookieActiveUser) ? ANONYMOUS : JSON.parse(cookieActiveUser);

        $rootScope.$watch(function() { return $cookies.get('activeUser'); }, function(newValue) {
            if (!newValue)
                return;

            setActiveUser(JSON.parse(newValue));
        });

        function setActiveUser(user) {
            if (!user)
                return;

            angular.extend(activeUser, user); // Shallow copy - just switch the references
            $localForage.setItem('activeUser', user);
        }

        var isAuthorize = function(accessLevel, role) {
            if (accessLevel === undefined) {
                accessLevel = 'public';
            }
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
                return user;
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
                    $localForage.removeItem('activeUser');
                    $cookies.put('activeUser', JSON.stringify(ANONYMOUS));
                });
        };

        return {
            register: register
            , logIn: logIn
            , logOut: logOut
            , isLoggedIn: isLoggedIn
            , isAuthorize: isAuthorize
            , getActiveUser: getActiveUser
            , setActiveUser: setActiveUser
        }
    });