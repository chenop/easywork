/**
 * Created by Chen on 06/03/14.
 */

angular.module('easywork')
    .factory('dataManager', function ($http, common, $q, appManager) {
        var filterData = null;

        // Optimizing filterData call
        var getFiltersData = function () {
            if (!filterData) {
                filterData = $http.get('/api/filtersData/')
                    .success(function (result) {
                        return result;
                    }
                );
            }
            return filterData;
        }

        // Companies
        var getCompanies = function() {
            return getEntities(common.CONTENT_TYPE.COMPANY);
        }

        var getJobs = function(companyId) {
            return $http.get('/api/job/list/' + companyId);
        }

        var getUsers = function() {
            return getEntities(common.CONTENT_TYPE.USER);
        }

        var getCompany = function (id) {
            return getEntity(common.CONTENT_TYPE.COMPANY, id)
                .then(function (result) {                 // Get the logo
                    var company = result.data;
                    return getCompanyLogo(id, company)
                        .then(function (data) {
                            company.logo.data = data;
                            return company;
                        })
                })
        }

        function prepareBase64ImgSrc(contentType, data) {
            return 'data:' + contentType + ';base64,' + data;
        }

        var getJob = function(id) {
            return getEntity(common.CONTENT_TYPE.JOB, id);
        }

        var getUser = function(id) {
            return getEntity(common.CONTENT_TYPE.USER, id);
        }

        var createCompany = function(company) {
            return createEntity(common.CONTENT_TYPE.COMPANY, company);
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
            if (id == undefined)
                return;
            return $http.get('/api/' + entityType.name +'/' + id);
        }

        var createEntity = function(entityType, entity) {
             return $http.post('/api/' + entityType.name, entity);
        }

        var deleteEntity = function(entityType, id) {
            if (id == undefined)
                return;
            return $http.delete('/api/' + entityType.name + '/' + id);
        }

        var updateEntity = function(entityType, entity) {
            return $http.put('/api/' + entityType.name + '/' + entity._id, entity);
        }

        var getCompanyLogo = function (id, company) {
            var deferred = $q.defer();
            // TODO cache is not working...
            // Check if logo is cached
//            if (company !== undefined && company.logo !== undefined) {
//                var data = company.logo.data;
//                if (data !== undefined && !(data instanceof Array)) { // If array it is not base64 image
//                    deferred.resolve(data);
//                    return deferred.promise;
//                }
//
//            }
//            $http.get('/api/company/logo/' + id)
//                .success(function(data) {
//                    deferred.resolve(data);
//                });
//            return deferred.promise;
            return $http.get('/api/company/logo/' + id);
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

        var collectJobs = function () {
            var users = getUsers();
            var allJobs = [];
            users.for(function(user) {
                if (user.role !== "jobProvider") {
                    return;
                }
            })
        };

        var getAllJobs = function() {
            var allJobs = [];
            return $http.get('/api/allJobs')
                .error(function(err){
                    console.log("err: " + err);
                });
        }

        var getAllCompanies = function() {
            var allCompanies = [];
            return $http.get('/api/allCompanies')
                .error(function(err){
                    console.log("err: " + err);
                });
        }

        function createEmptyEntity(contentTypeName) {
            var entity;

            switch (contentTypeName) {

                case common.CONTENT_TYPE.JOB.name:
                    entity = createEmptyJob()
                    return createEntity(common.CONTENT_TYPE.JOB, entity);
                case common.CONTENT_TYPE.COMPANY.name:
                    entity = createEmptyCompany()
                    return createEntity(common.CONTENT_TYPE.COMPANY, entity);
                case common.CONTENT_TYPE.USER.name:
                    entity = createEmptyUser()
                    return createEntity(common.CONTENT_TYPE.USER, entity);
            }

        }

        function createEmptyJob() {
            var company = appManager.getActiveCompanyId();
            var job = {
                name: "Untitled",
                company: company,
                code: "",
                city: '',
                technologies: '',
                description: ""
            };

            return job;
        }

        function createEmptyCompany() {
            var company = {
                name: "Untitled Company",
                street: '',
                city: '',
                email: '',
                technologies: '',
                logo: {}
            };

            company.ownerId = appManager.getActiveUserId();

            return company;
        }

        function createEmptyUser() {
            var defaultMessage = appManager.defaultMessage;
            var user = {
                name: "Untitled User",
                username: '',
                email: '',
                role: '',
                message: defaultMessage,
                experience: '',
                company: null,
                file: ''
            };
        }

        return {
            getFiltersData: getFiltersData
            , getTechnologiesSelect2Options: getTechnologiesSelect2Options
            , getAreasSelect2Options: getAreasSelect2Options
            , getDashboardSelect2Options: getDashboardSelect2Options

            , getEntity: getEntity

            // Companies
            , getCompanies: getCompanies
            , createCompany: createCompany
            , updateCompany: updateCompany
            , getCompany: getCompany
            , deleteCompany: deleteCompany
            , getCompanyLogo: getCompanyLogo

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

            , getAllJobs: getAllJobs
            , getAllCompanies: getAllCompanies
            , prepareBase64ImgSrc: prepareBase64ImgSrc
            , createEmptyEntity: createEmptyEntity
        }
    }
);



