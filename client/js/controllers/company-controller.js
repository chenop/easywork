'use strict';


angular.module('easywork')
    .controller('CompanyCtrl', function ($scope, $upload, $http, appManager, dataManager, $timeout, $state, $stateParams) {

        if ($state.current.isDashboard) {
            // Basically we pass the entityId so the state will change and will have the update
            // But we take the entity from the appManager (cause its cached)
            var entityId = $stateParams.entityId;

            var selectedEntity = appManager.getSelectedEntity();
            refreshCompany(selectedEntity);
        }
        else {
            var activeCompanyId = appManager.getActiveCompanyId();
            dataManager.getCompany(activeCompanyId)
                .then(function(company){
                    $scope.company = company;
                    // TODO wrap this function
                    dataManager.getCompanyLogo(company._id, company)
                        .then(function (data) {
                            if ($scope.company.logo === undefined) {
                                $scope.company.logo = {};
                            }
                            $scope.company.logo.data = data;
                            $scope.logo = data;
                        })
                })
        }

        // TODO what about my_company? ahhhhhaaaaahahaah
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

        dataManager.getFiltersData()
            .then(function(result) {
                $scope.technologies = result.data.technologies
            });

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
