'use strict';

angular.module('easywork.services.firebaseRefs', [])
  .factory('FireRef', ['FBURL', 'Firebase',
    function (FBURL, Firebase) {
      return {
        leagues: function () {
          return new Firebase(FBURL + '/leagues');
        }, users: function () {
          return new Firebase(FBURL + '/users');
        }
      }
    }])