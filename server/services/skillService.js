/**
 * Created by Chen.Oppenhaim on 10/2/2016.
 */
var Cv = require('../models/cv');
var utils = require('../utils/utils');
var BoolOperator = {
    OR: 0,
    AND: 1
};
/***********
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
            return Promise.reject();
        }
        return result[0].skills;
    });
}
function prepareSkillsFilter(filter) {
    if (!filter)
        return {};
    if (!filter.operator)
        filter.operator = BoolOperator.OR;
    if (filter.skills) {
        if (filter.operator === BoolOperator.OR) {
            if (Array.isArray(filter.skills)) {
                filter = { skills: { "$in": filter.skills } };
            }
            if (utils.isString(filter.skills)) {
                filter = { skills: { "$in": [filter.skills] } };
            }
        }
        else {
            filter = {
                skills: filter.skills
            };
        }
    }
    return filter;
}
var SearchCriteria = (function () {
    function SearchCriteria(skills, boolOperator) {
        this.boolOperator = BoolOperator.OR;
        skills = skills;
        boolOperator = boolOperator;
    }
    return SearchCriteria;
})();
/***********
 * Public
 ***********/
module.exports = {
    getSkills: getSkills,
    prepareSkillsFilter: prepareSkillsFilter,
    BoolOperator: BoolOperator,
    SearchCriteria: SearchCriteria
};
//# sourceMappingURL=skillService.js.map