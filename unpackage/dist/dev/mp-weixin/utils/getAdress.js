"use strict";
const common_vendor = require("../common/vendor.js");
const DEFAULT_TK = "1e3374be3d63de65d44dbfdc7b311afb";
function getAddress(latitude, longitude, tk = DEFAULT_TK) {
  return new Promise((resolve, reject) => {
    const postStr = common_vendor.UTS.JSON.stringify(new common_vendor.UTSJSONObject({
      lon: longitude,
      lat: latitude,
      ver: 1
    }));
    common_vendor.index.request({
      url: `https://api.tianditu.gov.cn/geocoder?postStr=${encodeURIComponent(postStr)}&type=geocode&tk=${tk}`,
      method: "GET",
      success: (res) => {
        if (res.statusCode === 200 && res.data != null) {
          resolve(res.data);
        } else {
          reject(new Error("获取地址信息失败"));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}
exports.getAddress = getAddress;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/getAdress.js.map
