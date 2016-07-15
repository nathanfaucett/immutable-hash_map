var Benchmark = require("@nathanfaucett/benchmark"),
    mori = require("@nathanfaucett/mori"),
    Immutable = require("@nathanfaucett/immutable"),
    ImmutableMap = require("..");


var suite = new Benchmark.Suite();


suite.add("immutable-hash_map", function() {
    new ImmutableMap(0, 1, 2, 3);
});

suite.add("Immutable", function() {
    var a = new Immutable.Map().set(0, 1).set(2, 3);
});

suite.add("mori hash_map", function() {
    mori.hashMap(0, 1, 2, 3);
});

suite.add("native map", function() {
    var a = new Map();
    a.set(0, 1);
    a.set(2, 3);
});

suite.on("cycle", function(event) {
    console.log(String(event.target));
});

suite.on("complete", function() {
    console.log("Fastest is " + this.filter("fastest").pluck("name"));
    console.log("==========================================\n");
});

console.log("\n= create =================================");
suite.run();
