var consts = require("./consts");


var MASK = consts.MASK;


module.exports = mask;


function mask(hashCode, shift) {
    return (hashCode >>> shift) & MASK;
}
