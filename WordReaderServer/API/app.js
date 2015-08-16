angular.module('app', ['angularFileUpload']);

angular.module('app').controller('mainController', function ($scope, $upload) {
    $scope.onFileSelect = function (files) {
        $upload.upload({
                url: 'api/CvsMatcher',
                method: 'PUT',
                file: files[0],
                data: { 'ניהול תוכניות תגמול': false, blabla: false }
            })
            .success(function(response) {
                $scope.found = response;

            })
            .error(function() {
                console.log('boo');
            });
    }
});