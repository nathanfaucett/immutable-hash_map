var has = require("has"),
    isNull = require("is_null"),
    isUndefined = require("is_undefined"),
    isObject = require("is_object"),
    defineProperty = require("define_property"),
    isEqual = require("is_equal"),
    hashCode = require("hash_code"),
    isArrayLike = require("is_array_like"),
    fastBindThis = require("fast_bind_this"),
    Box = require("./Box"),
    Iterator = require("./Iterator"),
    IteratorValue = require("./IteratorValue"),
    BitmapIndexedNode = require("./BitmapIndexedNode");


var INTERNAL_CREATE = {},

    HAS_SYMBOL = typeof(Symbol) === "function",
    ITERATOR_SYMBOL = HAS_SYMBOL ? Symbol.iterator : false,
    IS_MAP = HAS_SYMBOL ? Symbol("Map") : "__ImmutableMap__",

    NOT_SET = {},
    EMPTY_MAP = new Map(INTERNAL_CREATE),

    MapPrototype;


module.exports = Map;


function Map(value) {
    if (!(this instanceof Map)) {
        throw new Error("Map() must be called with new");
    }

    this.__size = 0;
    this.__root = null;

    if (value !== INTERNAL_CREATE) {
        return Map_createMap(this, value, arguments);
    } else {
        return this;
    }
}
MapPrototype = Map.prototype;

function Map_createMap(_this, value, args) {
    var length = args.length;

    if (length === 1) {
        if (isArrayLike(value)) {
            return Map_fromArray(_this, value.toArray ? value.toArray() : value);
        } else if (isObject(value)) {
            return Map_fromObject(_this, value);
        } else {
            return EMPTY_MAP;
        }
    } else if (length > 1) {
        return Map_fromArray(_this, args);
    } else {
        return EMPTY_MAP;
    }
}

function Map_fromObject(_this, object) {
    var size = 0,
        root = BitmapIndexedNode.EMPTY,
        key, value, newRoot, addedLeaf;

    for (key in object) {
        if (has(object, key)) {
            value = object[key];

            addedLeaf = new Box(null);
            newRoot = root.set(0, hashCode(key), key, value, addedLeaf);

            if (newRoot !== root) {
                root = newRoot;
                if (!isNull(addedLeaf.value)) {
                    size += 1;
                }
            }
        }
    }

    if (size !== 0) {
        _this.__size = size;
        _this.__root = newRoot;
        return _this;
    } else {
        return EMPTY_MAP;
    }
}

function Map_fromArray(_this, array) {
    var i = 0,
        il = array.length,
        root = BitmapIndexedNode.EMPTY,
        size = 0,
        newRoot, key, value, addedLeaf;

    while (i < il) {
        key = array[i];
        value = array[i + 1];
        addedLeaf = new Box(null);

        newRoot = root.set(0, hashCode(key), key, value, addedLeaf);
        if (newRoot !== root) {
            root = newRoot;
            if (!isNull(addedLeaf.value)) {
                size += 1;
            }
        }

        i += 2;
    }

    if (size !== 0) {
        _this.__root = root;
        _this.__size = size;
        return _this;
    } else {
        return EMPTY_MAP;
    }
}

Map.of = function(value) {
    if (arguments.length > 0) {
        return Map_createMap(new Map(INTERNAL_CREATE), value, arguments);
    } else {
        return EMPTY_MAP;
    }
};

Map.isMap = function(value) {
    return value && value[IS_MAP] === true;
};

if (HAS_SYMBOL) {
    MapPrototype[IS_MAP] = true;
} else if (Object.defineProperty) {
    defineProperty(MapPrototype, IS_MAP, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: true
    });
} else {
    MapPrototype[IS_MAP] = true;
}

MapPrototype.size = function() {
    return this.__size;
};

if (defineProperty.hasGettersSetters) {
    defineProperty(MapPrototype, "length", {
        get: MapPrototype.size
    });
}

MapPrototype.count = MapPrototype.size;

MapPrototype.has = function(key) {
    var root = this.__root;
    return isNull(root) ? false : root.get(0, hashCode(key), key, NOT_SET) !== NOT_SET;
};

MapPrototype.get = function(key) {
    var root = this.__root;
    return isNull(root) ? undefined : root.get(0, hashCode(key), key);
};

MapPrototype.set = function(key, value) {
    var root = this.__root,
        size = this.__size,
        addedLeaf = new Box(null),
        newRoot = (isNull(root) ? BitmapIndexedNode.EMPTY : root).set(0, hashCode(key), key, value, addedLeaf),
        map;

    if (newRoot === root) {
        return this;
    } else {
        map = new Map(INTERNAL_CREATE);
        map.__size = isNull(addedLeaf.value) ? size : size + 1;
        map.__root = newRoot;
        return map;
    }
};

MapPrototype.remove = function(key) {
    var root = this.__root,
        size = this.__size,
        newRoot;

    if (isNull(root)) {
        return this;
    } else if (size === 1) {
        return EMPTY_MAP;
    } else {
        newRoot = root.remove(0, hashCode(key), key);

        if (newRoot === root) {
            return this;
        } else {
            map = new Map(INTERNAL_CREATE);
            map.__size = size - 1;
            map.__root = newRoot;
            return map;
        }
    }
};

function hasNext() {
    return false;
}

function next() {
    return new IteratorValue(true, undefined);
}

MapPrototype.iterator = function(reverse) {
    var root = this.__root;

    if (isNull(root)) {
        return new Iterator(hasNext, next);
    } else {
        return root.iterator(reverse);
    }
};

if (ITERATOR_SYMBOL) {
    MapPrototype[ITERATOR_SYMBOL] = MapPrototype.iterator;
}

function Map_every(_this, it, callback) {
    var next = it.next(),
        nextValue;

    while (next.done === false) {
        nextValue = next.value;
        if (!callback(nextValue[1], nextValue[0], _this)) {
            return false;
        }
        next = it.next();
    }

    return true;
}

MapPrototype.every = function(callback, thisArg) {
    return Map_every(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function Map_filter(_this, it, callback) {
    var results = [],
        next = it.next(),
        index = 0,
        nextValue, key, value;

    while (next.done === false) {
        nextValue = next.value;
        key = nextValue[0];
        value = nextValue[1];

        if (callback(value, key, _this)) {
            results[index++] = key;
            results[index++] = value;
        }

        next = it.next();
    }

    return Map.of(results);
}

MapPrototype.filter = function(callback, thisArg) {
    return Map_filter(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function Map_forEach(_this, it, callback) {
    var next = it.next(),
        nextValue;

    while (next.done === false) {
        nextValue = next.value;
        if (callback(nextValue[1], nextValue[0], _this) === false) {
            break;
        }
        next = it.next();
    }

    return _this;
}

MapPrototype.forEach = function(callback, thisArg) {
    return Map_forEach(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

MapPrototype.each = MapPrototype.forEach;

function Map_forEachRight(_this, it, callback) {
    var next = it.next(),
        nextValue;

    while (next.done === false) {
        nextValue = next.value;
        if (callback(nextValue[1], nextValue[0], _this) === false) {
            break;
        }
        next = it.next();
    }

    return _this;
}

MapPrototype.forEachRight = function(callback, thisArg) {
    return Map_forEachRight(this, this.iterator(true), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

MapPrototype.eachRight = MapPrototype.forEachRight;

function Map_map(_this, it, callback) {
    var next = it.next(),
        results = new Array(_this.__size * 2),
        index = 0,
        nextValue, key, resultValue;

    while (next.done === false) {
        nextValue = next.value;
        key = nextValue[0];
        resultValue = callback(nextValue[1], key, _this);
        results[index++] = resultValue[0];
        results[index++] = resultValue[1];
        next = it.next();
    }

    return Map.of(results);
}

MapPrototype.map = function(callback, thisArg) {
    return Map_map(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

function Map_reduce(_this, it, callback, initialValue) {
    var next = it.next(),
        value = initialValue,
        nextValue, key;

    if (isUndefined(value)) {
        nextValue = next.value;
        key = nextValue[0];
        value = nextValue[1];
        next = it.next();
    }

    while (next.done === false) {
        nextValue = next.value;
        value = callback(value, nextValue[1], key, _this);
        next = it.next();
    }

    return value;
}

MapPrototype.reduce = function(callback, initialValue, thisArg) {
    return Map_reduce(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function Map_reduceRight(_this, it, callback, initialValue) {
    var next = it.next(),
        value = initialValue,
        nextValue, key;

    if (isUndefined(value)) {
        nextValue = next.value;
        key = nextValue[0];
        value = nextValue[1];
        next = it.next();
    }

    while (next.done === false) {
        nextValue = next.value;
        value = callback(value, nextValue[1], key, _this);
        next = it.next();
    }

    return value;
}

MapPrototype.reduceRight = function(callback, initialValue, thisArg) {
    return Map_reduceRight(this, this.iterator(true), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function Map_some(_this, it, callback) {
    var next = it.next(),
        nextValue;

    while (next.done === false) {
        nextValue = next.value;

        if (callback(nextValue[1], nextValue[0], _this)) {
            return true;
        }
        next = it.next();
    }

    return false;
}

MapPrototype.some = function(callback, thisArg) {
    return Map_some(this, this.iterator(), isUndefined(thisArg) ? callback : fastBindThis(callback, thisArg, 3));
};

MapPrototype.toArray = function() {
    var it = this.iterator(),
        next = it.next(),
        results = new Array(this.__size * 2),
        index = 0;

    while (next.done === false) {
        nextValue = next.value;
        results[index++] = nextValue[0];
        results[index++] = nextValue[1];
        next = it.next();
    }

    return results;
};

MapPrototype.toString = function() {
    return "{" + this.toArray().join(" ") + "}";
};

MapPrototype.inspect = MapPrototype.toString;

function Map_equal(ait, bit) {
    var anext = ait.next(),
        bnext = bit.next(),
        anextValue, bnextValue;

    while (anext.done === false) {
        anextValue = anext.value;
        bnextValue = bnext.value;

        if (!isEqual(anextValue[0], bnextValue[0]) || !isEqual(anextValue[1], bnextValue[1])) {
            return false;
        }

        anext = ait.next();
        bnext = bit.next();
    }

    return true;
}

Map.equal = function(a, b) {
    if (a === b) {
        return true;
    } else if (!a || !b || a.__size !== b.__size) {
        return false;
    } else {
        return Map_equal(a.iterator(), b.iterator());
    }
};

MapPrototype.equals = function(b) {
    return Map.equal(this, b);
};
