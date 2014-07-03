'use strict';


var companyController = angular.module('easywork.controllers.company',
    ['ui.select2', 'easywork.services.appManager', 'easywork.services.dataManager', 'easywork.services.auth']);

companyController.controller('CompanyCtrl', ['$scope', '$http', 'appManager', 'dataManager', 'authService', '$q',
        function ($scope, $http, appManager, dataManager, authService, $q) {

            var activeCompanyId = appManager.getCompanyId();
            if (activeCompanyId !== undefined) {
                dataManager.getCompany(activeCompanyId).
                    success(function (data) {
                        $scope.company = data;
                    }).
                    error(function (result) {
                        $scope.company = {};
                    });
            }

            appManager.addSelectionChangeListener(function (selectedEntity) {
                dataManager.getCompany(selectedEntity._id).
                    success(function (data, status, header, config) {
                        $scope.company = data;
                    }).
                    error(function (data, status, header, config) {
                        $scope.company = {};
                    });
            })

            $scope.message == '';

            dataManager.getFiltersData()
                .success(function (result) {
//                    $scope.areas = result.areas;
                    $scope.technologies = result.technologies;
                }
            );

            $scope.technologies_select2Options = {
                'multiple': true,
                'width': '83.33333%'
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

            // TODO sync between the entity name in the list and clicking the "save"
            $scope.createUpdateCompany = function () {
                var activeCompanyId = appManager.getCompany();
                if (activeCompanyId == undefined) {
                    dataManager.createCompany($scope.company.name)
                        .success(function () {
                            $scope.message = "Company created successfully!";
                        }
                    );
                } else {
                    dataManager.updateCompany($scope.company)
                        .success(
                        function () {
                            $scope.message = "Company updated successfully!";
                        }
                    );
                }
            }

            $('.fileinput').on('change.bs.fileinput', function (e) {
                console.log("jquery - change.bs.fileinput")
                $scope.company.file = "something";
            });

            $scope.updateCompany = function (event) {
                dataManager.updateCompany($scope.company)
                    .success(function (entity) {
                        $scope.$emit('dataChanged', entity);
                    });
            }
        }
    ]
);
