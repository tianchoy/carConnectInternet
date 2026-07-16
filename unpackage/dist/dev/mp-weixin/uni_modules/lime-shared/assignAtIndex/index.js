"use strict";
function assignAtIndex(arr, index, value) {
  if (index < 0) {
    throw new Error(`Index must be a non-negative integer, got ${index}`);
  }
  arr[index] = value;
}
exports.assignAtIndex = assignAtIndex;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/uni_modules/lime-shared/assignAtIndex/index.js.map
