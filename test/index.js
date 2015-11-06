var tape = require("tape"),
    HashMap = require("..");


tape("HashMap() should create new HashMap from passed arguments", function(assert) {
    assert.deepEqual(new HashMap("key0", "value0", "key1", "value1").toArray(), ["key0", "value0", "key1", "value1"]);
    assert.deepEqual(new HashMap({
        key0: "value0",
        key1: "value1"
    }).toArray(), ["key0", "value0", "key1", "value1"]);
    assert.deepEqual(new HashMap("key0", "value0", "key1", "value1").toArray(), ["key0", "value0", "key1", "value1"]);
    assert.deepEqual(new HashMap("key0", "value0", "key1", "value1").toArray(), ["key0", "value0", "key1", "value1"]);
    assert.end();
});

tape("HashMap.isHashMap(value) should return true if the object is a HashMap", function(assert) {
    var hashMap = new HashMap(0, 1, 2, 3),
        notHashMap = {};

    assert.equal(HashMap.isHashMap(hashMap), true);
    assert.equal(HashMap.isHashMap(notHashMap), false);

    assert.end();
});

tape("HashMap size() should return size of the HashMap", function(assert) {
    assert.equal(new HashMap().size(), 0);
    assert.equal(new HashMap([1, 1]).size(), 1);
    assert.equal(new HashMap([1, 1, 2, 2]).size(), 2);
    assert.end();
});

tape("HashMap get(key : Any) should return element where key equals passed key", function(assert) {
    var hashMap = new HashMap(1, 2, 3, 4);

    assert.equal(hashMap.get(1), 2);
    assert.equal(hashMap.get(3), 4);
    assert.equal(hashMap.get(5), undefined);

    assert.end();
});

tape("HashMap has(key : Any) should return if HashMap has an element where key equals passed key", function(assert) {
    var hashMap = new HashMap(0, 0, 1, 1);

    assert.equal(hashMap.has(0), true);
    assert.equal(hashMap.has(1), true);
    assert.equal(hashMap.has(2), false);

    assert.end();
});

tape("HashMap set(key : Any, value : Any) should return a new HashMap with the updated element at key if value is not the same", function(assert) {
    var a = new HashMap(1, 2, 3, 4),
        b = a.set(1, 1),
        c = b.set(1, 1);

    assert.equal(b.get(1), 1);
    assert.equal(b, c);

    assert.end();
});

tape("HashMap remove(key : Any) should return new HashMap with the removed key", function(assert) {
    var a = new HashMap(0, 1, 2, 3),
        b = a.remove(0),
        c = b.remove(2);

    assert.deepEqual(b.toArray(), [2, 3]);
    assert.deepEqual(c.toArray(), []);

    assert.end();
});

tape("HashMap static equal(a : HashMap, b : HashMap) should return a deep equals of hashMap a and b", function(assert) {
    assert.equal(HashMap.equal(new HashMap(0, 1, 2, 3), new HashMap(0, 1, 2, 3)), true);
    assert.equal(HashMap.equal(new HashMap(0, 1, 2, 3), new HashMap(0, 0, 2, 2)), false);
    assert.equal(HashMap.equal(new HashMap(0, 1, 2, 3), new HashMap(1, 2)), false);
    assert.end();
});

tape("HashMap iterator([reverse = false : Boolean]) (reverse = false) should return Iterator starting from the beginning", function(assert) {
    var a = new HashMap(0, 1, 2, 3),
        it = a.iterator();

    assert.deepEqual(it.next().value, [0, 1]);
    assert.deepEqual(it.next().value, [2, 3]);
    assert.equal(it.next().done, true);

    assert.end();
});

tape("HashMap iterator([reverse = true : Boolean]) should return Iterator starting from the end", function(assert) {
    var a = new HashMap(0, 1, 2, 3),
        it = a.iterator(true);

    assert.deepEqual(it.next().value, [2, 3]);
    assert.deepEqual(it.next().value, [0, 1]);
    assert.equal(it.next().done, true);

    assert.end();
});

tape("HashMap every(callback[, thisArg])", function(assert) {
    assert.equals(
        HashMap.of([0, 0, 1, 1, 2, 2]).every(function(value, key) {
            return value === key;
        }),
        true
    );
    assert.equals(
        HashMap.of([0, 0, 1, 1, 2, 3]).every(function(value, key) {
            return value === key;
        }),
        false
    );
    assert.end();
});

tape("HashMap filter(callback[, thisArg])", function(assert) {
    assert.deepEquals(
        HashMap.of([0, 0, 1, 1, 2, 2]).filter(function(value) {
            return value % 2 === 0;
        }).toArray(), [0, 0, 2, 2]
    );
    assert.end();
});

tape("HashMap forEach(callback[, thisArg])", function(assert) {
    var count = 0,
        keys = [];

    HashMap.of([0, 0, 1, 1, 2, 2]).forEach(function(value, key) {
        keys[keys.length] = key;
        count += 1;
    });
    assert.deepEquals(keys, [0, 1, 2]);
    assert.equals(count, 3);

    count = 0;
    keys.length = 0;
    HashMap.of([0, 0, 1, 1, 2, 2]).forEach(function(value, key) {
        keys[keys.length] = key;
        count += 1;
        if (value === 1) {
            return false;
        }
    });
    assert.deepEquals(keys, [0, 1]);
    assert.equals(count, 2);

    assert.end();
});

tape("HashMap forEachRight(callback[, thisArg])", function(assert) {
    var count = 0,
        keys = [];

    HashMap.of([0, 0, 1, 1, 2, 2]).forEachRight(function(value, key) {
        keys[keys.length] = key;
        count += 1;
    });
    assert.deepEquals(keys, [2, 1, 0]);
    assert.equals(count, 3);

    count = 0;
    keys.length = 0;
    HashMap.of([0, 0, 1, 1, 2, 2]).forEachRight(function(value, key) {
        keys[keys.length] = key;
        count += 1;
        if (value === 1) {
            return false;
        }
    });
    assert.deepEquals(keys, [2, 1]);
    assert.equals(count, 2);

    assert.end();
});

tape("HashMap map(callback[, thisArg])", function(assert) {
    assert.deepEquals(
        HashMap.of([0, 0, 1, 1, 2, 2]).map(function(value, key) {
            return [key, value + key];
        }).toArray(), [0, 0, 1, 2, 2, 4]
    );
    assert.end();
});

tape("HashMap reduce(callback[, thisArg])", function(assert) {
    assert.deepEquals(
        HashMap.of([0, 0, 1, 1, 2, 2]).reduce(function(currentValue, value) {
            return currentValue + value;
        }),
        3
    );
    assert.end();
});

tape("HashMap reduceRight(callback[, thisArg])", function(assert) {
    assert.deepEquals(
        HashMap.of([0, 0, 1, 1, 2, 2]).reduceRight(function(currentValue, value) {
            return currentValue + value;
        }),
        3
    );
    assert.end();
});

tape("HashMap some(callback[, thisArg])", function(assert) {
    assert.equals(
        HashMap.of([0, 0, 1, 1, 2, 2]).some(function(value) {
            return value === 2;
        }),
        true
    );
    assert.equals(
        HashMap.of([0, 0, 1, 1, 2, 2]).some(function(value) {
            return value === 3;
        }),
        false
    );
    assert.end();
});

tape("HashMap join([separator = \", \", [keyValueSeparator = \": \"]]) should join all elements of an HashMap into a String", function(assert) {
    var hashMap = new HashMap(0, 0, 1, 1);

    assert.equal(hashMap.join(), "0: 0, 1: 1");
    assert.equal(hashMap.join(" "), "0: 0 1: 1");
    assert.equal(hashMap.join(", ", " => "), "0 => 0, 1 => 1");

    assert.end();
});

tape("HashMap toString() should return toString representation of HashMap", function(assert) {
    assert.equal((new HashMap(0, 0, 1, 1)).toString(), "{0: 0, 1: 1}");
    assert.end();
});
