Immutable HashMap
=======

Immutable persistent hash map for the browser and node.js

# Install using npm
```bash
$ npm install @nathanfaucett/immutable-hash_map --save
```
# Install using yarn
```bash
$ yarn add @nathanfaucett/immutable-hash_map --save
```

# Example Usage
```javascript
var ImmutableHashMap = require("@nathanfaucett/immutable-hash_map");


var a = new ImmutableHashMap([0, 0, 1, 1]),
    b = new ImmutableHashMap(0, 0, 1, 1),
    c = ImmutableHashMap.of([0, 0, 1, 1]),
    d = ImmutableHashMap.of(0, 0, 1, 1);

var a0 = a.set(2, 2),
    a1 = a.remove(1);
```

# Docs

## Members

#### length -> Number
    returns size of HashMap, only available if Object.defineProperty is supported


## Static Functions

#### HashMap.isHashMap(value: Any) -> Boolean
    returns true if value is a hash map else false

#### HashMap.of(...values: Array<Any>) -> HashMap
    creates HashMap from passed values same as new HashMap(...values: Array<Any>)

#### HashMap.equal(a: HashMap, b: HashMap) -> Boolean
    compares hash maps by values


## Functions

#### size() -> Number
    returns size of HashMap

#### get(key: Any) -> Any
    returns value at key

#### has(key: Any) -> Boolean
    returns true if hash map contains key

#### set(key: Any, value: Any) -> HashMap
    returns new HashMap if value at key is not set or different

#### remove(key: Any) -> HashMap
    returns new HashMap without the value at key

#### iterator([reverse = false: Boolean]) -> Iterator
    returns Iterator

#### toArray() -> Array<[Any, Any]>
    returns HashMap elements in an Array

#### toObject() -> Object<String, Any>
    returns HashMap elements in an Object, keys should be primitives or some key value pairs will be lost

#### join([separator = " "]) -> String
    join all elements of an HashMap into a String

#### toString() -> String
    String representation of HashMap

#### equals(other: HashMap) -> Boolean
    compares this hash map to other hash map by values

#### every, filter, forEach, forEachRight, map, reduce, reduceRight, some
    some common methods
