/**
 * Created by Chen on 26/06/14.
 */

'use strict';

var fs = require('fs')
    , JobService = require('../services/jobService')
    , CompanyService = require('../services/companyService')
    , Job = require('../models/job')
    , Company = require('../models/company')
    , arrayUtils = require('../utils/arrayUtils')
    , mongoose = require('mongoose');


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
function createJob (req, res) {
    var newJob = req.body.job;
    var company = req.body.company;
    newJob.company = company; // set the company on the job

    return JobService.createJob(newJob)
        .then(function (jobCreated) {
            if (!company)
                return jobCreated;

            return CompanyService.getCompany(company)
                .then(function (companyFetched) {
                    return CompanyService.addJob(companyFetched, jobCreated)
                        .then(function () {
                            return jobCreated;
                        });
                })
        })
        .then(function success(job) {
            return res.send(job);
        },
        function error(err) {
            return res.json(500, err);
        });
};

function getJob (req, res) {
    var id = req.params.id;

    return JobService.getJob(id)
        .then(function success(job) {
            return res.send(job);
        },
        function error(err) {
            return res.json(500, err);
        });
}

function getJobs (req, res) {
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
        return CompanyService.getCompany(companyId)
            .then(function success(company) {
                return res.send(company.jobs)
            },
            function error(err) {
                return res.json(500, err);
            }
        );
    }
};

function deleteJob (req, res) {
    var jobId = req.params.id;

    return JobService.getJob(jobId)
        .then(function(job) {
            return CompanyService.deleteJob(job.company, job._id)
        })
        .then(function() {
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
                mergedTechnologies.merge(companyJobs[i].technologies);
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

function isTechnologiesEquals(oldTechnologies, newTechnologies) {
    return oldTechnologies.equals(newTechnologies);
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

function updateJob (req, res) {
    return Job.findById(req.params.id, function (err, job) {
        if (job === undefined || job == null)
            return;

        // Update job with new data
        job.name = req.body.name;
        job.code = req.body.code;
        job.city = req.body.city;
        job.description = req.body.description;

        var newCompany = req.body.company;
        var newTechnologies = req.body.technologies;
        var oldCompany = (job.company) ? job.company.toString() : null;
        var oldTechnologies = job.technologies;

        if (!isTechnologiesEquals(oldTechnologies, newTechnologies)) {
            job.technologies = newTechnologies;
        }

        if (isCompanyChanged(oldCompany, newCompany)) {
            // TODO chen the following update of companies need to be done in Company - only event should be fired from here
            Company.findById(oldCompany, function (err, company) {
                if (company === undefined || company == null)
                    return;

                if (err)
                    return console.log(err);

                company.removeJob(job._id);

                Job.find({'_id':{ $in: company.jobs}}, function(err, jobs) {
                    company.mergeTechnologies(jobs);
                    company.save();
                })
            });

            return Company.findById(newCompany, function (err, company) {
                if (company === undefined || company == null) {
                    job.company = null;
                    return job.save();
                }

                if (err)
                    return console.log(err);

                company.addJob(job._id);
                Job.find({'_id':{ $in: company.jobs}}, function(err, jobs) {
                    company.mergeTechnologies(jobs);
                    company.save();
                })

                // Saving the new company
                job.company = company;

                // New company we need to job.save() it
                return saveJob(job, res);

            });
        }
        else {
            return saveJob(job, res);
        }
    });
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

exports.getAllJobs = function(req, res) {
    var conditions = {};
    if (req.params.id) {
        conditions.company = req.params.id;
    }
    Job.find(conditions).select('company name description city technologies').populate('company').lean()
        .exec(function (err, jobs) {
            if (err) {
                console.log("error while trying to populate jobs:" + err);
            }
            var data = JSON.stringify(jobs);
            return res.send(data);
        })
}
