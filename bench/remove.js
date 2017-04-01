var Benchmark = require("benchmark"),
    mori = require("mori"),
    Immutable = require("immutable"),
    ImmutableMap = require("..");


var suite = new Benchmark.Suite();


suite.add("immutable-hash_map", function() {
    var a = new ImmutableMap(0, 0, 1, 1);

    return function() {
        a.remove(0);
    };
}());

suite.add("Immutable", function() {
    var a = new Immutable.Map().set(0, 0).set(1, 1);

    return function() {
        a.remove(0);
    };
}());

suite.add("mori hash_map", function() {
    var a = mori.hashMap(0, 0, 1, 1);

    return function() {
        mori.dissoc(a, 0);
    };
}());

suite.on("cycle", function(event) {
    console.log(String(event.target));
});

suite.on("complete", function() {
    console.log("Fastest is " + this.filter("fastest").map("name"));
    console.log("=========================================\n");
});

console.log("\n= remove ================================");
suite.run();
