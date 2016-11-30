'use strict';

/* Services */

angular.module('easywork')
    .factory('authService', function ($http, $rootScope, $localForage, $q, apiHelper) {

        var accessLevels = routingConfig.accessLevels;
        var userRoles = routingConfig.userRoles;
        var ANONYMOUS = {username: '', role: "public"};
        var activeUser;

        function isValidUser(user) {
            return user && user !== ANONYMOUS;
        }

        $localForage.getItem('activeUser')
            .then(function (user) {
                if (user === activeUser)
                    return;

                if (isValidUser(user) && !isValidUser(activeUser)) {
                    activeUser = user;
                    return;
                }

                if (!isValidUser(user) && isValidUser(activeUser)) {
                    return;
                }

                if (!isValidUser(user) && !isValidUser(activeUser)) {
                    activeUser = ANONYMOUS;
                    return;
                }

                if (isValidUser(user) && isValidUser(activeUser)) {
                    return;
                }
            });

        function setActiveUser(user) {
            if (!user)
                return;

            $localForage.setItem('activeUser', user)
                .then(function(user) {
                    activeUser = user;
                });
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

        function isLoggedIn(user) {
            if (user === undefined) {
                user = activeUser;
            }

            if (!user || !(user.role))
                return false;

            return user.role !== userRoles.public.title;
        };

        function getActiveUser() {
            return (!activeUser) ? ANONYMOUS : activeUser;
        }

        function register(user) {

            return apiHelper.post(true, 'register', user)
                .then(function (result) {
                    setActiveUser(result.data.user);
                    return user;
                });
        }

        function login(user) {

            return apiHelper.post(true, 'login', user)
                .then(function (result) {
                    setActiveUser(result.data.user);
                });
        };

        function logout() {
            $localForage.removeItem('token');
            setActiveUser(ANONYMOUS);
            if (activeUser) {
                return apiHelper.post(true, 'logout', activeUser);
            }
        };

        function handleNewToken(token) {
            if (!token)
                return;

            $localForage.setItem('token', token);
            
            // add jwt token to auth header for all requests made by the $http service
            $http.defaults.headers.common.Authorization = token;

            // Fetch activeUser
            apiHelper.get(true, "authenticate/" + token)
                .then(function (result) {
                    activeUser = result.data;
                });
        }

        function getToken() {
            return $localForage.getItem('token');
        }
        return {
            register: register
            , logIn: login
            , logOut: logout
            , isLoggedIn: isLoggedIn
            , isAuthorize: isAuthorize
            , getActiveUser: getActiveUser
            , setActiveUser: setActiveUser
            , handleNewToken: handleNewToken
        }
    });