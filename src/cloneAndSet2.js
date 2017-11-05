var arrayCopy = require("@nathanfaucett/array_copy");


var baseArrayCopy = arrayCopy.base;


module.exports = cloneAndSet2;


function cloneAndSet2(array, index, value0, value1) {
    var length = array.length,
        results = new Array(length);

    baseArrayCopy(array, 0, results, 0, length);
    results[index] = value0;
    results[index + 1] = value1;

    return results;
}