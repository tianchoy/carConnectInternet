"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
const utils_cars = require("../../utils/cars.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _component_marker = common_vendor.resolveComponent("marker");
  const _easycom_sub_navBar_1 = common_vendor.resolveComponent("sub-navBar");
  const _easycom_i_icon_1 = common_vendor.resolveComponent("i-icon");
  const _easycom_i_slider_1 = common_vendor.resolveComponent("i-slider");
  const _easycom_l_date_time_picker_1 = common_vendor.resolveComponent("l-date-time-picker");
  const _easycom_l_popup_1 = common_vendor.resolveComponent("l-popup");
  (_easycom_custom_navBar_1 + _component_marker + _easycom_sub_navBar_1 + _easycom_i_icon_1 + _easycom_i_slider_1 + _easycom_l_date_time_picker_1 + _easycom_l_popup_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_sub_navBar = () => "../../components/sub-navBar/sub-navBar.js";
const _easycom_i_icon = () => "../../uni_modules/i-ui-x/components/i-icon/i-icon.js";
const _easycom_i_slider = () => "../../uni_modules/i-ui-x/components/i-slider/i-slider.js";
const _easycom_l_date_time_picker = () => "../../uni_modules/lime-date-time-picker/components/l-date-time-picker/l-date-time-picker.js";
const _easycom_l_popup = () => "../../uni_modules/lime-popup/components/l-popup/l-popup.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_sub_navBar + _easycom_i_icon + _easycom_i_slider + _easycom_l_date_time_picker + _easycom_l_popup)();
}
class TrackPoint extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          latitude: { type: Number, optional: false },
          longitude: { type: Number, optional: false },
          rotation: { type: Number, optional: false },
          deviceTime: { type: String, optional: false },
          speed: { type: Number, optional: false }
        };
      },
      name: "TrackPoint"
    };
  }
  constructor(options, metadata = TrackPoint.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.latitude = this.__props__.latitude;
    this.longitude = this.__props__.longitude;
    this.rotation = this.__props__.rotation;
    this.deviceTime = this.__props__.deviceTime;
    this.speed = this.__props__.speed;
    delete this.__props__;
  }
}
class TrackBounds extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          minLat: { type: Number, optional: false },
          maxLat: { type: Number, optional: false },
          minLng: { type: Number, optional: false },
          maxLng: { type: Number, optional: false }
        };
      },
      name: "TrackBounds"
    };
  }
  constructor(options, metadata = TrackBounds.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.minLat = this.__props__.minLat;
    this.maxLat = this.__props__.maxLat;
    this.minLng = this.__props__.minLng;
    this.maxLng = this.__props__.maxLng;
    delete this.__props__;
  }
}
class PolylineData extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          points: { type: "Unknown", optional: false },
          color: { type: String, optional: false },
          width: { type: Number, optional: false },
          arrowLine: { type: Boolean, optional: false },
          borderColor: { type: String, optional: false },
          borderWidth: { type: Number, optional: false }
        };
      },
      name: "PolylineData"
    };
  }
  constructor(options, metadata = PolylineData.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.points = this.__props__.points;
    this.color = this.__props__.color;
    this.width = this.__props__.width;
    this.arrowLine = this.__props__.arrowLine;
    this.borderColor = this.__props__.borderColor;
    this.borderWidth = this.__props__.borderWidth;
    delete this.__props__;
  }
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
class CarMarker extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          id: { type: Number, optional: false },
          latitude: { type: Number, optional: false },
          longitude: { type: Number, optional: false },
          iconPath: { type: String, optional: false },
          width: { type: Number, optional: false },
          height: { type: Number, optional: false },
          rotate: { type: Number, optional: false },
          anchor: { type: "Unknown", optional: false },
          callout: { type: "Unknown", optional: false },
          animation: { type: "Unknown", optional: false }
        };
      },
      name: "CarMarker"
    };
  }
  constructor(options, metadata = CarMarker.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.id = this.__props__.id;
    this.latitude = this.__props__.latitude;
    this.longitude = this.__props__.longitude;
    this.iconPath = this.__props__.iconPath;
    this.width = this.__props__.width;
    this.height = this.__props__.height;
    this.rotate = this.__props__.rotate;
    this.anchor = this.__props__.anchor;
    this.callout = this.__props__.callout;
    this.animation = this.__props__.animation;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "playBack",
  setup(__props) {
    const center = common_vendor.reactive(new common_vendor.UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(15);
    const imei = common_vendor.ref("");
    const carStatus = common_vendor.ref("");
    const plateNo = common_vendor.ref("");
    const carType = common_vendor.ref("");
    const showDateTimePicker = common_vendor.ref(false);
    const currentPickerType = common_vendor.ref("start");
    const pickerTitle = common_vendor.ref("选择开始时间");
    const trackPoints = common_vendor.ref([]);
    const polyline = common_vendor.ref([]);
    const isPlaying = common_vendor.ref(false);
    const playbackSpeed = common_vendor.ref(5);
    const totalDistance = common_vendor.ref(0);
    const currentSpeed = common_vendor.ref(0);
    const currentTime = common_vendor.ref("");
    const currentIndex = common_vendor.ref(0);
    const carMarker = common_vendor.ref(null);
    let playbackTimer = 0;
    let lastTimestamp = 0;
    const startTime = common_vendor.ref("");
    const endTime = common_vendor.ref("");
    const lat = common_vendor.ref("");
    const lng = common_vendor.ref("");
    const sTime = common_vendor.ref("");
    const eTime = common_vendor.ref("");
    const markers = common_vendor.ref([]);
    function formatDateForDisplay(dateStr) {
      if (!dateStr)
        return "";
      return dateStr.replace(/\//g, "-");
    }
    function calculateBearing(lat1, lng1, lat2, lng2) {
      const degToRad = (d) => {
        return d * Math.PI / 180;
      };
      const radToDeg = (r) => {
        return r * 180 / Math.PI;
      };
      const φ1 = degToRad(lat1);
      const φ2 = degToRad(lat2);
      const Δλ = degToRad(lng2 - lng1);
      const y = Math.sin(Δλ) * Math.cos(φ2);
      const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
      const θ = Math.atan2(y, x);
      return (radToDeg(θ) + 360) % 360;
    }
    function getDistance(lat1, lng1, lat2, lng2) {
      const rad = (d) => {
        return d * Math.PI / 180;
      };
      const radLat1 = rad(lat1);
      const radLat2 = rad(lat2);
      const a = radLat1 - radLat2;
      const b = rad(lng1) - rad(lng2);
      const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      return s * 6378.137 * 1e3;
    }
    function calculateTrackBounds() {
      if (trackPoints.value.length == 0)
        return null;
      let minLat = trackPoints.value[0].latitude;
      let maxLat = trackPoints.value[0].latitude;
      let minLng = trackPoints.value[0].longitude;
      let maxLng = trackPoints.value[0].longitude;
      trackPoints.value.forEach((point) => {
        minLat = Math.min(minLat, point.latitude);
        maxLat = Math.max(maxLat, point.latitude);
        minLng = Math.min(minLng, point.longitude);
        maxLng = Math.max(maxLng, point.longitude);
      });
      return {
        minLat,
        maxLat,
        minLng,
        maxLng
      };
    }
    function adjustMapToFitTrack() {
      const nullableBounds = calculateTrackBounds();
      if (nullableBounds == null)
        return null;
      const bounds = nullableBounds;
      center.latitude = (bounds.minLat + bounds.maxLat) / 2;
      center.longitude = (bounds.minLng + bounds.maxLng) / 2;
      const latDiff = bounds.maxLat - bounds.minLat;
      const lngDiff = bounds.maxLng - bounds.minLng;
      const maxDiff = Math.max(latDiff, lngDiff);
      if (maxDiff > 0.1)
        mapScale.value = 10;
      else if (maxDiff > 0.05)
        mapScale.value = 12;
      else if (maxDiff > 0.02)
        mapScale.value = 15;
      else
        mapScale.value = 16;
    }
    function calculateTrackDistance() {
      totalDistance.value = 0;
      for (let i = 1; i < trackPoints.value.length; i++) {
        totalDistance.value += getDistance(trackPoints.value[i - 1].latitude, trackPoints.value[i - 1].longitude, trackPoints.value[i].latitude, trackPoints.value[i].longitude);
      }
    }
    function initDateTime() {
      const now = /* @__PURE__ */ new Date();
      const formatTime = (date) => {
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${date.getFullYear()}/${month}/${day} ${hours}:${minutes}:${seconds}`;
      };
      endTime.value = formatTime(now);
      const startDate = new Date(now.getTime() - 36e5 * 24);
      startTime.value = formatTime(startDate);
    }
    function initCarMarker() {
      var _a, _b;
      if (trackPoints.value.length > 0) {
        const firstPoint = trackPoints.value[0];
        const marker = new CarMarker({
          id: 999,
          latitude: firstPoint.latitude,
          longitude: firstPoint.longitude,
          iconPath: utils_cars.getDeviceIcon((_a = carStatus.value) !== null && _a !== void 0 ? _a : "", (_b = carType.value) !== null && _b !== void 0 ? _b : ""),
          width: 25,
          height: 25,
          rotate: firstPoint.rotation,
          anchor: new common_vendor.UTSJSONObject({}),
          callout: new common_vendor.UTSJSONObject({}),
          animation: new common_vendor.UTSJSONObject({})
        });
        carMarker.value = marker;
        const startMarker = new common_vendor.UTSJSONObject({
          id: 1e3,
          latitude: trackPoints.value[0].latitude,
          longitude: trackPoints.value[0].longitude,
          iconPath: "/static/start.png",
          width: 24,
          height: 24,
          // anchor: { x: 0.5, y: 0.5 },
          callout: new common_vendor.UTSJSONObject({
            content: "起点",
            borderRadius: 5,
            padding: 5,
            display: "BYCLICK"
          })
        });
        const endMarker = new common_vendor.UTSJSONObject({
          id: 1001,
          latitude: trackPoints.value[trackPoints.value.length - 1].latitude,
          longitude: trackPoints.value[trackPoints.value.length - 1].longitude,
          iconPath: "/static/end.png",
          width: 24,
          height: 24,
          // anchor: { x: 0.5, y: 0.5 },
          callout: new common_vendor.UTSJSONObject({
            content: "终点",
            borderRadius: 5,
            padding: 5,
            display: "BYCLICK"
          })
        });
        markers.value = [marker, startMarker, endMarker];
      }
    }
    function updatePolyline() {
      if (!trackPoints.value || trackPoints.value.length < 2) {
        polyline.value = [];
        return null;
      }
      const newPolyline = [];
      if (currentIndex.value > 0) {
        const playedPoints = trackPoints.value.slice(0, currentIndex.value + 1);
        if (playedPoints.length >= 2) {
          newPolyline.push(new PolylineData({
            points: playedPoints.map((point) => {
              return new CoordinatePoint({ latitude: point.latitude, longitude: point.longitude });
            }),
            color: "#1890FF",
            width: 6,
            arrowLine: true,
            borderColor: "#FFF",
            borderWidth: 1
          }));
        }
      }
      if (currentIndex.value < trackPoints.value.length - 1) {
        const unplayedPoints = trackPoints.value.slice(currentIndex.value);
        if (unplayedPoints.length >= 2) {
          newPolyline.push(new PolylineData({
            arrowLine: null,
            points: unplayedPoints.map((point) => {
              return new CoordinatePoint({ latitude: point.latitude, longitude: point.longitude });
            }),
            color: "#999",
            width: 3,
            borderColor: "#FFF",
            borderWidth: 1
          }));
        }
      }
      polyline.value = newPolyline;
    }
    function updateCarPosition() {
      const marker = carMarker.value;
      if (marker != null && trackPoints.value.length > 0 && currentIndex.value < trackPoints.value.length) {
        const point = trackPoints.value[currentIndex.value];
        marker.latitude = point.latitude;
        marker.longitude = point.longitude;
        marker.rotate = point.rotation;
        if (currentIndex.value % 5 == 0 || currentIndex.value == 0 || currentIndex.value == trackPoints.value.length - 1) {
          center.latitude = point.latitude;
          center.longitude = point.longitude;
        }
      }
    }
    function showPicker(type) {
      currentPickerType.value = type;
      pickerTitle.value = type == "start" ? "选择开始时间" : "选择结束时间";
      showDateTimePicker.value = true;
    }
    function showCurrentPosition() {
      var _a, _b, _c, _d;
      common_vendor.index.showToast({
        title: "这段时间没有数据",
        icon: "none",
        duration: 2e3
      });
      const originalLatText = (_a = lat.value) !== null && _a !== void 0 ? _a : "";
      const originalLngText = (_b = lng.value) !== null && _b !== void 0 ? _b : "";
      const originalLat = parseFloat(originalLatText);
      const originalLng = parseFloat(originalLngText);
      const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(originalLat, originalLng);
      center.latitude = convertedCoord.lat;
      center.longitude = convertedCoord.lng;
      mapScale.value = 15;
      const currentPoint = new TrackPoint(
        {
          latitude: convertedCoord.lat,
          longitude: convertedCoord.lng,
          rotation: 0,
          deviceTime: (/* @__PURE__ */ new Date()).toLocaleString(),
          speed: 0
        }
        // 初始化小车标记
      );
      const marker = new CarMarker({
        id: 999,
        latitude: currentPoint.latitude,
        longitude: currentPoint.longitude,
        iconPath: utils_cars.getDeviceIcon((_c = carStatus.value) !== null && _c !== void 0 ? _c : "", (_d = carType.value) !== null && _d !== void 0 ? _d : ""),
        width: 25,
        height: 25,
        rotate: 0,
        anchor: new common_vendor.UTSJSONObject({}),
        callout: new common_vendor.UTSJSONObject({}),
        animation: new common_vendor.UTSJSONObject({})
      });
      carMarker.value = marker;
      markers.value = [marker];
    }
    function processTrackData(positions) {
      const processedPoints = [];
      for (let i = 0; i < positions.length; i++) {
        const point = positions[i];
        const deviceTimeStr = point.getString("deviceTime", "");
        const originalLat = point.getNumber("latitude", 0);
        const originalLng = point.getNumber("longitude", 0);
        const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(originalLat, originalLng);
        const processedPoint = new TrackPoint({
          latitude: convertedCoord.lat,
          longitude: convertedCoord.lng,
          rotation: 0,
          deviceTime: formatDateForDisplay(deviceTimeStr),
          speed: point.getNumber("speed", 0)
        });
        if (i > 0) {
          const prevPoint = processedPoints[i - 1];
          processedPoint.rotation = calculateBearing(prevPoint.latitude, prevPoint.longitude, processedPoint.latitude, processedPoint.longitude);
        } else {
          processedPoint.rotation = 0;
        }
        processedPoints.push(processedPoint);
      }
      if (processedPoints.length > 1) {
        processedPoints[processedPoints.length - 1].rotation = processedPoints[processedPoints.length - 2].rotation;
      }
      trackPoints.value = processedPoints;
      calculateTrackDistance();
      initCarMarker();
      updatePolyline();
      adjustMapToFitTrack();
      if (trackPoints.value.length > 0) {
        currentTime.value = trackPoints.value[0].deviceTime;
      }
    }
    const loadTrackPos = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.showLoading(new common_vendor.UTSJSONObject({ title: "加载中..." }));
        const data = new common_vendor.UTSJSONObject({
          imei: imei.value,
          startTime: startTime.value.replace(/\//g, "-"),
          endTime: endTime.value.replace(/\//g, "-"),
          minParkTime: 2,
          withStop: false,
          withPos: true,
          withTrip: false
        });
        const res = yield api_request.getTrackPos(data);
        const trackData = res.getJSON("data");
        const positions = trackData === null || trackData === void 0 ? null : trackData.getArray("positions");
        if (positions != null && positions.length > 0) {
          processTrackData(positions);
          common_vendor.index.hideLoading();
        } else {
          showCurrentPosition();
          common_vendor.index.hideLoading();
        }
      });
    };
    function pausePlayback() {
      isPlaying.value = false;
      const timer = playbackTimer;
      if (timer != null) {
        clearTimeout(timer);
        playbackTimer = null;
      }
    }
    function resetPlayback() {
      pausePlayback();
      currentIndex.value = 0;
      currentSpeed.value = 0;
      if (trackPoints.value.length > 0) {
        currentTime.value = trackPoints.value[0].deviceTime;
      }
      updateCarPosition();
      updatePolyline();
    }
    function playNextPoint() {
      if (currentIndex.value >= trackPoints.value.length - 1) {
        pausePlayback();
        updatePolyline();
        common_vendor.index.showToast({
          title: "轨迹回放完成",
          icon: "none",
          duration: 1500
        });
        return null;
      }
      currentIndex.value++;
      updateCarPosition();
      updatePolyline();
      const point = trackPoints.value[currentIndex.value];
      currentSpeed.value = point.speed;
      currentTime.value = point.deviceTime;
    }
    function playbackStep() {
      if (!isPlaying.value)
        return null;
      const now = Date.now();
      const elapsed = now - lastTimestamp;
      const interval = 1e3 / playbackSpeed.value;
      if (elapsed >= interval) {
        playNextPoint();
        lastTimestamp = now - elapsed % interval;
      }
      if (isPlaying.value) {
        playbackTimer = setTimeout(() => {
          playbackStep();
        }, 16);
      }
    }
    function startPlayback() {
      if (trackPoints.value.length == 0) {
        common_vendor.index.showToast({ title: "没有轨迹数据", icon: "none" });
        return null;
      }
      if (currentIndex.value >= trackPoints.value.length - 1) {
        resetPlayback();
      }
      isPlaying.value = true;
      lastTimestamp = Date.now();
      playbackStep();
    }
    function togglePlayback() {
      if (isPlaying.value) {
        pausePlayback();
      } else {
        startPlayback();
      }
    }
    function onConfirm(value) {
      let formattedValue = value;
      if (formattedValue.includes("-")) {
        formattedValue = formattedValue.replace(/-/g, "/");
      }
      if (currentPickerType.value == "start") {
        startTime.value = formattedValue;
      } else {
        endTime.value = formattedValue;
      }
      resetPlayback();
      void loadTrackPos();
      showDateTimePicker.value = false;
    }
    function onCancel() {
      showDateTimePicker.value = false;
    }
    function setPlaybackSpeed(e) {
      const wasPlaying = isPlaying.value;
      if (wasPlaying) {
        pausePlayback();
      }
      playbackSpeed.value = e;
      if (wasPlaying) {
        startPlayback();
      }
    }
    common_vendor.onLoad((option) => {
      var _a, _b, _c, _d, _f, _g, _h, _j;
      imei.value = (_a = option.imei) !== null && _a !== void 0 ? _a : null;
      carStatus.value = (_b = option.connectionStatus) !== null && _b !== void 0 ? _b : "";
      plateNo.value = (_c = option.plateNo) !== null && _c !== void 0 ? _c : "";
      carType.value = (_d = option.carType) !== null && _d !== void 0 ? _d : "";
      lat.value = (_f = option.lat) !== null && _f !== void 0 ? _f : null;
      lng.value = (_g = option.lng) !== null && _g !== void 0 ? _g : null;
      sTime.value = (_h = option.startTime) !== null && _h !== void 0 ? _h : "";
      eTime.value = (_j = option.endTime) !== null && _j !== void 0 ? _j : "";
      common_vendor.index.__f__("log", "at pages/playBack/playBack.uvue:658", sTime.value, eTime.value);
      if (sTime.value != "" && eTime.value != "") {
        startTime.value = sTime.value;
        endTime.value = eTime.value;
        loadTrackPos();
      } else {
        initDateTime();
        loadTrackPos();
      }
    });
    common_vendor.onUnload(() => {
      pausePlayback();
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.p({
          title: "轨迹回放",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: carMarker.value
      }, carMarker.value ? {
        c: carMarker.value.id,
        d: common_vendor.p({
          id: carMarker.value.id,
          latitude: carMarker.value.latitude,
          longitude: carMarker.value.longitude,
          iconPath: carMarker.value.iconPath,
          width: carMarker.value.width,
          height: carMarker.value.height,
          rotate: carMarker.value.rotate,
          anchor: carMarker.value.anchor,
          callout: carMarker.value.callout,
          animation: carMarker.value.animation
        })
      } : {}, {
        e: common_vendor.p({
          showTime: false,
          currentCar: plateNo.value,
          showCar: true,
          carStatus: carStatus.value
        }),
        f: common_vendor.sei("myMap", "map"),
        g: center.latitude,
        h: center.longitude,
        i: markers.value,
        j: polyline.value,
        k: mapScale.value,
        l: common_vendor.p({
          name: "/static/rili.png",
          fontSize: "15"
        }),
        m: common_vendor.t(startTime.value),
        n: common_vendor.o(($event) => {
          return showPicker("start");
        }, "6b"),
        o: common_vendor.t(endTime.value),
        p: common_vendor.o(($event) => {
          return showPicker("end");
        }, "9b"),
        q: common_vendor.t(isPlaying.value ? "暂停" : "播放"),
        r: common_vendor.o(togglePlayback, "7b"),
        s: common_vendor.o(setPlaybackSpeed, "c6"),
        t: common_vendor.o(($event) => {
          return playbackSpeed.value = $event;
        }, "f7"),
        v: common_vendor.p({
          min: 1,
          max: 10,
          modelValue: playbackSpeed.value
        }),
        w: common_vendor.t(playbackSpeed.value),
        x: common_vendor.t(currentTime.value),
        y: common_vendor.t(currentSpeed.value),
        z: common_vendor.t((totalDistance.value / 1e3).toFixed(1)),
        A: common_vendor.o(onConfirm, "af"),
        B: common_vendor.o(onCancel, "ae"),
        C: common_vendor.p({
          ["confirm-btn"]: "确认",
          ["cancel-btn"]: "取消",
          title: pickerTitle.value,
          mode: 1 | 2 | 4 | 8 | 16 | 32
        }),
        D: common_vendor.o(($event) => {
          return showDateTimePicker.value = $event;
        }, "ed"),
        E: common_vendor.p({
          position: "bottom",
          closeable: false,
          modelValue: showDateTimePicker.value
        }),
        F: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        G: `${_ctx.u_s_b_h}px`,
        H: `${_ctx.u_s_a_i_b}px`,
        I: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/playBack/playBack.js.map
