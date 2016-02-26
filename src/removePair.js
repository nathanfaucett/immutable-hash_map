var arrayCopy = require("array_copy");


var baseArrayCopy = arrayCopy.base;


module.exports = removePair;


function removePair(array, index) {
    var length = array.length,
        newArray = new Array(length - 2);

    baseArrayCopy(array, 0, newArray, 0, 2 * index);
    baseArrayCopy(array, 2 * (index + 1), newArray, 2 * index, length - 2 * index);

    return newArray;
}
