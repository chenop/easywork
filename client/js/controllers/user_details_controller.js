'use strict';

var userDetailsModule = angular.module('userDetailsModule', ['angularFileUpload', 'ui.select2']);

userDetailsModule.controller('userDetailsCtrl', ['$scope', '$upload', function ($scope, $upload) {
  $scope.welcome = "אנא הכנס פרטים:";
  $scope.select2Options = {
    width: 200
  };

  var default_message = 'Hi,\nI am interested in open positions in your company.\nContact information can be found in my CV which is attached.\n\nBest Regards,\n';

  $scope.user = {
    name : 'Chen',
    message : default_message
  };


  $scope.$watch('user.name', function(value) {
    if(value) {
      $scope.user.message = default_message + value;
    }
  }, true);
//  $scope.onFileSelect = function ($files) {
//    //$files: an array of files selected, each file has name, size, and type.
//    for (var i = 0; i < $files.length; i++) {
//      var $file = $files[i];
//      $scope.upload = $upload.upload({
//        url: 'server/upload/url', //upload.php script, node.js route, or servlet url
//        // method: POST or PUT,
//        // headers: {'headerKey': 'headerValue'}, withCredential: true,
//        data: {myObj: $scope.myModelObj},
//        file: $file,
//        /* set file formData name for 'Content-Desposition' header. Default: 'file' */
//        //fileFormDataName: myFile,
//        /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
//        //formDataAppender: function(formData, key, val){}
//      }).progress(function (evt) {
//          console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
//        }).success(function (data, status, headers, config) {
//          // file is uploaded successfully
//          console.log(data);
//        });
//      //.error(...)
//      //.then(success, error, progress);
//    }
//  };
}]);