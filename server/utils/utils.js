/**
 * Created by Chen on 06/07/2014.
 */

var fs = require('fs');

module.exports.getUniqueFileName = function(fullFileName) {

    if (!fs.existsSync(fullFileName)) {
        return fullFileName;
    }

    var fileExist = true;
    var fileNumber = 1;
    var periodIndex = fullFileName.lastIndexOf('.');
    var fileName = fullFileName.substr(0, periodIndex) || fullFileName;
    var fileType = fullFileName.substr(periodIndex + 1, fullFileName.length - 1);

    while (fileExist) {

        fileNumber_str = fileNumber.toString();
        var current = fileName + '(' + fileNumber_str + ').' + fileType;

        if (fs.existsSync(current)) {
            fileNumber++;
        } else {
            return current
        }
    }
}

module.exports.getExtension = function(fileName) {
    var periodIndex = fileName.lastIndexOf('.');
    var fileType = fileName.substr(periodIndex + 1, fileName.length - 1);

    return fileType;
}

module.exports.getFileName = function(fileName) {
    var periodIndex = fileName.lastIndexOf('.');
    var fileName = fileName.substr(0, periodIndex) || fileName;

    return fileName;
}

module.exports.isUndefine = function(value){return typeof value === 'undefined';}