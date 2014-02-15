'use strict';

var SEND_BUTTON_STR = 'שלח';

var companiesController = angular.module('companyListModule', ['ui.select2']);

//companiesController.factory('companiesService', function ($http, $location) {
//	return {
//		getCompanies: function () {
//			return $http({
//				method: 'GET',
//				url: '/api/companies'
//			}).success(function (data, status, headers, config) {
//					console.log("getCompanies Succeeded!");
//				}
//			);
//		}
//	}
//});
companiesController.controller('CompanyListCtrl', ['$scope', '$http',
	function ($scope, $http) {
		getCompanies().then(function (result) {
			$scope.companies = result.data;
		});

		$scope.disableSend = false;

		$scope.sendButtonLabel = SEND_BUTTON_STR;

		$scope.title = "Companies List";

		// selected addresses
		$scope.selected_addresses = [];

		$scope.list_of_addresses = ['North', 'Haifa', 'Yoqneaam', 'Migdal Haeemek', 'Center', 'Tel Aviv', 'Rosh Haain'];
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
			if (nv == undefined)
				return;
			$scope.selection = nv.map(function (company) {
				return company.name;
			});

			// Update send button label
			$scope.disableSend = $scope.selection.length == 0;
			$scope.sendButtonLabel = SEND_BUTTON_STR;
			if ($scope.selection.length > 0) {
				$scope.sendButtonLabel += ' (' + $scope.selection.length + ' משרות)';
			}
		}, true);

// watch the selectAll checkBox for changes
		$scope.$watch('shouldSelectAll', function () {
			if ($scope.companies == undefined)
				return;
			for (var i = 0; i < $scope.companies.length; i++) {
				$scope.companies[i].selected = $scope.shouldSelectAll;
			}
		}, true);

		$scope.isRelevant = function (company) {
			return (superbag(company.addresses, $scope.selected_addresses) && superbag(company.domains, $scope.selected_domains));
		};

		// TODO - This check can be optimize - like sorting alphabetically or do hash-mapping of first letter (hash['i'] -> ['Intel']'.
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

		function getCompanies() {
			return $http.get('/api/companies');
		}

		$scope.sendCV = function () {
			console.log("sendCV, disable:" + $scope.disableSend);
		}
	}
]
);

