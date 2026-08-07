"use strict";
const common_vendor = require("../common/vendor.js");
const utils_toast = require("./toast.js");
require("./coordTransform.js");
class OpenLocationParams extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          latitude: { type: Number, optional: false },
          longitude: { type: Number, optional: false },
          name: { type: String, optional: false }
        };
      },
      name: "OpenLocationParams"
    };
  }
  constructor(options, metadata = OpenLocationParams.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.latitude = this.__props__.latitude;
    this.longitude = this.__props__.longitude;
    this.name = this.__props__.name;
    delete this.__props__;
  }
}
function isValidCoordinate(latitude, longitude) {
  return !isNaN(latitude) && !isNaN(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180 && !(latitude == 0 && longitude == 0);
}
function showInvalidLocationToast() {
  utils_toast.showAppToast({
    title: "暂无有效车辆位置",
    icon: "none"
  });
}
function openBuiltInLocation(params) {
  try {
    common_vendor.index.openLocation({
      latitude: params.latitude,
      longitude: params.longitude,
      name: params.name != "" ? params.name : "当前位置",
      scale: 18,
      success: () => {
        common_vendor.index.__f__("log", "at utils/openLocation.uts:129", "成功打开位置地图");
      },
      fail: (error) => {
        common_vendor.index.__f__("error", "at utils/openLocation.uts:132", "打开位置地图失败:", error);
        utils_toast.showAppToast({
          title: "打开位置地图失败，请稍后重试",
          icon: "none"
        });
      }
    });
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/openLocation.uts:140", "打开位置地图异常:", error);
    utils_toast.showAppToast({
      title: "打开位置地图失败，请稍后重试",
      icon: "none"
    });
  }
}
function openLocation(params) {
  if (!isValidCoordinate(params.latitude, params.longitude)) {
    showInvalidLocationToast();
    return null;
  }
  openBuiltInLocation(params);
}
exports.OpenLocationParams = OpenLocationParams;
exports.openLocation = openLocation;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/openLocation.js.map
