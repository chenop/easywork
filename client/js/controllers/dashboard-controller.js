/**
 * Created by Chen on 29/03/14.
 */

angular.module('easywork')
    .controller('DashboardCtrl', function ($scope, authService, appManager, dataManager, common, $routeParams, $timeout) {

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

        $scope.setSelected = function (entity, $index) {
            appManager.setSelectedEntity(entity, $index);
            // Entity was selected in the list we need the child controllers to get updated accordingly
            $scope.$broadcast('listSelectionChanged', entity);
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

        $scope.$on('dataChanged', function (event, entity) {
            refreshEntities(function () {
                appManager.setSelectedEntity(entity);

            });
        })

        $scope.$on('deleteEntityClicked', function (event, entity) {
            var index = appManager.getIndexOf($scope.entities, entity);
            $scope.deleteEntity(entity, index);
        })

        // User switch content type (users, companies, jobs)
        $scope.$watch('contentTypeValue', function () {
            refreshEntities(function () {
                if ($scope.entities != undefined && $scope.entities.length > 0) {
                    appManager.setSelectedEntity($scope.entities[0], 0);
                    // Waiting for the child scopes will be instantiated
                    $timeout(function () {
                        $scope.$broadcast('listSelectionChanged', $scope.entities[0]);
                    });
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
                    return '/views/users/user.html';
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
            if (appManager.getActiveUser().role == "admin") {
                dataManager.getAllJobs().then(function (result) {
                    $scope.entities = $scope.jobs = result.data;
                    if (callBack != undefined)
                        callBack();
                });
            }
            else {
                var companyId = appManager.getActiveCompanyId();
                dataManager.getJobs(companyId).then(function (result) {
                    $scope.entities = $scope.jobs = result.data;
                    if (callBack != undefined)
                        callBack();
                });
            }
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

        $scope.isSaveEnable = function () {
            return isEntitiesDirty();
        }

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

        $scope.deleteEntity = function (entity, index) {
            var contentType = getContentType($scope.contentTypeValue);
            dataManager.deleteEntity(contentType, entity._id).
                success(function () {
                    refreshEntities(function () {
                        if (index === undefined)
                            return;

                        if ($scope.entities != undefined) {
                            if (index >= $scope.entities.length) {
                                index = $scope.entities.length - 1;
                            }
                            appManager.setSelectedEntity($scope.entities[index], index);
                            $scope.$broadcast('listSelectionChanged', $scope.entities[index]);
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
);
