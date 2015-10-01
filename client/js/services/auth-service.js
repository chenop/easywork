'use strict';

/* Services */

angular.module('easywork')
    .factory('authService', function ($http, $cookies, $rootScope, $localForage) {

        var accessLevels = routingConfig.accessLevels
            , userRoles = routingConfig.userRoles
            , ANONYMOUS = {username: '', role: "public"};
            //, activeUser = $cookieStore.get('user') || angular.copy(ANONYMOUS);

        var activeUser = $localForage.getItem('activeUser').then(function(actUser) {
             activeUser = (!actUser) ? ANONYMOUS : actUser;
        }) 

        $rootScope.$watch(function() { return $cookies.activeUser; }, function(newValue) {
            if (!$cookies.activeUser)
                return;

            setActiveUser(JSON.parse($cookies.activeUser));
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
                    $cookies.activeUser = JSON.stringify(ANONYMOUS);
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