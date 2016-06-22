/**
 * User: chenop
 * Date: 12/19/13
 * Time: 11:46 AM
 *
 * User model
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var cvSchema = new Schema({
        user: {type: Schema.Types.ObjectId, ref: 'User'}
        , fileData: String // Saving binary file data in base64 representation
        , skills: [String]
        , fileName: String
        , fileType: String
    }
    ,
    {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    }
);

//cvSchema.virtual('fileDataBase64').get(function () {
//    if (!this.fileData)
//        return;
//    return this.fileData.toString("base64");
//});

module.exports = mongoose.model('Cv', cvSchema);