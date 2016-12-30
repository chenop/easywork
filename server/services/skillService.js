/**
 * Created by Chen.Oppenhaim on 10/2/2016.
 */
"use strict";
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
        if (!Array.isArray(result)
            || utils.isEmptyArray(result)
            || utils.isUndefined(result[0].skills)) {
            return Promise.reject("Error");
        }
        return result[0].skills;
    });
}
(function (BoolOperator) {
    BoolOperator[BoolOperator["OR"] = 0] = "OR";
    BoolOperator[BoolOperator["AND"] = 1] = "AND";
})(exports.BoolOperator || (exports.BoolOperator = {}));
var BoolOperator = exports.BoolOperator;
var SearchCriteria = (function () {
    function SearchCriteria(skills, boolOperator) {
        this.boolOperator = BoolOperator.OR;
        this.skills = skills;
        this.boolOperator = boolOperator;
    }
    SearchCriteria.prototype.isBoolOperator = function (boolOperator) {
        return this.boolOperator === boolOperator;
    };
    return SearchCriteria;
}());
exports.SearchCriteria = SearchCriteria;
function prepareSkillsQuery(searchCriteria) {
    var query = {};
    if (!searchCriteria)
        return query;
    if (!searchCriteria.boolOperator)
        searchCriteria.boolOperator = BoolOperator.OR;
    if (searchCriteria.skills) {
        if (searchCriteria.isBoolOperator(BoolOperator.OR)) {
            if (Array.isArray(searchCriteria.skills)) {
                query = { skills: { "$in": searchCriteria.skills } };
            }
            if (utils.isString(searchCriteria.skills)) {
                query = { skills: { "$in": [searchCriteria.skills] } };
            }
        }
        else {
            query = {
                skills: searchCriteria.skills
            };
        }
    }
    return query;
}
/***********
 * Public
 ***********/
module.exports = {
    getSkills: getSkills,
    prepareSkillsQuery: prepareSkillsQuery,
    BoolOperator: BoolOperator,
    SearchCriteria: SearchCriteria
};
