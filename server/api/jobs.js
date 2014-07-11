/**
 * Created by Chen on 26/06/14.
 */

'use strict';

var fs = require('fs')
    , passport = require('passport')
    , Job = require('../model/job')

exports.createJob = function (req, res) {
    var newJob = new Job(
        {
            name: req.body.name, userId: req.body.userId, code: req.body.code, description: req.body.description
        }
    );
    newJob.save(function (err) {
        if (!err) {
            console.log("job " + newJob.name + " create in server")
            return res.send(newJob);
        } else {
            console.log(err);
        }
    });
    return res.send(newJob);
}

exports.updateJob = function (req, res) {
    return Job.findById(req.params.id, function (err, job) {
        job.name = req.body.name
            , job.code = req.body.code
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
    return Job.findById(req.params.id, function (err, job) {
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
    return Job.find({ 'userId': req.params.id}, function (err, jobs) {
        if (!err) {
            return res.send(jobs);
        } else {
            return console.log(err);
        }
    });
};
