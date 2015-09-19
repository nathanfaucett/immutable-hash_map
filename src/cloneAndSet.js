var copyArray = require("./copyArray");


module.exports = cloneAndSet;


function cloneAndSet(array, index0, value0, index1, value1) {
    var length = array.length,
        results = new Array(length);

    copyArray(array, 0, results, 0, length);

    results[index0] = value0;
    if (index1 !== undefined) {
        results[index1] = value1;
    }

    return results;
}
