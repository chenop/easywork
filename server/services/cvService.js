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

    var newCv = new Cv(
        {
            user: cv.user
            , fileData: cv.fileData
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
    return Cv.findOneAndUpdate({'_id': cv._id}, upsertCv, {upsert: true, new: true}).exec();
}


function deleteCv(id) {
    return Cv.findById(id).exec()
        .then(function (cv) {
            if (cv == undefined || cv == null)
                return;

            return cv.remove();
        });
}

function getCv(cvId) {
    return Cv.findById(cvId).exec();
}

function getCvs() {
    return Cv.find({}).exec();
}


