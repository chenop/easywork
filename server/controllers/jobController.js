/**
 * Created by Chen on 26/06/14.
 */

'use strict';

var fs               = require('fs')
	, JobService     = require('../services/jobService')
	, CompanyService = require('../services/companyService')
	, Job            = require('../models/job')
	, Company        = require('../models/company')
	, arrayUtils     = require('../utils/arrayUtils')
	, mongoose       = require('mongoose');


/***********
 * Public
 ***********/
module.exports = {
	createJob: createJob
	, getJob: getJob
	, getJobs: getJobs
	, updateJob: updateJob
	, deleteJob: deleteJob
}

/**
 * Create a job - also add the job to the company
 * @param req
 * @param res
 * @returns {Promise.<T>|*}
 */
function createJob(req, res) {
	var newJob = req.body.job;
	var company = req.body.company;
	newJob.company = company; // set the company on the job

	return JobService.createJob(newJob)
		.then(function success(job) {
				return res.send(job);
			},
			function error(err) {
				return res.json(500, err);
			});
};

function getJob(req, res) {
	var id = req.params.id;

	return JobService.getJob(id)
		.then(function success(job) {
				return res.send(job);
			},
			function error(err) {
				return res.json(500, err);
			});
}

function getJobs(req, res) {
	var companyId = req.params.id;

	if (!companyId) {
		return JobService.getJobs()
			.then(function success(jobs) {
					return res.send(jobs);
				},
				function error(err) {
					return res.json(500, err);
				});
	}
	else {
		// Got companyId --> got jobs of this company only
		return JobService.getJobs(companyId)
			.then(function success(jobs) {
					return res.send(jobs)
				},
				function error(err) {
					return res.json(500, err);
				}
			);
	}
};

function deleteJob(req, res) {
	var jobId = req.params.id;

	return JobService.getJob(jobId)
		.then(function () {
			return JobService.deleteJob(jobId);
		})
		.then(function success(job) {
				return res.send(job);
			},
			function error(err) {
				return res.json(500, err);
			});
}

function updateCompanyAfterJobChange(company, jobId) {
	Company.findById(company, function (err, company) {
		if (company === undefined || company == null)
			return;

		if (err)
			return console.log(err);

		Job.find({company: company}, function (err, companyJobs) {

			var jobIndex = company.jobs.indexOf(jobId);
			company.jobs.splice(jobIndex, 1);

			var mergedTechnologies = [];
			for (var i = 0; i < companyJobs.length; i++) {
				mergedTechnologies.merge(companyJobs[i].skills);
			}

			company.technologies = mergedTechnologies;

			company.save();

		});
	});
}

function isCompanyChanged(oldCompany, newCompany) {
	if (!oldCompany && !newCompany)
		return false;

	if (!oldCompany && newCompany)
		return true;

	if (oldCompany && !newCompany)
		return true;

	return oldCompany !== newCompany;
}

/**
 * Update user details (except file)
 * @param id
 * @param newUser
 * @param callBack
 * @returns {*}
 */
function updateJob(id, newJob, callBack) {
	return Job.findById(id, function (err, job) {
		if ('undefined' !== typeof newJob.name)
			job.name = newJob.name;
		if ('undefined' !== typeof newJob.code)
			job.code = newJob.code;
		if ('undefined' !== typeof newJob.description)
			job.description = newJob.description;
		if ('undefined' !== typeof newJob.company)
			job.company = newJob.company;
		if ('undefined' !== typeof newJob.city)
			job.city = newJob.city;
		return job.save(callBack);
	});
}

function updateJob(req, res) {
	var job = req.body;

	return JobService.updateJob(job).
	then(function success(job) {
			return res.send(job);
		},
		function error(err) {
			return res.json(500, err);
		}
	);
};

function saveJob(job, res) {
	return job.save(function (err) {
		if (err) {
			console.log(err);
			return res.json(500, err);
		}
		return res.send(job);
	});
}

// Delete job shold update company the same way (observer) should be impleneted in updateJob
function deleteJob0(job, company, res) {
	return job.remove(function (err) {
		if (!err) {
			if (company) {
				updateCompanyAfterJobChange(company, job._id);
			}
			return res.send(job);
		} else {
			console.log(err);
			return res.json(401, err);
		}
	});
}

exports.getAllJobs = function (req, res) {
	var conditions = {};
	if (req.params.id) {
		conditions.company = req.params.id;
	}
	Job.find(conditions).select('company name description city skills').populate('company').lean()
		.exec(function (err, jobs) {
			if (err) {
				console.log("error while trying to populate jobs:" + err);
			}
			var data = JSON.stringify(jobs);
			return res.send(data);
		})
}
