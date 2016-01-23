/**
 * Created by Chen on 08/01/2016.
 */
'use strict';

var JobService = require('../server/services/jobService');
var JobModel = require('../server/models/job');
var utils = require('./testUtils');
var should = require('chai').should();

describe('Job service - Testing CRUD operations', function () {
    this.timeout(15000);
    describe('Create', function () {
        it('should return the job after created', function () {
            var newJob = utils.createMockedJobPlainObject("Job at Toluna");

            return JobService.createOrUpdateJob(newJob)
                .then(function (createdJob) {
                    // verify that the returned job is what we expect
                    createdJob.name.should.equal('Job at Toluna');
                    createdJob.city.should.equal('Haifa');
                });
        });
    });

    describe('Read', function () {
        it('should get job', function () {
            var newJob = utils.createMockedJobPlainObject("Toluna");

            return JobService.createOrUpdateJob(newJob)
                .then(function(createdJob) {
                    return JobService.getJob(createdJob.id)
                })
                .then(function(fetchedJob){
                    // verify that the returned job is what we expect
                    fetchedJob.name.should.equal('Toluna');
                    fetchedJob.city.should.equal('Haifa');

                    return JobModel.count({'name': fetchedJob.name}).exec()
                        .then(function (count) {
                            count.should.equal(1);
                        })
                });
        });

        it('should get jobs', function() {
            var toluna = utils.createMockedJobPlainObject('Toluna');
            var intel = utils.createMockedJobPlainObject('Intel');

            return JobService.createOrUpdateJob(toluna)
                .then(function() {
                    return JobService.createOrUpdateJob(intel);
                })
                .then(function() {
                    return JobService.getJobs();
                })
                .then(function(jobs){
                    jobs.length.should.equal(2);
                });
        })
    })

    describe('Update', function () {
        it('should return the updated job', function () {
            var newJob = utils.createMockedJobPlainObject("Toluna");

            // First cal to create
            return JobService.createOrUpdateJob(newJob)
                .then(function (createdJob) {
                    createdJob.name = "Intel";

                    // Second call to update
                    return JobService.createOrUpdateJob(createdJob)
                        .then(function (updatedJob) {
                            // verify that the returned job is what we expect
                            updatedJob.name.should.equal('Intel');

                            return JobModel.count({'name': updatedJob.name}).exec()
                                .then(function (count) {
                                    count.should.equal(1);
                                })
                        });
                });
        });
    });

    describe('Delete', function () {
        it('should not found the deleted job', function () {
            var newJob = utils.createMockedJobPlainObject("Toluna");

            return JobService.createOrUpdateJob(newJob)
                .then(function(createJob) {
                    return JobService.deleteJob(createJob._id);
                })
                .then(JobModel.count({'email': newJob.email}).exec()
                    .then(function (count) {
                        count.should.equal(0);
                    }));
        });
    });
});