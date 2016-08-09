/**
 * Created by Chen on 09/01/2016.
 */

var Job     = require('../models/job')

/***********
 * Public
 ***********/
module.exports = {
    createJob: createJob
    , updateJob: updateJob
    , deleteJob: deleteJob
    , getJob: getJob
    , getJobs: getJobs
}

/***********
 * Private
 ***********/
function createJob(job) {
    var jobInstance = createJobInstance(job);

    return jobInstance.save();
}

function updateJob(job) {
    var jobInstance = createJobInstance(job);
    jobInstance._id = job._id;

    var upsertJob = jobInstance.toObject();
    return Job.findOneAndUpdate({'code': job.code}, upsertJob, {upsert: true, new: true}).lean().exec();
}

function createJobInstance(job) {
    var newJob = new Job(
        {
            name: job.name
            , code: job.code
            , city: job.city
            , description: job.description
            , company: job.company
        }
    );

    return newJob;
}

function deleteJob(id) {
    return Job.remove({_id: id}).exec();
}

function getJob(jobId) {
    return Job.findById(jobId).lean().exec();
}

function getJobs() {
    return Job.find().exec();
}

