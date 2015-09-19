var mask = require("./mask");


module.exports = bitpos;


function bitpos(hashCode, shift) {
    return 1 << mask(hashCode, shift);
}
