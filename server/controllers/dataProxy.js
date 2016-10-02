/**
 * Created by Chen on 06/03/14.
 */

var SkillService = require('../services/skillService.ts');

exports.getFiltersData = function (req, res) {
    var data = {
        areas: [
            'ירושליים'
            , 'תל אביב'
            , 'יקום'
            , 'חיפה'
            , 'קרית גת'
            , 'פתח תקוה'
            , 'יקנעם'
            , 'ראש העין'
            , 'בני ברק'
            , 'ראשון לציון'
            , 'קיסריה'
            , 'מגדל העמק'
            , 'רמת גן'
            , 'גבעתיים'
            , 'הרצלייה'
            , 'יהוד'
            , 'אור יהודה'
            , 'רחובות'
            , 'גבעת שמואל'
            , 'כפר סבא'
            , 'רעננה'
            , 'חולון'
            , 'רמת השרון'
            , 'הוד השרון'
            , 'יבנה'
            , 'קרית מוצקין'
            , 'קרית ביאליק'
            , 'טירת הכרמל'
            , 'באר שבע'
            , 'אילת'
            , 'חדרה'
            , 'נתניה'
        ],
    };

    return SkillService.getSkills()
        .then(function(result) {
            data.technologies = result;
            return res.send(data);
        });
};

