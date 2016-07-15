var isNull = require("@nathanfaucett/is_null"),
    isUndefined = require("@nathanfaucett/is_undefined"),
    Iterator = require("./Iterator");


var IteratorValue = Iterator.Value;


module.exports = nodeIterator;


function nodeIterator(reverse) {
    if (reverse !== true) {
        return iterator(this);
    } else {
        return iteratorReverse(this);
    }
}

function iterator(_this) {
    var array = _this.array,
        index = 0,
        length = array.length,
        nextIter = null,
        nextEntry = null;

    function advance() {
        var key, iter;

        while (index < length) {
            key = array[index];
            valueOrNode = array[index + 1];
            index += 2;

            if (!isUndefined(key)) {
                nextEntry = [key, valueOrNode];
                return true;
            } else if (!isUndefined(valueOrNode)) {
                iter = valueOrNode.iterator();

                if (!isNull(iter) && iter.hasNext()) {
                    nextIter = iter;
                    return true;
                }
            }
        }

        return false;
    }

    function hasNext() {
        if (!isNull(nextEntry) || !isNull(nextIter)) {
            return true;
        } else {
            return advance();
        }
    }

    function next() {
        var entry = nextEntry;

        if (!isNull(entry)) {
            nextEntry = null;
            return new IteratorValue(entry, false);
        } else if (!isNull(nextIter)) {
            entry = nextIter.next();

            if (!nextIter.hasNext()) {
                nextIter = null;
            }

            return new IteratorValue(entry, false);
        } else if (advance()) {
            return next();
        } else {
            return new IteratorValue(undefined, true);
        }
    }

    return new Iterator(hasNext, next);
}

function iteratorReverse(_this) {
    var array = _this.array,
        length = array.length,
        index = length - 1,
        nextIter = null,
        nextEntry = null;

    function advance() {
        var key, iter;

        while (index > -1) {
            key = array[index - 1];
            valueOrNode = array[index];
            index -= 2;

            if (!isUndefined(key)) {
                nextEntry = [key, valueOrNode];
                return true;
            } else if (!isUndefined(valueOrNode)) {
                iter = valueOrNode.iterator();

                if (!isNull(iter) && iter.hasNext()) {
                    nextIter = iter;
                    return true;
                }
            }
        }

        return false;
    }

    function hasNext() {
        if (!isNull(nextEntry) || !isNull(nextIter)) {
            return true;
        } else {
            return advance();
        }
    }

    function next() {
        var entry = nextEntry;

        if (!isNull(entry)) {
            nextEntry = null;
            return new IteratorValue(entry, false);
        } else if (!isNull(nextIter)) {
            entry = nextIter.next();

            if (!nextIter.hasNext()) {
                nextIter = null;
            }

            return new IteratorValue(entry, false);
        } else if (advance()) {
            return next();
        } else {
            return new IteratorValue(undefined, true);
        }
    }

    return new Iterator(hasNext, next);
}
