var isUndefined = require("@nathanfaucett/is_undefined"),
    arrayCopy = require("@nathanfaucett/array_copy");


var baseArrayCopy = arrayCopy.base;


module.exports = cloneAndSet;


function cloneAndSet(array, index0, value0, index1, value1) {
    var length = array.length,
        results = new Array(length);

    baseArrayCopy(array, 0, results, 0, length);

    results[index0] = value0;
    if (!isUndefined(index1)) {
        results[index1] = value1;
    }

    return results;
}
