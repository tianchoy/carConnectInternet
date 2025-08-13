"use strict";
const common_vendor = require("../common/vendor.js");
const TD_MAP_CONFIG = new UTSJSONObject({
  API_KEY: "fcaf46a375259f6bf44c387383a212a1",
  BASE_URL: "https://api.tianditu.gov.cn/drive"
});
function getRoutePlan(options = null) {
  return new Promise((resolve, reject) => {
    var _a;
    if (!(options === null || options === void 0 ? null : options.origin) || !(options === null || options === void 0 ? null : options.destination)) {
      reject(new Error("缺少必要参数：起点或终点坐标"));
      return null;
    }
    const midParam = ((_a = options.waypoints) === null || _a === void 0 ? null : _a.join(";")) || "";
    const requestData = new UTSJSONObject({
      postStr: UTS.JSON.stringify(new UTSJSONObject({
        orig: options.origin,
        dest: options.destination,
        mid: midParam,
        style: options.style || "0"
      })),
      type: "search",
      tk: TD_MAP_CONFIG.API_KEY
    });
    common_vendor.wx$1.request({
      url: TD_MAP_CONFIG.BASE_URL,
      method: "GET",
      data: requestData,
      success(res = null) {
        var _a2;
        if (res.statusCode === 200) {
          if (res.data && !res.data.error) {
            resolve(res.data);
          } else {
            reject(new Error(((_a2 = res.data) === null || _a2 === void 0 ? null : _a2.message) || "路线规划数据解析失败"));
          }
        } else {
          reject(new Error(`请求失败，状态码：${res.statusCode}`));
        }
      },
      fail(err = null) {
        reject(new Error(`网络请求失败: ${err.errMsg || "未知错误"}`));
      }
    });
  });
}
exports.getRoutePlan = getRoutePlan;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/tiandituRoute.js.map
