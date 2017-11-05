var has = require("@nathanfaucett/has"),
    freeze = require("@nathanfaucett/freeze"),
    isObject = require("@nathanfaucett/is_object"),
    defineProperty = require("@nathanfaucett/define_property"),
    isEqual = require("@nathanfaucett/is_equal"),
    hashCode = require("@nathanfaucett/hash_code"),
    isArrayLike = require("@nathanfaucett/is_array_like"),
    fastBindThis = require("@nathanfaucett/fast_bind_this"),
    Box = require("./Box"),
    BitmapIndexedNode = require("./BitmapIndexedNode");


var INTERNAL_CREATE = {},

    ITERATOR_SYMBOL = typeof(Symbol) === "function" ? Symbol.iterator : false,
    IS_MAP = "__ImmutableHashMap__",

    NOT_SET = {},
    EMPTY_MAP = freeze(new HashMap(INTERNAL_CREATE)),

    HashMapPrototype;


module.exports = HashMap;


function HashMap(value) {
    this._size = 0;
    this._root = BitmapIndexedNode.EMPTY;

    if (value !== INTERNAL_CREATE) {
        return HashMap_createHashMap(this, value, arguments);
    } else {
        return this;
    }
}
HashMapPrototype = HashMap.prototype;

HashMap.EMPTY = EMPTY_MAP;

function HashMap_createHashMap(_this, value, args) {
    var length = args.length;

    if (length === 1) {
        if (isArrayLike(value)) {
            return HashMap_fromArray(_this, value.toArray ? value.toArray() : value);
        } else if (isObject(value)) {
            return HashMap_fromObject(_this, value);
        } else {
            return EMPTY_MAP;
        }
    } else if (length > 1) {
        return HashMap_fromArray(_this, args);
    } else {
        return EMPTY_MAP;
    }
}

function HashMap_fromObject(_this, object) {
    var size = 0,
        root = BitmapIndexedNode.EMPTY,
        addedLeaf = new Box(null),
        key, value, newRoot;

    for (key in object) {
        if (has(object, key)) {
            value = object[key];

            addedLeaf.value = null;
            newRoot = root.set(0, hashCode(key), key, value, addedLeaf);

            if (newRoot !== root) {
                root = newRoot;

                if (addedLeaf.value !== null) {
                    size++;
                }
            }
        }
    }

    if (size !== 0) {
        _this._size = size;
        _this._root = newRoot;
        return freeze(_this);
    } else {
        return EMPTY_MAP;
    }
}

function HashMap_fromArray(_this, array) {
    var i = 0,
        il = array.length,
        root = BitmapIndexedNode.EMPTY,
        size = 0,
        addedLeaf = new Box(null),
        newRoot, key, value;

    while (i < il) {
        key = array[i];
        value = array[i + 1];

        addedLeaf.value = null;
        newRoot = root.set(0, hashCode(key), key, value, addedLeaf);

        if (newRoot !== root) {
            root = newRoot;

            if (addedLeaf.value !== null) {
                size += 1;
            }
        }

        i += 2;
    }

    if (size !== 0) {
        _this._root = root;
        _this._size = size;
        return freeze(_this);
    } else {
        return EMPTY_MAP;
    }
}

HashMap.fromArray = function(array) {
    if (array.length > 0) {
        return HashMap_createHashMap(new HashMap(INTERNAL_CREATE), array[0], array);
    } else {
        return EMPTY_MAP;
    }
};

HashMap.fromObject = function(object) {
    return HashMap_fromObject(new HashMap(INTERNAL_CREATE), object);
};

HashMap.of = function() {
    return HashMap.fromArray(arguments);
};

HashMap.isHashMap = function(value) {
    return !!(value && value[IS_MAP]);
};

defineProperty(HashMapPrototype, IS_MAP, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: true
});

HashMapPrototype.size = function() {
    return this._size;
};

if (defineProperty.hasGettersSetters) {
    defineProperty(HashMapPrototype, "length", {
        get: HashMapPrototype.size
    });
}

HashMapPrototype.count = HashMapPrototype.size;

HashMapPrototype.isEmpty = function() {
    return this._size === 0;
};

HashMapPrototype.has = function(key) {
    return this._root.get(0, hashCode(key), key, NOT_SET) !== NOT_SET;
};

HashMapPrototype.get = function(key, notSetValue) {
    return this._root.get(0, hashCode(key), key, notSetValue);
};

HashMapPrototype.set = function(key, value) {
    var root = this._root,
        size = this._size,
        addedLeaf = new Box(null),
        newRoot = root.set(0, hashCode(key), key, value, addedLeaf),
        map;

    if (newRoot === root) {
        return this;
    } else {
        map = new HashMap(INTERNAL_CREATE);
        map._size = addedLeaf.value === null ? size : size + 1;
        map._root = newRoot;
        return freeze(map);
    }
};

HashMapPrototype.remove = function(key) {
    var root = this._root,
        size = this._size,
        newRoot;

    if (root === null) {
        return this;
    } else if (size === 1) {
        return EMPTY_MAP;
    } else {
        newRoot = root.remove(0, hashCode(key), key);

        if (newRoot === root) {
            return this;
        } else {
            map = new HashMap(INTERNAL_CREATE);
            map._size = size - 1;
            map._root = newRoot;
            return freeze(map);
        }
    }
};

HashMapPrototype.iterator = function(reverse) {
    return this._root.iterator(reverse);
};

if (ITERATOR_SYMBOL) {
    HashMapPrototype[ITERATOR_SYMBOL] = HashMapPrototype.iterator;
}

function HashMap_every(_this, it, callback) {
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

HashMapPrototype.every = function(callback, thisArg) {
    return HashMap_every(this, this.iterator(), thisArg === void(0) ? callback : fastBindThis(callback, thisArg, 3));
};

function HashMap_filter(_this, it, callback) {
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

    return HashMap.of(results);
}

HashMapPrototype.filter = function(callback, thisArg) {
    return HashMap_filter(this, this.iterator(), thisArg === void(0) ? callback : fastBindThis(callback, thisArg, 3));
};

function HashMap_forEach(_this, it, callback) {
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

HashMapPrototype.forEach = function(callback, thisArg) {
    return HashMap_forEach(this, this.iterator(), thisArg === void(0) ? callback : fastBindThis(callback, thisArg, 3));
};

HashMapPrototype.each = HashMapPrototype.forEach;

function HashMap_forEachRight(_this, it, callback) {
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

HashMapPrototype.forEachRight = function(callback, thisArg) {
    return HashMap_forEachRight(this, this.iterator(true), thisArg === void(0) ? callback : fastBindThis(callback, thisArg, 3));
};

HashMapPrototype.eachRight = HashMapPrototype.forEachRight;

function HashMap_map(_this, it, callback) {
    var next = it.next(),
        results = new Array(_this._size * 2),
        index = 0,
        nextValue, key;

    while (next.done === false) {
        nextValue = next.value;
        key = nextValue[0];
        results[index++] = key;
        results[index++] = callback(nextValue[1], key, _this);
        next = it.next();
    }

    return HashMap.of(results);
}

HashMapPrototype.map = function(callback, thisArg) {
    return HashMap_map(this, this.iterator(), thisArg === void(0) ? callback : fastBindThis(callback, thisArg, 3));
};

function HashMap_reduce(_this, it, callback, initialValue) {
    var next = it.next(),
        value = initialValue,
        nextValue, key;

    if (value === void(0)) {
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

HashMapPrototype.reduce = function(callback, initialValue, thisArg) {
    return HashMap_reduce(this, this.iterator(), thisArg === void(0) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function HashMap_reduceRight(_this, it, callback, initialValue) {
    var next = it.next(),
        value = initialValue,
        nextValue, key;

    if (value === void(0)) {
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

HashMapPrototype.reduceRight = function(callback, initialValue, thisArg) {
    return HashMap_reduceRight(this, this.iterator(true), thisArg === void(0) ? callback : fastBindThis(callback, thisArg, 4), initialValue);
};

function HashMap_some(_this, it, callback) {
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

HashMapPrototype.some = function(callback, thisArg) {
    return HashMap_some(this, this.iterator(), thisArg === void(0) ? callback : fastBindThis(callback, thisArg, 3));
};

HashMapPrototype.toArray = function() {
    var it = this.iterator(),
        next = it.next(),
        results = new Array(this._size * 2),
        index = 0;

    while (next.done === false) {
        nextValue = next.value;
        results[index++] = nextValue[0];
        results[index++] = nextValue[1];
        next = it.next();
    }

    return results;
};

HashMapPrototype.toObject = function() {
    var it = this.iterator(),
        results = {},
        step;

    while ((step = it.next()).done === false) {
        nextValue = step.value;
        results[nextValue[0]] = nextValue[1];
    }

    return results;
};

HashMap.fromJSON = HashMap.fromObject;
HashMapPrototype.toJSON = HashMapPrototype.toObject;

HashMapPrototype.join = function(separator, keyValueSeparator) {
    var it = this.iterator(),
        next = it.next(),
        result = "";

    separator = separator || ", ";
    keyValueSeparator = keyValueSeparator || ": ";

    while (!next.done) {
        nextValue = next.value;
        next = it.next();

        if (next.done) {
            result += nextValue[0] + keyValueSeparator + nextValue[1];
            break;
        } else {
            result += nextValue[0] + keyValueSeparator + nextValue[1] + separator;
        }
    }

    return result;
};

HashMapPrototype.toString = function() {
    return "{" + this.join() + "}";
};

HashMapPrototype.inspect = HashMapPrototype.toString;

function HashMap_equal(ait, bit) {
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

HashMap.equal = function(a, b) {
    if (a === b) {
        return true;
    } else if (!a || !b || a._size !== b._size) {
        return false;
    } else {
        return HashMap_equal(a.iterator(), b.iterator());
    }
};

HashMapPrototype.equals = function(b) {
    return HashMap.equal(this, b);
};
