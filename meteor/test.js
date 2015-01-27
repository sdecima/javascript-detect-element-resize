'use strict';

Tinytest.add('javascript-detect-element-resize', function (test) {
  test.instanceOf(addResizeListener, Function);
  test.instanceOf(removeResizeListener, Function);
});
