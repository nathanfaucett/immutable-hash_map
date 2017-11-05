var arrayCopy = require("@nathanfaucett/array_copy");


var baseArrayCopy = arrayCopy.base;


module.exports = removePair;


function removePair(array, index) {
    var length = array.length,
        newArray = new Array(length - 2),
        indexOffset = 2 * index;

    baseArrayCopy(array, 0, newArray, 0, indexOffset);
    baseArrayCopy(array, 2 * (index + 1), newArray, indexOffset, length - indexOffset);

    return newArray;
}