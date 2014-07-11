'use strict';


angular.module('easywork')
    .controller('CompanyCtrl', function ($scope, $upload, $http, appManager, dataManager, $timeout) {

        $scope.$on('listSelectionChanged', function (event, selectedEntity) {
            // Update the form according to the selected entity
            $scope.company = selectedEntity;
            $timeout(function () {
                $('#companyName').select();
            }, 100);
        });

        $scope.addCompany = function () {
            var company = {
                name: "Untitled Company",
                street: '',
                city: '',
                email: '',
                technologies: '',
                logoUrl: ''
            };

            dataManager.createCompany(company)
                .success(function (entity) {
                    $scope.$emit('dataChanged', entity);
                    $scope.company = entity;
                    $timeout(function () {
                        $('#companyName').select();
                    }, 100);
                });
        }

        $scope.message === '';

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

        $scope.onImageSelect = function ($files) {
            console.log("file: " + $files[0].name);
            $scope.upload = $upload.upload({
                url: './api/company/logo-upload/' + $scope.company._id,
                method: 'POST',
                data: {companyName: $scope.company.name},
                file: $files[0]
            }).progress(function (evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (logoUrl) {
                $scope.company.logoUrl = logoUrl;
            })
                .error(function (err) {
                    console.log("Error:" + err.message);
                })
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
            var activeCompanyId = appManager.getCompany();
            if (activeCompanyId === undefined) {
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

        $scope.updateCompany = function (event) {
            dataManager.updateCompany($scope.company)
                .success(function (entity) {
                    $scope.$emit('dataChanged', entity);
                });
        }

        $scope.deleteCompany = function () {
            $scope.$emit('deleteEntityClicked', appManager.getSelectedEntity());
        }
    }
);
