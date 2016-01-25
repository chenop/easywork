/**
 * Created by Chen on 22/01/2016.
 */

if (!Array.prototype.equals) {
    Array.prototype.equals = function (array, strict) {
        if (!array)
            return false;

        if (arguments.length == 1)
            strict = true;

        if (this.length != array.length)
            return false;

        for (var i = 0; i < this.length; i++) {
            if (this[i] instanceof Array && array[i] instanceof Array) {
                if (!this[i].equals(array[i], strict))
                    return false;
            }
            else if (strict && this[i] != array[i]) {
                return false;
            }
            else if (!strict) {
                return this.sort().equals(array.sort(), true);
            }
        }
        return true;
    }
}

if (!Array.prototype.merge) {
    Array.prototype.merge = function (/* variable number of arrays */) {
        for (var i = 0; i < arguments.length; i++) {
            var array = arguments[i];
            for (var j = 0; j < array.length; j++) {
                if (this.indexOf(array[j]) === -1) {
                    this.push(array[j]);
                }
            }
        }
        return this;
    };
}