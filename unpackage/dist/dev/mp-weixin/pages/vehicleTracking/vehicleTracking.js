"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_toast = require("../../utils/toast.js");
const api_request = require("../../api/request.js");
const utils_cars = require("../../utils/cars.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_sub_navBar_1 = common_vendor.resolveComponent("sub-navBar");
  const _easycom_i_button_1 = common_vendor.resolveComponent("i-button");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  (_easycom_custom_navBar_1 + _easycom_sub_navBar_1 + _easycom_i_button_1 + _easycom_app_toast_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_sub_navBar = () => "../../components/sub-navBar/sub-navBar.js";
const _easycom_i_button = () => "../../uni_modules/i-ui-x/components/i-button/i-button.js";
const _easycom_app_toast = () => "../../components/app-toast/app-toast.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_sub_navBar + _easycom_i_button + _easycom_app_toast)();
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
          connectionStatus: { type: String, optional: false },
          positionTime: { type: String, optional: false }
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
    this.positionTime = this.__props__.positionTime;
    delete this.__props__;
  }
}
class MpPolylineData extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          points: { type: "Unknown", optional: false },
          color: { type: String, optional: false },
          width: { type: Number, optional: false },
          dottedLine: { type: Boolean, optional: false },
          arrowLine: { type: Boolean, optional: false },
          borderColor: { type: String, optional: false },
          borderWidth: { type: Number, optional: false }
        };
      },
      name: "MpPolylineData"
    };
  }
  constructor(options, metadata = MpPolylineData.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.points = this.__props__.points;
    this.color = this.__props__.color;
    this.width = this.__props__.width;
    this.dottedLine = this.__props__.dottedLine;
    this.arrowLine = this.__props__.arrowLine;
    this.borderColor = this.__props__.borderColor;
    this.borderWidth = this.__props__.borderWidth;
    delete this.__props__;
  }
}
const TRACKING_POLL_INTERVAL_MS = 1e3;
const TRACKING_ANIMATION_DURATION_MS = 900;
const MAX_POSITION_JUMP_DISTANCE = 500;
const MARKER_UPDATE_INTERVAL = 30;
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
    const isMapReady = common_vendor.ref(false);
    const temporaryRenderPoints = common_vendor.ref([]);
    const polyline = common_vendor.ref([]);
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
    const hasValidPosition = common_vendor.ref(false);
    let trackingSessionId = 0;
    let isTrackRequestPending = false;
    let lastAcceptedPosition = null;
    let lastAcceptedPositionTime = "";
    let lastAcceptedReceivedTime = 0;
    let pendingJumpPosition = null;
    let pendingJumpTime = "";
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
    function createVehicleMarker(iconPath) {
      return {
        id: 1,
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        iconPath,
        width: 25,
        height: 25,
        rotate: currentRotation.value,
        anchor: { x: 0.5, y: 0.5 },
        alpha: 1
      };
    }
    function loadInitialPosition() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        isMapReady.value = false;
        try {
          const data = new common_vendor.UTSJSONObject({
            deptId: deptId.value,
            deviceids: imei.value
          });
          const res = yield api_request.getDevicePos(data);
          const positions = res.data;
          if ((res === null || res === void 0 ? null : res.code) != 200 || positions == null || positions.length == 0) {
            utils_toast.showAppToast({
              title: "获取位置失败",
              icon: "none"
            });
            return Promise.resolve(null);
          }
          let foundDevice = false;
          positions.forEach((item) => {
            const itemImei = item.getString("imei", "");
            if (itemImei == imei.value) {
              foundDevice = true;
              const latitude = item.getNumber("latitude", 0);
              const longitude = item.getNumber("longitude", 0);
              if (latitude == 0 || longitude == 0) {
                utils_toast.showAppToast({
                  title: "位置信息缺失",
                  icon: "none"
                });
                return null;
              }
              const direction = item.getNumber("direction", 0);
              const speed = item.getNumber("speed", 0);
              const positionUpdateTime = item.getString("positionUpdateTime", "定位时间未知");
              const status = item.getString("connectionStatus", "unknown");
              const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencentPrecise(latitude, longitude);
              currentPosition.latitude = convertedCoord.lat;
              currentPosition.longitude = convertedCoord.lng;
              hasValidPosition.value = true;
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
                markers.value = [createVehicleMarker(iconPath)];
                markerInitialized.value = true;
              }
              isMapReady.value = true;
            }
          });
          if (!foundDevice) {
            utils_toast.showAppToast({
              title: "未找到车辆设备",
              icon: "none"
            });
          }
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/vehicleTracking/vehicleTracking.uvue:248", "获取初始位置失败:", err);
          utils_toast.showAppToast({
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
      const marker = createVehicleMarker(iconPath);
      markers.value = [marker];
      markerInitialized.value = true;
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:269", "初始化标记点完成");
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
      var _a, _b, _c, _d, _f;
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:290", "option", option);
      connectionStatus.value = (_a = option.connectionStatus) !== null && _a !== void 0 ? _a : "";
      imei.value = (_b = option.imei) !== null && _b !== void 0 ? _b : "";
      currentCar.value = (_c = option.plateNo) !== null && _c !== void 0 ? _c : "未知车辆";
      deptId.value = (_d = option.deptId) !== null && _d !== void 0 ? _d : "";
      carType.value = (_f = option.carType) !== null && _f !== void 0 ? _f : "";
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
      if (markers.value.length == 0) {
        initMarker();
        return null;
      }
      const newIconPath = utils_cars.getDeviceIcon(connectionStatus.value, carType.value);
      const needUpdateIcon = newIconPath != lastIconPath;
      const updatedMarker = createVehicleMarker(needUpdateIcon ? newIconPath : lastIconPath);
      markers.value = [updatedMarker];
      if (needUpdateIcon) {
        lastIconPath = newIconPath;
      }
    };
    function copyPosition(p) {
      return new CoordinatePoint({ latitude: p.latitude, longitude: p.longitude });
    }
    function isSamePosition(first, second) {
      return first.latitude == second.latitude && first.longitude == second.longitude;
    }
    function parsePositionTime(value) {
      const time = Date.parse(value.replace(/-/g, "/"));
      return isNaN(time) ? 0 : time;
    }
    function updateTrackingPolyline() {
      const renderPoints = temporaryRenderPoints.value.map((point) => {
        return copyPosition(point);
      });
      if (isAnimating.value && renderPoints.length > 0 && !isSamePosition(renderPoints[renderPoints.length - 1], currentPosition))
        renderPoints.push(copyPosition(currentPosition));
      if (renderPoints.length < 2) {
        polyline.value = [];
        return null;
      }
      polyline.value = [{ points: renderPoints, color: "#888787", width: 3, dottedLine: false, arrowLine: false, borderColor: "#888787", borderWidth: 0 }];
    }
    function appendTemporaryRenderPoint(position) {
      const last = temporaryRenderPoints.value.length > 0 ? temporaryRenderPoints.value[temporaryRenderPoints.value.length - 1] : null;
      if (last != null && isSamePosition(last, position))
        return null;
      temporaryRenderPoints.value.push(copyPosition(position));
      if (temporaryRenderPoints.value.length > 1e3)
        temporaryRenderPoints.value.splice(0, temporaryRenderPoints.value.length - 1e3);
      updateTrackingPolyline();
    }
    function resetTemporaryRenderSegment(position) {
      temporaryRenderPoints.value = [copyPosition(position)];
      polyline.value = [];
    }
    function clearTemporaryRoute() {
      temporaryRenderPoints.value = [];
      polyline.value = [];
    }
    const startPositionAnimation = (duration, sessionId, done) => {
      if (animationTimer.value != null)
        clearInterval(animationTimer.value);
      isAnimating.value = true;
      const begin = Date.now(), lat = currentPosition.latitude, lng = currentPosition.longitude, rot = currentRotation.value;
      const latDiff = targetPosition.latitude - lat, lngDiff = targetPosition.longitude - lng, rotDiff = calculateShortestRotation(rot, targetRotation.value);
      let lastDraw = begin;
      animationTimer.value = setInterval(() => {
        if (!isTracking.value || sessionId != trackingSessionId)
          return null;
        const now = Date.now(), progress = Math.min((now - begin) / duration, 1);
        currentPosition.latitude = lat + latDiff * progress;
        currentPosition.longitude = lng + lngDiff * progress;
        currentRotation.value = normalizeRotation(rot + rotDiff * progress);
        center.latitude = currentPosition.latitude;
        center.longitude = currentPosition.longitude;
        if (now - lastDraw >= MARKER_UPDATE_INTERVAL || progress >= 1) {
          updateMarkerSmooth();
          updateTrackingPolyline();
          lastDraw = now;
        }
        if (progress >= 1) {
          clearInterval(animationTimer.value);
          animationTimer.value = null;
          isAnimating.value = false;
          currentPosition.latitude = targetPosition.latitude;
          currentPosition.longitude = targetPosition.longitude;
          currentRotation.value = normalizeRotation(targetRotation.value);
          updateMarkerSmooth();
          appendTemporaryRenderPoint(currentPosition);
          done();
        }
      }, 30);
    };
    function processAnimationQueue(sessionId) {
      if (!isTracking.value || sessionId != trackingSessionId || animationQueue.value.length == 0) {
        isProcessingQueue.value = false;
        return null;
      }
      isProcessingQueue.value = true;
      const next = common_vendor.UTS.arrayShift(animationQueue.value);
      targetPosition.latitude = next.position.latitude;
      targetPosition.longitude = next.position.longitude;
      targetRotation.value = next.rotation;
      currentSpeed.value = next.speed;
      currentAddress.value = next.address;
      connectionStatus.value = next.connectionStatus;
      startPositionAnimation(TRACKING_ANIMATION_DURATION_MS, sessionId, () => {
        if (!isTracking.value || sessionId != trackingSessionId)
          return null;
        isProcessingQueue.value = false;
        if (animationQueue.value.length > 0)
          setTimeout(() => {
            return processAnimationQueue(sessionId);
          }, 50);
      });
    }
    function acceptLivePosition(item, position, positionTime, sessionId) {
      const direction = item.getNumber("direction", lastDirection.value);
      const animationData = new AnimationQueueItem({ position, rotation: normalizeRotation(calculateMapRotation(direction)), speed: item.getNumber("speed", 0), address: positionTime == "" ? "未知位置" : positionTime, connectionStatus: item.getString("connectionStatus", "unknown"), positionTime });
      lastAcceptedPosition = copyPosition(position);
      lastAcceptedPositionTime = positionTime;
      lastAcceptedReceivedTime = Date.now();
      if (isAnimating.value || animationQueue.value.length > 0)
        animationQueue.value = [];
      animationQueue.value.push(animationData);
      lastDirection.value = direction;
      if (!isProcessingQueue.value && !isAnimating.value)
        processAnimationQueue(sessionId);
    }
    function relocateToConfirmedPosition(item, position, positionTime) {
      if (animationTimer.value != null)
        clearInterval(animationTimer.value);
      animationTimer.value = null;
      isAnimating.value = false;
      isProcessingQueue.value = false;
      animationQueue.value = [];
      currentPosition.latitude = position.latitude;
      currentPosition.longitude = position.longitude;
      targetPosition.latitude = position.latitude;
      targetPosition.longitude = position.longitude;
      const direction = item.getNumber("direction", lastDirection.value);
      currentRotation.value = normalizeRotation(calculateMapRotation(direction));
      targetRotation.value = currentRotation.value;
      center.latitude = position.latitude;
      center.longitude = position.longitude;
      currentSpeed.value = item.getNumber("speed", 0);
      currentAddress.value = positionTime;
      connectionStatus.value = item.getString("connectionStatus", "unknown");
      lastDirection.value = direction;
      lastAcceptedPosition = copyPosition(position);
      lastAcceptedPositionTime = positionTime;
      lastAcceptedReceivedTime = Date.now();
      resetTemporaryRenderSegment(position);
      updateMarkerSmooth();
    }
    const loadTrackData = (sessionId) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!isTracking.value || sessionId != trackingSessionId || isTrackRequestPending)
          return Promise.resolve(null);
        isTrackRequestPending = true;
        try {
          const res = yield api_request.getDevicePos(new common_vendor.UTSJSONObject({ deptId: deptId.value, deviceids: imei.value }));
          const positions = res.data;
          if (!isTracking.value || sessionId != trackingSessionId || (res === null || res === void 0 ? null : res.code) != 200 || positions == null)
            return Promise.resolve(null);
          const item = common_vendor.UTS.arrayFind(positions, (value) => {
            return value.getString("imei", "") == imei.value;
          });
          if (item == null)
            return Promise.resolve(null);
          const rawLat = item.getNumber("latitude", 0), rawLng = item.getNumber("longitude", 0);
          if (rawLat == 0 || rawLng == 0 || !isFinite(rawLat) || !isFinite(rawLng))
            return Promise.resolve(null);
          const converted = utils_coordTransform.CoordTransform.wgs84ToTencentPrecise(rawLat, rawLng);
          if (!isFinite(converted.lat) || !isFinite(converted.lng))
            return Promise.resolve(null);
          const position = new CoordinatePoint({ latitude: converted.lat, longitude: converted.lng });
          const positionTime = item.getString("positionUpdateTime", "");
          const previous = lastAcceptedPosition;
          if (positionTime != "" && positionTime == lastAcceptedPositionTime)
            return Promise.resolve(null);
          if (previous == null || isSamePosition(previous, position))
            return Promise.resolve(null);
          const sourceTime = parsePositionTime(positionTime);
          const previousTime = parsePositionTime(lastAcceptedPositionTime);
          const elapsedSeconds = sourceTime > previousTime && previousTime > 0 ? (sourceTime - previousTime) / 1e3 : Math.max((Date.now() - lastAcceptedReceivedTime) / 1e3, 1);
          const distance = calculateDistance(previous.latitude, previous.longitude, position.latitude, position.longitude);
          const impliedSpeed = distance / elapsedSeconds * 3.6;
          if (distance > MAX_POSITION_JUMP_DISTANCE || impliedSpeed > 210) {
            const pending = pendingJumpPosition;
            if (pending != null && calculateDistance(pending.latitude, pending.longitude, position.latitude, position.longitude) <= MAX_POSITION_JUMP_DISTANCE && positionTime != pendingJumpTime) {
              pendingJumpPosition = null;
              pendingJumpTime = "";
              relocateToConfirmedPosition(item, position, positionTime);
            } else {
              pendingJumpPosition = copyPosition(position);
              pendingJumpTime = positionTime;
            }
            return Promise.resolve(null);
          }
          pendingJumpPosition = null;
          pendingJumpTime = "";
          acceptLivePosition(item, position, positionTime, sessionId);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/vehicleTracking/vehicleTracking.uvue:488", "获取跟踪位置失败:", error);
        } finally {
          if (sessionId == trackingSessionId)
            isTrackRequestPending = false;
        }
      });
    };
    function stopTracking(showToast = true) {
      trackingSessionId += 1;
      isTracking.value = false;
      if (trackingInterval.value != null) {
        clearInterval(trackingInterval.value);
        trackingInterval.value = null;
      }
      if (animationTimer.value != null) {
        clearInterval(animationTimer.value);
        animationTimer.value = null;
      }
      if (temporaryRenderPoints.value.length > 0) {
        const lastIndex = temporaryRenderPoints.value.length - 1;
        temporaryRenderPoints.value[lastIndex] = copyPosition(currentPosition);
        updateTrackingPolyline();
      }
      animationQueue.value = [];
      isAnimating.value = false;
      isProcessingQueue.value = false;
      isTrackRequestPending = false;
      pendingJumpPosition = null;
      if (showToast)
        utils_toast.showAppToast({ title: "停止跟踪", icon: "success", duration: 1500 });
    }
    function startTracking() {
      if (!hasValidPosition.value) {
        utils_toast.showAppToast({ title: "暂无有效定位信息", icon: "none" });
        return null;
      }
      if (!markerInitialized.value)
        initMarker();
      clearTemporaryRoute();
      resetTemporaryRenderSegment(currentPosition);
      animationQueue.value = [];
      isProcessingQueue.value = false;
      lastAcceptedPosition = copyPosition(currentPosition);
      lastAcceptedPositionTime = "";
      lastAcceptedReceivedTime = Date.now();
      pendingJumpPosition = null;
      trackingSessionId += 1;
      const sessionId = trackingSessionId;
      isTracking.value = true;
      loadTrackData(sessionId);
      trackingInterval.value = setInterval(() => {
        loadTrackData(sessionId);
      }, TRACKING_POLL_INTERVAL_MS);
      utils_toast.showAppToast({ title: "开始跟踪", icon: "success", duration: 1500 });
    }
    const toggleTracking = () => {
      if (isTracking.value) {
        stopTracking();
      } else {
        startTracking();
      }
    };
    common_vendor.onHide(() => {
      stopTracking(false);
    });
    common_vendor.onUnload(() => {
      stopTracking(false);
      clearTemporaryRoute();
    });
    common_vendor.onUnmounted(() => {
      stopTracking(false);
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
        b: isMapReady.value
      }, isMapReady.value ? {
        c: common_vendor.sei("myMap", "map"),
        d: currentPosition.latitude,
        e: currentPosition.longitude,
        f: markers.value,
        g: polyline.value,
        h: mapScale.value
      } : {}, {
        i: common_vendor.o(handleCurrentTimeUpdate, "70"),
        j: common_vendor.p({
          currentTime: currentTime.value,
          currentCar: currentCar.value,
          times: times.value,
          showCar: true,
          carStatus: connectionStatus.value,
          class: "sub-nav-overlay"
        }),
        k: common_vendor.o(toggleTracking, "96"),
        l: isTracking.value ? "#e64340" : "#1296db",
        m: common_vendor.p({
          type: isTracking.value ? "danger" : "primary",
          size: "small",
          text: isTracking.value ? "停止跟踪" : "开始跟踪",
          style: common_vendor.normalizeStyle({
            backgroundColor: isTracking.value ? "#e64340" : "#1296db"
          })
        }),
        n: common_vendor.t(currentSpeed.value),
        o: common_vendor.t(currentAddress.value),
        p: `${_ctx.u_s_b_h}px`,
        q: `${_ctx.u_s_a_i_b}px`
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/vehicleTracking/vehicleTracking.js.map
