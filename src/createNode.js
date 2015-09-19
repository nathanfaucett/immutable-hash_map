var hashCode = require("hash_code"),
    Box = require("./Box"),
    HashCollisionNode, BitmapIndexedNode;


module.exports = createNode;


HashCollisionNode = require("./HashCollisionNode");
BitmapIndexedNode = require("./BitmapIndexedNode");


function createNode(shift, key0, value0, keyHash1, key1, value1) {
    var keyHash0 = hashCode(key0),
        addedLeaf;

    if (keyHash0 === keyHash1) {
        return new HashCollisionNode(keyHash0, 2, [key0, value0, key1, value1]);
    } else {
        addedLeaf = new Box(null);
        return BitmapIndexedNode.EMPTY
            .set(shift, keyHash0, key0, value0, addedLeaf)
            .set(shift, keyHash1, key1, value1, addedLeaf);
    }
}
