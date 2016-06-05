'use strict';


angular.module('easywork')
    .controller('CompanyCtrl', function ($scope, Upload, $http, appManager, dataManager, $timeout, $state, $stateParams, $uibModal, debounce) {
        function isDefined(value){return typeof value !== 'undefined';}

        $scope.publish = false;
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
                })
        }

        function refreshCompany(selectedEntity) {
            if (selectedEntity == null)
                return;
            $scope.company = selectedEntity;
            dataManager.getCompanyLogo(selectedEntity._id, $scope.company);

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
                $scope.upload = Upload.upload({
                    url: './api/company/logo-upload/' + $scope.company._id,
                    method: 'POST',
                    data: e.target.result // Image as base64
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
                }).error(function (err) {
                    console.log("Error:" + err.message);
                })
            }
        }

        var printCompany = function () {
            console.log("company")
            console.log("----------")
            console.log("Name: " + $scope.company.name);
            console.log("street: " + $scope.company.address.street);
            console.log("city: " + $scope.company.address.city);
            console.log("email: " + $scope.company.email);
            console.log("logoUrl: " + $scope.company.logo);
        };


        var debounceUpdateCompany = debounce(function() {
            return dataManager.updateCompany($scope.company)
                .then(function (entity) {
                    $scope.$emit('dataChanged', entity);
                    return entity.data;
                })
                .then(function(company) {
                    dataManager.getCompanyLogo(company._id, company, true)
                        .then(function(url) {
                            $scope.company.logo.url = url;
                        })
                })
        }, 300, false);

        $scope.updateCompany = function () {
            debounceUpdateCompany();
        }

        $scope.deleteCompany = function () {
            $scope.$emit('deleteEntityClicked', appManager.getSelectedEntity());
        }

        $scope.addLocation = function() {
            $scope.company.locations.push({street: "", city: ""});
        }

        $scope.removeLocation = function($index) {
            $scope.company.locations.splice($index, 1);
            dataManager.updateCompany($scope.company);
        }

        $scope.showLogoGallery = function(company) {
            var modalInstance = $uibModal.open({
                templateUrl: '/views/companies/logo-gallery.html',
                controller: 'LogoGalleryCtrl',
                resolve: {
                    company: function() {
                        return company;
                    }
                }

            });
        }

    }
);
