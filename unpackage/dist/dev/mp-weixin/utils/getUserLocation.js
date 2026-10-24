"use strict";
const common_vendor = require("../common/vendor.js");
class UserLocation extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          latitude: { type: Number, optional: false },
          longitude: { type: Number, optional: false }
        };
      },
      name: "UserLocation"
    };
  }
  constructor(options, metadata = UserLocation.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.latitude = this.__props__.latitude;
    this.longitude = this.__props__.longitude;
    delete this.__props__;
  }
}
let cachedUserLocation = null;
function getUserCurrentLocation() {
  return new Promise((resolve) => {
    if (cachedUserLocation != null) {
      resolve(cachedUserLocation);
      return null;
    }
    common_vendor.index.getLocation(new common_vendor.UTSJSONObject({
      type: "gcj02",
      provider: "system",
      success: (res = null) => {
        const loc = new UserLocation({
          latitude: res.latitude,
          longitude: res.longitude
        });
        cachedUserLocation = loc;
        resolve(loc);
      },
      fail: (err = null) => {
        common_vendor.index.__f__("warn", "at utils/getUserLocation.uts:28", "获取用户当前位置失败:", err);
        resolve(null);
      }
    }));
  });
}
function isValidLatLng(latitude, longitude) {
  if (isNaN(latitude) || isNaN(longitude))
    return false;
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180)
    return false;
  if (latitude == 0 && longitude == 0)
    return false;
  return true;
}
exports.getUserCurrentLocation = getUserCurrentLocation;
exports.isValidLatLng = isValidLatLng;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/getUserLocation.js.map
