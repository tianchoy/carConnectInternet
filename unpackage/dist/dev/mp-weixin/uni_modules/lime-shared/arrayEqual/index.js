"use strict";
function arrayEqual(arr1, arr2) {
  return arr1.length == arr2.length && arr1.every((val, i) => {
    return val == arr2[i];
  });
}
exports.arrayEqual = arrayEqual;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/uni_modules/lime-shared/arrayEqual/index.js.map
