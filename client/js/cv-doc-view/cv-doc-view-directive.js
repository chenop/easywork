/**
 * Created by Chen.Oppenhaim on 1/8/2017.
 */
angular.module('easywork')
	.directive('cvDocView', function (cvService, dataManager, Upload, localStorageService, utils, ANONYMOUS) {
		return {
			restrict: 'E',
			scope: {
				cv: "="
			},
			templateUrl: '/js/cv-doc-view/cv-doc-view.html',
			controller : ["$scope", "$sce", "FileSaver", function ($scope, $sce, FileSaver) {
				var cvId = $scope.cv.id;
				$scope.isIframeLoading = true;
				$scope.url = "http://docs.google.com/gview?url=http://www.easywork.co.il/public/cv/download/" + cvId + "&embedded=true";

				$scope.trustSrc = function(src) {
					return $sce.trustAsResourceUrl(src);
				}

				$scope.refreshSkills = function() {
					$scope.isLoading = true;
					dataManager.analyzeCv($scope.cv.id)
						.then(function (cv) {
							$scope.cv.skills = cv.skills;
							$scope.isLoading = false;
						})
				}

				$scope.downloadCv = function () {
					dataManager.getCv(cvId)
						.then(function(cv) {
							var blob = cvService.convertBase64ToBlob(cv.fileData, cv.fileType);
							FileSaver.saveAs(blob, cv.fileName);
						})
				}

				$scope.iframeLoadedCallBack = function(){
					$scope.isIframeLoading = false;
					$scope.$apply();
				}
			}],
			link: function (scope, element, attrs) {
			}
		}
	})
