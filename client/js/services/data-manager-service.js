/**
 * Created by Chen on 06/03/14.
 */

angular.module('easywork')
    .factory('dataManager', function ($http, common, $q, appManager, modelTransformer, Job) {
        function isUndefined(value){return typeof value === 'undefined';}
        function isDefined(value){return typeof value !== 'undefined';}
        function isEmpty(value) {
            return isUndefined(value) || value === '' || value === null || value !== value;
        };

        var jobs = null;
        var companies = null;
        var users = null;
        var skillsToJobs = null;
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
        var getCompanies = function(showPublishOnly) {
            var params = {};

            if (isDefined(showPublishOnly) && showPublishOnly === true)
                params = {showPublishOnly: showPublishOnly};

            return $http({
                url: "/api/company/list"
                , method: "GET"
                , params: params
                })
                .then(function(result) {
                    return result.data;
                });
        }

        var getJobs = function(companyId) {
            var url = '/api/job/list';

            if (companyId)
                url +=  "/" + companyId;

            return $http.get(url)
                .then(function(result) {
                    jobs = result.data;
                    return jobs;
                });
        }

        var getUsers = function() {
            return getEntities(common.CONTENT_TYPE.USER);
                //.then(function(entities) {
                //    users = entities;
                //    return users;
                //});;
        }

        var getCompany = function (id) {
            return getEntity(common.CONTENT_TYPE.COMPANY, id)
                .then(function (result) {                 // Get the logo
                    var company = result.data;
                    return getCompanyLogo(id, company)
                        .then(function (logoUrl) {
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
            return createEntity(common.CONTENT_TYPE.COMPANY, {company: company});
        }

        var createJob = function(job) {
            return createEntity(common.CONTENT_TYPE.JOB, {job: job});
        }

        var createUser = function(user) {
            return createEntity(common.CONTENT_TYPE.USER, {user: user});
        }

        var createCv = function(cv) {
            return createEntity(common.CONTENT_TYPE.CV, {cv: cv});
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
            return $http.get('/api/' + entityType.name + '/list')
                .then(function(result) {
                    return result.data;
                });
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

        var getCompanyLogo = function (id, company, force) {
            var deferred = $q.defer();
            force = isDefined(force) ? force : false;
            // Check if logo is cached
            if (!force && !isEmpty(company) && !isEmpty(company.logo) && !isEmpty(company.logo.url)) {
                deferred.resolve(company.logo.url);
                return deferred.promise;
            }
            return $http.get('/api/company/logo/' + id + '/' + force)
                .then(function (result) {
                    if (result.data) {
                        setLogo(company, result.data);
                        return company.logo.url;
                    } else {
                        setEmptyLogo(company);
                        return company.logo.url;
                    }
                });
        }

        function setLogo(company, url) {
            if ((typeof company.logo === 'undefined') || company.logo === null) {
                company.logo = {};
            }
            company.logo.url = url;
        }

        function setEmptyLogo(company) {
            setLogo(company, 'http://placehold.it/150x150.jpg&text=Logo..');
            company.logo.shape = 'round';
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

        var getAllJobs = function(companyId) {
            //var deferred = $q.defer();
            //if (jobs !== null) {
            //    deferred.resolve(jobs);
            //    return deferred.promise;
            //}


            var allJobsUrl = '/api/allJobs';
            if (companyId) {
                allJobsUrl += '/' +companyId;
            }

            return $http.get(allJobsUrl)
                .then(function(result) {
                    var jobs = modelTransformer.transform(result.data, Job);
                    //jobs = result.data;
                    return jobs;
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
                    return createJob(entity);
                case common.CONTENT_TYPE.COMPANY.name:
                    entity = createEmptyCompany()
                    return createCompany(entity);
                case common.CONTENT_TYPE.USER.name:
                    entity = createEmptyUser()
                    return createUser(entity);
            }

        }

        function getJobsBySkill(skill, companyId) {
            return $http.get('/api/company/jobsBySkill/' + companyId + '/' + skill);
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

        function setPublish(companyId, publish) {
            return $http.post('/api/company/' + companyId + '/setPublish/' + publish);
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
            , setPublish: setPublish

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

            // Cvs
            , createCv: createCv
            , createEntity: createEntity
            , deleteEntity: deleteEntity

            , getAllJobs: getAllJobs
            , prepareBase64ImgSrc: prepareBase64ImgSrc
            , createEmptyEntity: createEmptyEntity
            , getJobsBySkill: getJobsBySkill
        }
    }
);



