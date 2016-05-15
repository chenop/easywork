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


