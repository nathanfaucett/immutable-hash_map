var inherits = require("@nathanfaucett/inherits"),
    BaseIterator = require("@nathanfaucett/iterator");


module.exports = Iterator;


function Iterator(hasNext, next) {
    this.hasNext = hasNext;
    this.next = next;
}
inherits(Iterator, BaseIterator);