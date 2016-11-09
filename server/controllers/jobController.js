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
	, getJobsByCompanyAndSkill: getJobsByCompanyAndSkill
}

/**
 * Create a job - also add the job to the company
 * @param req
 * @param res
 * @returns {Promise.<T>|*}
 */
function createJob(req, res) {
	var newJob = req.body.job;

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

function updateJob(req, res) {
	var job = req.body;

	return JobService.updateJob(job).
		then(function success(job) {
			return res.send(job);
		},
		function error(err) {
			return res.json(500, err);
		});
}

function getJobsByCompanyAndSkill (req, res) {
	var companyId = req.params.companyId;
	var skill = req.params.skill;

	return JobService.getJobsByCompanyAndSkill(companyId, skill)
		.then(function success(jobs) {
			return res.send(jobs);
		},
		function error(err) {
			return res.json(500, err);
		});
}
