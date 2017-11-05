var mask = require("./mask");


module.exports = bitPosition;


function bitPosition(hashCode, shift) {
    return 1 << mask(hashCode, shift);
}