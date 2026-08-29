"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_toast = require("../../utils/toast.js");
const api_request = require("../../api/request.js");
const utils_formateTime = require("../../utils/formateTime.js");
const utils_cars = require("../../utils/cars.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_sub_navBar_1 = common_vendor.resolveComponent("sub-navBar");
  const _easycom_i_icon_1 = common_vendor.resolveComponent("i-icon");
  const _easycom_i_button_1 = common_vendor.resolveComponent("i-button");
  const _easycom_i_slider_1 = common_vendor.resolveComponent("i-slider");
  const _easycom_l_date_time_picker_1 = common_vendor.resolveComponent("l-date-time-picker");
  const _easycom_l_popup_1 = common_vendor.resolveComponent("l-popup");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  (_easycom_custom_navBar_1 + _easycom_sub_navBar_1 + _easycom_i_icon_1 + _easycom_i_button_1 + _easycom_i_slider_1 + _easycom_l_date_time_picker_1 + _easycom_l_popup_1 + _easycom_app_toast_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_sub_navBar = () => "../../components/sub-navBar/sub-navBar.js";
const _easycom_i_icon = () => "../../uni_modules/i-ui-x/components/i-icon/i-icon.js";
const _easycom_i_button = () => "../../uni_modules/i-ui-x/components/i-button/i-button.js";
const _easycom_i_slider = () => "../../uni_modules/i-ui-x/components/i-slider/i-slider.js";
const _easycom_l_date_time_picker = () => "../../uni_modules/lime-date-time-picker/components/l-date-time-picker/l-date-time-picker.js";
const _easycom_l_popup = () => "../../uni_modules/lime-popup/components/l-popup/l-popup.js";
const _easycom_app_toast = () => "../../components/app-toast/app-toast.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_sub_navBar + _easycom_i_icon + _easycom_i_button + _easycom_i_slider + _easycom_l_date_time_picker + _easycom_l_popup + _easycom_app_toast)();
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
class MapPolylinePoint extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          latitude: { type: Number, optional: false },
          longitude: { type: Number, optional: false }
        };
      },
      name: "MapPolylinePoint"
    };
  }
  constructor(options, metadata = MapPolylinePoint.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.latitude = this.__props__.latitude;
    this.longitude = this.__props__.longitude;
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
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "playBack",
  setup(__props) {
    const center = common_vendor.reactive(new common_vendor.UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(12);
    const isMapReady = common_vendor.ref(false);
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
    const isTrackPlayable = common_vendor.ref(false);
    const playbackSpeed = common_vendor.ref(5);
    const totalDistance = common_vendor.ref(0);
    const currentSpeed = common_vendor.ref(0);
    const currentTime = common_vendor.ref("");
    const currentIndex = common_vendor.ref(0);
    const carMarker = common_vendor.ref(null);
    let playbackTimer = null;
    let lastTimestamp = 0;
    let replaySessionId = 0;
    function formatPlaybackTime(timestamp) {
      var _a;
      return (_a = utils_formateTime.formatTimes(timestamp)) !== null && _a !== void 0 ? _a : "";
    }
    const now = /* @__PURE__ */ new Date();
    const initialEndTime = utils_formateTime.formatTimes(now.getTime());
    const initialStartTime = utils_formateTime.formatTimes(now.getTime() - 36e5 * 6);
    const startTime = common_vendor.ref(initialStartTime);
    const endTime = common_vendor.ref(initialEndTime);
    function normalizePlaybackTime(value, fallback) {
      const milliseconds = utils_formateTime.parseLocalDateTime(value);
      return milliseconds == null ? fallback : formatPlaybackTime(milliseconds);
    }
    function getPlaybackDate(value) {
      const parts = value.split(" ");
      return parts.length > 1 ? parts[0] : value;
    }
    function getPlaybackClock(value) {
      const parts = value.split(" ");
      return parts.length > 1 ? parts[1] : "";
    }
    function setPlaybackTimeRange(startValue, endValue) {
      startTime.value = normalizePlaybackTime(startValue, startTime.value);
      endTime.value = normalizePlaybackTime(endValue, endTime.value);
    }
    const lat = common_vendor.ref("");
    const lng = common_vendor.ref("");
    const sTime = common_vendor.ref("");
    const eTime = common_vendor.ref("");
    const markers = common_vendor.ref([]);
    function safeParseDate(dateStr) {
      var _a;
      return (_a = utils_formateTime.parseLocalDateTime(dateStr)) !== null && _a !== void 0 ? _a : 0;
    }
    function normalizeDateTime(dateStr) {
      return utils_formateTime.normalizeLocalDateTime(dateStr);
    }
    function resolveRouteDateTime(dateStr) {
      var _a;
      if (dateStr == "")
        return null;
      try {
        const decoded = ((_a = decodeURIComponent(dateStr)) !== null && _a !== void 0 ? _a : "").replace(/\+/g, " ").replace("T", " ");
        const milliseconds = utils_formateTime.parseLocalDateTime(decoded);
        return milliseconds == null ? null : formatPlaybackTime(milliseconds);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/playBack/playBack.uvue:205", "解析回放时间失败:", error);
        return null;
      }
    }
    function formatDateForDisplay(dateStr) {
      return normalizeDateTime(dateStr);
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
      const now2 = /* @__PURE__ */ new Date();
      setPlaybackTimeRange(formatPlaybackTime(now2.getTime() - 36e5 * 6), formatPlaybackTime(now2.getTime()));
    }
    function initCarMarker() {
      var _a, _b;
      if (trackPoints.value.length == 0)
        return null;
      const firstPoint = trackPoints.value[0];
      const marker = {
        id: 999,
        latitude: firstPoint.latitude,
        longitude: firstPoint.longitude,
        iconPath: utils_cars.getDeviceIcon((_a = carStatus.value) !== null && _a !== void 0 ? _a : "", (_b = carType.value) !== null && _b !== void 0 ? _b : ""),
        width: 25,
        height: 25,
        rotate: firstPoint.rotation,
        anchor: { x: 0.5, y: 0.5 }
      };
      carMarker.value = marker;
      const startMarker = {
        id: 1e3,
        latitude: firstPoint.latitude,
        longitude: firstPoint.longitude,
        iconPath: "/static/start.png",
        width: 24,
        height: 24,
        anchor: { x: 0.5, y: 0.5 },
        callout: new common_vendor.UTSJSONObject({ content: "起点", borderRadius: 5, padding: 5, display: "BYCLICK" })
      };
      const lastPoint = trackPoints.value[trackPoints.value.length - 1];
      const endMarker = {
        id: 1001,
        latitude: lastPoint.latitude,
        longitude: lastPoint.longitude,
        iconPath: "/static/end.png",
        width: 24,
        height: 24,
        anchor: { x: 0.5, y: 0.5 },
        callout: new common_vendor.UTSJSONObject({ content: "终点", borderRadius: 5, padding: 5, display: "BYCLICK" })
      };
      markers.value = [marker, startMarker, endMarker];
    }
    function toMpPoints(points) {
      return points.map((point) => {
        return new MapPolylinePoint({
          latitude: point.latitude,
          longitude: point.longitude
        });
      });
    }
    function updatePolyline() {
      if (trackPoints.value.length < 2) {
        polyline.value = [];
        return null;
      }
      const lines = [];
      const unplayedPoints = trackPoints.value.slice(currentIndex.value);
      if (unplayedPoints.length >= 2) {
        lines.push(new MpPolylineData({
          points: toMpPoints(unplayedPoints),
          color: "#999999",
          width: 3,
          dottedLine: true,
          arrowLine: false,
          borderColor: "#FFFFFF",
          borderWidth: 1
        }));
      }
      if (currentIndex.value > 0) {
        lines.push(new MpPolylineData({
          points: toMpPoints(trackPoints.value.slice(0, currentIndex.value + 1)),
          color: "#1890FF",
          width: 6,
          dottedLine: false,
          arrowLine: true,
          borderColor: "#FFFFFF",
          borderWidth: 1
        }));
      }
      polyline.value = lines;
    }
    function initPolyline() {
      updatePolyline();
    }
    function updateCarPosition() {
      const marker = carMarker.value;
      if (marker != null && trackPoints.value.length > 0 && currentIndex.value < trackPoints.value.length) {
        const point = trackPoints.value[currentIndex.value];
        const updatedMarker = {
          id: marker.id,
          latitude: point.latitude,
          longitude: point.longitude,
          iconPath: marker.iconPath,
          width: marker.width,
          height: marker.height,
          rotate: point.rotation,
          anchor: marker.anchor,
          callout: marker.callout,
          label: marker.label
        };
        carMarker.value = updatedMarker;
        markers.value = [updatedMarker, ...markers.value.slice(1)];
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
      isTrackPlayable.value = false;
      const originalLatText = (_a = lat.value) !== null && _a !== void 0 ? _a : "";
      const originalLngText = (_b = lng.value) !== null && _b !== void 0 ? _b : "";
      const originalLat = parseFloat(originalLatText);
      const originalLng = parseFloat(originalLngText);
      if (isNaN(originalLat) || isNaN(originalLng) || originalLat == 0 || originalLng == 0) {
        utils_toast.showAppToast({
          title: "这段时间没有数据",
          icon: "none",
          duration: 2e3
        });
        return null;
      }
      utils_toast.showAppToast({
        title: "这段时间没有数据",
        icon: "none",
        duration: 2e3
      });
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
      const marker = {
        id: 999,
        latitude: currentPoint.latitude,
        longitude: currentPoint.longitude,
        iconPath: utils_cars.getDeviceIcon((_c = carStatus.value) !== null && _c !== void 0 ? _c : "", (_d = carType.value) !== null && _d !== void 0 ? _d : ""),
        width: 25,
        height: 25,
        rotate: 0,
        anchor: { x: 0.5, y: 0.5 }
      };
      carMarker.value = marker;
      markers.value = [marker];
      isMapReady.value = true;
    }
    function clearTrackDisplay() {
      isMapReady.value = false;
      trackPoints.value = [];
      isTrackPlayable.value = false;
      currentIndex.value = 0;
      currentSpeed.value = 0;
      currentTime.value = "";
      totalDistance.value = 0;
      carMarker.value = null;
      markers.value = [];
      polyline.value = [];
    }
    function pausePlayback() {
      isPlaying.value = false;
      const timer = playbackTimer;
      if (timer != null) {
        clearTimeout(timer);
        playbackTimer = null;
      }
    }
    function renderPlaybackIndex() {
      if (trackPoints.value.length == 0)
        return null;
      updateCarPosition();
      updatePolyline();
      const point = trackPoints.value[currentIndex.value];
      currentSpeed.value = point.speed;
      currentTime.value = point.deviceTime;
    }
    function processTrackData(positions) {
      const processedPoints = [];
      let lastRetainedLat = null;
      let lastRetainedLng = null;
      for (let i = 0; i < positions.length; i++) {
        const point = positions[i];
        const deviceTimeStr = point.getString("deviceTime", "");
        const originalLat = point.getNumber("latitude", 0);
        const originalLng = point.getNumber("longitude", 0);
        if (originalLat == 0 || originalLng == 0 || !isFinite(originalLat) || !isFinite(originalLng) || deviceTimeStr == "" || safeParseDate(deviceTimeStr) == 0) {
          continue;
        }
        if (lastRetainedLat != null && lastRetainedLng != null && originalLat == lastRetainedLat && originalLng == lastRetainedLng) {
          continue;
        }
        const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(originalLat, originalLng);
        if (!isFinite(convertedCoord.lat) || !isFinite(convertedCoord.lng)) {
          continue;
        }
        lastRetainedLat = originalLat;
        lastRetainedLng = originalLng;
        processedPoints.push(new TrackPoint({
          latitude: convertedCoord.lat,
          longitude: convertedCoord.lng,
          rotation: 0,
          deviceTime: formatDateForDisplay(deviceTimeStr),
          speed: point.getNumber("speed", 0)
        }));
      }
      for (let i = 1; i < processedPoints.length; i++) {
        const previousPoint = processedPoints[i - 1];
        const currentPoint = processedPoints[i];
        currentPoint.rotation = calculateBearing(previousPoint.latitude, previousPoint.longitude, currentPoint.latitude, currentPoint.longitude);
      }
      if (processedPoints.length > 1) {
        processedPoints[processedPoints.length - 1].rotation = processedPoints[processedPoints.length - 2].rotation;
      }
      trackPoints.value = processedPoints;
      isTrackPlayable.value = processedPoints.length > 1;
      currentIndex.value = 0;
      calculateTrackDistance();
      initCarMarker();
      initPolyline();
      adjustMapToFitTrack();
      const firstPoint = trackPoints.value[0];
      center.latitude = firstPoint.latitude;
      center.longitude = firstPoint.longitude;
      renderPlaybackIndex();
      isMapReady.value = true;
    }
    const loadTrackPos = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        pausePlayback();
        const requestId = ++replaySessionId;
        clearTrackDisplay();
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
        try {
          const res = yield api_request.getTrackPos(data);
          if (requestId != replaySessionId)
            return Promise.resolve(null);
          if (res.code != 200) {
            utils_toast.showAppToast({ title: res.msg || "轨迹加载失败", icon: "none" });
            showCurrentPosition();
            return Promise.resolve(null);
          }
          const trackData = res.data;
          if (trackData == null) {
            showCurrentPosition();
            return Promise.resolve(null);
          }
          const positions = trackData.getArray("positions");
          if (positions != null && positions.length > 0) {
            processTrackData(positions);
            if (trackPoints.value.length == 0) {
              showCurrentPosition();
            }
          } else {
            showCurrentPosition();
          }
        } catch (error) {
          if (requestId != replaySessionId)
            return Promise.resolve(null);
          common_vendor.index.__f__("error", "at pages/playBack/playBack.uvue:691", "加载轨迹失败:", error);
          utils_toast.showAppToast({ title: "轨迹加载失败", icon: "none" });
          if (!isNaN(parseFloat((_a = lat.value) !== null && _a !== void 0 ? _a : "")) && !isNaN(parseFloat((_b = lng.value) !== null && _b !== void 0 ? _b : ""))) {
            showCurrentPosition();
          }
        } finally {
          if (requestId == replaySessionId) {
            common_vendor.index.hideLoading();
          }
        }
      });
    };
    function resetPlayback() {
      pausePlayback();
      currentIndex.value = 0;
      renderPlaybackIndex();
    }
    function playNextPoint() {
      if (currentIndex.value >= trackPoints.value.length - 1) {
        pausePlayback();
        utils_toast.showAppToast({
          title: "轨迹回放完成",
          icon: "none",
          duration: 1500
        });
        return false;
      }
      currentIndex.value++;
      renderPlaybackIndex();
      return true;
    }
    function playbackStep(sessionId) {
      if (!isPlaying.value || sessionId != replaySessionId)
        return null;
      const now2 = Date.now();
      const elapsed = now2 - lastTimestamp;
      const interval = 1e3 / playbackSpeed.value;
      if (elapsed >= interval) {
        playNextPoint();
        lastTimestamp = now2 - elapsed % interval;
      }
      if (isPlaying.value && sessionId == replaySessionId) {
        playbackTimer = setTimeout(() => {
          playbackStep(sessionId);
        }, 16);
      }
    }
    function startPlayback() {
      if (!isTrackPlayable.value) {
        utils_toast.showAppToast({ title: "没有轨迹数据", icon: "none" });
        return null;
      }
      if (currentIndex.value >= trackPoints.value.length - 1) {
        resetPlayback();
      }
      isPlaying.value = true;
      const sessionId = ++replaySessionId;
      if (!playNextPoint())
        return null;
      lastTimestamp = Date.now();
      playbackStep(sessionId);
    }
    function togglePlayback() {
      if (isPlaying.value) {
        pausePlayback();
      } else {
        startPlayback();
      }
    }
    function onConfirm(value) {
      var _a, _b;
      const formattedValue = normalizeDateTime(value);
      if (currentPickerType.value == "start") {
        setPlaybackTimeRange(formattedValue, (_a = endTime.value) !== null && _a !== void 0 ? _a : "");
      } else {
        setPlaybackTimeRange((_b = startTime.value) !== null && _b !== void 0 ? _b : "", formattedValue);
      }
      resetPlayback();
      void loadTrackPos();
      showDateTimePicker.value = false;
    }
    function onCancel() {
      showDateTimePicker.value = false;
    }
    function applyPlaybackSpeed(value) {
      if (!isFinite(value))
        return null;
      playbackSpeed.value = Math.min(50, Math.max(5, value));
      if (!isPlaying.value)
        return null;
      const timer = playbackTimer;
      if (timer != null) {
        clearTimeout(timer);
        playbackTimer = null;
      }
      lastTimestamp = Date.now();
      const sessionId = replaySessionId;
      playbackTimer = setTimeout(() => {
        playbackStep(sessionId);
      }, 16);
    }
    function setPlaybackSpeedFromValue(value) {
      applyPlaybackSpeed(value);
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
      common_vendor.index.__f__("log", "at pages/playBack/playBack.uvue:820", sTime.value, eTime.value);
      const routeStartTime = resolveRouteDateTime(sTime.value);
      const routeEndTime = resolveRouteDateTime(eTime.value);
      if (routeStartTime != null && routeEndTime != null) {
        setPlaybackTimeRange(routeStartTime, routeEndTime);
        loadTrackPos();
      } else {
        initDateTime();
        loadTrackPos();
      }
    });
    common_vendor.onHide(() => {
      pausePlayback();
      ++replaySessionId;
    });
    common_vendor.onUnload(() => {
      pausePlayback();
      ++replaySessionId;
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
        b: isMapReady.value
      }, isMapReady.value ? {
        c: common_vendor.sei("myMap", "map"),
        d: center.latitude,
        e: center.longitude,
        f: markers.value,
        g: polyline.value,
        h: mapScale.value
      } : {}, {
        i: common_vendor.p({
          showTime: false,
          currentCar: plateNo.value,
          showCar: true,
          carStatus: carStatus.value,
          class: "sub-nav-overlay"
        }),
        j: common_vendor.p({
          name: "/static/rili.png",
          fontSize: "15"
        }),
        k: common_vendor.t(getPlaybackDate(startTime.value)),
        l: common_vendor.t(getPlaybackClock(startTime.value)),
        m: common_vendor.o(($event) => {
          return showPicker("start");
        }, "df"),
        n: common_vendor.o(($event) => {
          return showPicker("start");
        }, "72"),
        o: common_vendor.p({
          name: "/static/xiangxia.png",
          fontSize: "15",
          class: "date-arrow"
        }),
        p: common_vendor.t(getPlaybackDate(endTime.value)),
        q: common_vendor.t(getPlaybackClock(endTime.value)),
        r: common_vendor.o(($event) => {
          return showPicker("end");
        }, "5c"),
        s: common_vendor.o(($event) => {
          return showPicker("end");
        }, "02"),
        t: common_vendor.p({
          name: "/static/xiangxia.png",
          fontSize: "15",
          class: "date-arrow"
        }),
        v: common_vendor.o(togglePlayback, "3f"),
        w: common_vendor.p({
          type: "primary",
          size: "small",
          text: isPlaying.value ? "暂停" : "播放"
        }),
        x: common_vendor.o(setPlaybackSpeedFromValue, "ac"),
        y: common_vendor.o(($event) => {
          return playbackSpeed.value = $event;
        }, "7d"),
        z: common_vendor.p({
          min: 5,
          max: 50,
          step: 5,
          modelValue: playbackSpeed.value
        }),
        A: common_vendor.t(playbackSpeed.value),
        B: common_vendor.t(currentTime.value),
        C: common_vendor.t(currentSpeed.value),
        D: common_vendor.t((totalDistance.value / 1e3).toFixed(1)),
        E: common_vendor.o(onConfirm, "85"),
        F: common_vendor.o(onCancel, "9f"),
        G: common_vendor.p({
          ["confirm-btn"]: "确认",
          ["cancel-btn"]: "取消",
          title: pickerTitle.value,
          mode: 63,
          format: "YYYY-MM-DD HH:mm:ss"
        }),
        H: common_vendor.o(($event) => {
          return showDateTimePicker.value = $event;
        }, "40"),
        I: common_vendor.p({
          position: "bottom",
          closeable: false,
          modelValue: showDateTimePicker.value
        }),
        J: `${_ctx.u_s_b_h}px`,
        K: `${_ctx.u_s_a_i_b}px`
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/playBack/playBack.js.map
