"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
const utils_cars = require("../../utils/cars.js");
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
    const carType = common_vendor.ref("");
    const center = common_vendor.reactive(new UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(15);
    const isAnimating = common_vendor.ref(false);
    const animationTimer = common_vendor.ref(null);
    const currentPosition = common_vendor.reactive(new UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const targetPosition = common_vendor.reactive(new UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const currentRotation = common_vendor.ref(0);
    const targetRotation = common_vendor.ref(0);
    const animationQueue = common_vendor.ref([]);
    const isProcessingQueue = common_vendor.ref(false);
    const markers = common_vendor.ref([]);
    const markerInitialized = common_vendor.ref(false);
    let lastIconPath = "";
    const isTracking = common_vendor.ref(false);
    const trackingInterval = common_vendor.ref(null);
    const lastDirection = common_vendor.ref(0);
    const currentSpeed = common_vendor.ref(0);
    const currentAddress = common_vendor.ref("获取中...");
    const currentTime = common_vendor.ref("1s");
    const currentCar = common_vendor.ref("京A12345");
    const times = common_vendor.ref([
      [
        new UTSJSONObject({ label: "1s", value: "1" }),
        new UTSJSONObject({ label: "5s", value: "5" }),
        new UTSJSONObject({ label: "10s", value: "10" }),
        new UTSJSONObject({ label: "20s", value: "20" })
      ]
    ]);
    common_vendor.watch(currentTime, (newVal) => {
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:100", "时间选择变化（仅显示）:", newVal);
    });
    common_vendor.onLoad((option) => {
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:104", option);
      connectionStatus.value = option.connectionStatus;
      imei.value = option.imei;
      currentCar.value = option.plateNo;
      deptId.value = option.deptId;
      carType.value = option.carType;
      loadInitialPosition();
    });
    const loadInitialPosition = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const data = new UTSJSONObject({ deptId: deptId.value, deviceids: imei.value });
          const res = yield api_request.getDevicePos(data);
          common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:118", "跟踪位置", res.data, imei.value);
          res.data.forEach((item = null) => {
            return common_vendor.__awaiter(this, void 0, void 0, function* () {
              if (item.imei == imei.value) {
                if (!item.latitude || !item.longitude) {
                  common_vendor.index.showToast({
                    title: "位置信息缺失",
                    icon: "none"
                  });
                  return Promise.resolve(null);
                }
                const deviceData = item;
                const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(Number(deviceData.latitude), Number(deviceData.longitude));
                currentPosition.latitude = convertedCoord.lat;
                currentPosition.longitude = convertedCoord.lng;
                targetPosition.latitude = convertedCoord.lat;
                targetPosition.longitude = convertedCoord.lng;
                center.latitude = convertedCoord.lat;
                center.longitude = convertedCoord.lng;
                lastDirection.value = deviceData.direction || 0;
                currentRotation.value = normalizeRotation(calculateMapRotation(lastDirection.value));
                targetRotation.value = currentRotation.value;
                currentSpeed.value = deviceData.speed || 0;
                currentAddress.value = deviceData.positionUpdateTime || "定位时间未知";
                connectionStatus.value = deviceData.connectionStatus || "unknown";
                initMarker();
              }
            });
          });
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/vehicleTracking/vehicleTracking.uvue:160", "获取初始位置失败:", err);
          common_vendor.index.showToast({
            title: "获取车辆位置失败",
            icon: "none"
          });
        }
      });
    };
    const initMarker = () => {
      if (markerInitialized.value) {
        return null;
      }
      const iconPath = connectionStatus.value == "online" ? utils_cars.getOnlineDeviceIcon(carType.value) : utils_cars.getOfflineDeviceIcon(carType.value);
      lastIconPath = iconPath;
      const marker = new UTSJSONObject({
        id: 1,
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        iconPath,
        width: 25,
        height: 25,
        rotate: currentRotation.value,
        anchor: new UTSJSONObject({ x: 0.5, y: 0.5 }),
        alpha: 1,
        fixed: false
      });
      markers.value = [marker];
      markerInitialized.value = true;
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:192", "初始化标记点完成");
    };
    const calculateMapRotation = (direction) => {
      let rotation = direction;
      if (rotation >= 360)
        rotation -= 360;
      if (rotation < 0)
        rotation += 360;
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:201", "方向计算 - 原始:", direction, "修正后:", rotation);
      return rotation;
    };
    const normalizeRotation = (rotation) => {
      let normalized = rotation % 360;
      if (normalized < 0) {
        normalized += 360;
      }
      return normalized;
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
            const newPosition = new UTSJSONObject(
              {
                latitude: convertedCoord.lat,
                longitude: convertedCoord.lng,
                speed: deviceData.speed || 0,
                address: deviceData.positionUpdateTime || "未知位置",
                connectionStatus: deviceData.connectionStatus || "unknown",
                direction: deviceData.direction !== void 0 && deviceData.direction !== null ? deviceData.direction : lastDirection.value
              }
              // 处理方向数据
            );
            let newDirection = newPosition.direction;
            if (newPosition.direction === lastDirection.value) {
              newDirection = lastDirection.value;
            }
            addToAnimationQueue(new UTSJSONObject({
              position: new UTSJSONObject({
                latitude: newPosition.latitude,
                longitude: newPosition.longitude
              }),
              rotation: normalizeRotation(calculateMapRotation(newDirection)),
              speed: newPosition.speed,
              address: newPosition.address,
              connectionStatus: newPosition.connectionStatus
            }));
            lastDirection.value = newDirection;
          }
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/vehicleTracking/vehicleTracking.uvue:262", "获取位置失败:", err);
          common_vendor.index.showToast({ title: "获取位置失败", icon: "none" });
        }
      });
    };
    const addToAnimationQueue = (animationData = null) => {
      animationQueue.value.push(animationData);
      if (isProcessingQueue.value) {
        return null;
      }
      processAnimationQueue();
    };
    const processAnimationQueue = () => {
      if (animationQueue.value.length === 0) {
        isProcessingQueue.value = false;
        return null;
      }
      isProcessingQueue.value = true;
      const nextAnimation = UTS.arrayShift(animationQueue.value);
      targetPosition.latitude = nextAnimation.position.latitude;
      targetPosition.longitude = nextAnimation.position.longitude;
      targetRotation.value = nextAnimation.rotation;
      currentSpeed.value = nextAnimation.speed;
      currentAddress.value = nextAnimation.address;
      connectionStatus.value = nextAnimation.connectionStatus;
      const distance = calculateDistance(currentPosition.latitude, currentPosition.longitude, targetPosition.latitude, targetPosition.longitude);
      const animationDuration = calculateAnimationDuration(distance, currentSpeed.value);
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:313", `开始动画: 距离=${distance.toFixed(2)}米, 速度=${currentSpeed.value}km/h, 时长=${animationDuration}ms`);
      startPositionAnimation(animationDuration, () => {
        processAnimationQueue();
      });
    };
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371e3;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
    const calculateAnimationDuration = (distance, speed) => {
      if (speed <= 0 || distance <= 0) {
        return 1e4;
      }
      const actualTime = distance / (speed / 3.6);
      const duration = Math.min(Math.max(actualTime * 1e3, 2e3), 15e3);
      return duration;
    };
    const startPositionAnimation = (duration, onComplete) => {
      if (isAnimating.value) {
        if (animationTimer.value) {
          clearInterval(animationTimer.value);
        }
      }
      isAnimating.value = true;
      const startTime = Date.now();
      const startLat = currentPosition.latitude;
      const startLng = currentPosition.longitude;
      const startRot = currentRotation.value;
      const latDiff = targetPosition.latitude - startLat;
      const lngDiff = targetPosition.longitude - startLng;
      const rotDiff = calculateShortestRotation(startRot, targetRotation.value);
      animationTimer.value = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const linearProgress = progress;
        currentPosition.latitude = startLat + latDiff * linearProgress;
        currentPosition.longitude = startLng + lngDiff * linearProgress;
        currentRotation.value = normalizeRotation(startRot + rotDiff * linearProgress);
        center.latitude = currentPosition.latitude;
        center.longitude = currentPosition.longitude;
        if (progress >= 1 || elapsed % 100 < 50) {
          updateMarkerPositionOnly();
        }
        if (progress >= 1) {
          if (animationTimer.value) {
            clearInterval(animationTimer.value);
            animationTimer.value = null;
          }
          isAnimating.value = false;
          currentPosition.latitude = targetPosition.latitude;
          currentPosition.longitude = targetPosition.longitude;
          currentRotation.value = normalizeRotation(targetRotation.value);
          updateMarkerPositionOnly();
          common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:405", "动画完成");
          onComplete();
        }
      }, 50);
    };
    const calculateShortestRotation = (from, to) => {
      let diff = to - from;
      if (diff > 180) {
        diff -= 360;
      } else if (diff < -180) {
        diff += 360;
      }
      return diff;
    };
    const updateMarkerPositionOnly = () => {
      if (markers.value.length === 0) {
        initMarker();
        return null;
      }
      const newIconPath = connectionStatus.value == "online" ? utils_cars.getOnlineDeviceIcon(carType.value) : utils_cars.getOfflineDeviceIcon(carType.value);
      const needUpdateIcon = newIconPath !== lastIconPath;
      if (needUpdateIcon) {
        const updatedMarkers = markers.value.map((marker = null) => {
          return new UTSJSONObject(Object.assign(Object.assign({}, marker), { latitude: currentPosition.latitude, longitude: currentPosition.longitude, rotate: currentRotation.value, iconPath: newIconPath }));
        });
        markers.value = updatedMarkers;
        lastIconPath = newIconPath;
      } else {
        const marker = markers.value[0];
        marker.latitude = currentPosition.latitude;
        marker.longitude = currentPosition.longitude;
        marker.rotate = currentRotation.value;
        Object.assign(markers.value[0], marker);
      }
    };
    const toggleTracking = () => {
      if (isTracking.value) {
        stopTracking();
      } else {
        startTracking();
      }
    };
    const startTracking = () => {
      if (!markerInitialized.value) {
        initMarker();
      }
      animationQueue.value = [];
      isProcessingQueue.value = false;
      const interval = 1e4;
      isTracking.value = true;
      if (trackingInterval.value) {
        clearInterval(trackingInterval.value);
      }
      getCurrentPosition();
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
      animationQueue.value = [];
      isProcessingQueue.value = false;
      if (animationTimer.value) {
        clearInterval(animationTimer.value);
        animationTimer.value = null;
      }
      isAnimating.value = false;
      common_vendor.index.showToast({
        title: "停止跟踪",
        icon: "success"
      });
    };
    const getCurrentPosition = () => {
      loadTrackData();
    };
    const handleRegionChange = (e = null) => {
    };
    common_vendor.onUnmounted(() => {
      if (trackingInterval.value) {
        clearInterval(trackingInterval.value);
        trackingInterval.value = null;
      }
      if (animationTimer.value) {
        clearInterval(animationTimer.value);
        animationTimer.value = null;
      }
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
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
        h: mapScale.value,
        i: common_vendor.o(handleRegionChange),
        j: common_vendor.t(isTracking.value ? "停止跟踪" : "开始跟踪"),
        k: common_vendor.o(toggleTracking),
        l: isTracking.value ? "#e64340" : "#1296db",
        m: common_vendor.t(currentSpeed.value),
        n: common_vendor.t(currentAddress.value),
        o: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/vehicleTracking/vehicleTracking.js.map
