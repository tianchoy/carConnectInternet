"use strict";
const common_vendor = require("../common/vendor.js");
class CoordTransform {
  /**
   * WGS84转腾讯地图坐标系（GCJ02）
   * @param wgLat WGS84纬度
   * @param wgLon WGS84经度
   * @returns 腾讯地图坐标系 { lat: number, lng: number }
   */
  static wgs84ToTencent(wgLat, wgLon) {
    if (!this.isInChina(wgLon, wgLat)) {
      return { lat: wgLat, lng: wgLon };
    }
    let dLat = this.transformLat(wgLon - 105, wgLat - 35);
    let dLng = this.transformLng(wgLon - 105, wgLat - 35);
    let radLat = wgLat / 180 * this.pi;
    let magic = Math.sin(radLat);
    magic = 1 - this.ee * magic * magic;
    let sqrtMagic = Math.sqrt(magic);
    dLat = dLat * 180 / (this.a * (1 - this.ee) / (magic * sqrtMagic) * this.pi);
    dLng = dLng * 180 / (this.a / sqrtMagic * Math.cos(radLat) * this.pi);
    const mgLat = wgLat + dLat;
    const mgLng = wgLon + dLng;
    return {
      lat: Number(mgLat.toFixed(6)),
      lng: Number(mgLng.toFixed(6))
    };
  }
  /**
   * 腾讯地图坐标系转WGS84（使用高精度算法）
   * @param tcLat 腾讯地图纬度
   * @param tcLon 腾讯地图经度
   * @returns WGS84坐标系 { lat: number, lng: number }
   */
  static tencentToWgs84(tcLat, tcLon) {
    if (!this.isInChina(tcLon, tcLat)) {
      return { lat: tcLat, lng: tcLon };
    }
    let wgsLat = tcLat;
    let wgsLng = tcLon;
    for (let i = 0; i < 5; i++) {
      const gcj02 = this.wgs84ToTencent(wgsLat, wgsLng);
      const deltaLat = tcLat - gcj02.lat;
      const deltaLng = tcLon - gcj02.lng;
      wgsLat += deltaLat;
      wgsLng += deltaLng;
      if (Math.abs(deltaLat) < 1e-7 && Math.abs(deltaLng) < 1e-7) {
        break;
      }
    }
    return {
      lat: Number(wgsLat.toFixed(6)),
      lng: Number(wgsLng.toFixed(6))
    };
  }
  /**
   * 批量转换坐标（内部使用高精度转换）
   * @param devices 设备数组
   * @param targetSystem 目标坐标系 'tencent' | 'wgs84'
   * @returns 转换后的设备数组
   */
  static batchConvertCoordinates(devices, targetSystem = "tencent") {
    if (!Array.isArray(devices))
      return [];
    return devices.map((device = null) => {
      if (!device)
        return device;
      const lat = Number(device.latitude);
      const lng = Number(device.longitude);
      if (isNaN(lat) || isNaN(lng)) {
        common_vendor.index.__f__("warn", "at utils/coordTransform.uts:96", "设备经纬度无效", device);
        return device;
      }
      let converted = null;
      if (targetSystem === "tencent") {
        converted = this.wgs84ToTencent(lat, lng);
      } else {
        converted = this.tencentToWgs84(lat, lng);
      }
      return new UTSJSONObject(Object.assign(Object.assign({}, device), { latitude: converted.lat, longitude: converted.lng, originalLatitude: lat, originalLongitude: lng }));
    });
  }
  /**
   * 转换单个坐标点（内部使用高精度转换）
   * @param lat 纬度
   * @param lng 经度
   * @param fromSystem 原坐标系 'wgs84' | 'tencent'
   * @param toSystem 目标坐标系 'tencent' | 'wgs84'
   * @returns 转换后的坐标 { lat: number, lng: number }
   */
  static convertCoordinate(lat, lng, fromSystem = "wgs84", toSystem = "tencent") {
    if (fromSystem === "wgs84" && toSystem === "tencent") {
      return this.wgs84ToTencent(lat, lng);
    } else if (fromSystem === "tencent" && toSystem === "wgs84") {
      return this.tencentToWgs84(lat, lng);
    } else {
      common_vendor.index.__f__("warn", "at utils/coordTransform.uts:133", "不支持的坐标系转换", fromSystem, "->", toSystem);
      return { lat, lng };
    }
  }
  /**
   * 检查坐标是否在中国境内
   * @param lat 纬度
   * @param lng 经度
   * @returns 是否在中国境内
   */
  static isInChina(lng, lat) {
    return lng >= 72.004 && lng <= 137.8347 && lat >= 0.8293 && lat <= 55.8271;
  }
  // 私有方法：纬度转换
  static transformLat(x, y) {
    let ret = -100 + 2 * x + 3 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2 / 3;
    ret += (20 * Math.sin(y * Math.PI) + 40 * Math.sin(y / 3 * Math.PI)) * 2 / 3;
    ret += (160 * Math.sin(y / 12 * Math.PI) + 320 * Math.sin(y * Math.PI / 30)) * 2 / 3;
    return ret;
  }
  // 私有方法：经度转换
  static transformLng(x, y) {
    let ret = 300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20 * Math.sin(6 * x * Math.PI) + 20 * Math.sin(2 * x * Math.PI)) * 2 / 3;
    ret += (20 * Math.sin(x * Math.PI) + 40 * Math.sin(x / 3 * Math.PI)) * 2 / 3;
    ret += (150 * Math.sin(x / 12 * Math.PI) + 300 * Math.sin(x / 30 * Math.PI)) * 2 / 3;
    return ret;
  }
}
CoordTransform.a = 6378245;
CoordTransform.ee = 0.006693421622965943;
CoordTransform.pi = 3.141592653589793;
exports.CoordTransform = CoordTransform;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/coordTransform.js.map
