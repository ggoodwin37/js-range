js-range
========

Build "range tracker" module in javascript. Exposes the following api:

```
trackRange(start, end);  // starts tracking the given range
queryRange(start, end);  // returns true if the given range is completely tracked
deleteRange(start, end); // stops tracking the given range
```

example:  

```
trackRange(10, 20);
queryRange(10, 12);  // true
queryRange(12, 14);  // true
queryRange(18, 20);  // true
queryRange(18, 21);  // false
queryRange(30, 32);  // false
deleteRange(16, 100);
queryRange(15, 17);  // false
queryRange(15, 16);  // true
```

Should be efficient both in memory and speed. Should handle overlaps and deletes smoothly.
