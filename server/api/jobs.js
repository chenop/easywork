/**
 * Created by Chen on 26/06/14.
 */

'use strict';

var fs = require('fs')
    , passport = require('passport')
    , Job = require('../model/job')
    , Company = require('../model/company')
    , mongoose = require('mongoose');

Array.prototype.equals = function (array, strict) {
    if (!array)
        return false;

    if (arguments.length == 1)
        strict = true;

    if (this.length != array.length)
        return false;

    for (var i = 0; i < this.length; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i], strict))
                return false;
        }
        else if (strict && this[i] != array[i]) {
            return false;
        }
        else if (!strict) {
            return this.sort().equals(array.sort(), true);
        }
    }
    return true;
}

Array.prototype.merge = function(/* variable number of arrays */){
    for(var i = 0; i < arguments.length; i++){
        var array = arguments[i];
        for(var j = 0; j < array.length; j++){
            if(this.indexOf(array[j]) === -1) {
                this.push(array[j]);
            }
        }
    }
    return this;
};

exports.createJob = function (req, res) {
    return Company.findById(req.body.company, function(err, company) {

        var newJob = new Job(
            {
                name: req.body.name
                , code: req.body.code
                , description: req.body.description
                , city: req.body.city
                , technologies: req.body.technologies
                , company: company
            }
        );

        // Adding job to company
        company.jobs.push(newJob);
        return company.save(function (err) {
            if (err) {
                console.log("Error saving job in company " + company.name);
            }

            return newJob.save(function (err) {
                if (!err) {
                    console.log("job " + newJob["name"] + " create in server")
                    return res.send(newJob);
                } else {
                    console.log(err);
                    return res.json(401, err);
                }
            });
        })
    })
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
function companyUpdateIsNeeded(job, newTechnologies, newCompany) {
    return !job.technologies.equals(newTechnologies) || job.company !== newCompany;
}

exports.updateJob = function (req, res) {
    return Job.findById(req.params.id, function (err, job) {
        if (job === undefined || job == null)
            return;

        // Update job with new data
        job.name = req.body.name;
        job.code = req.body.code;
        job.city = req.body.city;
        job.description = req.body.description;

        if (companyUpdateIsNeeded(job, req.body.technologies, req.body.company)) {
            job.technologies = req.body.technologies;
            var newCompany = req.body.company;
            var oldCompany = job.company;

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

            Company.findById(newCompany, function (err, company) {
                if (company === undefined || company == null)
                    return;

                if (err)
                    return console.log(err);

                company.addJob(job._id);
                Job.find({'_id':{ $in: company.jobs}}, function(err, jobs) {
                    company.mergeTechnologies(jobs);
                    company.save();
                })

            });

            job.company = mongoose.Schema.Types.ObjectId(newCompany);

            return job.save(function (err) {
                if (!err) {
                    console.log("updated");
                } else {
                    console.log(err);
                    return res.json(401, err);
                }
                return res.send(job);
            });
        }
    });
};

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
exports.deleteJob = function (req, res) {
    var jobId = req.params.id;
    return Job.findById(jobId, function (err, job) {
        // Remove job from company
        if (!job) {
            return res.json(501, "job not found");
        }

        var company = job.company;
        if (company !== null && company !== undefined) {
            return Company.findById(company, function (err, company) {
                if (company === null || company === undefined)
                    return;

                company.jobs.remove(jobId);

                return company.save(function(err, savedCompany) {

                    // Remove job from collection jobs
                    return deleteJob0(job, company, res);
                });
            })
        }
        else {
            // In case its a job that no company were set to
            deleteJob0(job, null, res);
        }
    });
}

exports.getJob = function (req, res) {
    return Job.findById(req.params.id, function (err, job) {
        if (!err) {
            return res.send(job);
        } else {
            return console.log(err);
        }
    });
}

exports.getJobs = function (req, res) {
    return getJobsByCompanyId(req.params.id);
};

var getJobsByCompanyId = function(companyId, callback) {
    return Job.find({'company': companyId}, function (err, jobs) {
        if (!err) {
            if (callback) {
                callback(jobs)
            }
            else {
                return jobs;
            }
        } else {
            return console.log(err);
        }
    });
}

exports.getJobsByCompanyId = getJobsByCompanyId;

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
