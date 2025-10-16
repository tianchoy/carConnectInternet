"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_tiandituRoute = require("../../utils/tiandituRoute.js");
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
    const lastDataTime = common_vendor.ref(0);
    const isRequesting = common_vendor.ref(false);
    const lastAnimationEndTime = common_vendor.ref(0);
    common_vendor.watch(currentTime, (newVal) => {
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:117", "时间变化:", newVal);
      if (isTracking.value) {
        stopTracking();
        startTracking();
      }
    });
    common_vendor.onLoad((option) => {
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:126", option);
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
          common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:140", "跟踪位置", res.data, imei.value);
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
                currentAddress.value = deviceData.positionUpdateTime ? `最后定位: ${deviceData.positionUpdateTime}` : "未知位置";
                connectionStatus.value = deviceData.connectionStatus || "unknown";
                updateMarkers();
                lastDataTime.value = Date.now();
                lastAnimationEndTime.value = Date.now();
              }
            });
          });
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/vehicleTracking/vehicleTracking.uvue:188", "获取初始位置失败:", err);
          common_vendor.index.showToast({
            title: "获取车辆位置失败",
            icon: "none"
          });
        }
      });
    };
    const calculateMapRotation = (direction) => {
      let rotation = direction;
      if (rotation >= 360)
        rotation -= 360;
      if (rotation < 0)
        rotation += 360;
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:202", "方向计算 - 原始:", direction, "修正后:", rotation);
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
        if (isRequesting.value) {
          return Promise.resolve(null);
        }
        isRequesting.value = true;
        try {
          const data = new UTSJSONObject({ deptId: deptId.value, deviceids: imei.value });
          const res = yield api_request.getDevicePos(data);
          if ((res === null || res === void 0 ? null : res.code) == 0 && ((_a = res.data) === null || _a === void 0 ? null : _a.length) > 0) {
            const deviceData = res.data[0];
            const currentTime_1 = Date.now();
            if (currentTime_1 - lastDataTime.value < 3e3) {
              return Promise.resolve(null);
            }
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
            if (newPosition.direction === lastDirection.value && trackPoints.value.length >= 2) {
              newDirection = calculateDirectionFromTrack();
            }
            currentSpeed.value = newPosition.speed;
            currentAddress.value = newPosition.address;
            connectionStatus.value = newPosition.connectionStatus;
            lastDirection.value = newDirection;
            lastDataTime.value = currentTime_1;
            addToAnimationQueue(new UTSJSONObject({
              position: new UTSJSONObject({
                latitude: newPosition.latitude,
                longitude: newPosition.longitude
              }),
              rotation: normalizeRotation(calculateMapRotation(newDirection))
            }));
            if (isTracking.value) {
              trackPoints.value.push({
                latitude: newPosition.latitude,
                longitude: newPosition.longitude
              });
              drawTempRoute();
            }
            updateMarkers();
          }
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/vehicleTracking/vehicleTracking.uvue:291", "获取位置失败:", err);
        } finally {
          isRequesting.value = false;
        }
      });
    };
    const addToAnimationQueue = (animationData = null) => {
      if (animationQueue.value.length > 0) {
        const lastAnimation = animationQueue.value[animationQueue.value.length - 1];
        const distance = calculateDistance(lastAnimation.position.latitude, lastAnimation.position.longitude, animationData.position.latitude, animationData.position.longitude);
        if (distance < 5) {
          return null;
        }
      }
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
      const distance = calculateDistance(currentPosition.latitude, currentPosition.longitude, targetPosition.latitude, targetPosition.longitude);
      const animationDuration = calculateAnimationDuration(distance, currentSpeed.value);
      startPositionAnimation(animationDuration, () => {
        lastAnimationEndTime.value = Date.now();
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
      const requestInterval = parseInt(currentTime.value) * 1e3;
      if (speed <= 0 || distance <= 0) {
        return requestInterval;
      }
      const actualTime = distance / (speed / 3.6);
      const actualDuration = actualTime * 1e3;
      const minDuration = requestInterval * 0.8;
      const maxDuration = requestInterval * 1.2;
      let duration = actualDuration;
      if (duration < minDuration) {
        duration = minDuration;
      } else if (duration > maxDuration) {
        duration = maxDuration;
      }
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
        const currentTime2 = Date.now();
        const elapsed = currentTime2 - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const linearProgress = progress;
        currentPosition.latitude = startLat + latDiff * linearProgress;
        currentPosition.longitude = startLng + lngDiff * linearProgress;
        currentRotation.value = normalizeRotation(startRot + rotDiff * linearProgress);
        center.latitude = currentPosition.latitude;
        center.longitude = currentPosition.longitude;
        updateMarkers();
        if (progress >= 1) {
          if (animationTimer.value) {
            clearInterval(animationTimer.value);
            animationTimer.value = null;
          }
          isAnimating.value = false;
          currentPosition.latitude = targetPosition.latitude;
          currentPosition.longitude = targetPosition.longitude;
          currentRotation.value = normalizeRotation(targetRotation.value);
          updateMarkers();
          onComplete();
        }
      }, 16);
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
      return angle;
    };
    const updateMarkers = () => {
      markers.value = [
        new UTSJSONObject({
          id: 0,
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          iconPath: connectionStatus.value == "online" ? utils_cars.getOnlineDeviceIcon(carType.value) : utils_cars.getOfflineDeviceIcon(carType.value),
          width: 25,
          height: 25,
          rotate: currentRotation.value,
          callout: new UTSJSONObject({
            content: connectionStatus.value == "online" ? `速度: ${currentSpeed.value}km/h` : "爱车已离线",
            color: "#ffffff",
            bgColor: connectionStatus.value == "online" ? "#1296db" : "#ccc",
            padding: 5,
            borderRadius: 4,
            display: "ALWAYS"
          })
        })
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
      animationQueue.value = [];
      isProcessingQueue.value = false;
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
      animationQueue.value = [];
      isProcessingQueue.value = false;
      if (trackPoints.value.length >= 2) {
        getRealRoute();
      }
      common_vendor.index.showToast({
        title: "停止跟踪",
        icon: "success"
      });
    };
    const getCurrentPosition = () => {
      loadTrackData();
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
        common_vendor.index.__f__("error", "at pages/vehicleTracking/vehicleTracking.uvue:639", "路线规划失败:", err);
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
        new UTSJSONObject({
          points: convertedPoints,
          color: "#4a90e2",
          width: 12,
          level: "low"
        }),
        new UTSJSONObject({
          points: convertedPoints,
          color: "#1a73e8",
          width: 8,
          arrowLine: true,
          arrowIconPath: "/static/road-arrow.png",
          level: "high"
        }),
        new UTSJSONObject({
          points: convertedPoints,
          color: "#ffffff",
          width: 2,
          level: "highest"
        })
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
        j: common_vendor.t(isTracking.value ? "停止跟踪" : "开始跟踪"),
        k: common_vendor.o(toggleTracking),
        l: isTracking.value ? "#e64340" : "#1296db",
        m: common_vendor.t(currentSpeed.value),
        n: common_vendor.t(currentAddress.value),
        o: routeInfo.distance
      }, routeInfo.distance ? {
        p: common_vendor.t(formatDistance(routeInfo.distance)),
        q: common_vendor.t(formatDuration(routeInfo.duration))
      } : {}, {
        r: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/vehicleTracking/vehicleTracking.js.map
