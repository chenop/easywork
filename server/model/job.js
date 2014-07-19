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
    , code: String
    , description: String
    , city: String
    , technologies: [
        {type: String}
    ]
    , company: { type: Schema.Types.ObjectId, ref: 'Company'}
});

module.exports = mongoose.model('Job', jobSchema);