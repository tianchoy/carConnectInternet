"use strict";
const common_vendor = require("../common/vendor.js");
function getTodayZeroTime() {
  const now = /* @__PURE__ */ new Date();
  const nowTime = now.getTime();
  const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
  return new common_vendor.UTSJSONObject({
    nowTime,
    todayZero
  });
}
exports.getTodayZeroTime = getTodayZeroTime;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/gettime.js.map
