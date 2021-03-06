var arrayCopy = require("@nathanfaucett/array_copy");


var baseArrayCopy = arrayCopy.base;


module.exports = cloneAndSet;


function cloneAndSet(array, index, value) {
    var length = array.length,
        results = new Array(length);

    baseArrayCopy(array, 0, results, 0, length);
    results[index] = value;

    return results;
}