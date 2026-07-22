"use strict";
const common_vendor = require("../common/vendor.js");
const DEFAULT_TK = "1e3374be3d63de65d44dbfdc7b311afb";
class AddressResult extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          formatted_address: { type: String, optional: false }
        };
      },
      name: "AddressResult"
    };
  }
  constructor(options, metadata = AddressResult.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.formatted_address = this.__props__.formatted_address;
    delete this.__props__;
  }
}
class AddressResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          result: { type: AddressResult, optional: false }
        };
      },
      name: "AddressResponse"
    };
  }
  constructor(options, metadata = AddressResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.result = this.__props__.result;
    delete this.__props__;
  }
}
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
      header: new common_vendor.UTSJSONObject({
        "User-Agent": "Mozilla/5.0"
      }),
      success: (res) => {
        if (res.statusCode != 200 || res.data == null) {
          reject(new Error(`获取地址信息失败，状态码：${res.statusCode}`));
          return null;
        }
        const response = res.data;
        const result = response.getJSON("result");
        if (result == null) {
          reject(new Error(`获取地址信息失败：${response.getString("msg", "响应缺少结果")}`));
          return null;
        }
        const formattedAddress = result.getString("formatted_address", "");
        if (formattedAddress == "") {
          reject(new Error("获取地址信息失败：响应缺少地址"));
          return null;
        }
        resolve({ result: new AddressResult({ formatted_address: formattedAddress }) });
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}
exports.getAddress = getAddress;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/getAdress.js.map
