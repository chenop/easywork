/**
 * Created by Chen on 16/05/14.
 */

var dict = {
    "java": false, "javascript": false, "c#": false, "perl": false, "web": false, "angularjs": false, "oop": false
}

angular.module('easywork.services.cvParser', [])
    .factory('cvParser', function ($q) {

        function parseDocx(event) {
            var htmlContent = docx(btoa(event.target.result));
            var text = "";
            for (var i = 0; i < htmlContent.DOM.length; i++) {
                text += htmlContent.DOM[i].innerHTML + " ";
            }
            var result = extractKeywords(text);
            return result;
        }

        function parseDoc(event) {
            var content = parseContent(event.target.result);
            var result = extractKeywords(content);
            return result;
        }

        function parseCV(file) {
            var deferred = $q.defer();
            var extension = extractExtension(file.name);
            var skills;
            var fileReader = new FileReader();
            if (extension == "docx") {
                fileReader.onload = function (event) {
                    skills = parseDocx(event);
                    deferred.resolve(skills);
                }
            }
            else if (extension == "doc") {
                fileReader.onload = function (event) {
                    skills = parseDoc(event);
                    deferred.resolve(skills);
                }
            }
            else {
                console.log("Extension " + extension + " is not supported!")
            }
            fileReader.readAsBinaryString(file);
            return deferred.promise;
        }

        function parseContent(content) {
            content = content
                .replace(/\n/g, "nnn")
                .replace(/\s/g, "sss")
                .replace(/@(\w+)\./g, "shtrudel$1.")
                .replace(/\./g, "ddoott")
                .replace(/\s[\w\d]{1,2}\s/g, '') // remove string length of 1 or 2 - still not working
                .replace(/[\W]/g, '')
                .replace(/ddoott/g, ".")
                .replace(/shtrudel/g, "@")
                .replace(/nnn/g, "\n")
                .replace(/sss/g, " ")
                .replace(/\w{12}/g, '');

            return content;
        }

        function extractKeywords(content) {
            var words = content.split(" ");
            clearDict(words);
            for (var i = 0; i < words.length; i++) {
                var word = words[i].toLowerCase();
                if (dict[word] != undefined) {
                    dict[word] = true;
                }
            }

            console.log("Found the following keywords:");

            var result = new Array();
            for (var i = 0, keys = Object.keys(dict), dictSize = keys.length; i < dictSize; i++) {
//        console.log('key : ' + keys[i] + ' val : ' + dict[keys[i]]);
                if (dict[keys[i]] == true) {
                    result.push(keys[i]);
                    console.log("keword: " + keys[i]);
                }
            }

            return result;
        }

        function clearDict(words) {
            for (var i = 0, keys = Object.keys(dict), dictSize = keys.length; i < dictSize; i++) {
                dict[keys[i]] = false;
            }
        }

        function extractExtension(fileName) {
            var a = fileName.split(".");
            if (a.length === 1 || ( a[0] === "" && a.length === 2 )) {
                return "";
            }
            return a.pop();    // feel free to tack .toLowerCase() here if you want
        }

        return {
            parseCV: parseCV
        }
    });


