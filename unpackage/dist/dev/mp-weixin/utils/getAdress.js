"use strict";
const common_vendor = require("../common/vendor.js");
const getAddress = (latitude, longitude, tk = "fcaf46a375259f6bf44c387383a212a1") => {
  return new Promise((resolve, reject) => {
    const postStr = UTS.JSON.stringify(new UTSJSONObject({
      lon: longitude,
      lat: latitude,
      ver: 1
    }));
    common_vendor.index.request({
      url: `https://api.tianditu.gov.cn/geocoder?postStr=${encodeURIComponent(postStr)}&type=geocode&tk=${tk}`,
      method: "GET",
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
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
};
exports.getAddress = getAddress;
