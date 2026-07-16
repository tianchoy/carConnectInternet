"use strict";
const uni_modules_limeShared_addUnit_index = require("../../../lime-shared/addUnit/index.js");
function convertRadius(radius) {
  var _a;
  if (Array.isArray(radius)) {
    const values = radius.map((item) => {
      return uni_modules_limeShared_addUnit_index.addUnit(item);
    });
    if (values.length == 1) {
      return [values[0], values[0], values[0], values[0]];
    }
    if (values.length == 2) {
      return [values[0], values[1], values[0], values[1]];
    }
    if (values.length == 3) {
      return [values[0], values[1], values[2], values[1]];
    }
    if (values.length == 4) {
      return [values[0], values[1], values[2], values[3]];
    }
    return ["0", "0", "0", "0"];
  }
  const value = (_a = uni_modules_limeShared_addUnit_index.addUnit(radius)) !== null && _a !== void 0 ? _a : "0";
  return [value, value, value, value];
}
exports.convertRadius = convertRadius;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/lime-popup/components/l-popup/utils.js.map
