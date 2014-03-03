'use strict';


var companyController = angular.module('easywork.controllers.company', ['ui.select2', 'easywork.services.appManager']);

companyController.controller('CompanyCtrl', ['$scope', '$http', 'appManager',
	function ($scope, $http, appManager) {

		// Technologies
		$scope.selected_technologies = [];

        $scope.message == '';

		$scope.list_of_technologies = ['Java', 'C#', 'Web', 'UI', 'GUI', 'AngularJS', 'HTML', 'CSS', 'C++'];
		$scope.technologies_select2Options = {
            'multiple': true
		};

        $scope.company = {
            name: '',
            street: '',
            city: '',
            email: '',
            technologies: '',
            logoUrl: ''
        };

        $scope.updateCompany = function () {
            var company = authService.getActiveCompany();
            $http.put('./api/company/' + company.id, $scope.company)
                .success(
                function () {
                    $scope.message = "Company saved successfully!";
                }
            );
        }

        $('.fileinput').on('change.bs.fileinput', function (e) {
            console.log("jquery - change.bs.fileinput")
            $scope.company.file = "something";
        });
//		$scope.$watch('companies|filter:{selected:true}', function (nv) {
//			if (nv == undefined)
//				return;
//			$scope.selection = nv.map(function (company) {
//				return company;
//			});
//
//			// Update send button label
////			$scope.disableSend = $scope.selection.length == 0;
//			$scope.sendButtonLabel = SEND_BUTTON_STR;
//			if ($scope.selection.length > 0) {
//				$scope.sendButtonLabel += ' (' + $scope.selection.length + ' משרות)';
//			}
//		}, true);


		function getCompanies() {
			return $http.get('/api/companies');
		}
	}
]
);

