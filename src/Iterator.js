var inherits = require("inherits"),
    BaseIterator = require("iterator");


module.exports = Iterator;


function Iterator(hasNext, next) {
    this.hasNext = hasNext;
    this.next = next;
}
inherits(Iterator, BaseIterator);
