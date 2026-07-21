"use strict";
const common_vendor = require("../common/vendor.js");
class TodayTimeRange extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          nowTime: { type: Number, optional: false },
          todayZero: { type: Number, optional: false }
        };
      },
      name: "TodayTimeRange"
    };
  }
  constructor(options, metadata = TodayTimeRange.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.nowTime = this.__props__.nowTime;
    this.todayZero = this.__props__.todayZero;
    delete this.__props__;
  }
}
function getTodayZeroTime() {
  const now = /* @__PURE__ */ new Date();
  const nowTime = now.getTime();
  const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
  return new TodayTimeRange({
    nowTime,
    todayZero
  });
}
exports.getTodayZeroTime = getTodayZeroTime;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/gettime.js.map
