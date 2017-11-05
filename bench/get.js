var Benchmark = require("benchmark"),
    mori = require("mori"),
    Immutable = require("immutable"),
    ImmutableHashMap = require("..");


var suite = new Benchmark.Suite();


suite.add("immutable-hash_map", function() {
    var a = ImmutableHashMap.fromObject({0: 0, 1: 1});

    return function() {
        a.get(0);
        a.get(1);
    };
}());

suite.add("Immutable", function() {
    var a = Immutable.fromJS({0: 0, 1: 1});

    return function() {
        a.get(0);
        a.get(1);
    };
}());

suite.add("mori hash_map", function() {
    var a = mori.hashMap({0: 0, 1: 1});

    return function() {
        mori.get(a, 0);
        mori.get(a, 1);
    };
}());

suite.on("cycle", function(event) {
    console.log(String(event.target));
});

suite.on("complete", function() {
    console.log("Fastest is " + this.filter("fastest").map("name"));
    console.log("=========================================\n");
});

console.log("\n= get ===================================");
suite.run();
