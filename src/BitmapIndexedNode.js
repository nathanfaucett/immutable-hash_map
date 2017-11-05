var isEqual = require("@nathanfaucett/is_equal"),
    hashCode = require("@nathanfaucett/hash_code"),
    bitCount = require("@nathanfaucett/bit_count"),
    consts = require("./consts"),
    bitPosition = require("./bitPosition"),
    arrayCopy = require("@nathanfaucett/array_copy"),
    cloneAndSet = require("./cloneAndSet"),
    cloneAndSet2 = require("./cloneAndSet2"),
    removePair = require("./removePair"),
    mask = require("./mask"),
    nodeIterator = require("./nodeIterator"),
    ArrayNode, createNode;


var baseArrayCopy = arrayCopy.base,
    SHIFT = consts.SHIFT,
    MAX_BITMAP_INDEXED_SIZE = consts.MAX_BITMAP_INDEXED_SIZE,
    EMPTY = new BitmapIndexedNode(0, []),
    BitmapIndexedNodePrototype = BitmapIndexedNode.prototype;


module.exports = BitmapIndexedNode;


ArrayNode = require("./ArrayNode");
createNode = require("./createNode");


function BitmapIndexedNode(bitmap, array) {
    this.bitmap = bitmap;
    this.array = array;
}

BitmapIndexedNode.EMPTY = EMPTY;

BitmapIndexedNodePrototype.get = function(shift, keyHash, key, notSetValue) {
    var bitmap = this.bitmap,
        bit = bitPosition(keyHash, shift),
        array, index, indexOffset, keyOrNull, valueOrNode;

    if ((bitmap & bit) === 0) {
        return notSetValue;
    } else {
        array = this.array;
        index = getIndex(bitmap, bit);
        indexOffset = 2 * index;

        keyOrNull = array[indexOffset];
        valueOrNode = array[indexOffset + 1];

        if (keyOrNull === null) {
            return valueOrNode.get(shift + SHIFT, keyHash, key, notSetValue);
        } else {
            if (isEqual(key, keyOrNull)) {
                return valueOrNode;
            } else {
                return notSetValue;
            }
        }
    }
};

function BitmapIndexedNode_set(_this, bitmap, array, keyHash, key, value, shift, index, addedLeaf) {
    var indexOffset = 2 * index,
        keyOrNull = array[indexOffset],
        valueOrNode = array[indexOffset + 1],
        newNode;

    if (keyOrNull === null) {
        newNode = valueOrNode.set(shift + SHIFT, keyHash, key, value, addedLeaf);

        if (newNode === valueOrNode) {
            return _this;
        } else {
            return new BitmapIndexedNode(bitmap, cloneAndSet(array, indexOffset + 1, newNode));
        }
    }

    if (isEqual(key, keyOrNull)) {
        if (value === valueOrNode) {
            return _this;
        } else {
            return new BitmapIndexedNode(bitmap, cloneAndSet(array, indexOffset + 1, value));
        }
    }

    addedLeaf.value = addedLeaf;

    return new BitmapIndexedNode(bitmap,
        cloneAndSet2(array, indexOffset, null, createNode(shift + SHIFT, keyOrNull, valueOrNode, keyHash, key, value))
    );
}

function BitmapIndexedNode_setNew(bitmap, array, keyHash, key, value, shift, index, bit, addedLeaf) {
    var newNode = bitCount(bitmap),
        nodes, indexOffset, jIndex, i, j, newArray, tmpJ;

    if (newNode >= MAX_BITMAP_INDEXED_SIZE) {
        nodes = new Array(32);
        jIndex = mask(keyHash, shift);
        nodes[jIndex] = EMPTY.set(shift + SHIFT, keyHash, key, value, addedLeaf);

        i = -1;
        j = 0;
        while (i++ < 31) {
            if (((bitmap >>> i) & 1) !== 0) {
                tmpJ = array[j];

                if (tmpJ === null) {
                    nodes[i] = array[j + 1];
                } else {
                    nodes[i] = EMPTY.set(shift + SHIFT, hashCode(tmpJ), tmpJ, array[j + 1], addedLeaf);
                }
                j += 2;
            }
        }

        return new ArrayNode(newNode + 1, nodes);
    } else {
        newArray = new Array(2 * (newNode + 1));
        indexOffset = 2 * index;
        baseArrayCopy(array, 0, newArray, 0, indexOffset);

        newArray[indexOffset] = key;
        newArray[indexOffset + 1] = value;
        addedLeaf.value = addedLeaf;

        baseArrayCopy(array, indexOffset + 1, newArray, 2 * (index + 1), 2 * (newNode - index));

        return new BitmapIndexedNode(bitmap | bit, newArray);
    }
}

BitmapIndexedNodePrototype.set = function(shift, keyHash, key, value, addedLeaf) {
    var array = this.array,
        bitmap = this.bitmap,
        bit = bitPosition(keyHash, shift),
        index = getIndex(bitmap, bit);

    if ((bitmap & bit) !== 0) {
        return BitmapIndexedNode_set(this, bitmap, array, keyHash, key, value, shift, index, addedLeaf);
    } else {
        return BitmapIndexedNode_setNew(bitmap, array, keyHash, key, value, shift, index, bit, addedLeaf);
    }
};

BitmapIndexedNodePrototype.remove = function(shift, keyHash, key) {
    var bitmap = this.bitmap,
        bit = bitPosition(keyHash, shift),
        index, indexOffset, array, newNode;

    if ((bitmap & bit) === 0) {
        return this;
    } else {
        index = getIndex(bitmap, bit);
        indexOffset = 2 * index;
        array = this.array;

        keyOrNull = array[indexOffset];
        valueOrNode = array[indexOffset + 1];

        if (keyOrNull === null) {
            newNode = valueOrNode.remove(shift + SHIFT, keyHash, key);

            if (newNode === valueOrNode) {
                return this;
            } else if (newNode !== null) {
                return new BitmapIndexedNode(bitmap, cloneAndSet(array, indexOffset + 1, newNode));
            } else if (bitmap === bit) {
                return null;
            } else {
                return new BitmapIndexedNode(bitmap ^ bit, removePair(array, index));
            }
        } else {
            if (isEqual(key, keyOrNull)) {
                return new BitmapIndexedNode(bitmap ^ bit, removePair(array, index));
            } else {
                return this;
            }
        }
    }
};

BitmapIndexedNodePrototype.iterator = nodeIterator;

function getIndex(bitmap, bit) {
    return bitCount(bitmap & (bit - 1));
}