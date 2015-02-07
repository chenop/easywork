/**
 * Created by Chen on 26/06/14.
 */

'use strict';

var fs = require('fs')
    , passport = require('passport')
    , Job = require('../model/job')
    , Company = require('../model/company')

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
        company.save(function (err) {
            if (err) {
                console.log("Error saving job in company " + company.name);
            }
        })

        newJob.save(function (err) {
            if (!err) {
                console.log("job " + newJob.name + " create in server")
                return res.send(newJob);
            } else {
                console.log(err);
            }
        });
        return res.send(newJob);
    })
}

exports.updateJob = function (req, res) {
    return Job.findById(req.params.id, function (err, job) {
        if (job === undefined || job == null)
            return;
        job.name = req.body.name
            , job.code = req.body.code
            , job.city = req.body.city
            , job.technologies = req.body.technologies
            , job.description = req.body.description

        return job.save(function (err) {
            if (!err) {
                console.log("updated");
            } else {
                console.log(err);
                return res.json(401, err);
            }
            return res.send(job);
        });
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
        return job.save(callBack);
    });
}

exports.deleteJob = function (req, res) {
    var jobId = req.params.id;
    return Job.findById(jobId, function (err, job) {
        // Remove job from company
        var company = job.company;
        if (company !== null || company !== undefined) {
            Company.findById(company, function (err, company) {
                if (company === null || company === undefined)
                    return;
                company.jobs.remove(jobId);
                company.save();
            })
        }

        // Remove job from collection jobs
        return job.remove(function (err) {
            if (!err) {
                return res.send(job);
            } else {
                console.log(err);
            }
        });
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
    return Job.find({ 'company': req.params.id}, function (err, jobs) {
        if (!err) {
            return res.send(jobs);
        } else {
            return console.log(err);
        }
    });
};

exports.getAllJobs = function(req, res) {
    Job.find().select('company name description city technologies').populate('company').lean()
        .exec(function (err, jobs) {
            if (err) {
                console.log("error while trying to populate jobs:" + err);
            }
            var data = JSON.stringify(jobs);
            return res.send(data);
        })
}
