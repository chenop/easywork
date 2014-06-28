/**
 * User: chenop
 * Date: 12/19/13
 * Time: 11:46 AM
 *
 * User model
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var jobSchema = new Schema({
    name: String
    , userId: String
    , code: String
    , description: String
});

module.exports = mongoose.model('Job', jobSchema);