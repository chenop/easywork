/**
 * Created by Chen on 06/03/14.
 */

angular.module('easywork.services.dataManager', ['easywork.services.common'])
    .factory('dataManager', function ($http, common) {

        var getFiltersData = function () {
            return $http.get('./api/filtersData/');
        }

        // Companies
        var getCompanies = function() {
            return getEntities(common.CONTENT_TYPE.COMPANY);
        }

        var getJobs = function(userId) {
            return $http.get('/api/job/list/' + userId);
        }

        var getUsers = function() {
            return getEntities(common.CONTENT_TYPE.USER);
        }

        var getCompany = function(id) {
            return getEntity(common.CONTENT_TYPE.COMPANY, id);
//            return $http.get('./api/company/' + id);
        }

        var getJob = function(id) {
            return getEntity(common.CONTENT_TYPE.JOB, id);
        }

        var getUser = function(id) {
            return getEntity(common.CONTENT_TYPE.USER, id);
        }

        var createCompany = function(company) {
            return createEntity(common.CONTENT_TYPE.COMPANY, company);
//            return $http.post('./api/company', company);
        }

        var createJob = function(job) {
            return createEntity(common.CONTENT_TYPE.JOB, job);
        }

        var createUser = function(user) {
            return createEntity(common.CONTENT_TYPE.USER, user);
        }

        var deleteCompany = function(id) {
            return deleteEntity(common.CONTENT_TYPE.COMPANY, id);
        }

        var deleteJob = function(id) {
            return deleteEntity(common.CONTENT_TYPE.JOB, id);
        }

        var deleteUser = function(id) {
            return deleteEntity(common.CONTENT_TYPE.USER, id);
        }

        var updateCompany = function(entity) {
            return updateEntity(common.CONTENT_TYPE.COMPANY, entity)
        }

        var updateUser = function(entity) {
            return updateEntity(common.CONTENT_TYPE.USER, entity)
        }

        var updateJob = function(entity) {
            return updateEntity(common.CONTENT_TYPE.JOB, entity)
        }

        // Entities
        var getEntities = function(entityType) {
            return $http.get('/api/' + entityType.name + '/list');
        }

        var getEntity = function(entityType, id) {
            return $http.get('/api/' + entityType.name +'/' + id);
        }

        var createEntity = function(entityType, entity) {
             return $http.post('/api/' + entityType.name, entity);
        }

        var deleteEntity = function(entityType, id) {
            return $http.delete('/api/' + entityType.name + '/' + id);
        }

        var updateEntity = function(entityType, entity) {
            return $http.put('/api/' + entityType.name + '/' + entity._id, entity);
        }


        var getTechnologiesSelect2Options = function() {
            return {
                'multiple': true
            };
        }

        var getAreasSelect2Options = function() {
            return {
                'multiple': true
            };
        }

        var getDashboardSelect2Options = function() {
            return {
                minimumResultsForSearch: -1
            };
        }

        return {
            getFiltersData: getFiltersData
            , getTechnologiesSelect2Options: getTechnologiesSelect2Options
            , getAreasSelect2Options: getAreasSelect2Options
            , getDashboardSelect2Options: getDashboardSelect2Options

            // Companies
            , getCompanies: getCompanies
            , createCompany: createCompany
            , updateCompany: updateCompany
            , getCompany: getCompany
            , deleteCompany: deleteCompany

            // Jobs
            , getJobs: getJobs
            , createJob: createJob
            , updateJob: updateJob
            , getJob: getJob
            , deleteJob: deleteJob

            // Users
            , getUsers: getUsers
            , createUser: createUser
            , updateUser: updateUser
            , getUser: getUser
            , deleteUser: deleteUser

            , createEntity: createEntity
            , deleteEntity: deleteEntity
        }
    }
);



