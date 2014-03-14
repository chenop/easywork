'use strict';

appManager.controller('loginCtrl', function ($scope, authService, $modalInstance) {

		$scope.username = null;
		$scope.password = null;
		$scope.rememeberMe = null;
		$scope.err = undefined;

        $scope.cancel = function(){
            $modalInstance.dismiss('canceled');
        }; // end cancel

        $scope.hitEnter = function(evt){
            if(angular.equals(evt.keyCode,13) && !(angular.equals($scope.username,null) || angular.equals($scope.username,'')))
                $scope.login();
        }; // end hitEnter

		$scope.login = function () {
			var user = {
				username: this.username,
				password: this.password
			}

			authService.logIn(user)
			.success(
				function () {
					authService.setAuthenticate(true);
                    $modalInstance.close(user.username);
                    $scope.apply();
				}
			).error(
				function (err) {
					$scope.err = err;
					console.log(err);
					authService.setAuthenticate(false);
				}
            );
		}
	}
);
