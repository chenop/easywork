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
        {type: String}
    ]
    , logo: {
        data: Buffer,
        url: String
    }
    , isLogoExists: Boolean
    , owner: { type: Schema.Types.ObjectId, ref: 'User'}
    , jobs: [{ type: Schema.Types.ObjectId, ref: 'Job'}]
});

module.exports = mongoose.model('Company', companySchema);