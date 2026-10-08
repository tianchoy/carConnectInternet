"use strict";
const common_vendor = require("../../common/vendor.js");
const api_response = require("../../api/response.js");
const utils_toast = require("../../utils/toast.js");
const api_request = require("../../api/request.js");
const utils_formateTime = require("../../utils/formateTime.js");
const utils_cars = require("../../utils/cars.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
const utils_getUserLocation = require("../../utils/getUserLocation.js");
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
const PLAYBACK_FRAME_INTERVAL_MS = 50;
const MIN_SEGMENT_DURATION_MS = 500;
const MAX_SEGMENT_DURATION_MS = 6e3;
const FALLBACK_SPEED_KMH = 20;
const POLYLINE_SCREEN_DEADBAND_PX = 8;
const POLYLINE_MAX_DEADBAND_PX = 10;
const POLYLINE_MIN_PUSH_GAP_MS = 200;
const POLYLINE_CLIP_MARGIN = 1.35;
const POLYLINE_CLIP_EDGE_TOLERANCE = 1.3;
const MAP_SCALE_SYNC_INTERVAL_MS = 300;
const MARKER_ROTATION_UPDATE_THRESHOLD = 2;
const MIN_TRACK_FIT_SCALE = 5;
const MAX_TRACK_FIT_SCALE = 17;
const TRACK_FIT_MARGIN = 0.85;
const METERS_PER_DEGREE_LAT = 110540;
const METERS_PER_DEGREE_LNG = 111320;
const EARTH_RESOLUTION_BASE = 156543.03392;
const MAX_POLYLINE_POINTS = 400;
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "playBack",
  setup(__props) {
    const center = common_vendor.reactive(new common_vendor.UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(12);
    const isMapReady = common_vendor.ref(false);
    const deviceNo = common_vendor.ref("");
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
    const playbackSpeed = common_vendor.ref(1);
    const totalDistance = common_vendor.ref(0);
    const currentSpeed = common_vendor.ref(0);
    const currentTime = common_vendor.ref("");
    const currentIndex = common_vendor.ref(0);
    const carMarker = common_vendor.ref(null);
    const showCarOverlay = common_vendor.ref(false);
    const carOverlayIcon = common_vendor.ref("/static/cars/online/default.png");
    const carOverlayRotation = common_vendor.ref(0);
    const renderedPoint = common_vendor.reactive(new TrackPoint({
      latitude: 0,
      longitude: 0,
      rotation: 0,
      deviceTime: "",
      speed: 0
    }));
    const activeSegmentTargetIndex = common_vendor.ref(-1);
    let playbackTimer = null;
    let replaySessionId = 0;
    let lastCarMarkerRotation = 0;
    function resetRenderedPoint(point) {
      renderedPoint.latitude = point.latitude;
      renderedPoint.longitude = point.longitude;
      renderedPoint.rotation = point.rotation;
      renderedPoint.deviceTime = point.deviceTime;
      renderedPoint.speed = point.speed;
    }
    function shortestAngleDiff(from, to) {
      let difference = to - from;
      if (difference > 180)
        difference -= 360;
      else if (difference < -180)
        difference += 360;
      return difference;
    }
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
    const pickerValue = common_vendor.computed(() => {
      return currentPickerType.value == "start" ? startTime.value : endTime.value;
    });
    const pickerMinTime = common_vendor.computed(() => {
      const now2 = /* @__PURE__ */ new Date();
      return new Date(now2.getFullYear(), now2.getMonth() - 6, now2.getDate(), 0, 0, 0).getTime();
    });
    const pickerMaxTime = common_vendor.computed(() => {
      return Date.now();
    });
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
        common_vendor.index.__f__("error", "at pages/playBack/playBack.uvue:355", "解析回放时间失败:", error);
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
    let mapViewWidth = 0;
    let mapViewHeight = 0;
    let mapViewSizeMeasured = false;
    function measureMapViewportSize(callback) {
      try {
        const query = common_vendor.index.createSelectorQuery();
        query.select("#track-map-container").boundingClientRect((rect = null) => {
          var _a, _b;
          if (rect != null) {
            const nodeInfo = rect;
            const width = (_a = nodeInfo.width) !== null && _a !== void 0 ? _a : 0;
            const height = (_b = nodeInfo.height) !== null && _b !== void 0 ? _b : 0;
            if (width > 0 && height > 0) {
              mapViewWidth = width;
              mapViewHeight = height;
              mapViewSizeMeasured = true;
            }
          }
          callback();
        }).exec();
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/playBack/playBack.uvue:455", "测量地图容器尺寸失败:", error);
        callback();
      }
    }
    function ensureMapViewportEstimate() {
      if (mapViewWidth > 0 && mapViewHeight > 0)
        return null;
      try {
        const info = common_vendor.index.getSystemInfoSync();
        mapViewWidth = info.windowWidth;
        mapViewHeight = info.windowHeight * 0.5;
      } catch (error) {
        mapViewWidth = 375;
        mapViewHeight = 300;
      }
    }
    function adjustMapToFitTrack() {
      const nullableBounds = calculateTrackBounds();
      if (nullableBounds == null)
        return null;
      const bounds = nullableBounds;
      const midLat = (bounds.minLat + bounds.maxLat) / 2;
      const midLng = (bounds.minLng + bounds.maxLng) / 2;
      center.latitude = midLat;
      center.longitude = midLng;
      ensureMapViewportEstimate();
      const usableWidth = mapViewWidth * TRACK_FIT_MARGIN;
      const usableHeight = mapViewHeight * TRACK_FIT_MARGIN;
      if (usableWidth <= 0 || usableHeight <= 0)
        return null;
      let cosLat = Math.cos(midLat * Math.PI / 180);
      if (cosLat < 0.01)
        cosLat = 0.01;
      const spanLatMeters = (bounds.maxLat - bounds.minLat) * METERS_PER_DEGREE_LAT;
      const spanLngMeters = (bounds.maxLng - bounds.minLng) * METERS_PER_DEGREE_LNG * cosLat;
      const neededResolution = Math.max(spanLatMeters / usableHeight, spanLngMeters / usableWidth);
      let zoom = MAX_TRACK_FIT_SCALE;
      if (neededResolution > 1e-4) {
        const baseResolution = EARTH_RESOLUTION_BASE * cosLat;
        zoom = Math.log(baseResolution / neededResolution) / Math.log(2);
      }
      let finalZoom = Math.floor(zoom);
      if (finalZoom > MAX_TRACK_FIT_SCALE)
        finalZoom = MAX_TRACK_FIT_SCALE;
      if (finalZoom < MIN_TRACK_FIT_SCALE)
        finalZoom = MIN_TRACK_FIT_SCALE;
      mapScale.value = finalZoom;
    }
    function applyTrackViewportFit() {
      adjustMapToFitTrack();
      if (mapViewSizeMeasured)
        return null;
      measureMapViewportSize(() => {
        adjustMapToFitTrack();
      });
    }
    function focusMapOnVehicle() {
      if (trackPoints.value.length == 0)
        return null;
      center.latitude = renderedPoint.latitude;
      center.longitude = renderedPoint.longitude;
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
    let startMarker = null;
    let endMarker = null;
    function initCarMarker() {
      var _a, _b;
      if (trackPoints.value.length == 0)
        return null;
      const firstPoint = trackPoints.value[0];
      const deviceIcon = utils_cars.getDeviceIcon((_a = carStatus.value) !== null && _a !== void 0 ? _a : "", (_b = carType.value) !== null && _b !== void 0 ? _b : "");
      const marker = {
        id: 999,
        latitude: firstPoint.latitude,
        longitude: firstPoint.longitude,
        iconPath: deviceIcon,
        width: 25,
        height: 25,
        rotate: firstPoint.rotation,
        anchor: { x: 0.5, y: 0.5 }
      };
      carMarker.value = marker;
      lastCarMarkerRotation = firstPoint.rotation;
      carOverlayIcon.value = deviceIcon;
      carOverlayRotation.value = firstPoint.rotation;
      const start = {
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
      const end = {
        id: 1001,
        latitude: lastPoint.latitude,
        longitude: lastPoint.longitude,
        iconPath: "/static/end.png",
        width: 24,
        height: 24,
        anchor: { x: 0.5, y: 0.5 },
        callout: new common_vendor.UTSJSONObject({ content: "终点", borderRadius: 5, padding: 5, display: "BYCLICK" })
      };
      startMarker = start;
      endMarker = end;
      markers.value = [marker, start, end];
    }
    function applyFullMarkers() {
      const car = carMarker.value;
      if (car == null)
        return null;
      const list = [car];
      if (startMarker != null)
        list.push(startMarker);
      if (endMarker != null)
        list.push(endMarker);
      markers.value = list;
    }
    let thinnedSourceIndex = [];
    let rawPoints = [];
    let thinnedCount = 0;
    let polylineAnchorLat = 0;
    let polylineAnchorLng = 0;
    let polylineAnchorScale = 0;
    let polylineAnchorValid = false;
    let polylineForceNext = false;
    let polylineDeadbandPx = POLYLINE_SCREEN_DEADBAND_PX;
    let polylineLastPushAt = 0;
    let trueMapScale = 0;
    let mapContext = null;
    let mapScaleSyncTimer = null;
    function ensureMapContext() {
      var _a, _b;
      if (mapContext == null) {
        mapContext = common_vendor.index.createMapContext("myMap", (_b = (_a = common_vendor.getCurrentInstance()) === null || _a === void 0 ? null : _a.proxy) !== null && _b !== void 0 ? _b : null);
      }
      return mapContext;
    }
    function syncTrueMapScale() {
      const ctx = ensureMapContext();
      if (ctx == null)
        return null;
      ctx.getScale(new common_vendor.UTSJSONObject({
        success: (result = null) => {
          const scale = result != null ? result.scale : 0;
          if (scale <= 0 || scale > 24)
            return null;
          if (Math.abs(scale - trueMapScale) < 0.01)
            return null;
          trueMapScale = scale;
          invalidatePolylineAnchor();
        },
        fail: () => {
        }
      }));
    }
    function startMapScaleSync() {
      stopMapScaleSync();
      const tick = () => {
        syncTrueMapScale();
        mapScaleSyncTimer = setTimeout(tick, MAP_SCALE_SYNC_INTERVAL_MS);
      };
      tick();
    }
    function stopMapScaleSync() {
      const timer = mapScaleSyncTimer;
      if (timer != null) {
        clearTimeout(timer);
        mapScaleSyncTimer = null;
      }
    }
    function getEffectiveMapScale() {
      return trueMapScale > 0 ? trueMapScale : mapScale.value;
    }
    function markPolylineRendered() {
      if (polylineAnchorValid && polylineAnchorScale == getEffectiveMapScale()) {
        const elapsed = Date.now() - polylineLastPushAt;
        const movedPx = getScreenDistancePx(polylineAnchorLat, polylineAnchorLng, renderedPoint.latitude, renderedPoint.longitude);
        if (elapsed > 0 && movedPx > 0) {
          let required = movedPx / elapsed * POLYLINE_MIN_PUSH_GAP_MS;
          if (required > POLYLINE_MAX_DEADBAND_PX) {
            required = POLYLINE_MAX_DEADBAND_PX;
          }
          if (required > polylineDeadbandPx) {
            polylineDeadbandPx = required;
          }
        }
      }
      polylineAnchorLat = renderedPoint.latitude;
      polylineAnchorLng = renderedPoint.longitude;
      polylineAnchorScale = getEffectiveMapScale();
      polylineAnchorValid = true;
      polylineLastPushAt = Date.now();
    }
    function invalidatePolylineAnchor() {
      polylineAnchorValid = false;
      polylineForceNext = true;
      polylineDeadbandPx = POLYLINE_SCREEN_DEADBAND_PX;
    }
    function getScreenDistancePx(lat1, lng1, lat2, lng2) {
      const metersPerPixel = getMetersPerPixelOfScale(lat1);
      if (metersPerPixel <= 0)
        return 0;
      const dLatMeters = (lat2 - lat1) * METERS_PER_DEGREE_LAT;
      let cosLat = Math.cos(lat1 * Math.PI / 180);
      if (cosLat < 0.01)
        cosLat = 0.01;
      const dLngMeters = (lng2 - lng1) * METERS_PER_DEGREE_LNG * cosLat;
      const distMeters = Math.sqrt(dLatMeters * dLatMeters + dLngMeters * dLngMeters);
      return distMeters / metersPerPixel;
    }
    function shouldPushPolyline() {
      if (!isPlaying.value)
        return true;
      if (polylineForceNext)
        return true;
      if (!polylineAnchorValid)
        return true;
      if (polylineAnchorScale != getEffectiveMapScale())
        return true;
      const movedPx = getScreenDistancePx(polylineAnchorLat, polylineAnchorLng, renderedPoint.latitude, renderedPoint.longitude);
      return movedPx >= polylineDeadbandPx;
    }
    function buildThinnedPoints() {
      thinnedSourceIndex.length = 0;
      rawPoints.length = 0;
      const total = trackPoints.value.length;
      if (total == 0)
        return null;
      if (total <= MAX_POLYLINE_POINTS || MAX_POLYLINE_POINTS < 2) {
        for (let i = 0; i < total; i++) {
          const point = trackPoints.value[i];
          thinnedSourceIndex.push(i);
          rawPoints.push(new MapPolylinePoint({ latitude: point.latitude, longitude: point.longitude }));
        }
      } else {
        const step = (total - 1) / (MAX_POLYLINE_POINTS - 1);
        let lastIndex = -1;
        for (let i = 0; i < MAX_POLYLINE_POINTS; i++) {
          const index = Math.round(step * i);
          if (index == lastIndex)
            continue;
          lastIndex = index;
          const point = trackPoints.value[index];
          thinnedSourceIndex.push(index);
          rawPoints.push(new MapPolylinePoint({ latitude: point.latitude, longitude: point.longitude }));
        }
      }
      thinnedCount = rawPoints.length;
    }
    function distanceToCarMeters(point) {
      const dLat = (point.latitude - renderedPoint.latitude) * METERS_PER_DEGREE_LAT;
      let cosLat = Math.cos(renderedPoint.latitude * Math.PI / 180);
      if (cosLat < 0.01)
        cosLat = 0.01;
      const dLng = (point.longitude - renderedPoint.longitude) * METERS_PER_DEGREE_LNG * cosLat;
      return Math.sqrt(dLat * dLat + dLng * dLng);
    }
    function findGrayClipEnd(fromIndex, clipRadius) {
      const limit = clipRadius * POLYLINE_CLIP_EDGE_TOLERANCE;
      for (let i = fromIndex; i < thinnedCount; i++) {
        if (distanceToCarMeters(rawPoints[i]) > limit) {
          return i + 1;
        }
      }
      return thinnedCount;
    }
    function findBlueClipStart(boundaryIndex, clipRadius) {
      const limit = clipRadius * POLYLINE_CLIP_EDGE_TOLERANCE;
      for (let i = boundaryIndex; i >= 0; i--) {
        if (distanceToCarMeters(rawPoints[i]) > limit) {
          return i;
        }
      }
      return 0;
    }
    function updatePolyline() {
      if (!shouldPushPolyline()) {
        return null;
      }
      if (trackPoints.value.length < 2 || thinnedCount < 2) {
        polyline.value = [];
        polylineForceNext = false;
        return null;
      }
      let boundary = -1;
      for (let i = 0; i < thinnedCount; i++) {
        if (thinnedSourceIndex[i] <= currentIndex.value) {
          boundary = i;
        } else {
          break;
        }
      }
      const lines = [];
      const livePoint = new MapPolylinePoint(
        {
          latitude: renderedPoint.latitude,
          longitude: renderedPoint.longitude
        }
        // 车标是否恰好落在抽稀点 boundary 上。若落在上面，两条线都不必重复追加这一点，
        // 否则会产生长度为 0 的线段，部分渲染库对此处理异常。
      );
      const boundaryPoint = boundary >= 0 ? rawPoints[boundary] : null;
      const needLivePoint = boundaryPoint == null || Math.abs(boundaryPoint.latitude - renderedPoint.latitude) > 1e-9 || Math.abs(boundaryPoint.longitude - renderedPoint.longitude) > 1e-9;
      let grayEndIndex = thinnedCount;
      let blueStartIndex = 0;
      if (isPlaying.value) {
        const clipRadius = getVisibleRadiusMeters();
        grayEndIndex = findGrayClipEnd(Math.max(boundary + 1, 0), clipRadius);
        blueStartIndex = findBlueClipStart(boundary, clipRadius);
      }
      let grayPoints = rawPoints;
      if (isPlaying.value) {
        grayPoints = [];
        if (needLivePoint) {
          grayPoints.push(livePoint);
        }
        for (let i = Math.max(boundary + 1, 0); i < grayEndIndex; i++) {
          grayPoints.push(rawPoints[i]);
        }
      }
      if (grayPoints.length >= 2) {
        lines.push(new MpPolylineData({
          points: grayPoints,
          color: "#999999",
          width: 3,
          dottedLine: true,
          arrowLine: false,
          borderColor: "#FFFFFF",
          borderWidth: 0
        }));
      }
      if (boundary >= 0) {
        const playedPoints = rawPoints.slice(blueStartIndex, boundary + 1);
        if (needLivePoint) {
          playedPoints.push(livePoint);
        }
        if (playedPoints.length >= 2) {
          lines.push(new MpPolylineData({
            points: playedPoints,
            color: "#1890FF",
            width: 3,
            dottedLine: false,
            arrowLine: false,
            borderColor: "#FFFFFF",
            borderWidth: 0
          }));
        }
      }
      polyline.value = lines;
      polylineForceNext = false;
      markPolylineRendered();
    }
    function initPolyline() {
      buildThinnedPoints();
      invalidatePolylineAnchor();
      updatePolyline();
    }
    function getMetersPerPixelOfScale(latitude) {
      let cosLat = Math.cos(latitude * Math.PI / 180);
      if (cosLat < 0.01)
        cosLat = 0.01;
      const scale = trueMapScale > 0 ? trueMapScale : mapScale.value;
      const resolution = EARTH_RESOLUTION_BASE * cosLat / Math.pow(2, scale);
      return resolution > 1e-4 ? resolution : 1;
    }
    function getVisibleRadiusMeters() {
      let width = mapViewWidth;
      let height = mapViewHeight;
      if (width <= 0 || height <= 0) {
        width = 375;
        height = 640;
      }
      const halfDiagonalPx = Math.sqrt(width * width + height * height) / 2;
      const radius = halfDiagonalPx * getMetersPerPixelOfScale(renderedPoint.latitude) * POLYLINE_CLIP_MARGIN;
      return radius > 1 ? radius : 1;
    }
    function updateCarPosition(force) {
      const marker = carMarker.value;
      if (marker != null && trackPoints.value.length > 0 && currentIndex.value < trackPoints.value.length) {
        if (isPlaying.value) {
          center.latitude = renderedPoint.latitude;
          center.longitude = renderedPoint.longitude;
        }
        if (isPlaying.value) {
          const overlayDiff = shortestAngleDiff(renderedPoint.rotation, carOverlayRotation.value);
          if (force || Math.abs(overlayDiff) >= MARKER_ROTATION_UPDATE_THRESHOLD) {
            carOverlayRotation.value = renderedPoint.rotation;
          }
          return null;
        }
        const rotationDiff = shortestAngleDiff(renderedPoint.rotation, lastCarMarkerRotation);
        const markerRotation = Math.abs(rotationDiff) >= MARKER_ROTATION_UPDATE_THRESHOLD ? renderedPoint.rotation : lastCarMarkerRotation;
        lastCarMarkerRotation = markerRotation;
        const updatedMarker = {
          id: marker.id,
          latitude: renderedPoint.latitude,
          longitude: renderedPoint.longitude,
          iconPath: marker.iconPath,
          width: marker.width,
          height: marker.height,
          rotate: markerRotation,
          anchor: marker.anchor,
          callout: marker.callout,
          label: marker.label
        };
        carMarker.value = updatedMarker;
        markers.value = [updatedMarker, ...markers.value.slice(1)];
      }
    }
    function showPicker(type) {
      currentPickerType.value = type;
      pickerTitle.value = type == "start" ? "选择开始时间" : "选择结束时间";
      showDateTimePicker.value = true;
    }
    function showCurrentPosition(message = "这段时间没有数据") {
      var _a, _b, _c, _d;
      isTrackPlayable.value = false;
      const originalLatText = (_a = lat.value) !== null && _a !== void 0 ? _a : "";
      const originalLngText = (_b = lng.value) !== null && _b !== void 0 ? _b : "";
      const originalLat = parseFloat(originalLatText);
      const originalLng = parseFloat(originalLngText);
      if (isNaN(originalLat) || isNaN(originalLng) || originalLat == 0 || originalLng == 0) {
        utils_toast.showAppToast({
          title: message,
          icon: "none",
          duration: 2e3
        });
        showUserLocationFallback();
        return null;
      }
      utils_toast.showAppToast({
        title: message,
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
      resetRenderedPoint(currentPoint);
      markers.value = [marker];
      isMapReady.value = true;
    }
    const showUserLocationFallback = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const userLoc = yield utils_getUserLocation.getUserCurrentLocation();
        if (userLoc == null)
          return Promise.resolve(null);
        center.latitude = userLoc.latitude;
        center.longitude = userLoc.longitude;
        mapScale.value = 12;
        const userMarker = {
          id: 10004,
          latitude: userLoc.latitude,
          longitude: userLoc.longitude,
          width: 25,
          height: 25,
          iconPath: "/static/current-location.png",
          callout: new common_vendor.UTSJSONObject({
            content: "当前位置",
            color: carStatus.value == "online" ? "#ffffff" : "#999999",
            borderRadius: 10,
            bgColor: carStatus.value == "online" ? "#1296db" : "#CCCCCC",
            padding: 5,
            display: "ALWAYS"
          })
        };
        markers.value = [userMarker];
        isMapReady.value = true;
      });
    };
    function clearTrackDisplay() {
      isMapReady.value = false;
      trackPoints.value = [];
      isTrackPlayable.value = false;
      currentIndex.value = 0;
      activeSegmentTargetIndex.value = -1;
      renderedPoint.latitude = 0;
      renderedPoint.longitude = 0;
      renderedPoint.rotation = 0;
      renderedPoint.deviceTime = "";
      renderedPoint.speed = 0;
      currentSpeed.value = 0;
      currentTime.value = "";
      totalDistance.value = 0;
      carMarker.value = null;
      markers.value = [];
      lastCarMarkerRotation = 0;
      polyline.value = [];
      invalidatePolylineAnchor();
      stopMapScaleSync();
      trueMapScale = 0;
      mapContext = null;
    }
    function clearPlaybackTimer() {
      const timer = playbackTimer;
      if (timer != null) {
        clearTimeout(timer);
        playbackTimer = null;
      }
    }
    function pausePlayback() {
      isPlaying.value = false;
      clearPlaybackTimer();
      stopMapScaleSync();
      showCarOverlay.value = false;
      if (carMarker.value != null && trackPoints.value.length > 0) {
        updateCarPosition(true);
        applyFullMarkers();
      }
      updatePolyline();
    }
    function renderPlaybackIndex() {
      if (trackPoints.value.length == 0)
        return null;
      if (activeSegmentTargetIndex.value <= currentIndex.value) {
        resetRenderedPoint(trackPoints.value[currentIndex.value]);
      }
      updateCarPosition(true);
      if (!isPlaying.value) {
        invalidatePolylineAnchor();
      }
      updatePolyline();
      if (!isPlaying.value) {
        applyFullMarkers();
      }
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
      activeSegmentTargetIndex.value = -1;
      if (processedPoints.length == 0)
        return null;
      resetRenderedPoint(processedPoints[0]);
      calculateTrackDistance();
      initCarMarker();
      initPolyline();
      applyTrackViewportFit();
      renderPlaybackIndex();
      currentSpeed.value = 0;
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
          deviceNo: deviceNo.value,
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
          if (!api_response.isBusinessSuccessCode(res.code)) {
            showCurrentPosition(res.msg || "轨迹加载失败");
            return Promise.resolve(null);
          }
          common_vendor.index.__f__("log", "at pages/playBack/playBack.uvue:1486", "加载轨迹成功:", res);
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
          common_vendor.index.__f__("error", "at pages/playBack/playBack.uvue:1504", "加载轨迹失败:", error);
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
      activeSegmentTargetIndex.value = -1;
      renderPlaybackIndex();
      applyTrackViewportFit();
    }
    function getShortestRotationDifference(from, to) {
      let difference = to - from;
      if (difference > 180)
        difference -= 360;
      else if (difference < -180)
        difference += 360;
      return difference;
    }
    function getSegmentDuration(start, end) {
      const distance = getDistance(start.latitude, start.longitude, end.latitude, end.longitude);
      const recordedSpeed = start.speed > 0 && isFinite(start.speed) ? start.speed : end.speed;
      const speed = recordedSpeed > 0 && isFinite(recordedSpeed) ? recordedSpeed : FALLBACK_SPEED_KMH;
      const duration = distance / (speed / 3.6) * 1e3 / playbackSpeed.value;
      return Math.min(MAX_SEGMENT_DURATION_MS, Math.max(MIN_SEGMENT_DURATION_MS, duration));
    }
    function finishPlayback() {
      pausePlayback();
      activeSegmentTargetIndex.value = -1;
      currentSpeed.value = 0;
      utils_toast.showAppToast({
        title: "轨迹回放完成",
        icon: "none",
        duration: 1500
      });
    }
    function animateNextSegment(sessionId) {
      if (!isPlaying.value || sessionId != replaySessionId)
        return null;
      if (currentIndex.value >= trackPoints.value.length - 1) {
        finishPlayback();
        return null;
      }
      const startPoint = new TrackPoint({
        latitude: renderedPoint.latitude,
        longitude: renderedPoint.longitude,
        rotation: renderedPoint.rotation,
        deviceTime: renderedPoint.deviceTime,
        speed: renderedPoint.speed
      });
      const targetIndex = currentIndex.value + 1;
      const targetPoint = trackPoints.value[targetIndex];
      const rotationDifference = getShortestRotationDifference(startPoint.rotation, targetPoint.rotation);
      const duration = getSegmentDuration(startPoint, targetPoint);
      const startedAt = Date.now();
      activeSegmentTargetIndex.value = targetIndex;
      let renderFrame = null;
      renderFrame = () => {
        if (!isPlaying.value || sessionId != replaySessionId)
          return null;
        const progress = Math.min((Date.now() - startedAt) / duration, 1);
        renderedPoint.latitude = startPoint.latitude + (targetPoint.latitude - startPoint.latitude) * progress;
        renderedPoint.longitude = startPoint.longitude + (targetPoint.longitude - startPoint.longitude) * progress;
        renderedPoint.rotation = (startPoint.rotation + rotationDifference * progress + 360) % 360;
        renderedPoint.deviceTime = targetPoint.deviceTime;
        renderedPoint.speed = targetPoint.speed;
        currentSpeed.value = renderedPoint.speed;
        currentTime.value = renderedPoint.deviceTime;
        updateCarPosition(false);
        const frameNow = Date.now();
        let polylineDue = false;
        polylineDue = shouldPushPolyline();
        if (progress >= 1) {
          currentIndex.value = targetIndex;
          activeSegmentTargetIndex.value = -1;
          resetRenderedPoint(targetPoint);
          renderPlaybackIndex();
          animateNextSegment(sessionId);
          return null;
        }
        if (renderFrame != null) {
          const nextFrameAt = startedAt + (Math.floor((frameNow - startedAt) / PLAYBACK_FRAME_INTERVAL_MS) + 1) * PLAYBACK_FRAME_INTERVAL_MS;
          const delay = nextFrameAt - frameNow;
          playbackTimer = setTimeout(() => {
            renderFrame === null || renderFrame === void 0 ? null : renderFrame();
          }, delay > 0 ? delay : 0);
        }
        if (polylineDue) {
          const polylineSessionId = sessionId;
          setTimeout(() => {
            if (!isPlaying.value || polylineSessionId != replaySessionId)
              return null;
            updatePolyline();
          }, 0);
        }
      };
      renderFrame === null || renderFrame === void 0 ? null : renderFrame();
    }
    function startPlayback() {
      if (!isTrackPlayable.value) {
        utils_toast.showAppToast({ title: "没有轨迹数据", icon: "none" });
        return null;
      }
      if (currentIndex.value >= trackPoints.value.length - 1) {
        resetPlayback();
      }
      activeSegmentTargetIndex.value = -1;
      isPlaying.value = true;
      showCarOverlay.value = true;
      carOverlayRotation.value = renderedPoint.rotation;
      markers.value = markers.value.slice(1);
      invalidatePolylineAnchor();
      syncTrueMapScale();
      startMapScaleSync();
      focusMapOnVehicle();
      const sessionId = ++replaySessionId;
      animateNextSegment(sessionId);
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
      playbackSpeed.value = Math.min(30, Math.max(1, value));
      if (!isPlaying.value)
        return null;
      clearPlaybackTimer();
      const sessionId = ++replaySessionId;
      animateNextSegment(sessionId);
    }
    function setPlaybackSpeedFromValue(value) {
      applyPlaybackSpeed(value);
    }
    const normalizeRouteValue = (value = null) => {
      if (value == null)
        return "";
      const text = value.toString().trim();
      if (text == "" || text == "null" || text == "undefined")
        return "";
      try {
        const decoded = decodeURIComponent(text);
        return decoded == null ? text : decoded.trim();
      } catch (error) {
        return text;
      }
    };
    common_vendor.onLoad((option) => {
      var _a, _b, _c, _d, _f, _g, _h, _j, _k;
      deviceNo.value = (_a = option.deviceNo) !== null && _a !== void 0 ? _a : null;
      carStatus.value = (_b = option.connectionStatus) !== null && _b !== void 0 ? _b : "";
      const displayCarName = normalizeRouteValue((_c = option.plateNo) !== null && _c !== void 0 ? _c : "");
      plateNo.value = displayCarName != "" ? displayCarName : (_d = deviceNo.value) !== null && _d !== void 0 ? _d : "未命名设备";
      carType.value = normalizeRouteValue((_f = option.carType) !== null && _f !== void 0 ? _f : "");
      lat.value = (_g = option.lat) !== null && _g !== void 0 ? _g : null;
      lng.value = (_h = option.lng) !== null && _h !== void 0 ? _h : null;
      startTime.value = (_j = option.startTime) !== null && _j !== void 0 ? _j : "";
      endTime.value = (_k = option.endTime) !== null && _k !== void 0 ? _k : "";
      common_vendor.index.__f__("log", "at pages/playBack/playBack.uvue:1743", "plateNo:", plateNo.value);
      const routeStartTime = resolveRouteDateTime(startTime.value);
      const routeEndTime = resolveRouteDateTime(endTime.value);
      if (routeStartTime != null && routeEndTime != null) {
        setPlaybackTimeRange(routeStartTime, routeEndTime);
        loadTrackPos();
      } else {
        initDateTime();
        loadTrackPos();
      }
    });
    common_vendor.onReady(() => {
      measureMapViewportSize(() => {
        if (trackPoints.value.length > 0 && !isPlaying.value)
          adjustMapToFitTrack();
      });
      syncTrueMapScale();
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
        i: showCarOverlay.value
      }, showCarOverlay.value ? {
        j: carOverlayIcon.value,
        k: common_vendor.s("transform: rotate(" + carOverlayRotation.value + "deg);")
      } : {}, {
        l: common_vendor.p({
          showTime: false,
          currentCar: plateNo.value,
          showCar: true,
          carStatus: carStatus.value,
          class: "sub-nav-overlay"
        }),
        m: common_vendor.sei("track-map-container", "view"),
        n: common_vendor.p({
          name: "/static/rili.png",
          fontSize: "15"
        }),
        o: common_vendor.t(getPlaybackDate(startTime.value)),
        p: common_vendor.t(getPlaybackClock(startTime.value)),
        q: common_vendor.o(($event) => {
          return showPicker("start");
        }, "49"),
        r: common_vendor.o(($event) => {
          return showPicker("start");
        }, "67"),
        s: common_vendor.p({
          name: "/static/xiangxia.png",
          fontSize: "15",
          class: "date-arrow"
        }),
        t: common_vendor.t(getPlaybackDate(endTime.value)),
        v: common_vendor.t(getPlaybackClock(endTime.value)),
        w: common_vendor.o(($event) => {
          return showPicker("end");
        }, "9e"),
        x: common_vendor.o(($event) => {
          return showPicker("end");
        }, "30"),
        y: common_vendor.p({
          name: "/static/xiangxia.png",
          fontSize: "15",
          class: "date-arrow"
        }),
        z: common_vendor.o(togglePlayback, "c2"),
        A: common_vendor.p({
          type: "primary",
          size: "small",
          text: isPlaying.value ? "暂停" : "播放"
        }),
        B: common_vendor.o(setPlaybackSpeedFromValue, "1a"),
        C: common_vendor.o(($event) => {
          return playbackSpeed.value = $event;
        }, "7d"),
        D: common_vendor.p({
          min: 1,
          max: 30,
          step: 1,
          modelValue: playbackSpeed.value
        }),
        E: common_vendor.t(playbackSpeed.value),
        F: common_vendor.t(currentTime.value),
        G: common_vendor.t(currentSpeed.value),
        H: common_vendor.t((totalDistance.value / 1e3).toFixed(1)),
        I: common_vendor.o(onConfirm, "8e"),
        J: common_vendor.o(onCancel, "4c"),
        K: common_vendor.p({
          ["confirm-btn"]: "确认",
          ["cancel-btn"]: "取消",
          start: common_vendor.unref(pickerMinTime),
          end: common_vendor.unref(pickerMaxTime),
          value: common_vendor.unref(pickerValue),
          title: pickerTitle.value,
          mode: 63,
          format: "YYYY-MM-DD HH:mm:ss"
        }),
        L: common_vendor.o(($event) => {
          return showDateTimePicker.value = $event;
        }, "09"),
        M: common_vendor.p({
          position: "bottom",
          closeable: false,
          modelValue: showDateTimePicker.value
        }),
        N: `${_ctx.u_s_b_h}px`,
        O: `${_ctx.u_s_a_i_b}px`
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/playBack/playBack.js.map
