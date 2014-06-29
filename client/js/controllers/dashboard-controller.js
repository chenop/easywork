/**
 * Created by Chen on 29/03/14.
 */

angular.module('easywork.controllers.dashboard', [
        'easywork.services.auth',
        'easywork.services.appManager',
        'easywork.services.dataManager',
        'easywork.services.common',
        'ui.bootstrap'
    ])
    .controller('DashboardCtrl', ['$scope', 'authService', 'appManager', 'dataManager', 'common', '$routeParams',
//        '$modal', '$location',
        function ($scope, authService, appManager, dataManager, common, $routeParams) {

//            var selectedEntity;

            if ($routeParams.contentType == undefined) {
                $scope.contentTypeValue = common.CONTENT_TYPE.COMPANY.value;
            } else {
                $scope.contentTypeValue = $routeParams.contentType;
            }

            $scope.isSelected = function (entity) {
                var selectedEntity = appManager.getSelectedEntity();
                if (entity == undefined || selectedEntity == undefined)
                    return false;
                return selectedEntity._id == entity._id;
            }

            $scope.setSelected = function (entity) {
                appManager.setSelectedEntity(entity);
            }

            $scope.select2Options = dataManager.getDashboardSelect2Options();

            function refreshEntities(callBack) {
                switch (Number($scope.contentTypeValue)) {

                    case common.CONTENT_TYPE.JOB.value:
                        getJobs(callBack);
                        break;

                    case common.CONTENT_TYPE.COMPANY.value:
                        getCompanies(callBack);
                        break;

                    case common.CONTENT_TYPE.USER.value:
                        getUsers(callBack);
                        break;
                }
            }

            $scope.$on('dataChanged', function(event, entity) {
                refreshEntities(function() {
                    appManager.setSelectedEntity(entity);
                    $scope.newEntityName = "";
                });
            })

            $scope.$watch('contentTypeValue', function () {
                refreshEntities(function() {
                    if ($scope.entities != undefined && $scope.entities.length > 0) {
                        appManager.setSelectedEntity($scope.entities[0]);
                    }
                });

            }, true);


            $scope.getRelevantForm = function () {
                switch (Number($scope.contentTypeValue)) {

                    case common.CONTENT_TYPE.JOB.value:
                        return '/views/jobs/job.html';

                    case common.CONTENT_TYPE.COMPANY.value:
                        return '/views/companies/company.html';
                    case common.CONTENT_TYPE.USER.value:
                        return '/views/users/details.html';
                }
            };

            function getCompanies(callBack) {
                dataManager.getCompanies().then(function (result) {
                    $scope.entities = $scope.companies = result.data;
                    if (callBack != undefined)
                        callBack();
                });
            };

            function getJobs(callBack) {
                var userId = appManager.getActiveUserId();
                dataManager.getJobs(userId).then(function (result) {
                    $scope.entities = $scope.jobs = result.data;
                    if (callBack != undefined)
                        callBack();
                });
            };

            function getUsers(callBack) {
                dataManager.getUsers().then(function (result) {
                    $scope.entities = $scope.users = result.data;
                    if (callBack != undefined)
                        callBack();
                });
            };

            var isEntitiesDirty = function () {
                return false;
            };

            $scope.isSaveEnable = function() {
                return isEntitiesDirty();
            }

            $scope.hitEnter = function ($event) {
                if (angular.equals($event.keyCode, 13) && !(angular.equals($scope.newEntityName, null) || angular.equals($scope.newEntityName, '')))
                    $scope.addEntity();
            }; // end hitEnter

            var getContentType = function (contentTypeValue) {
                switch (Number(contentTypeValue)) {

                    case common.CONTENT_TYPE.JOB.value:
                        return common.CONTENT_TYPE.JOB;

                    case common.CONTENT_TYPE.COMPANY.value:
                        return common.CONTENT_TYPE.COMPANY;

                    case common.CONTENT_TYPE.USER.value:
                        return common.CONTENT_TYPE.USER;
                }
            };

            $scope.addEntity = function (entity, entityType) {
                var contentType = getContentType(entityType);
                dataManager.createEntity(contentType, entity).
                    success(function (entity) {
                        refreshEntities(function() {
                            appManager.setSelectedEntity(entity);
                            $scope.newEntityName = "";
                        });

                    });
            }

            $scope.deleteEntity = function (entity, index) {
                var contentType = getContentType($scope.contentTypeValue);
                dataManager.deleteEntity(contentType, entity._id).
                    success(function () {
                        refreshEntities(function() {
                            if ($scope.entities != undefined) {
                                if (index >= $scope.entities.length) {
                                    index = $scope.entities.length - 1;
                                }
                                appManager.setSelectedEntity($scope.entities[index]);
                            }
                        });
                    });
            }

            $scope.saveEntities = function () {
                switch (Number($scope.contentTypeValue)) {

                    case common.CONTENT_TYPE.JOB.value:
                        saveJobs($scope.entities);
                        break;

                    case common.CONTENT_TYPE.COMPANY.value:
                        saveCompanies($scope.entities);
                        break;

                    case common.CONTENT_TYPE.USER.value:
                        saveUsers($scope.entities);
                        break;
                }
            }

        }

    ])
;
