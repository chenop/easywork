/**
 * Created by Chen.Oppenhaim on 5/25/2016.
 */

angular.module('easywork')
    .factory('cvService', function (Upload, localStorageService, dataManager) {

        function getCvByUserId(userId) {
            var cv = localStorageService.get(userId)
            if (cv)
                return Promise.resolve(cv);

            return dataManager.getCvByUserId(userId)
                .then(function(cv) {
                    return cv;
                })
                .catch(function() {
                    return Promise.reject();
                })
        }

        function uploadFile(file, userId) {
            if (!file)
                return Promise.reject();

            return Upload.base64DataUrl(file)
                .then(function (dataUrl) {
                    return Upload.upload({
                        url: 'api/cv',
                        data: {file: file, data: dataUrl, userId: userId}
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

        function convertBase64ToBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, {type: contentType});
            return blob;
        }

        return {
            uploadFile: uploadFile
            , convertBase64ToBlob: convertBase64ToBlob
            , getCvByUserId: getCvByUserId
        }
    });

