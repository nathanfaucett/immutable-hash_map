var consts = exports;


consts.SHIFT = 5;
consts.SIZE = 1 << consts.SHIFT;
consts.MASK = consts.SIZE - 1;

consts.MAX_ARRAY_MAP_SIZE = consts.SIZE / 4;
consts.MAX_BITMAP_INDEXED_SIZE = consts.SIZE / 2;
