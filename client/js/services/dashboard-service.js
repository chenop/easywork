/**
 * Created by Chen on 11/09/2014.
 */

angular.module('easywork')
    .factory('dashboardService', function () {

        var getContentType = function (contentTypeValue) {
            switch (Number(contentTypeValue)) {

                case common.CONTENT_TYPE.JOB.value:
                    return common.CONTENT_TYPE.JOB;

                case common.CONTENT_TYPE.COMPANY.value:
                    return common.CONTENT_TYPE.COMPANY;

                case common.CONTENT_TYPE.USER.value:
                    return common.CONTENT_TYPE.USER;
            }
        };

        return {
            getContentType: getContentType
        }
    });
