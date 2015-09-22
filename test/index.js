var tape = require("tape"),
    Map = require("..");


tape("Map() should create new Map from passed arguments", function(assert) {
    assert.deepEqual(new Map("key0", "value0", "key1", "value1").toArray(), ["key0", "value0", "key1", "value1"]);
    assert.deepEqual(new Map({
        key0: "value0",
        key1: "value1"
    }).toArray(), ["key0", "value0", "key1", "value1"]);
    assert.deepEqual(new Map("key0", "value0", "key1", "value1").toArray(), ["key0", "value0", "key1", "value1"]);
    assert.deepEqual(new Map("key0", "value0", "key1", "value1").toArray(), ["key0", "value0", "key1", "value1"]);
    assert.end();
});

tape("Map.isMap(value) should return true if the object is a Map", function(assert) {
    var map = new Map(0, 1, 2, 3),
        notMap = {};

    assert.equal(Map.isMap(map), true);
    assert.equal(Map.isMap(notMap), false);

    assert.end();
});

tape("Map size() should return size of the Map", function(assert) {
    assert.equal(new Map().size(), 0);
    assert.equal(new Map([1, 1]).size(), 1);
    assert.equal(new Map([1, 1, 2, 2]).size(), 2);
    assert.end();
});

tape("Map get(key : Any) should return element where key equals passed key", function(assert) {
    var map = new Map(1, 2, 3, 4);

    assert.equal(map.get(1), 2);
    assert.equal(map.get(3), 4);
    assert.equal(map.get(5), undefined);

    assert.end();
});

tape("Map has(key : Any) should return if Map has an element where key equals passed key", function(assert) {
    var map = new Map(0, 0, 1, 1);

    assert.equal(map.has(0), true);
    assert.equal(map.has(1), true);
    assert.equal(map.has(2), false);

    assert.end();
});

tape("Map set(key : Any, value : Any) should return a new Map with the updated element at key if value is not the same", function(assert) {
    var a = new Map(1, 2, 3, 4),
        b = a.set(1, 1),
        c = b.set(1, 1);

    assert.equal(b.get(1), 1);
    assert.equal(b, c);

    assert.end();
});

tape("Map remove(key : Any) should return new Map with the removed key", function(assert) {
    var a = new Map(0, 1, 2, 3),
        b = a.remove(0),
        c = b.remove(2);

    assert.deepEqual(b.toArray(), [2, 3]);
    assert.deepEqual(c.toArray(), []);

    assert.end();
});

tape("Map static equal(a : Map, b : Map) should return a deep equals of map a and b", function(assert) {
    assert.equal(Map.equal(new Map(0, 1, 2, 3), new Map(0, 1, 2, 3)), true);
    assert.equal(Map.equal(new Map(0, 1, 2, 3), new Map(0, 0, 2, 2)), false);
    assert.equal(Map.equal(new Map(0, 1, 2, 3), new Map(1, 2)), false);
    assert.end();
});

tape("Map iterator([reverse = false : Boolean]) (reverse = false) should return Iterator starting from the beginning", function(assert) {
    var a = new Map(0, 1, 2, 3),
        it = a.iterator();

    assert.deepEqual(it.next().value, [0, 1]);
    assert.deepEqual(it.next().value, [2, 3]);
    assert.equal(it.next().done, true);

    assert.end();
});

tape("Map iterator([reverse = true : Boolean]) should return Iterator starting from the end", function(assert) {
    var a = new Map(0, 1, 2, 3),
        it = a.iterator(true);

    assert.deepEqual(it.next().value, [2, 3]);
    assert.deepEqual(it.next().value, [0, 1]);
    assert.equal(it.next().done, true);

    assert.end();
});

tape("Map every(callback[, thisArg])", function(assert) {
    assert.equals(
        Map.of([0, 0, 1, 1, 2, 2]).every(function(value, key) {
            return value === key;
        }),
        true
    );
    assert.equals(
        Map.of([0, 0, 1, 1, 2, 3]).every(function(value, key) {
            return value === key;
        }),
        false
    );
    assert.end();
});

tape("Map filter(callback[, thisArg])", function(assert) {
    assert.deepEquals(
        Map.of([0, 0, 1, 1, 2, 2]).filter(function(value) {
            return value % 2 === 0;
        }).toArray(), [0, 0, 2, 2]
    );
    assert.end();
});

tape("Map forEach(callback[, thisArg])", function(assert) {
    var count = 0,
        keys = [];

    Map.of([0, 0, 1, 1, 2, 2]).forEach(function(value, key) {
        keys[keys.length] = key;
        count += 1;
    });
    assert.deepEquals(keys, [0, 1, 2]);
    assert.equals(count, 3);

    count = 0;
    keys.length = 0;
    Map.of([0, 0, 1, 1, 2, 2]).forEach(function(value, key) {
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

tape("Map forEachRight(callback[, thisArg])", function(assert) {
    var count = 0,
        keys = [];

    Map.of([0, 0, 1, 1, 2, 2]).forEachRight(function(value, key) {
        keys[keys.length] = key;
        count += 1;
    });
    assert.deepEquals(keys, [2, 1, 0]);
    assert.equals(count, 3);

    count = 0;
    keys.length = 0;
    Map.of([0, 0, 1, 1, 2, 2]).forEachRight(function(value, key) {
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

tape("Map map(callback[, thisArg])", function(assert) {
    assert.deepEquals(
        Map.of([0, 0, 1, 1, 2, 2]).map(function(value, key) {
            return [key, value + key];
        }).toArray(), [0, 0, 1, 2, 2, 4]
    );
    assert.end();
});

tape("Map reduce(callback[, thisArg])", function(assert) {
    assert.deepEquals(
        Map.of([0, 0, 1, 1, 2, 2]).reduce(function(currentValue, value) {
            return currentValue + value;
        }),
        3
    );
    assert.end();
});

tape("Map reduceRight(callback[, thisArg])", function(assert) {
    assert.deepEquals(
        Map.of([0, 0, 1, 1, 2, 2]).reduceRight(function(currentValue, value) {
            return currentValue + value;
        }),
        3
    );
    assert.end();
});

tape("Map some(callback[, thisArg])", function(assert) {
    assert.equals(
        Map.of([0, 0, 1, 1, 2, 2]).some(function(value) {
            return value === 2;
        }),
        true
    );
    assert.equals(
        Map.of([0, 0, 1, 1, 2, 2]).some(function(value) {
            return value === 3;
        }),
        false
    );
    assert.end();
});

tape("Map join([separator = \", \", [keyValueSeparator = \": \"]]) should join all elements of an Map into a String", function(assert) {
    var map = new Map(0, 0, 1, 1);

    assert.equal(map.join(), "0: 0, 1: 1");
    assert.equal(map.join(" "), "0: 0 1: 1");
    assert.equal(map.join(", ", " => "), "0 => 0, 1 => 1");

    assert.end();
});

tape("Map toString() should return toString representation of Map", function(assert) {
    assert.equal((new Map(0, 0, 1, 1)).toString(), "{0: 0, 1: 1}");
    assert.end();
});
