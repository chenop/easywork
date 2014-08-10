'use strict';


angular.module('easywork')
    .controller('CompanyCtrl', function ($scope, $upload, $http, appManager, dataManager, $timeout) {

        // TODO 2. addSelectionChangedListener does not add this listener once ..... move to service?
        var companyId = appManager.getActiveCompanyId();

        if (companyId !== undefined) {
            dataManager.getCompany(companyId).
                success(function (result) {
                    $scope.company = result;

                    // Get the logo
                    dataManager.getCompanyLogo(companyId).
                        success(function(data) {
                            var contentType = $scope.company.file.contentType;
                            $scope.company.file.data = prepareBase64ImgSrc(contentType, data);
                        })
                })
        }

        function prepareBase64ImgSrc(contentType, data) {
            return 'data:' + contentType + ';base64,' + data;
        }

        appManager.addSelectionChangedListener(function (selectedEntity) {
            $timeout(function () {
                // Using timeout since we want to this to happen after the initialization of the dataManager.getCompany()...
                // I know... not the best practice ever...
                $scope.company = selectedEntity;
                $timeout(function () {
                    $('#companyName').select();
                }, 100);
            })
        })

        $scope.addCompany = function () {
            var company = {
                name: "Untitled Company",
                street: '',
                city: '',
                email: '',
                technologies: '',
                logoUrl: ''
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
            var contentType = $files[0].type;
            $scope.upload = $upload.upload({
                url: './api/company/logo-upload/' + $scope.company._id,
                method: 'POST',
                data: {companyName: $scope.company.name},
                file: $files[0]
            }).progress(function (evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data) {
                $scope.company.file.data = prepareBase64ImgSrc(contentType, data);
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
