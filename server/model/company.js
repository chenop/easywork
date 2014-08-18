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
    , street: String
    , addresses: [
        {type: String}
    ]
    , city: String
    , email: String
    , technologies: [
        {type: String}
    ]
    , logo: {
        data: Buffer
    }
    , owner: { type: Schema.Types.ObjectId, ref: 'User'}
    , jobs: [{ type: Schema.Types.ObjectId, ref: 'Job'}]
});

module.exports = mongoose.model('Company', companySchema);