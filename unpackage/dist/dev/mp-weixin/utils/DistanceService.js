"use strict";
const common_vendor = require("../common/vendor.js");
class DistanceService {
  /**
   * 计算两点之间的直线距离（Haversine公式）
   */
  static calculateDistance(startLng, startLat, endLng, endLat) {
    if (!this.isValidCoordinate(startLng, startLat) || !this.isValidCoordinate(endLng, endLat)) {
      common_vendor.index.__f__("error", "at utils/DistanceService.uts:20", "无效的坐标参数，无法计算距离");
      return 0;
    }
    if (startLng === endLng && startLat === endLat) {
      return 0;
    }
    const dLat = this.toRad(endLat - startLat);
    const dLng = this.toRad(endLng - startLng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.toRad(startLat)) * Math.cos(this.toRad(endLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = this.CONFIG.EARTH_RADIUS * c;
    const roundedDistance = Math.round(distance);
    return roundedDistance < this.CONFIG.MIN_DISTANCE_THRESHOLD ? 0 : roundedDistance;
  }
  /**
   * 异步计算距离（为了保持接口一致性）
   */
  static getDistanceAsync(startLng, startLat, endLng, endLat) {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.calculateDistance(startLng, startLat, endLng, endLat));
        }, 0);
      });
    });
  }
  /**
   * 验证坐标是否有效
   */
  static isValidCoordinate(lng, lat) {
    return typeof lng === "number" && typeof lat === "number" && !isNaN(lng) && !isNaN(lat) && lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
  }
  /**
   * 角度转弧度
   */
  static toRad(degree) {
    return degree * Math.PI / 180;
  }
}
DistanceService.CONFIG = new UTSJSONObject(
  {
    MIN_DISTANCE_THRESHOLD: 1,
    EARTH_RADIUS: 6371e3
    // 地球半径，单位米
  }
  /**
   * 计算两点之间的直线距离（Haversine公式）
   */
);
class TianMapService {
  /**
   * 获取道路规划路径和距离（实际上使用直线距离）
   */
  static getRouteDistance(startLng, startLat, endLng, endLat) {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      common_vendor.index.__f__("log", "at utils/DistanceService.uts:94", "使用直线距离计算");
      return DistanceService.getDistanceAsync(startLng, startLat, endLng, endLat);
    });
  }
  /**
   * 计算直线距离
   */
  static calculateStraightDistance(lng1, lat1, lng2, lat2) {
    return DistanceService.calculateDistance(lng1, lat1, lng2, lat2);
  }
  /**
   * 简化版本：直接使用直线距离
   */
  static getSimpleDistance(startLng, startLat, endLng, endLat) {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      return DistanceService.getDistanceAsync(startLng, startLat, endLng, endLat);
    });
  }
  /**
   * 初始化方法（为了兼容性保留）
   */
  static initialize() {
    common_vendor.index.__f__("log", "at utils/DistanceService.uts:126", "距离计算服务已初始化（使用直线距离算法）");
  }
}
exports.TianMapService = TianMapService;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/DistanceService.js.map
