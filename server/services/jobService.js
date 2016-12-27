/**
 * Created by Chen on 09/01/2016.
 */

var Job     = require('../models/job');
const utils = require('../utils/utils');
var SkillService = require('./skillService');

/***********
 * Public
 ***********/
module.exports = {
    createJob: createJob
    , updateJob: updateJob
    , deleteJob: deleteJob
    , getJob: getJob
    , getJobs: getJobs
    , getCompanyNeededSkills: getCompanyNeededSkills
    , getCompaniesNeededSkills: getCompaniesNeededSkills
    , getJobsByCompanyAndSkill: getJobsByCompanyAndSkill
	, getRelevantJobs: getRelevantJobs
};

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
    return Job.findOneAndUpdate({'_id': job._id}, upsertJob, {upsert: true, new: true}).lean().exec();
}

function createJobInstance(job) {
    var newJob = new Job(
        {
            name: job.name
            , code: job.code
            , city: job.city
            , description: job.description
            , company: job.company
            , skills: job.skills
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

function getJobs(companyId) {
    var conditions = {};

    if (utils.isDefined(companyId))
        conditions = {"company" : companyId}
    return Job.find(conditions).exec();
}

function concatSkills(skills, job) {
    skills = skills.concat(job.skills.filter(function (item) { // concatenating all jobs skills and filter duplications
            return skills.indexOf(item) < 0;
        }));
    return skills;
}
function getCompanyNeededSkills(companyId) {
    return Job.find({company: companyId}).lean().exec()
        .then(function (jobs) {
            var skills = [];
            for (var i = 0; i < jobs.length; i++) {
                var job = jobs[i];
                if (job.skills && job.skills.length > 0) {
                    skills = concatSkills(skills, job);
                }
            }
            return skills;
        })
}

function getCompaniesNeededSkills() {
    var companies = {};
    return Job.find().exec()
        .then(function(jobs) {
            jobs.forEach(function(job) {
                if (job && job.company && job.skills) {
                    if (!companies[job.company.toString()])
                        companies[job.company.toString()] = job.skills;
                    else {
                        var skills = companies[job.company.toString()];
                        companies[job.company.toString()] = concatSkills(skills, job);
                    }

                }
            })
            return companies;
        })
}

function getJobsByCompanyAndSkill(company, skill) {
    return Job.find({
        company: company,
        skills: skill
    }).lean().exec();
}

function getRelevantJobs(skills) {
	var query = SkillService.prepareSkillsQuery(new SkillService.SearchCriteria(skills) );
	return Job.find(query).populate('company').lean().exec();
}