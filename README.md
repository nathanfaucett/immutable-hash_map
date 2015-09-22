immutable Map
=======

immutable persistent map for the browser and node.js


# Usage
```javascript
var ImmutableMap = require("immutable-map");


var a = new ImmutableMap([0, 0, 1, 1]),
    b = new ImmutableMap(0, 0, 1, 1),
    c = ImmutableMap.of([0, 0, 1, 1]),
    d = ImmutableMap.of(0, 0, 1, 1);

var a0 = a.set(2, 2),
    a1 = a.remove(1);
```

# Docs

## Members

#### length -> Number
    returns size of Map, only available if Object.defineProperty is supported


## Static Functions

#### Map.isMap(value: Any) -> Boolean
    returns true if value is a map else false

#### Map.of(...values: Array<Any>) -> Map
    creates Map from passed values same as new Map(...values: Array<Any>)

#### Map.equal(a: Map, b: Map) -> Boolean
    compares maps by values


## Functions

#### size() -> Number
    returns size of Map

#### get(key: Any) -> Any
    returns value at index

#### has(key: Any) -> Boolean
    returns true if map contains key

#### set(key: Any, value: Any) -> Map
    returns new Map if value at key is different

#### remove(key: Any) -> Map
    returns new Map without the value at key

#### iterator([reverse = false: Boolean]) -> Iterator
    returns Iterator

#### every, filter, forEach, forEachRight, map, reduce, reduceRight, some
    common Array methods

#### toArray() -> Array<Any>
    returns Map elements in an Array

#### join([separator = " "]) -> String
    join all elements of an Map into a String

#### toString() -> String
    String representation of Map

#### equals(other: Map) -> Boolean
    compares this map to other map by values
