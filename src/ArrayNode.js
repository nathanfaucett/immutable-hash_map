var isNullOrUndefined = require("@nathanfaucett/is_null_or_undefined"),
    consts = require("./consts"),
    mask = require("./mask"),
    cloneAndSet = require("./cloneAndSet"),
    Iterator = require("./Iterator"),
    BitmapIndexedNode;


var SHIFT = consts.SHIFT,
    MAX_ARRAY_MAP_SIZE = consts.MAX_ARRAY_MAP_SIZE,
    EMPTY = new ArrayNode(0, []),
    IteratorValue = Iterator.Value,
    ArrayNodePrototype = ArrayNode.prototype;


module.exports = ArrayNode;


BitmapIndexedNode = require("./BitmapIndexedNode");


function ArrayNode(count, array) {
    this.count = count;
    this.array = array;
}

ArrayNode.EMPTY = EMPTY;

ArrayNodePrototype.get = function(shift, keyHash, key, notSetValue) {
    var index = mask(keyHash, shift),
        node = this.array[index];

    if (isNullOrUndefined(node)) {
        return notSetValue;
    } else {
        return node.get(shift + SHIFT, keyHash, key, notSetValue);
    }
};

ArrayNodePrototype.set = function(shift, keyHash, key, value, addedLeaf) {
    var index = mask(keyHash, shift),
        array = this.array,
        count = this.count,
        node = array[index],
        newNode;

    if (node) {
        newNode = node.set(shift + SHIFT, keyHash, key, value, addedLeaf);

        if (newNode === node) {
            return this;
        } else {
            return new ArrayNode(count, cloneAndSet(array, index, newNode));
        }
    } else {
        return new ArrayNode(count + 1, cloneAndSet(array, index,
            BitmapIndexedNode.EMPTY.set(shift + SHIFT, keyHash, key, value, addedLeaf)
        ));
    }
};

ArrayNodePrototype.remove = function(shift, keyHash, key) {
    var index = mask(keyHash, shift),
        array = this.array,
        node = array[index],
        newNode, count;

    if (node) {
        newNode = node.remove(shift + SHIFT, keyHash, key);

        if (newNode === node) {
            return this;
        } else {
            array = this.array;
            count = this.count;

            if (newNode === null) {
                if (count <= MAX_ARRAY_MAP_SIZE) {
                    return pack(array, index);
                } else {
                    return new ArrayNode(count - 1, cloneAndSet(array, index, newNode));
                }
            } else {
                return new ArrayNode(count, cloneAndSet(array, index, newNode));
            }
        }
    } else {
        return this;
    }
};

function ArrayNode_iterator(_this) {
    var array = _this.array,
        index = 0,
        length = array.length,
        nestedIter = null;

    function hasNext() {
        var node;

        while (true) {
            if (nestedIter !== null) {
                if (nestedIter.hasNext()) {
                    return true;
                } else {
                    nestedIter = null;
                }
            } else {
                if (index === length) {
                    return false;
                } else {
                    node = array[index];
                    index += 1;

                    if (!isNullOrUndefined(node)) {
                        nestedIter = node.iterator();
                    }
                }
            }
        }
    }

    function next() {
        if (hasNext()) {
            return nestedIter.next();
        } else {
            return new IteratorValue(undefined, true);
        }
    }

    return new Iterator(hasNext, next);
}

function ArrayNode_iteratorReverse(_this) {
    var array = _this.array,
        length = array.length,
        index = length - 1,
        nestedIter = null;

    function hasNext() {
        var node;

        while (true) {
            if (nestedIter !== null) {
                if (nestedIter.hasNext()) {
                    return true;
                } else {
                    nestedIter = null;
                }
            } else {
                if (index === -1) {
                    return false;
                } else {
                    node = array[index];
                    index -= 1;

                    if (!isNullOrUndefined(node)) {
                        nestedIter = node.iterator();
                    }
                }
            }
        }
    }

    function next() {
        if (hasNext()) {
            return nestedIter.next();
        } else {
            return new IteratorValue(undefined, true);
        }
    }

    return new Iterator(hasNext, next);
}

ArrayNodePrototype.iterator = function(reverse) {
    if (reverse !== true) {
        return ArrayNode_iterator(this);
    } else {
        return ArrayNode_iteratorReverse(this);
    }
};

function pack(array, index) {
    var newArray = new Array(2 * (count - 1)),
        j = 1,
        bitmap = 0,
        i = -1,
        il = index - 1,
        value;

    while (i++ < il) {
        value = array[i];

        if (value !== null) {
            newArray[j] = value;
            bitmap |= 1 << i;
            j += 2;
        }
    }

    i = index - 1;
    il = array.length - 1;
    while (i++ < il) {
        value = array[i];

        if (value !== null) {
            newArray[j] = value;
            bitmap |= 1 << i;
            j += 2;
        }
    }

    return new BitmapIndexedNode(bitmap, newArray);
}