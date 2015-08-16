/**
 * Created by Chen.Oppenhaim on 6/21/2015.
 */

(function() {

    var Job = function() {
        this.id;
        this.name = "";
        this.skills = [];
        this.city = "";
        this.code = "";
        this.description = "";
        this.company = null;
    };

    Job.prototype = {
    };

    var module = angular.module("easywork");
    module.value("Job", Job);

}());