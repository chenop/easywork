'use strict';

angular.module('companyListModule', ['ui.select2'])
  .controller('CompanyListCtrl', ['$scope', '$rootScope', '$location',
    function ($scope, $rootScope, $location) {
      $scope.companies = [
        {
          'id': 1,
          'name': 'Intel',
          "addresses": ['Haifa', 'Kiryat Gat'],
          'domains': ['C++', 'HDL'],
          'details': 'Fast just got faster with Nexus S.',
          'logoUrl': 'img/companies/intel.jpg',
          'selected': false
        },
        {
          'id': 2,
          'name': 'Cadence',
          "addresses": ['Rosh Haain'],
          'domains': ['Java'],
          'details': 'The Next, Next Generation tablet.',
          'logoUrl': 'img/companies/cadence.jpg',
          'selected': false
        },
        {
          'id': 3,
          'name': 'Wix',
          "addresses": ['Tel Aviv'],
          'domains': ['Javascript', 'HTML', 'CSS', 'Java'],
          'details': 'The Next, Next Generation tablet.',
          'logoUrl': 'img/companies/wix.jpg',
          'selected': false
        }
      ];

      $scope.title = "Companies List";

// selected addresses
      $scope.selected_addresses = [];

      $scope.list_of_addresses = ['North', 'Haifa', 'Yoqneaam', 'Migdal Haeemek', 'Tel Aviv', 'Rosh Haain'];
      $scope.addresses_select2Options = {
        'multiple': true
      };

// selected domains
      $scope.selected_domains = [];

      $scope.list_of_domains = ['Java', 'C#', 'Web', 'UI', 'GUI', 'AngularJS', 'HTML', 'CSS', 'C++'];
      $scope.domains_select2Options = {
        'multiple': true
      };


      $scope.$watch('companies|filter:{selected:true}', function (nv) {
        $scope.selection = nv.map(function (company) {
          return company.name;
        });
      }, true);

// watch the selectAll checkBox for changes
      $scope.$watch('shouldSelectAll', function () {
        for (var i = 0; i < $scope.companies.length; i++) {
          $scope.companies[i].selected = $scope.shouldSelectAll;
        }
      }, true);

      $scope.isRelevant = function (company) {
        return (superbag(company.addresses, $scope.selected_addresses) && superbag(company.domains, $scope.selected_domains));
      };

// This check can be optimize - like sorting alphabetically or do hash-mapping of first letter (hash['i'] -> ['Intel']'.
      function superbag(superSet, subSet) {
        if (superSet == undefined || subSet == undefined)
          return true;
        if (subSet.length == 0)
          return true;
        var i, j;
        for (i = 0; i < subSet.length; i++) {
          for (j = 0; j < superSet.length; j++) {
            if (subSet[i] == superSet[j])
              return true;
          }
        }
        return false;
      }

      $scope.go = function (path) {
        $location.path(path);
      }
    }
  ]
  );

