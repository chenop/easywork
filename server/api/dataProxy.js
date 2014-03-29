/**
 * Created by Chen on 06/03/14.
 */

exports.getFiltersData = function (req, res) {
    var data = {
        areas: ['North', 'Haifa', 'Yoqneaam', 'Migdal Haeemek', 'Center', 'Tel Aviv', 'Rosh Haain'],
        technologies: ['Java', 'C#', 'Web', 'UI', 'GUI', 'AngularJS', 'HTML', 'CSS', 'C++']
    }
    return res.send(data);
};
