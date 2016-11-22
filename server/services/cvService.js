/**
 * Created by Chen.Oppenhaim on 5/15/2016.
 */

var Cv = require('../models/cv');
var utils = require('../utils/utils');

var BoolOperator = {
	OR: 0,
	AND: 1
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
	return Cv.findById(cvId).exec();
}

var prepareFilter = function (filter) {
	if (!filter)
		return {};

	if (!filter.operator)
		filter.operator = BoolOperator.OR;

	if (filter.skills) {
		if (filter.operator === BoolOperator.OR) {
			if (Array.isArray(filter.skills)) {
				filter = {skills: {"$in": filter.skills}};
			}

			if (utils.isString(filter.skills)) {
				filter = {skills: {"$in": [filter.skills]}};
			}
		}
		else { // AND
			filter = {
				skills: filter.skills
			}
		}
	}

	return filter;
}

function getCvs(filter) {
	var filter = prepareFilter(filter);

	return Cv.find(filter).sort('-createdAt').select('-fileData -fileType');
}

/***********
 * Public
 ***********/
module.exports = {
	createCv: createCv
	, getCv: getCv
	, getCvs: getCvs
	, updateCv: updateCv
	, deleteCv: deleteCv
	, BoolOperator: BoolOperator
}
