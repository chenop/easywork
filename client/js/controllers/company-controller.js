'use strict';


var companyController = angular.module('easywork.controllers.company',
    ['ui.select2', 'easywork.services.appManager', 'easywork.services.auth']);

companyController.controller('CompanyCtrl', ['$scope', '$http', 'appManager', 'authService',
    function ($scope, $http, appManager, authService) {

        var activeUser = authService.getActiveUser();
        if (activeUser.companyId !== undefined) {
            getCompany(activeUser.companyId).then(function (result) {
                $scope.company = result.data;
            });
        }

        // Technologies
        $scope.selected_technologies = [];

        $scope.message == '';

        $scope.list_of_technologies = ['Java', 'C#', 'Web', 'UI', 'GUI', 'AngularJS', 'HTML', 'CSS', 'C++'];
        $scope.technologies_select2Options = {
            'multiple': true
        };

        $scope.displayedImage = "holder.js/100%x100%";

        $scope.company = {
            name: '',
            street: '',
            city: '',
            email: '',
            technologies: '',
            logoUrl: ''
        };

        $scope.onImageSelect = function ($files) {
            $scope.company.logoUrl = $files[0].name;

        }

        $scope.uploadLogo = function () {
            console.log("file: " + $file.name);
            $scope.upload = $upload.upload({
                url: './api/company_upload', //upload.php script, node.js route, or servlet url
                method: 'POST',
                data: {company: $scope.company},
                file: $file
            }).progress(function (evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
                $scope.uploadedFiles.push(angular.copy($files[index]));
                console.log("what data" + data);
            });
            //.error(...)
        }

        var printCompany = function () {
            console.log("company")
            console.log("----------")
            console.log("Name: " + $scope.company.name);
            console.log("street: " + $scope.company.street);
            console.log("city: " + $scope.company.city);
            console.log("email: " + $scope.company.email);
            console.log("logoUrl: " + $scope.company.logoUrl);
        };

        $scope.createUpdateCompany = function () {
            var activeUser = authService.getActiveUser();
            if (activeUser.companyId == undefined) {
                $http.post('./api/company/' + activeUser.id, $scope.company)
                    .success(function () {
                        printCompany();
                        $scope.message = "Company created successfully!";
                    }
                );
            } else {
                $http.put('./api/company/' + activeUser.companyId, $scope.company)
                    .success(
                    function () {
                        printCompany();
                        $scope.message = "Company updated successfully!";
                    }
                );
            }
        }

        $('.fileinput').on('change.bs.fileinput', function (e) {
            console.log("jquery - change.bs.fileinput")
            $scope.company.file = "something";
        });

        function getCompanies() {
            return $http.get('./api/companies');
        }

        function getCompany(id) {
            return $http.get('./api/company/' + id);
        }
    }
]
);

