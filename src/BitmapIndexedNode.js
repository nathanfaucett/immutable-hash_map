var isNull = require("@nathanfaucett/is_null"),
    isEqual = require("@nathanfaucett/is_equal"),
    hashCode = require("@nathanfaucett/hash_code"),
    bitCount = require("@nathanfaucett/bit_count"),
    consts = require("./consts"),
    bitpos = require("./bitpos"),
    arrayCopy = require("@nathanfaucett/array_copy"),
    cloneAndSet = require("./cloneAndSet"),
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
        bit = bitpos(keyHash, shift),
        array, index, keyOrNull, valueOrNode;

    if ((bitmap & bit) === 0) {
        return notSetValue;
    } else {
        array = this.array;
        index = getIndex(bitmap, bit);

        keyOrNull = array[2 * index];
        valueOrNode = array[2 * index + 1];

        if (isNull(keyOrNull)) {
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

BitmapIndexedNodePrototype.set = function(shift, keyHash, key, value, addedLeaf) {
    var array = this.array,
        bitmap = this.bitmap,
        bit = bitpos(keyHash, shift),
        index = getIndex(bitmap, bit),
        keyOrNull, valueOrNode, newNode, nodes, jIndex, i, j, newArray;

    if ((bitmap & bit) !== 0) {
        keyOrNull = array[2 * index];
        valueOrNode = array[2 * index + 1];

        if (isNull(keyOrNull)) {
            newNode = valueOrNode.set(shift + SHIFT, keyHash, key, value, addedLeaf);

            if (newNode === valueOrNode) {
                return this;
            } else {
                return new BitmapIndexedNode(bitmap, cloneAndSet(array, 2 * index + 1, newNode));
            }
        }
        if (isEqual(key, keyOrNull)) {
            if (value === valueOrNode) {
                return this;
            } else {
                return new BitmapIndexedNode(bitmap, cloneAndSet(array, 2 * index + 1, value));
            }
        }
        addedLeaf.value = addedLeaf;
        return new BitmapIndexedNode(bitmap,
            cloneAndSet(array,
                2 * index, null,
                2 * index + 1, createNode(shift + SHIFT, keyOrNull, valueOrNode, keyHash, key, value)));
    } else {
        newNode = bitCount(bitmap);

        if (newNode >= MAX_BITMAP_INDEXED_SIZE) {
            nodes = new Array(32);
            jIndex = mask(keyHash, shift);
            nodes[jIndex] = EMPTY.set(shift + SHIFT, keyHash, key, value, addedLeaf);

            i = -1;
            j = 0;
            while (i++ < 31) {
                if (((bitmap >>> i) & 1) !== 0) {
                    if (array[j] == null) {
                        nodes[i] = array[j + 1];
                    } else {
                        nodes[i] = EMPTY.set(shift + SHIFT, hashCode(array[j]), array[j], array[j + 1], addedLeaf);
                    }
                    j += 2;
                }
            }

            return new ArrayNode(newNode + 1, nodes);
        } else {
            newArray = new Array(2 * (newNode + 1));
            baseArrayCopy(array, 0, newArray, 0, 2 * index);

            newArray[2 * index] = key;
            addedLeaf.value = addedLeaf;
            newArray[2 * index + 1] = value;

            baseArrayCopy(array, 2 * index, newArray, 2 * (index + 1), 2 * (newNode - index));

            return new BitmapIndexedNode(bitmap | bit, newArray);
        }
    }
};

BitmapIndexedNodePrototype.remove = function(shift, keyHash, key) {
    var bitmap = this.bitmap,
        bit = bitpos(keyHash, shift),
        index, array, newNode;

    if ((bitmap & bit) === 0) {
        return this;
    } else {
        index = getIndex(bitmap, bit);
        array = this.array;

        keyOrNull = array[2 * index];
        valueOrNode = array[2 * index + 1];

        if (isNull(keyOrNull)) {
            newNode = valueOrNode.remove(shift + SHIFT, keyHash, key);

            if (newNode === valueOrNode) {
                return this;
            } else if (!isNull(newNode)) {
                return new BitmapIndexedNode(bitmap, cloneAndSet(array, 2 * index + 1, newNode));
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