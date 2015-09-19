var copyArray = require("./copyArray");


module.exports = removePair;


function removePair(array, index) {
    var length = array.length,
        newArray = new Array(length - 2);

    copyArray(array, 0, newArray, 0, 2 * index);
    copyArray(array, 2 * (index + 1), newArray, 2 * index, length - 2 * index);

    return newArray;
}
