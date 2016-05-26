/**
 * Created by Chen.Oppenhaim on 5/25/2016.
 */

angular.module('easywork')
    .factory('cvService', function (Upload, $timeout) {
        function uploadFile(file) {
            if (!file)
                return Promise.reject();

            return Upload.base64DataUrl(file)
                .then(function (dataUrl) {
                    return Upload.upload({
                        url: 'api/cv',
                        data: {file: file, data: dataUrl}
                    }).then(function (response) {
                        return response.data;
                        //$timeout(function () {
                        //    file.fileData = response.data;
                        //});
                    }, function (response) {
                        //if (response.status > 0)
                        //    $scope.errorMsg = response.status + ': ' + response.data;
                    }, function (evt) {
                        file.progress = Math.min(100, parseInt(100.0 *
                            evt.loaded / evt.total));
                    });
                })
        }
        return {
            uploadFile: uploadFile
        }
    });

