"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_tiandituRoute = require("../../utils/tiandituRoute.js");
const api_request = require("../../api/request.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_sub_navBar_1 = common_vendor.resolveComponent("sub-navBar");
  (_easycom_custom_navBar_1 + _easycom_sub_navBar_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_sub_navBar = () => "../../components/sub-navBar/sub-navBar.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_sub_navBar)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "vehicleTracking",
  setup(__props) {
    const imei = common_vendor.ref("");
    const connectionStatus = common_vendor.ref("");
    common_vendor.ref("");
    const deptId = common_vendor.ref("");
    const center = common_vendor.reactive(new UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(15);
    const markers = common_vendor.ref([]);
    const polylines = common_vendor.ref([]);
    const routeInfo = common_vendor.reactive(new UTSJSONObject({
      distance: 0,
      duration: 0
    }));
    const isTracking = common_vendor.ref(false);
    const trackingInterval = common_vendor.ref(null);
    const trackPoints = common_vendor.ref([]);
    const lastDirection = common_vendor.ref(0);
    const currentSpeed = common_vendor.ref(0);
    const currentAddress = common_vendor.ref("获取中...");
    const currentTime = common_vendor.ref("5s");
    const currentCar = common_vendor.ref("京A12345");
    const times = common_vendor.ref([
      [
        new UTSJSONObject({ label: "5s", value: "5" }),
        new UTSJSONObject({ label: "10s", value: "10" }),
        new UTSJSONObject({ label: "20s", value: "20" }),
        new UTSJSONObject({ label: "30s", value: "30" })
      ]
    ]);
    common_vendor.watch(currentTime, (newVal) => {
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:92", "时间变化:", newVal);
      if (isTracking.value) {
        stopTracking();
        startTracking();
      }
    });
    common_vendor.onLoad((option) => {
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:101", option);
      connectionStatus.value = option.connectionStatus;
      imei.value = option.imei;
      currentCar.value = option.plateNo;
      deptId.value = option.deptId;
      loadInitialPosition();
    });
    const loadInitialPosition = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.showLoading({
          title: "获取车辆位置中..."
        });
        try {
          const data = new UTSJSONObject({ deptId: deptId.value, deviceids: imei.value });
          const res = yield api_request.getDevicePos(data);
          common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:118", "跟踪位置", res.data, imei.value);
          res.data.forEach((item = null) => {
            return common_vendor.__awaiter(this, void 0, void 0, function* () {
              if (item.imei == imei.value) {
                const deviceData = item;
                const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(Number(deviceData.latitude), Number(deviceData.longitude));
                center.latitude = convertedCoord.lat;
                center.longitude = convertedCoord.lng;
                const position = new UTSJSONObject(
                  {
                    latitude: convertedCoord.lat,
                    longitude: convertedCoord.lng
                  }
                  // 记录初始方向
                );
                lastDirection.value = deviceData.direction || 0;
                markers.value = [new UTSJSONObject({
                  id: 0,
                  latitude: position.latitude,
                  longitude: position.longitude,
                  iconPath: connectionStatus.value == "online" ? "/static/car.png" : "/static/offline.png",
                  width: 20,
                  height: 20,
                  rotate: calculateMapRotation(lastDirection.value),
                  callout: new UTSJSONObject({
                    content: connectionStatus.value == "online" ? `车辆位置 | 速度: ${deviceData.speed || 0}km/h` : "车辆已离线",
                    color: connectionStatus.value == "online" ? "#fff" : "#666",
                    bgColor: connectionStatus.value == "online" ? "#1296db" : "#ccc",
                    padding: 5,
                    borderRadius: 4,
                    display: "ALWAYS"
                  })
                })];
                currentSpeed.value = deviceData.speed || 0;
                currentAddress.value = deviceData.positionUpdateTime ? `最后定位: ${deviceData.positionUpdateTime}` : "未知位置";
                connectionStatus.value = deviceData.connectionStatus || "unknown";
              }
            });
          });
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/vehicleTracking/vehicleTracking.uvue:168", "获取初始位置失败:", err);
          common_vendor.index.showToast({
            title: "获取车辆位置失败",
            icon: "none"
          });
        } finally {
          common_vendor.index.hideLoading();
        }
      });
    };
    const calculateMapRotation = (direction) => {
      let rotation = direction;
      if (rotation >= 360)
        rotation -= 360;
      if (rotation < 0)
        rotation += 360;
      return rotation;
    };
    const loadTrackData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
          const data = new UTSJSONObject({ deptId: deptId.value, deviceids: imei.value });
          const res = yield api_request.getDevicePos(data);
          if ((res === null || res === void 0 ? null : res.code) == 0 && ((_a = res.data) === null || _a === void 0 ? null : _a.length) > 0) {
            const deviceData = res.data[0];
            const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(Number(deviceData.latitude), Number(deviceData.longitude));
            const position = new UTSJSONObject(
              {
                latitude: convertedCoord.lat,
                longitude: convertedCoord.lng
              }
              // 更新中心点
            );
            center.latitude = position.latitude;
            center.longitude = position.longitude;
            currentSpeed.value = deviceData.speed || 0;
            currentAddress.value = deviceData.positionUpdateTime || "未知位置";
            connectionStatus.value = deviceData.connectionStatus || "unknown";
            if (deviceData.direction !== void 0 && deviceData.direction !== null) {
              lastDirection.value = deviceData.direction;
            } else if (trackPoints.value.length >= 2) {
              lastDirection.value = calculateDirectionFromTrack();
            }
            if (isTracking.value) {
              trackPoints.value.push(position);
              drawTempRoute();
            }
            setMarkers();
          }
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/vehicleTracking/vehicleTracking.uvue:236", "获取位置失败:", err);
          common_vendor.index.showToast({ title: "获取位置失败", icon: "none" });
        }
      });
    };
    const calculateDirectionFromTrack = () => {
      if (trackPoints.value.length < 2)
        return lastDirection.value;
      const lastIndex = trackPoints.value.length - 1;
      const prevIndex = trackPoints.value.length - 2;
      const lastPoint = trackPoints.value[lastIndex];
      const prevPoint = trackPoints.value[prevIndex];
      const dx = lastPoint.longitude - prevPoint.longitude;
      const dy = lastPoint.latitude - prevPoint.latitude;
      let angle = Math.atan2(dy, dx) * 180 / Math.PI;
      if (angle < 0)
        angle += 360;
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:261", "计算方向:", angle);
      return angle;
    };
    const setMarkers = () => {
      if (trackPoints.value.length === 0)
        return null;
      markers.value = [
        new UTSJSONObject(
          // 车辆位置
          {
            id: 0,
            latitude: trackPoints.value[trackPoints.value.length - 1].latitude,
            longitude: trackPoints.value[trackPoints.value.length - 1].longitude,
            iconPath: connectionStatus.value == "online" ? "/static/car.png" : "/static/offline.png",
            width: 20,
            height: 20,
            rotate: calculateMapRotation(lastDirection.value),
            callout: new UTSJSONObject({
              content: `速度: ${currentSpeed.value}km/h`,
              color: "#ffffff",
              bgColor: connectionStatus.value == "online" ? "#1296db" : "#ccc",
              padding: 5,
              borderRadius: 4,
              display: "ALWAYS"
            })
          }
        )
      ];
    };
    const toggleTracking = () => {
      if (isTracking.value) {
        stopTracking();
      } else {
        startTracking();
      }
    };
    const startTracking = () => {
      if (trackPoints.value.length > 0) {
        const lastPoint = trackPoints.value[trackPoints.value.length - 1];
        trackPoints.value = [lastPoint];
      } else {
        trackPoints.value = [];
        getCurrentPosition();
      }
      const interval = parseInt(currentTime.value) * 1e3;
      isTracking.value = true;
      if (trackingInterval.value) {
        clearInterval(trackingInterval.value);
      }
      trackingInterval.value = setInterval(() => {
        getCurrentPosition();
      }, interval);
      common_vendor.index.showToast({
        title: "开始跟踪",
        icon: "success"
      });
    };
    const stopTracking = () => {
      isTracking.value = false;
      if (trackingInterval.value) {
        clearInterval(trackingInterval.value);
        trackingInterval.value = null;
      }
      if (trackPoints.value.length >= 2) {
        getRealRoute();
      }
      common_vendor.index.showToast({
        title: "停止跟踪",
        icon: "success"
      });
    };
    const getCurrentPosition = () => {
      common_vendor.index.showLoading({
        title: "获取位置中..."
      });
      loadTrackData();
      setTimeout(() => {
        common_vendor.index.hideLoading();
      }, 1e3);
    };
    const drawTempRoute = () => {
      if (trackPoints.value.length < 2)
        return null;
      const validPoints = trackPoints.value.map((point) => {
        return new UTSJSONObject({
          latitude: Number(point.latitude),
          longitude: Number(point.longitude)
        });
      });
      polylines.value = [new UTSJSONObject({
        points: validPoints,
        color: "#1296db",
        width: 6,
        arrowLine: true,
        arrowIconPath: "/static/arrow.png",
        borderColor: "#ffffff",
        borderWidth: 2
      })];
    };
    const getRealRoute = () => {
      if (trackPoints.value.length < 2) {
        common_vendor.index.showToast({
          title: "至少需要2个坐标点",
          icon: "none"
        });
        return null;
      }
      common_vendor.index.showLoading({
        title: "路线规划中..."
      });
      const waypoints = trackPoints.value.slice(1, -1).map((point) => {
        return `${point.longitude},${point.latitude}`;
      });
      utils_tiandituRoute.getRoutePlan(new UTSJSONObject({
        origin: `${trackPoints.value[0].longitude},${trackPoints.value[0].latitude}`,
        destination: `${trackPoints.value[trackPoints.value.length - 1].longitude},${trackPoints.value[trackPoints.value.length - 1].latitude}`,
        waypoints,
        style: "0"
      })).then((res = null) => {
        common_vendor.index.hideLoading();
        if (res && res.data) {
          drawRoadRoute(res.data);
        }
      }).catch((err = null) => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "路线获取失败",
          icon: "none"
        });
        common_vendor.index.__f__("error", "at pages/vehicleTracking/vehicleTracking.uvue:418", "路线规划失败:", err);
      });
    };
    const drawRoadRoute = (path = null) => {
      const roadPoints = path.points || [];
      const convertedPoints = roadPoints.map((point = null) => {
        const converted = utils_coordTransform.CoordTransform.wgs84ToTencent(point.latitude, point.longitude);
        return new UTSJSONObject({
          latitude: converted.lat,
          longitude: converted.lng
        });
      });
      polylines.value = [
        new UTSJSONObject(
          // 道路底色
          {
            points: convertedPoints,
            color: "#4a90e2",
            width: 12,
            level: "low"
          }
        ),
        new UTSJSONObject(
          // 主路线
          {
            points: convertedPoints,
            color: "#1a73e8",
            width: 8,
            arrowLine: true,
            arrowIconPath: "/static/road-arrow.png",
            level: "high"
          }
        ),
        new UTSJSONObject(
          // 路线高亮
          {
            points: convertedPoints,
            color: "#ffffff",
            width: 2,
            level: "highest"
          }
        )
      ];
      routeInfo.distance = path.distance || 0;
      routeInfo.duration = path.duration || 0;
      adjustMapView(convertedPoints);
    };
    const adjustMapView = (points) => {
      if (points.length === 0)
        return null;
      let minLat = points[0].latitude;
      let maxLat = points[0].latitude;
      let minLng = points[0].longitude;
      let maxLng = points[0].longitude;
      points.forEach((point = null) => {
        minLat = Math.min(minLat, point.latitude);
        maxLat = Math.max(maxLat, point.latitude);
        minLng = Math.min(minLng, point.longitude);
        maxLng = Math.max(maxLng, point.longitude);
      });
      center.latitude = (minLat + maxLat) / 2;
      center.longitude = (minLng + maxLng) / 2;
      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;
      const diff = Math.max(latDiff, lngDiff);
      if (diff < 0.01) {
        mapScale.value = 16;
      } else if (diff < 0.02) {
        mapScale.value = 15;
      } else if (diff < 0.05) {
        mapScale.value = 14;
      } else {
        mapScale.value = 13;
      }
    };
    const formatDistance = (distance) => {
      if (distance < 1e3) {
        return `${distance}米`;
      } else {
        return `${(distance / 1e3).toFixed(1)}公里`;
      }
    };
    const formatDuration = (seconds) => {
      const mins = Math.floor(seconds / 60);
      if (mins < 60) {
        return `${mins}分钟`;
      } else {
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return `${hours}小时${remainingMins}分钟`;
      }
    };
    const handleRegionChange = (e = null) => {
    };
    common_vendor.onUnmounted(() => {
      if (trackingInterval.value) {
        clearInterval(trackingInterval.value);
        trackingInterval.value = null;
      }
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.p({
          title: "车辆跟踪",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.o((val) => {
          return currentTime.value = val;
        }),
        c: common_vendor.p({
          currentTime: currentTime.value,
          currentCar: currentCar.value,
          times: times.value,
          showCar: true,
          carStatus: connectionStatus.value
        }),
        d: common_vendor.sei("myMap", "map"),
        e: center.latitude,
        f: center.longitude,
        g: markers.value,
        h: polylines.value,
        i: mapScale.value,
        j: common_vendor.o(handleRegionChange),
        k: common_vendor.t(isTracking.value ? "停止跟踪" : "开始跟踪"),
        l: common_vendor.o(toggleTracking),
        m: isTracking.value ? "#e64340" : "#1296db",
        n: common_vendor.t(currentSpeed.value),
        o: common_vendor.t(currentAddress.value),
        p: routeInfo.distance
      }, routeInfo.distance ? {
        q: common_vendor.t(formatDistance(routeInfo.distance)),
        r: common_vendor.t(formatDuration(routeInfo.duration))
      } : {}, {
        s: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/vehicleTracking/vehicleTracking.js.map
