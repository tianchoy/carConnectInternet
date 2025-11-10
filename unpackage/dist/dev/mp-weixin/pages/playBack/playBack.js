"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
const utils_cars = require("../../utils/cars.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _component_marker = common_vendor.resolveComponent("marker");
  const _easycom_sub_navBar_1 = common_vendor.resolveComponent("sub-navBar");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_slider_1 = common_vendor.resolveComponent("uv-slider");
  const _easycom_l_date_time_picker_1 = common_vendor.resolveComponent("l-date-time-picker");
  const _easycom_l_popup_1 = common_vendor.resolveComponent("l-popup");
  (_easycom_custom_navBar_1 + _component_marker + _easycom_sub_navBar_1 + _easycom_uv_icon_1 + _easycom_uv_slider_1 + _easycom_l_date_time_picker_1 + _easycom_l_popup_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_sub_navBar = () => "../../components/sub-navBar/sub-navBar.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_slider = () => "../../uni_modules/uv-slider/components/uv-slider/uv-slider.js";
const _easycom_l_date_time_picker = () => "../../uni_modules/lime-date-time-picker/components/l-date-time-picker/l-date-time-picker.js";
const _easycom_l_popup = () => "../../uni_modules/lime-popup/components/l-popup/l-popup.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_sub_navBar + _easycom_uv_icon + _easycom_uv_slider + _easycom_l_date_time_picker + _easycom_l_popup)();
}
class polyData extends UTS.UTSType {
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
      name: "polyData"
    };
  }
  constructor(options, metadata = polyData.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.points = this.__props__.points;
    this.color = this.__props__.color;
    this.width = this.__props__.width;
    this.arrowLine = this.__props__.arrowLine;
    this.borderColor = this.__props__.borderColor;
    this.borderWidth = this.__props__.borderWidth;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "playBack",
  setup(__props) {
    const center = common_vendor.reactive(new UTSJSONObject({
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
    function safeParseDate(dateStr) {
      if (!dateStr)
        return 0;
      const iosCompatibleStr = dateStr.replace(/-/g, "/");
      const date = new Date(iosCompatibleStr);
      if (isNaN(date.getTime())) {
        const isoStr = dateStr.replace(" ", "T");
        const isoDate = new Date(isoStr);
        if (!isNaN(isoDate.getTime())) {
          return isoDate.getTime();
        }
        return 0;
      }
      return date.getTime();
    }
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
      trackPoints.value.forEach((point = null) => {
        minLat = Math.min(minLat, point.latitude);
        maxLat = Math.max(maxLat, point.latitude);
        minLng = Math.min(minLng, point.longitude);
        maxLng = Math.max(maxLng, point.longitude);
      });
      return new UTSJSONObject({ minLat, maxLat, minLng, maxLng });
    }
    function adjustMapToFitTrack() {
      const bounds = calculateTrackBounds();
      if (!bounds)
        return null;
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
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
      };
      endTime.value = formatTime(now);
      const startDate = new Date(now.getTime() - 36e5 * 24);
      startTime.value = formatTime(startDate);
    }
    function initCarMarker() {
      if (trackPoints.value.length > 0) {
        carMarker.value = new UTSJSONObject(
          {
            id: 999,
            latitude: trackPoints.value[0].latitude,
            longitude: trackPoints.value[0].longitude,
            iconPath: utils_cars.getDeviceIcon(carStatus.value, carType.value),
            width: 25,
            height: 25,
            rotate: trackPoints.value[0].rotation || 0
            // anchor: { x: 0.5, y: 0.5 },
            // callout: {
            // 	content: plateNo,
            // 	borderRadius: 5,
            // 	padding: 5,
            // 	display: 'ALWAYS'
            // }
          }
          // 添加起点和终点标记
        );
        const startMarker = new UTSJSONObject({
          id: 1e3,
          latitude: trackPoints.value[0].latitude,
          longitude: trackPoints.value[0].longitude,
          iconPath: "/static/start.png",
          width: 24,
          height: 24,
          // anchor: { x: 0.5, y: 0.5 },
          callout: new UTSJSONObject({
            content: "起点",
            borderRadius: 5,
            padding: 5,
            display: "BYCLICK"
          })
        });
        const endMarker = new UTSJSONObject({
          id: 1001,
          latitude: trackPoints.value[trackPoints.value.length - 1].latitude,
          longitude: trackPoints.value[trackPoints.value.length - 1].longitude,
          iconPath: "/static/end.png",
          width: 24,
          height: 24,
          // anchor: { x: 0.5, y: 0.5 },
          callout: new UTSJSONObject({
            content: "终点",
            borderRadius: 5,
            padding: 5,
            display: "BYCLICK"
          })
        });
        markers.value = [carMarker.value, startMarker, endMarker];
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
          newPolyline.push(new UTSJSONObject({
            points: playedPoints.map((p = null) => {
              return new UTSJSONObject({ latitude: p.latitude, longitude: p.longitude });
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
          newPolyline.push(new UTSJSONObject({
            points: unplayedPoints.map((p = null) => {
              return new UTSJSONObject({ latitude: p.latitude, longitude: p.longitude });
            }),
            color: "#999",
            width: 3,
            borderColor: "#FFF",
            borderWidth: 1,
            dottedLine: true
          }));
        }
      }
      polyline.value = newPolyline;
    }
    function updateCarPosition() {
      if (carMarker.value && trackPoints.value.length > 0 && currentIndex.value < trackPoints.value.length) {
        const point = trackPoints.value[currentIndex.value];
        carMarker.value.latitude = point.latitude;
        carMarker.value.longitude = point.longitude;
        carMarker.value.rotate = point.rotation || 0;
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
      loadTrackPos();
      showDateTimePicker.value = false;
    }
    function onCancel() {
      showDateTimePicker.value = false;
    }
    function togglePlayback() {
      if (isPlaying.value) {
        pausePlayback();
      } else {
        startPlayback();
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
        playbackTimer = setTimeout(playbackStep, 16);
      }
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
      currentSpeed.value = point.speed || 0;
      currentTime.value = point.deviceTime || "";
    }
    function pausePlayback() {
      isPlaying.value = false;
      if (playbackTimer) {
        clearTimeout(playbackTimer);
        playbackTimer = null;
      }
    }
    function resetPlayback() {
      pausePlayback();
      currentIndex.value = 0;
      currentSpeed.value = 0;
      if (trackPoints.value.length > 0) {
        currentTime.value = trackPoints.value[0].deviceTime || "";
      }
      updateCarPosition();
      updatePolyline();
    }
    function setPlaybackSpeed(e = null) {
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
      imei.value = option.imei;
      carStatus.value = option.connectionStatus;
      plateNo.value = option.plateNo;
      carType.value = option.carType;
      lat.value = option.lat;
      lng.value = option.lng;
      sTime.value = option.startTime;
      eTime.value = option.endTime;
      console.log(sTime.value, eTime.value);
      if (sTime.value && eTime.value) {
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
    const loadTrackPos = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.showLoading({ title: "加载中..." });
        const data = new UTSJSONObject({
          imei: imei.value,
          startTime: startTime.value.replace(/\//g, "-"),
          endTime: endTime.value.replace(/\//g, "-"),
          minParkTime: 2,
          withStop: false,
          withPos: true,
          withTrip: false
        });
        const res = yield api_request.getTrackPos(data);
        if (res.data.positions && res.data.positions.length > 0) {
          processTrackData(res.data.positions);
          common_vendor.index.hideLoading();
        } else {
          showCurrentPosition();
          common_vendor.index.hideLoading();
        }
      });
    };
    function showCurrentPosition() {
      common_vendor.index.showToast({
        title: "这段时间没有数据",
        icon: "none",
        duration: 2e3
      });
      const originalLat = parseFloat(lat.value);
      const originalLng = parseFloat(lng.value);
      const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(originalLat, originalLng);
      center.latitude = convertedCoord.lat;
      center.longitude = convertedCoord.lng;
      mapScale.value = 15;
      const currentPoint = new UTSJSONObject(
        {
          latitude: convertedCoord.lat,
          longitude: convertedCoord.lng,
          speed: 0,
          deviceTime: (/* @__PURE__ */ new Date()).toLocaleString(),
          timestamp: Date.now(),
          rotation: 0,
          originalLatitude: originalLat,
          originalLongitude: originalLng
        }
        // 初始化小车标记
      );
      carMarker.value = new UTSJSONObject(
        {
          id: 999,
          latitude: currentPoint.latitude,
          longitude: currentPoint.longitude,
          iconPath: utils_cars.getDeviceIcon(carStatus.value, carType.value),
          width: 25,
          height: 25,
          rotate: 0
          // anchor: { x: 0.5, y: 0.5 },
          // callout: {
          // 	content: plateNo.value,
          // 	borderRadius: 5,
          // 	padding: 5,
          // 	display: 'ALWAYS'
          // }
        }
        // 设置标记点
      );
      markers.value = [carMarker.value];
    }
    function processTrackData(positions) {
      const processedPoints = [];
      for (let i = 0; i < positions.length; i++) {
        const point = positions[i];
        const deviceTimeStr = point.getString("deviceTime", "");
        const originalLat = point.getNumber("latitude", 0);
        const originalLng = point.getNumber("longitude", 0);
        const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(originalLat, originalLng);
        const processedPoint = new UTSJSONObject({
          latitude: convertedCoord.lat,
          longitude: convertedCoord.lng,
          speed: point.getNumber("speed", 0),
          deviceTime: formatDateForDisplay(deviceTimeStr),
          timestamp: safeParseDate(deviceTimeStr),
          // 保留原始坐标信息
          originalLatitude: originalLat,
          originalLongitude: originalLng
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
          name: "calendar",
          size: "25"
        }),
        m: common_vendor.t(startTime.value),
        n: common_vendor.o(($event) => {
          return showPicker("start");
        }),
        o: common_vendor.t(endTime.value),
        p: common_vendor.o(($event) => {
          return showPicker("end");
        }),
        q: common_vendor.t(isPlaying.value ? "暂停" : "播放"),
        r: common_vendor.o(togglePlayback),
        s: common_vendor.o(setPlaybackSpeed),
        t: common_vendor.o(($event) => {
          return playbackSpeed.value = $event;
        }),
        v: common_vendor.p({
          backgroundColor: "#f5f5f5",
          activeColor: "#1890FF",
          min: "1",
          max: "10",
          ["block-color"]: "#1890FF",
          modelValue: playbackSpeed.value
        }),
        w: common_vendor.t(playbackSpeed.value),
        x: common_vendor.t(currentTime.value),
        y: common_vendor.t(currentSpeed.value),
        z: common_vendor.t((totalDistance.value / 1e3).toFixed(1)),
        A: common_vendor.o(onConfirm),
        B: common_vendor.o(onCancel),
        C: common_vendor.p({
          ["confirm-btn"]: "确认",
          ["cancel-btn"]: "取消",
          title: pickerTitle.value,
          mode: 1 | 2 | 4 | 8 | 16 | 32
        }),
        D: common_vendor.o(($event) => {
          return showDateTimePicker.value = $event;
        }),
        E: common_vendor.p({
          position: "bottom",
          closeable: false,
          modelValue: showDateTimePicker.value
        }),
        F: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
