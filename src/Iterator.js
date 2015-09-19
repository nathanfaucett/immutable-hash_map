module.exports = Iterator;


function Iterator(hasNext, next) {
    this.hasNext = hasNext;
    this.next = next;
}
