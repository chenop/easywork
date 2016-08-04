/**
 * Created by Chen on 06/07/2014.
 */

var fs = require('fs');

function getUniqueFileName(fullFileName) {

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

function getExtension(fileName) {
    var periodIndex = fileName.lastIndexOf('.');
    var fileType = fileName.substr(periodIndex + 1, fileName.length - 1);

    return fileType;
}

function getFileName(fileName) {
    var periodIndex = fileName.lastIndexOf('.');
    var fileName = fileName.substr(0, periodIndex) || fileName;

    return fileName;
}

function isDefined (value) {
    return typeof value !== 'undefined' && value !== null;
}

function isUndefined (obj) {
    return !isDefined(obj);
}

function isEmpty(text) {
    return (!text || text.length === 0 || !text.trim());
}

function isEmptyArray(arr) {
    return (Array.isArray(arr) && arr.length > 0);
}

module.exports = {
    getUniqueFileName: getUniqueFileName
    , getExtension: getExtension
    , getFileName: getFileName
    , isDefined: isDefined
    , isUndefined: isUndefined
    , isEmptyArray: isEmptyArray
    , isEmpty: isEmpty
}