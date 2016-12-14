'use strict';

/* Services */

angular.module('easywork')
    .factory('authService', function ($http, $rootScope, localStorageService, $q, apiHelper) {

        var accessLevels = routingConfig.accessLevels;
        var userRoles = routingConfig.userRoles;
        var ANONYMOUS = {username: '', role: "public"};
        var activeUser;

        activeUser = localStorageService.get('activeUser') || ANONYMOUS;

        function setActiveUser(user) {
            if (!user)
                return;

            localStorageService.set('activeUser', user);
            activeUser = user;
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
                    if (result.data.token)
                        handleNewToken(result.data.token);
                });
        };

        function logout() {
            localStorageService.remove('token');
            if (activeUser) {
                apiHelper.post(true, 'logout', activeUser);
            }

            setActiveUser(ANONYMOUS);
        }

        function handleNewToken(token, shouldFetchActiveUser) {
            if (!token)
                return;

            localStorageService.set('token', token);
            
            if (shouldFetchActiveUser) {
                // Fetch activeUser
                apiHelper.get(true, "authenticate/" + token)
                    .then(function (result) {
                        setActiveUser(result.data);
                    });
            }
        }

        function getToken() {
            return localStorageService.get('token');
        }

        return {
            register: register
            , logIn: login
            , logout: logout
            , isLoggedIn: isLoggedIn
            , isAuthorize: isAuthorize
            , getActiveUser: getActiveUser
            , setActiveUser: setActiveUser
            , handleNewToken: handleNewToken
            , getToken: getToken
        }
    });