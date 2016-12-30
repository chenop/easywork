/**
 * Created by Chen.Oppenhaim on 10/2/2016.
 */

var Cv = require('../models/cv');
var utils = require('../utils/utils');

/**********
 * Private
 ***********/

/**
 * Aggregate all skills in all the CVs - no duplication
 * @returns {Promise<U>}
 */
function getSkills() {
	return Cv.aggregate([
		// Group on the compound key and get the occurrences first
		{
			"$group": {
				"_id": {},
				"skills": {"$push": "$skills"}
			}
		},
		// Unwind twice because "$skills" is now an array of arrays
		{"$unwind": "$skills"},
		{"$unwind": "$skills"},
		// Now use $addToSet to get the distinct values
		{
			"$group": {
				"_id": "$_id",
				"skills": {"$addToSet": "$skills"}
			}
		},
	]).exec()
		.then(function(result) {
			if (!Array.isArray(result)
			|| utils.isEmptyArray(result)
			|| utils.isUndefined(result[0].skills)) {

				return Promise.reject("Error");
			}

			return result[0].skills;
		});
}

export enum BoolOperator {
    OR,
    AND
}

export class SearchCriteria {
    skills: string[];
    boolOperator: number = BoolOperator.OR;
    public companyId: string;

    constructor(skills: string[], boolOperator: number) {
        this.skills = skills;
        this.boolOperator = boolOperator;
    }

    public isBoolOperator(boolOperator: BoolOperator) {
        return this.boolOperator === boolOperator;
    }
}

function prepareSkillsQuery(searchCriteria: SearchCriteria) {
    var query = {};

    if (!searchCriteria)
        return query;

    if (!searchCriteria.boolOperator)
        searchCriteria.boolOperator = BoolOperator.OR;

    if (searchCriteria.skills) {
        if (searchCriteria.isBoolOperator(BoolOperator.OR)) {
            if (Array.isArray(searchCriteria.skills)) {
                query = {skills: {"$in": searchCriteria.skills}};
            }

            if (utils.isString(searchCriteria.skills)) {
                query = {skills: {"$in": [searchCriteria.skills]}};
            }
        }
        else { // AND
            query = {
                skills: searchCriteria.skills
            }
        }
    }

    return query;
}


/***********
 * Public
 ***********/
module.exports = {
    getSkills: getSkills
    , prepareSkillsQuery: prepareSkillsQuery
    , BoolOperator: BoolOperator
    , SearchCriteria: SearchCriteria
}
