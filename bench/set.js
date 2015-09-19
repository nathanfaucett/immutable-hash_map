var Benchmark = require("benchmark"),
    mori = require("mori"),
    Immutable = require("immutable"),
    Map = require("..");


var suite = new Benchmark.Suite();


suite.add("immutable-map", function() {
    var a = new Map(0, 0, 1, 1);

    return function() {
        a.set(0, 1);
    };
}());

suite.add("Immutable", function() {
    var a = new Immutable.Map().set(0, 0).set(1, 1);

    return function() {
        a.set(0, 1);
    };
}());

suite.add("mori map", function() {
    var a = mori.hashMap(0, 0, 1, 1);

    return function() {
        mori.set(a, 0, 1);
    };
}());

suite.on("cycle", function(event) {
    console.log(String(event.target));
});

suite.on("complete", function() {
    console.log("Fastest is " + this.filter("fastest").pluck("name"));
    console.log("=========================================\n");
});

console.log("\n= set ===================================");
suite.run();
