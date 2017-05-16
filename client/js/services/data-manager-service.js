/**
 * Created by Chen on 06/03/14.
 */

angular.module('easywork')
	.factory('dataManager', function ($http, common, utils, $q, apiHelper) {

			var filterData = null;

			// Optimizing filterData call
			function getFiltersData() {
				if (!filterData) {
					filterData = apiHelper.get(true, 'filtersData/')
						.then(function (result) {
								return result;
							}
						);
				}
				return filterData;
			}

			// Companies
			var getCompanies = function (showPublishOnly) {
				var params = {};

				if (utils.isDefined(showPublishOnly) && showPublishOnly === true)
					params = {showPublishOnly: showPublishOnly};

				return apiHelper.get(true, "company/list", {params: params})
					.then(function (result) {
						return result.data;
					});
			}

			var getJobs = function (companyId) {
				var url = 'job/list';

				if (companyId)
					url += "/" + companyId;

				return apiHelper.get(true, url)
					.then(function (result) {
							return result.data;
						},
						function (err1, err2) {
							console.log(err1);
						});
			}

			var getUsers = function () {
				return getEntities(common.CONTENT_TYPE.USER);
			}

			var getCvs = function (skills) {
				var url = 'cv/list';
				var filter = {};

				if (utils.isDefined(skills) && skills.length > 0) {
					filter.skills = skills;
				}
				return apiHelper.get(false, url, {params: filter})
					.then(function (result) {
						return result.data;
					});
			}

			function analyzeCv(cvId) {
				if (!cvId)
					return;

				return apiHelper.put(true, common.CONTENT_TYPE.CV.name + '/analyzeCv/' + cvId)
					.then(function (result) {
							return result.data;
						},
						function (err) {
							console.log("Error! " + err);
						});

			}

			var getCompany = function (id) {
				return getEntity(common.CONTENT_TYPE.COMPANY, id)
					.then(function (result) {                 // Get the logo
						return result.data;
					})
			}

			function prepareBase64ImgSrc(contentType, data) {
				return 'data:' + contentType + ';base64,' + data;
			}

			var getJob = function (id) {
				return getEntity(common.CONTENT_TYPE.JOB, id)
					.then(function (result) {
						return result.data;
					});
			}

			var getUser = function (id) {
				return getEntity(common.CONTENT_TYPE.USER, id)
					.then(function (result) {
						return result.data;
					});
			}

			var getCv = function (id) {
				return getEntity(common.CONTENT_TYPE.CV, id)
					.then(function (result) {
						return result.data;
					});
			}

			var getCvFile = function (id) {
				return apiHelper.get(false, 'cv/download/' + id, {responseType: 'arraybuffer'});
			}

			var createCompany = function (company) {
				return createEntity(common.CONTENT_TYPE.COMPANY, {company: company});
			}

			var createJob = function (job) {
				return createEntity(common.CONTENT_TYPE.JOB, {job: job});
			}

			var createUser = function (user) {
				return createEntity(common.CONTENT_TYPE.USER, {user: user});
			}

			var createCv = function (cv) {
				return apiHelper.post(true, common.CONTENT_TYPE.CV.name, cv);
			}

			var deleteCompany = function (id) {
				return deleteEntity(common.CONTENT_TYPE.COMPANY.name, id);
			}

			var deleteJob = function (id) {
				return deleteEntity(common.CONTENT_TYPE.JOB.name, id);
			}

			var deleteUser = function (id) {
				return deleteEntity(common.CONTENT_TYPE.USER.name, id);
			}

			var deleteCv = function (id) {
				return deleteEntity(common.CONTENT_TYPE.CV.name, id);
			}

			var updateCompany = function (entity) {
				return updateEntity(common.CONTENT_TYPE.COMPANY, entity)
			}

			var updateUser = function (entity) {
				return updateEntity(common.CONTENT_TYPE.USER, entity)
			}

			var updateJob = function (entity) {
				return updateEntity(common.CONTENT_TYPE.JOB, entity)
			}

			// Entities
			var getEntities = function (entityType) {
				return apiHelper.get(false, entityType.name + '/list')
					.then(function (result) {
						return result.data;
					});
			}

			var getEntity = function (entityType, id) {
				if (id == undefined)
					return;
				return apiHelper.get(true, entityType.name + '/' + id);
			}

			var createEntity = function (entityType, entity) {
				return apiHelper.post(false, entityType.name, entity);
			}

			var deleteEntity = function (entityType, id) {
				if (id == undefined)
					return;
				return apiHelper.delete1(false, entityType + '/' + id);
			}

			var updateEntity = function (entityType, entity) {
				return apiHelper.put(false, entityType.name + '/' + entity._id, entity);
			}

			var getCompanyLogo = function (id, company, force) {
				var deferred = $q.defer();
				force = utils.isDefined(force) ? force : false;
				// Check if logo is cached
				if (!force && !utils.isEmpty(company) && !utils.isEmpty(company.logo) && !utils.isEmpty(company.logo.url)) {
					deferred.resolve(company.logo.url);
					return deferred.promise;
				}
				return apiHelper.get(false, 'company/logo/' + id + '/' + force)
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


			var getTechnologiesSelect2Options = function () {
				return {
					'multiple': true
				};
			}

			var getAreasSelect2Options = function () {
				return {
					'multiple': true
				};
			}

			var getDashboardSelect2Options = function () {
				return {
					minimumResultsForSearch: -1
				};
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

			function getJobsByCompanyAndSkill(skill, companyId) {
				return apiHelper.get(true, 'job/jobsBySkill/' + companyId + '/' + skill)
					.then(function (result) {
						return result.data;
					});
			}

			function createEmptyJob(company) {
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

			function createEmptyCompany(owner) {
				var company = {
					name: "Untitled Company",
					street: '',
					city: '',
					email: '',
					technologies: '',
					logo: null,
					owner: utils.isDefined(owner) ? owner : ''

				};

				return company;
			}

			function createEmptyUser() {
				var defaultMessage = common.DEFAULT_MESSAGE;
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

				return user;
			}

			function setPublish(companyId, publish) {
				return apiHelper.post(false, 'company/' + companyId + '/setPublish/' + publish);
			}

			function isEmailExist(email) {
				if (!email)
					return false;

				return apiHelper.get(true, 'user/isEmailExist/' + email);
			}

			function getCvByUserId(userId) {
				return apiHelper.get(false, 'user/byUserId/' + userId)
					.then(function (result) {
						return result.data;
					});
			}

			function sendFeedback(data) {
				return apiHelper.post(true, 'feedback', {data: data});
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
				, createEmptyCompany: createEmptyCompany

				// Jobs
				, getJobs: getJobs
				, createJob: createJob
				, updateJob: updateJob
				, getJob: getJob
				, deleteJob: deleteJob
				, createEmptyJob: createEmptyJob

				// Users
				, getUsers: getUsers
				, createUser: createUser
				, updateUser: updateUser
				, getUser: getUser
				, deleteUser: deleteUser
				, createEmptyUser: createEmptyUser

				// Cvs
				, createCv: createCv
				, deleteCv: deleteCv
				, getCv: getCv
				, getCvFile: getCvFile
				, getCvs: getCvs
				, analyzeCv: analyzeCv
				, getCvByUserId: getCvByUserId

				, prepareBase64ImgSrc: prepareBase64ImgSrc
				, createEmptyEntity: createEmptyEntity
				, getJobsByCompanyAndSkill: getJobsByCompanyAndSkill
				, isEmailExist: isEmailExist
				, deleteEntity: deleteEntity,
				sendFeedback: sendFeedback
			}
		}
	);



