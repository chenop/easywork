/**
 * Created by Chen on 06/03/14.
 */

var users = require('./users')
    , Job = require('../model/job')

exports.getFiltersData = function (req, res) {
    var data = {
        areas: ['North', 'Haifa', 'Yoqneaam', 'Migdal Haeemek', 'Center', 'Tel Aviv', 'Rosh Haain'],
        technologies: ['Java', 'C#', 'Web', 'UI', 'GUI', 'AngularJS', 'HTML', 'CSS', 'C++']
    }
    return res.send(data);
};

exports.getAllJobs = function(req, res) {
    var allJobs = [];
    return Job.find({ 'userId': req.params.id}, function (err, jobs) {

    })
    users.for(function(user) {
        if (user.role !== "jobProvider") {
            return;
        }
    })
}
