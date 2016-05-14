/**
 * User: chenop
 * Date: 12/19/13
 * Time: 11:46 AM
 *
 * Company model
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var companySchema = new Schema({
    name: String
    , site : String
    , description : String
    , street: String
    , locations: [
        {
            street: String
            , city: String
        }
    ]
    , addresses: [
        {type: String}
    ]
    , city: String
    , email: String
    , technologies: [
        {
            type: String,
            jobs: [{ type: Schema.Types.ObjectId, ref: 'Job'}] // TODO this is the solution... now maintain that...
        }
    ]
    , logo: {
        data: Buffer,
        url: String
    }
    , owner: { type: Schema.Types.ObjectId, ref: 'User'}
    , jobs: [{ type: Schema.Types.ObjectId, ref: 'Job'}]
    ,  publish: { type: Boolean, default: true }
});

companySchema.methods.mergeTechnologies = function(jobs) {

    var mergedTechnologies = [];
    for (var i = 0; i < jobs.length; i++) {
        mergedTechnologies = mergedTechnologies.merge(jobs[i].technologies);
    }

    this.technologies = mergedTechnologies;
}

companySchema.methods.removeJob = function(jobIdToRemove) {
    var jobIndex = this.jobs.indexOf(jobIdToRemove);
    this.jobs.splice(jobIndex, 1);
}

companySchema.methods.addJob = function(jobId) {
    this.jobs.push(jobId)
}

var Company = mongoose.model('Company', companySchema);
module.exports = Company;