module.exports = copyArray;


function copyArray(src, srcPos, dest, destPos, length) {
    var i = srcPos - 1,
        il = srcPos + length - 1;

    while (i++ < il) {
        dest[destPos++] = src[i];
    }
}
