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
class CoordinatePoint extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          latitude: { type: Number, optional: false },
          longitude: { type: Number, optional: false }
        };
      },
      name: "CoordinatePoint"
    };
  }
  constructor(options, metadata = CoordinatePoint.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.latitude = this.__props__.latitude;
    this.longitude = this.__props__.longitude;
    delete this.__props__;
  }
}
class AnimationQueueItem extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          position: { type: CoordinatePoint, optional: false },
          rotation: { type: Number, optional: false },
          speed: { type: Number, optional: false },
          address: { type: String, optional: false },
          connectionStatus: { type: String, optional: false }
        };
      },
      name: "AnimationQueueItem"
    };
  }
  constructor(options, metadata = AnimationQueueItem.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.position = this.__props__.position;
    this.rotation = this.__props__.rotation;
    this.speed = this.__props__.speed;
    this.address = this.__props__.address;
    this.connectionStatus = this.__props__.connectionStatus;
    delete this.__props__;
  }
}
const MARKER_UPDATE_INTERVAL = 100;
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "vehicleTracking",
  setup(__props) {
    const imei = common_vendor.ref("");
    const connectionStatus = common_vendor.ref("");
    common_vendor.ref("");
    const deptId = common_vendor.ref("");
    const carType = common_vendor.ref("");
    const center = common_vendor.reactive(new common_vendor.UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(15);
    const isAnimating = common_vendor.ref(false);
    const animationTimer = common_vendor.ref(null);
    const currentPosition = common_vendor.reactive(new CoordinatePoint({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const targetPosition = common_vendor.reactive(new CoordinatePoint({
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
        new common_vendor.UTSJSONObject({ label: "1s", value: "1" }),
        new common_vendor.UTSJSONObject({ label: "5s", value: "5" }),
        new common_vendor.UTSJSONObject({ label: "10s", value: "10" }),
        new common_vendor.UTSJSONObject({ label: "20s", value: "20" })
      ]
    ]);
    function handleCurrentTimeUpdate(value) {
      currentTime.value = value;
    }
    function loadInitialPosition() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const data = new common_vendor.UTSJSONObject({
            deptId: deptId.value,
            deviceids: imei.value
          });
          common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:124", "data", data);
          const res = yield api_request.getDevicePos(data);
          common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:128", "res", res);
          if ((res === null || res === void 0 ? null : res.code) === 0 && res.data && res.data.length > 0) {
            let foundDevice = false;
            res.data.forEach((item) => {
              const itemImei = item.getString("imei", "");
              if (itemImei == imei.value) {
                foundDevice = true;
                const latitude = item.getNumber("latitude", 0);
                const longitude = item.getNumber("longitude", 0);
                if (latitude == 0 || longitude == 0) {
                  common_vendor.index.showToast({
                    title: "位置信息缺失",
                    icon: "none"
                  });
                  return null;
                }
                const direction = item.getNumber("direction", 0);
                const speed = item.getNumber("speed", 0);
                const positionUpdateTime = item.getString("positionUpdateTime", "定位时间未知");
                const status = item.getString("connectionStatus", "unknown");
                const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(latitude, longitude);
                currentPosition.latitude = convertedCoord.lat;
                currentPosition.longitude = convertedCoord.lng;
                targetPosition.latitude = convertedCoord.lat;
                targetPosition.longitude = convertedCoord.lng;
                center.latitude = convertedCoord.lat;
                center.longitude = convertedCoord.lng;
                lastDirection.value = direction;
                let initialRotation = lastDirection.value % 360;
                if (initialRotation < 0) {
                  initialRotation += 360;
                }
                currentRotation.value = initialRotation;
                targetRotation.value = currentRotation.value;
                currentSpeed.value = speed;
                currentAddress.value = positionUpdateTime;
                connectionStatus.value = status;
                if (!markerInitialized.value) {
                  const iconPath = utils_cars.getDeviceIcon(connectionStatus.value, carType.value);
                  lastIconPath = iconPath;
                  markers.value = [new common_vendor.UTSJSONObject({
                    id: 1,
                    latitude: currentPosition.latitude,
                    longitude: currentPosition.longitude,
                    iconPath,
                    width: 25,
                    height: 25,
                    rotate: currentRotation.value,
                    anchor: new common_vendor.UTSJSONObject({ x: 0.5, y: 0.5 }),
                    alpha: 1,
                    fixed: false
                  })];
                  markerInitialized.value = true;
                }
              }
            });
            if (!foundDevice) {
              common_vendor.index.showToast({
                title: "未找到车辆设备",
                icon: "none"
              });
            }
          } else {
            common_vendor.index.showToast({
              title: "获取位置失败",
              icon: "none"
            });
          }
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/vehicleTracking/vehicleTracking.uvue:211", "获取初始位置失败:", err);
          common_vendor.index.showToast({
            title: "网络请求失败",
            icon: "none"
          });
        }
      });
    }
    function initMarker() {
      if (markerInitialized.value) {
        return null;
      }
      const iconPath = utils_cars.getDeviceIcon(connectionStatus.value, carType.value);
      lastIconPath = iconPath;
      const marker = new common_vendor.UTSJSONObject({
        id: 1,
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        iconPath,
        width: 25,
        height: 25,
        rotate: currentRotation.value,
        anchor: new common_vendor.UTSJSONObject({ x: 0.5, y: 0.5 }),
        alpha: 1,
        fixed: false
      });
      markers.value = [marker];
      markerInitialized.value = true;
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:243", "初始化标记点完成");
    }
    function calculateMapRotation(direction) {
      let rotation = direction;
      if (rotation >= 360)
        rotation -= 360;
      if (rotation < 0)
        rotation += 360;
      return rotation;
    }
    function normalizeRotation(rotation) {
      let normalized = rotation % 360;
      if (normalized < 0) {
        normalized += 360;
      }
      return normalized;
    }
    common_vendor.onLoad((option) => {
      var _a, _b, _c, _d, _e;
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:264", "option", option);
      connectionStatus.value = (_a = option.connectionStatus) !== null && _a !== void 0 ? _a : "";
      imei.value = (_b = option.imei) !== null && _b !== void 0 ? _b : "";
      currentCar.value = (_c = option.plateNo) !== null && _c !== void 0 ? _c : "未知车辆";
      deptId.value = (_d = option.deptId) !== null && _d !== void 0 ? _d : "";
      carType.value = (_e = option.carType) !== null && _e !== void 0 ? _e : "";
      loadInitialPosition();
    });
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371e3;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
    const calculateRealisticAnimationDuration = (distance, speedKmh) => {
      if (speedKmh <= 0 || distance <= 0) {
        return 2e3;
      }
      const speedMs = speedKmh / 3.6;
      const realTimeSeconds = distance / speedMs;
      let duration = realTimeSeconds * 1e3;
      if (duration < 1e3)
        duration = 1e3;
      if (duration > 15e3)
        duration = 15e3;
      if (speedKmh < 10 && duration < 3e3) {
        duration = 3e3;
      }
      return duration;
    };
    function calculateShortestRotation(from, to) {
      let diff = to - from;
      if (diff > 180) {
        diff -= 360;
      } else if (diff < -180) {
        diff += 360;
      }
      return diff;
    }
    const updateMarkerSmooth = () => {
      if (markers.value.length === 0) {
        initMarker();
        return null;
      }
      const newIconPath = utils_cars.getDeviceIcon(connectionStatus.value, carType.value);
      const needUpdateIcon = newIconPath !== lastIconPath;
      const updatedMarker = new common_vendor.UTSJSONObject({
        id: 1,
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        iconPath: needUpdateIcon ? newIconPath : lastIconPath,
        width: 25,
        height: 25,
        rotate: currentRotation.value,
        anchor: new common_vendor.UTSJSONObject({ x: 0.5, y: 0.5 }),
        alpha: 1,
        fixed: false
      });
      markers.value = [updatedMarker];
      if (needUpdateIcon) {
        lastIconPath = newIconPath;
      }
    };
    const startPositionAnimation = (duration, onComplete) => {
      if (isAnimating.value && animationTimer.value != null) {
        clearInterval(animationTimer.value);
      }
      isAnimating.value = true;
      const startTime = Date.now();
      const startLat = currentPosition.latitude;
      const startLng = currentPosition.longitude;
      const startRot = currentRotation.value;
      const latDiff = targetPosition.latitude - startLat;
      const lngDiff = targetPosition.longitude - startLng;
      const rotDiff = calculateShortestRotation(startRot, targetRotation.value);
      const interval = 30;
      let lastMarkerUpdate = startTime;
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
        if (now - lastMarkerUpdate >= MARKER_UPDATE_INTERVAL || progress >= 1) {
          updateMarkerSmooth();
          lastMarkerUpdate = now;
        }
        if (progress >= 1) {
          clearInterval(animationTimer.value);
          animationTimer.value = null;
          isAnimating.value = false;
          currentPosition.latitude = targetPosition.latitude;
          currentPosition.longitude = targetPosition.longitude;
          currentRotation.value = normalizeRotation(targetRotation.value);
          updateMarkerSmooth();
          onComplete();
        }
      }, interval);
    };
    function processAnimationQueue() {
      if (animationQueue.value.length == 0) {
        isProcessingQueue.value = false;
        return null;
      }
      isProcessingQueue.value = true;
      const nextAnimation = animationQueue.value[0];
      animationQueue.value.splice(0, 1);
      targetPosition.latitude = nextAnimation.position.latitude;
      targetPosition.longitude = nextAnimation.position.longitude;
      targetRotation.value = nextAnimation.rotation;
      currentSpeed.value = nextAnimation.speed;
      currentAddress.value = nextAnimation.address;
      connectionStatus.value = nextAnimation.connectionStatus;
      const distance = calculateDistance(currentPosition.latitude, currentPosition.longitude, targetPosition.latitude, targetPosition.longitude);
      const animationDuration = calculateRealisticAnimationDuration(distance, currentSpeed.value);
      startPositionAnimation(animationDuration, () => {
        isProcessingQueue.value = false;
        if (animationQueue.value.length > 0) {
          setTimeout(() => {
            processAnimationQueue();
          }, 50);
        }
      });
    }
    const addToAnimationQueue = (animationData) => {
      if (animationQueue.value.length > 2) {
        animationQueue.value = animationQueue.value.slice(-1);
      }
      animationQueue.value.push(animationData);
      if (!isProcessingQueue.value && !isAnimating.value) {
        processAnimationQueue();
      }
    };
    const loadTrackData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const data = new common_vendor.UTSJSONObject({
            deptId: deptId.value,
            deviceids: imei.value
          });
          const res = yield api_request.getDevicePos(data);
          common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:471", "222222");
          if ((res === null || res === void 0 ? null : res.code) === 0 && res.data && res.data.length > 0) {
            const deviceData = common_vendor.UTS.arrayFind(res.data, (item) => {
              return item.getString("imei", "") == imei.value;
            });
            if (deviceData != null) {
              const latitude = deviceData.getNumber("latitude", 0);
              const longitude = deviceData.getNumber("longitude", 0);
              const speed = deviceData.getNumber("speed", 0);
              const address = deviceData.getString("positionUpdateTime", "未知位置");
              const status = deviceData.getString("connectionStatus", "unknown");
              const direction = deviceData.getNumber("direction", lastDirection.value);
              const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(latitude, longitude);
              let newDirection = direction;
              if (direction === lastDirection.value) {
                newDirection = lastDirection.value;
              }
              const animationData = new AnimationQueueItem({
                position: new CoordinatePoint({
                  latitude: convertedCoord.lat,
                  longitude: convertedCoord.lng
                }),
                rotation: normalizeRotation(calculateMapRotation(newDirection)),
                speed,
                address,
                connectionStatus: status
              });
              addToAnimationQueue(animationData);
              lastDirection.value = newDirection;
            }
          }
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/vehicleTracking/vehicleTracking.uvue:503", "获取跟踪位置失败:", err);
        }
      });
    };
    function stopTracking() {
      isTracking.value = false;
      if (trackingInterval.value != null) {
        clearInterval(trackingInterval.value);
        trackingInterval.value = null;
      }
      animationQueue.value = [];
      isProcessingQueue.value = false;
      if (animationTimer.value != null) {
        clearInterval(animationTimer.value);
        animationTimer.value = null;
      }
      isAnimating.value = false;
      common_vendor.index.showToast({
        title: "停止跟踪",
        icon: "success",
        duration: 1500
      });
    }
    function startTracking() {
      if (!markerInitialized.value) {
        initMarker();
      }
      animationQueue.value = [];
      isProcessingQueue.value = false;
      const interval = 1e4;
      isTracking.value = true;
      if (trackingInterval.value != null) {
        clearInterval(trackingInterval.value);
      }
      loadTrackData();
      trackingInterval.value = setInterval(() => {
        loadTrackData();
      }, interval);
      common_vendor.index.showToast({
        title: "开始跟踪",
        icon: "success",
        duration: 1500
      });
    }
    const toggleTracking = () => {
      if (isTracking.value) {
        stopTracking();
      } else {
        startTracking();
      }
    };
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:578", "页面隐藏时停止自动刷新");
      isTracking.value = false;
      if (trackingInterval.value != null) {
        clearInterval(trackingInterval.value);
        trackingInterval.value = null;
      }
      animationQueue.value = [];
      isProcessingQueue.value = false;
      if (animationTimer.value != null) {
        clearInterval(animationTimer.value);
        animationTimer.value = null;
      }
      isAnimating.value = false;
    });
    common_vendor.onUnmounted(() => {
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:599", "页面卸载时停止自动刷新");
      isTracking.value = false;
      if (trackingInterval.value != null) {
        clearInterval(trackingInterval.value);
        trackingInterval.value = null;
      }
      animationQueue.value = [];
      isProcessingQueue.value = false;
      if (animationTimer.value != null) {
        clearInterval(animationTimer.value);
        animationTimer.value = null;
      }
      isAnimating.value = false;
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
        b: common_vendor.o(handleCurrentTimeUpdate, "1a"),
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
        i: common_vendor.t(isTracking.value ? "停止跟踪" : "开始跟踪"),
        j: common_vendor.o(toggleTracking, "f8"),
        k: isTracking.value ? "#e64340" : "#1296db",
        l: common_vendor.t(currentSpeed.value),
        m: common_vendor.t(currentAddress.value),
        n: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        o: `${_ctx.u_s_b_h}px`,
        p: `${_ctx.u_s_a_i_b}px`,
        q: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/vehicleTracking/vehicleTracking.js.map
