/**
 * Created by Chen.Oppenhaim on 5/15/2016.
 */

var Cv = require('../models/cv');

/***********
 * Public
 ***********/
module.exports = {
    createCv: createCv
    , getCv: getCv
    , getCvs: getCvs
    , updateCv: updateCv
    , deleteCv: deleteCv
}

function createCv(cv) {
    var cvInstance = createCvInstance(cv);

    return cvInstance.save();
}

function createCvInstance(cv) {
    if (!cv) {
        return new Cv();
    }

    var fileType = cv.fileData.split(',')[0];
    var fileData = cv.fileData.split(',')[1];

    var newCv = new Cv(
        {
            user: cv.userId
            , fileData: fileData //new Buffer(fileData, "base64")
            , fileType: fileType
            , fileName: cv.fileName
            , skills: cv.skills
        }
    );

    return newCv;
}

function updateCv(cv) {
    var cvInstance = createCvInstance(cv);
    cvInstance._id = cv._id;

    var upsertCv = cvInstance.toObject();
    return Cv.findOneAndUpdate({'_id': cv._id}, upsertCv, {upsert: true, new: true}).lean().exec();
}


function deleteCv(id) {
    return Cv.remove({_id: id}).exec();
}

function getCv(cvId) {
    return Cv.findById(cvId).lean().exec();
}

function getCvs() {
    return Cv.find({}).select('-fileData -fileType').lean().exec();
}

