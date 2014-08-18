'use strict';


angular.module('easywork')
    .controller('CompanyCtrl', function ($scope, $upload, $http, appManager, dataManager, $timeout) {

        var companyId = appManager.getActiveCompanyId();

        function refreshCompany(selectedEntity) {
            if (selectedEntity == null)
                return;
            $scope.company = selectedEntity;
            dataManager.getCompanyLogo(selectedEntity._id, $scope.company)
                .then(function (data) {
                    if ($scope.company.logo === undefined) {
                        $scope.company.logo = {};
                    }
                    $scope.company.logo.data = data;
                    $scope.logo = data;
                })

            $timeout(function () {
                $('#companyName').select();
            }, 100);
        }

        if (companyId !== undefined) {
            dataManager.getCompany(companyId)
                .then(function (result) {
                    $scope.company = result;
                    $scope.logo = result.logo.data;
                    return result;
                })
                .then(function () {
                    var selectedEntity = appManager.getSelectedEntity();
                    refreshCompany(selectedEntity);

                    // We would like to register to the selectionChanged event only after company was fetched
                    $scope.$on('selectionChanged', function (event, selectedEntity) {
                        refreshCompany(selectedEntity);
                    })
                })
        }


        $scope.addCompany = function () {
            var company = {
                name: "Untitled Company",
                street: '',
                city: '',
                email: '',
                technologies: '',
                logo: {}
            };

            company.ownerId = appManager.getActiveUserId();

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
            var file = $files[0];
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file); // Reading the image as base64
            fileReader.onload = function (e) {
                $scope.upload = $upload.upload({
                    url: './api/company/logo-upload/' + $scope.company._id,
                    method: 'POST',
                    data: {data: e.target.result} // Image as base64
                }).progress(function (evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function (data) {
                    // If file is undefined init it
                    if ($scope.company.logo === undefined) {
                        $scope.company.logo = {};
                    }
                    $scope.company.logo.data = data;
                    $scope.logo = data;

                    return data;
                })
                    .error(function (err) {
                        console.log("Error:" + err.message);
                    })
            }
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
