'use strict';

angular.module('easywork')
	.factory('common', function ($uibModal) {

        var DEFAULT_MESSAGE = 'Hi,\nI am interested in open positions in your company.\nContact information can be found in my CV which is attached.\n\nBest Regards,\n';

        var MODAL_RESULT = {
            YES: 0
            , NO: 1
        }

        var EContentType = {
            Job: 0
            , Company: 1
            , User: 2
            , CV: 3
        }
        var CONTENT_TYPE =
            {
                JOB: {value: 0, name: "job"},
                COMPANY: {value: 1, name: "company"},
                USER: {value: 2, name: "user"},
                CV: {value: 3, name: "cv"}
            };

        function openYesNoModal(text, yesCallBack) {
            var modalInstance = $uibModal.open({
                templateUrl: '/views/admin/yesNoModalContent.html',
                controller: 'YesNoModalCtrl',
                size: 'sm',
                resolve: {
                    text: function () {
                        return text;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if (result == MODAL_RESULT.YES) {
                    if (yesCallBack)
                        yesCallBack();
                }
            }, function () {
            });
        }

        function openErrorModal(text) {
            var modalInstance = $uibModal.open({
                templateUrl: '/views/error.html',
                controller: function ($scope, text, $uibModalInstance) {
                    $scope.status = text.status;
                    $scope.message = text.data;

                    $scope.close = function() {
                        $uibModalInstance.close();
                    }
                },
                size: 'sm',
                resolve: {
                    text: function () {
                        return text;
                    }
                }
            });

            modalInstance.result.then(function (result) {
            }, function () {
            });
        }

        return {
            CONTENT_TYPE: CONTENT_TYPE
            , MODAL_RESULT: MODAL_RESULT
            , openYesNoModal: openYesNoModal
            , openErrorModal: openErrorModal
            , DEFAULT_MESSAGE: DEFAULT_MESSAGE
            , EContentType: EContentType
		}
	});
