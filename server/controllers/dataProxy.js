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
    skills: [".NET","AJAX","Android","AngularJS","ASP.NET","B.A.","B.Sc","B.sc.","C#","C++","CSS","ERP","Flash","GUI","HTML","IOS","java","JavaScript","JQuery","MySQL","Office","Oracle","Perl","PhoneGap","Photoshop","QA","SAP","SQL","SQLite","Visual Basic","Web","אדריכל","אופיס","ארכיטקט","בגרות","הנדסאי","הנהלת חשבונות","טכנאי","מהנדס","מהנדס ביצוע","מזכירה","מכירות","מנהלת משרד","מפקח","משאבי אנוש","סייעת","קלינאית תקשורת","רכז גיוס","רכזת גיוס","רכש","שירות לקוחות","שרות לקוחות","שרטט","תואר ראשון"]
};

exports.getFiltersData = function (req, res) {
    return res.send(data);

    // 15/08/2018 Since this extra call to docParserApi took a long time (probably due to docParser's sandbox mode - I decided to return skills hardcoded
    // return docParserApi.getKeywords()
    //     .then(function(result) {
    //         data.skills = result;
    //         return res.send(data);
    //     });
};

