/**
 * Created by Chen.Oppenhaim on 10/2/2016.
 */
var Cv = require('../models/cv');
var utils = require('../utils/utils');
/***********
 * Public
 ***********/
module.exports = {
    getSkills: getSkills
};
/***********
 * Private
 ***********/
function getSkills() {
    return Cv.aggregate([
        // Group on the compound key and get the occurrences first
        {
            "$group": {
                "_id": {},
                "skills": { "$push": "$skills" }
            }
        },
        // Unwind twice because "$skills" is now an array of arrays
        { "$unwind": "$skills" },
        { "$unwind": "$skills" },
        // Now use $addToSet to get the distinct values
        {
            "$group": {
                "_id": "$_id",
                "skills": { "$addToSet": "$skills" }
            }
        },
    ]).exec()
        .then(function (result) {
			// Extract the skills array
	        if (!Array.isArray(result)
	            || utils.isEmptyArray(result)
	            || utils.isUndefined(result[0].skills)) {
	            return Promise.reject();
	        }
	        return result[0].skills;
    });
}
//# sourceMappingURL=skillService.js.map