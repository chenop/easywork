// Create an AngularJS service called debounce
// reference http://stackoverflow.com/questions/13320015/how-to-write-a-debounce-service-in-angularjs
angular.module('easywork')
	.factory('debounce', ['$timeout', '$q', function ($timeout, $q) {
		// The service is actually this function, which we call with the func
		// that should be debounced and how long to wait in between calls
		var timeout;
		return function debounce(func, wait, immediate) {
			// Create a deferred object that will be resolved when we need to
			// actually call the func
			var deferred = $q.defer();
			return function () {
				var context = this, args = arguments;
				var later = function () {
					timeout = null;
					if (!immediate) {
						deferred.resolve(func.apply(context, args));
						deferred = $q.defer();
					}
				};
				var callNow = immediate && !timeout;
				if (timeout) {
					$timeout.cancel(timeout);
				}
				timeout = $timeout(later, wait);
				if (callNow) {
					deferred.resolve(func.apply(context, args));
					deferred = $q.defer();
				}
				return deferred.promise;
			};
		};
	}])
	.factory('utils', function () {

		function isEmptyArray(arr) {
			return (Array.isArray(arr) && arr.length == 0);
		}

		function isUndefined(value){return typeof value === 'undefined';}
		function isDefined (value){return typeof value !== 'undefined';}
		function isEmpty(value) {
			if (Array.isArray(value)) {
				return (value.length == 0)
			}
			else { // primitive or single object
				return isUndefined(value) || value === '' || value === null || value !== value;
			}
		}

		function removeObject(array, object) {
			if ($rootScope.isEmpty(array))
				return array;

			var index = array.indexOf(object);
			if (index !== -1) {
				array.splice(index, 1);
			}
			return array;
		}

		return {
			isEmptyArray: isEmptyArray
			, isUndefined: isUndefined
			, isDefined: isDefined
			, isEmpty: isEmpty
			, removeObject: removeObject
		}
	});
