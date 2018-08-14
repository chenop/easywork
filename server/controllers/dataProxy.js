/**
 * Created by Chen on 06/03/14.
 */

var SkillService = require('../services/skillService');
var docParserApi  = require("../api/docParserApi");

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

exports.getFiltersData = function (req, res) {
    return docParserApi.getKeywords()
        .then(function(result) {
            data.skills = result;
            return res.send(data);
        });
};

