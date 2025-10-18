"use strict";
const common_vendor = require("../common/vendor.js");
class TianMapService {
  // 获取道路规划路径和距离
  static getRouteDistance(startLng, startLat, endLng, endLat, options = {}) {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      const _a = options.retryCount, retryCount = _a == void 0 ? 0 : _a;
      try {
        if (!this.isValidCoordinate(startLng, startLat) || !this.isValidCoordinate(endLng, endLat)) {
          throw new Error("无效的坐标参数");
        }
        const straightDistance = this.calculateStraightDistance(startLng, startLat, endLng, endLat);
        if (straightDistance < this.CONFIG.MIN_DISTANCE_THRESHOLD) {
          common_vendor.index.__f__("log", "at utils/TianMapService.uts:33", "距离太近，直接使用直线距离:", straightDistance, "米");
          return straightDistance;
        }
        const requestData = new UTSJSONObject({
          orig: `${startLng},${startLat}`,
          dest: `${endLng},${endLat}`,
          style: "0"
        });
        const postStr = encodeURIComponent(UTS.JSON.stringify(requestData));
        const url = `${this.BASE_URL}?postStr=${postStr}&type=search&tk=${this.API_KEY}`;
        common_vendor.index.__f__("log", "at utils/TianMapService.uts:46", "请求天地图URL:", url);
        const result = yield common_vendor.index.request({
          url,
          method: "GET",
          timeout: this.CONFIG.REQUEST_TIMEOUT,
          dataType: "text"
        });
        if (result.statusCode === 200 && result.data) {
          const xmlData = result.data;
          const distance = this.parseDistanceFromXML(xmlData);
          if (distance > 0) {
            common_vendor.index.__f__("log", "at utils/TianMapService.uts:60", `道路距离计算成功: ${startLng},${startLat} -> ${endLng},${endLat} = ${distance}米`);
            return distance;
          } else {
            common_vendor.index.__f__("warn", "at utils/TianMapService.uts:63", "道路距离计算失败，使用直线距离");
            return straightDistance;
          }
        } else {
          common_vendor.index.__f__("warn", "at utils/TianMapService.uts:67", `天地图API请求失败，状态码: ${result.statusCode}`);
          if (retryCount < this.CONFIG.MAX_RETRY_ATTEMPTS) {
            common_vendor.index.__f__("log", "at utils/TianMapService.uts:70", `进行第${retryCount + 1}次重试...`);
            return yield this.getRouteDistance(startLng, startLat, endLng, endLat, {
              retryCount: retryCount + 1
            });
          }
          return straightDistance;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at utils/TianMapService.uts:78", "道路规划请求异常:", error);
        if (retryCount < this.CONFIG.MAX_RETRY_ATTEMPTS) {
          common_vendor.index.__f__("log", "at utils/TianMapService.uts:82", `进行第${retryCount + 1}次重试...`);
          return yield this.getRouteDistance(startLng, startLat, endLng, endLat, {
            retryCount: retryCount + 1
          });
        }
        const straightDistance = this.calculateStraightDistance(startLng, startLat, endLng, endLat);
        common_vendor.index.__f__("warn", "at utils/TianMapService.uts:89", "所有重试失败，使用直线距离:", straightDistance, "米");
        return straightDistance;
      }
    });
  }
  // 从XML响应中解析距离
  static parseDistanceFromXML(xmlString) {
    try {
      const distanceMatch = xmlString.match(/<distance>([\d.]+)<\/distance>/);
      if (distanceMatch && distanceMatch[1]) {
        const distanceValue = parseFloat(distanceMatch[1]);
        if (distanceValue <= 0 || !isFinite(distanceValue)) {
          return 0;
        }
        const distanceInMeters = Math.round(distanceValue * 1e3);
        return distanceInMeters;
      }
      const streetDistanceMatch = xmlString.match(/<streetDistance>([\d.]+)<\/streetDistance>/);
      if (streetDistanceMatch && streetDistanceMatch[1]) {
        const streetDistance = parseFloat(streetDistanceMatch[1]);
        if (streetDistance > 0 && isFinite(streetDistance)) {
          return Math.round(streetDistance);
        }
      }
      const pathDistanceMatch = xmlString.match(/<pathDistance>([\d.]+)<\/pathDistance>/);
      if (pathDistanceMatch && pathDistanceMatch[1]) {
        const pathDistance = parseFloat(pathDistanceMatch[1]);
        if (pathDistance > 0 && isFinite(pathDistance)) {
          return Math.round(pathDistance);
        }
      }
      common_vendor.index.__f__("warn", "at utils/TianMapService.uts:130", "XML中未找到有效的距离信息");
      return 0;
    } catch (error) {
      common_vendor.index.__f__("error", "at utils/TianMapService.uts:134", "XML解析错误:", error);
      return 0;
    }
  }
  // 计算直线距离（Haversine公式）
  static calculateStraightDistance(lng1, lat1, lng2, lat2) {
    if (!this.isValidCoordinate(lng1, lat1) || !this.isValidCoordinate(lng2, lat2)) {
      common_vendor.index.__f__("error", "at utils/TianMapService.uts:143", "无效的坐标参数，无法计算距离");
      return 0;
    }
    const R = 6371e3;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance);
  }
  // 角度转弧度
  static toRad(degree) {
    return degree * Math.PI / 180;
  }
  // 验证坐标是否有效
  static isValidCoordinate(lng, lat) {
    return typeof lng === "number" && typeof lat === "number" && !isNaN(lng) && !isNaN(lat) && lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
  }
  // 批量计算多个路径的距离
  static getBatchRouteDistances(routes) {
    return common_vendor.__awaiter(this, void 0, void 0, function* () {
      var e_1, _a;
      const results = [];
      try {
        for (var routes_1 = common_vendor.__values(routes), routes_1_1 = routes_1.next(); !routes_1_1.done; routes_1_1 = routes_1.next()) {
          var route = routes_1_1.value;
          try {
            const roadDistance = yield this.getRouteDistance(route.startLng, route.startLat, route.endLng, route.endLat);
            const straightDistance = this.calculateStraightDistance(route.startLng, route.startLat, route.endLng, route.endLat);
            const useRoadDistance = roadDistance > straightDistance * 0.8 && roadDistance < straightDistance * 3;
            results.push({
              id: route.id,
              startLng: route.startLng,
              startLat: route.startLat,
              endLng: route.endLng,
              endLat: route.endLat,
              distance: useRoadDistance ? roadDistance : straightDistance,
              type: useRoadDistance ? "road" : "straight",
              straightDistance,
              roadDistance
              // 保留道路距离供参考
            });
            yield this.delay(100);
          } catch (error) {
            common_vendor.index.__f__("error", "at utils/TianMapService.uts:231", `计算路径距离失败: ${route.id || "未知路径"}`, error);
            const straightDistance = this.calculateStraightDistance(route.startLng, route.startLat, route.endLng, route.endLat);
            results.push({
              id: route.id,
              startLng: route.startLng,
              startLat: route.startLat,
              endLng: route.endLng,
              endLat: route.endLat,
              distance: straightDistance,
              type: "straight",
              straightDistance,
              roadDistance: 0,
              error: error.message
            });
          }
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (routes_1_1 && !routes_1_1.done && (_a = routes_1.return))
            _a.call(routes_1);
        } finally {
          if (e_1)
            throw e_1.error;
        }
      }
      return results;
    });
  }
  // 延迟函数
  static delay(ms) {
    return new Promise((resolve) => {
      return setTimeout(resolve, ms);
    });
  }
  // 获取服务状态信息
  static getServiceInfo() {
    return new UTSJSONObject({
      apiKey: this.API_KEY ? "已设置" : "未设置",
      baseUrl: this.BASE_URL,
      config: this.CONFIG,
      service: "天地图道路规划服务"
    });
  }
}
TianMapService.API_KEY = "fcaf46a375259f6bf44c387383a212a1";
TianMapService.BASE_URL = "https://api.tianditu.gov.cn/drive";
TianMapService.CONFIG = new UTSJSONObject(
  {
    MIN_DISTANCE_THRESHOLD: 50,
    REQUEST_TIMEOUT: 15e3,
    MAX_RETRY_ATTEMPTS: 2
    // 最大重试次数
  }
  // 获取道路规划路径和距离
);
exports.TianMapService = TianMapService;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/TianMapService.js.map
