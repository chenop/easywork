/**
 * Created by Chen.Oppenhaim on 10/2/2016.
 */

var SkillService = require('../services/skillService.ts')

/***********
 * Public
 ***********/
module.exports = {
    getSkills: getSkills
}

/***********
 * Private
 ***********/

function getSkills() {
    return SkillService.getSkills()
        .then(function success(skills) {
                return res.send(skills);
            },
            function error(err) {
                return res.status(500).json(err)
            }
        );
}
