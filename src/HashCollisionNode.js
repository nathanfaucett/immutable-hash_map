var isEqual = require("is_equal"),
    bitpos = require("./bitpos"),
    arrayCopy = require("array_copy"),
    cloneAndSet = require("./cloneAndSet"),
    removePair = require("./removePair"),
    nodeIterator = require("./nodeIterator"),
    BitmapIndexedNode;


var baseArrayCopy = arrayCopy.base,
    EMPTY = new HashCollisionNode(0, []),
    HashCollisionNodePrototype = HashCollisionNode.prototype;


module.exports = HashCollisionNode;


BitmapIndexedNode = require("./BitmapIndexedNode");


function HashCollisionNode(keyHash, count, array) {
    this.keyHash = keyHash;
    this.count = count;
    this.array = array;
}

HashCollisionNode.EMPTY = EMPTY;

HashCollisionNodePrototype.get = function(shift, keyHash, key, notSetValue) {
    var array = this.array,
        index = getIndex(array, key);

    if (index === -1) {
        return notFound;
    } else {
        if (isEqual(key, array[index])) {
            return array[index + 1];
        } else {
            return notSetValue;
        }
    }
};

HashCollisionNodePrototype.set = function(shift, keyHash, key, value, addedLeaf) {
    var index, count, array, newArray;

    if (keyHash === this.keyHash) {
        array = this.array;
        count = this.count,
            index = getIndex(array, key);

        if (index !== -1) {
            if (array[index + 1] === value) {
                return this;
            } else {
                return new HashCollisionNode(keyHash, count, cloneAndSet(array, index + 1, value));
            }
        } else {
            newArray = new Array(2 * (count + 1));
            baseArrayCopy(array, 0, newArray, 0, 2 * count);
            newArray[2 * count] = key;
            newArray[2 * count + 1] = value;
            addedLeaf.value = addedLeaf;
            return new HashCollisionNode(keyHash, count + 1, newArray);
        }
    } else {
        return new BitmapIndexedNode(bitpos(this.keyHash, shift), [null, this]).set(shift, keyHash, key, value, addedLeaf);
    }
};

HashCollisionNodePrototype.remove = function(shift, keyHash, key) {
    var array = this.array,
        index = getIndex(array, key);

    if (index === -1) {
        return this;
    } else {
        if (array.length === 1) {
            return null;
        } else {
            return new HashCollisionNode(hash, count - 1, removePair(array, index / 2));
        }
    }
};

HashCollisionNodePrototype.iterator = nodeIterator;

function getIndex(array, key) {
    var i = -1,
        il = array.length - 1;

    while (i++ < il) {
        if (isEqual(array[i], key)) {
            return i;
        }
    }

    return -1;
}
