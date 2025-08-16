"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
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
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "playBack",
  setup(__props) {
    const center = common_vendor.reactive(new UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(18);
    const imei = common_vendor.ref("");
    const carStatus = common_vendor.ref("");
    const plateNo = common_vendor.ref("");
    const showDateTimePicker = common_vendor.ref(false);
    const currentPickerType = common_vendor.ref("start");
    const pickerTitle = common_vendor.ref("选择开始时间");
    const trackPoints = common_vendor.ref([]);
    const polyline = common_vendor.ref([]);
    const isPlaying = common_vendor.ref(false);
    const playbackSpeed = common_vendor.ref(1);
    const totalDistance = common_vendor.ref(0);
    const currentSpeed = common_vendor.ref(0);
    const currentTime = common_vendor.ref("");
    const playbackInterval = common_vendor.ref(null);
    const currentIndex = common_vendor.ref(0);
    const carMarker = common_vendor.ref(null);
    const startTime = common_vendor.ref("");
    const endTime = common_vendor.ref("");
    const markers = common_vendor.ref([]);
    common_vendor.onLoad((option) => {
      common_vendor.index.__f__("log", "at pages/playBack/playBack.uvue:111", "option", option);
      imei.value = option.imei;
      carStatus.value = option.connectionStatus;
      plateNo.value = option.plateNo;
      initDateTime();
      loadTrackPos();
    });
    const loadTrackPos = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const data = new UTSJSONObject({
          imei: imei.value,
          startTime: startTime.value,
          endTime: endTime.value,
          minParkTime: 60,
          withStop: true,
          withPos: true,
          withTrip: false
        });
        const res = yield api_request.getTrackPos(data);
        if (res.data && res.data.positions) {
          processTrackData(res.data.positions);
        }
      });
    };
    const processTrackData = (positions) => {
      const processedPoints = [];
      for (let i = 0; i < positions.length; i++) {
        const point = positions[i];
        const processedPoint = new UTSJSONObject({
          latitude: point.getNumber("latitude", 0),
          longitude: point.getNumber("longitude", 0),
          speed: point.getNumber("speed", 0),
          deviceTime: point.getString("deviceTime", ""),
          timestamp: new Date(point.getString("deviceTime", "")).getTime()
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
    };
    const initDateTime = () => {
      const now = /* @__PURE__ */ new Date();
      const formatTime = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
      };
      endTime.value = formatTime(now);
      const startDate = new Date(now.getTime() - 36e5);
      startTime.value = formatTime(startDate);
    };
    const showPicker = (type) => {
      currentPickerType.value = type;
      pickerTitle.value = type === "start" ? "选择开始时间" : "选择结束时间";
      showDateTimePicker.value = true;
    };
    const onConfirm = (value) => {
      if (currentPickerType.value == "start") {
        startTime.value = value;
      } else {
        endTime.value = value;
      }
      loadTrackPos();
      showDateTimePicker.value = false;
    };
    const onCancel = () => {
      showDateTimePicker.value = false;
    };
    const calculateBearing = (lat1, lng1, lat2, lng2) => {
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
    };
    const initCarMarker = () => {
      if (trackPoints.value.length > 0) {
        carMarker.value = new UTSJSONObject({
          id: 999,
          latitude: trackPoints.value[0].latitude,
          longitude: trackPoints.value[0].longitude,
          iconPath: "/static/car.png",
          width: 32,
          height: 32,
          rotate: trackPoints.value[0].rotation || 0,
          anchor: new UTSJSONObject({ x: 0.5, y: 0.5 }),
          animation: new UTSJSONObject({
            duration: 1e3,
            type: "move"
          }),
          callout: new UTSJSONObject({
            content: "起点",
            borderRadius: 5,
            padding: 5,
            display: "ALWAYS"
          })
        });
        markers.value = [carMarker.value];
      }
    };
    const updatePolyline = () => {
      if (!trackPoints.value || trackPoints.value.length < 2) {
        polyline.value = [];
        return null;
      }
      const newPolyline = [];
      if (currentIndex.value > 0) {
        const playedPoints = trackPoints.value.slice(0, currentIndex.value + 1);
        if (playedPoints.length >= 2) {
          newPolyline.push({
            points: playedPoints.map((p) => {
              return new UTSJSONObject({ latitude: p.latitude, longitude: p.longitude });
            }),
            color: "#1890FF",
            width: 6,
            arrowLine: true,
            borderColor: "#FFF",
            borderWidth: 1
          });
        }
      }
      if (currentIndex.value < trackPoints.value.length - 1) {
        const unplayedPoints = trackPoints.value.slice(currentIndex.value);
        if (unplayedPoints.length >= 2) {
          newPolyline.push({
            points: unplayedPoints.map((p) => {
              return new UTSJSONObject({ latitude: p.latitude, longitude: p.longitude });
            }),
            color: "#999",
            width: 3,
            borderColor: "#FFF",
            borderWidth: 1,
            dottedLine: true
          });
        }
      }
      polyline.value = newPolyline;
    };
    const adjustMapToFitTrack = () => {
      if (trackPoints.value.length === 0)
        return null;
      const bounds = calculateTrackBounds();
      center.latitude = (bounds.minLat + bounds.maxLat) / 2;
      center.longitude = (bounds.minLng + bounds.maxLng) / 2;
      const latDiff = bounds.maxLat - bounds.minLat;
      const lngDiff = bounds.maxLng - bounds.minLng;
      const maxDiff = Math.max(latDiff, lngDiff);
      if (maxDiff > 0.1)
        mapScale.value = 11;
      else if (maxDiff > 0.05)
        mapScale.value = 12;
      else if (maxDiff > 0.02)
        mapScale.value = 13;
      else
        mapScale.value = 14;
    };
    const calculateTrackBounds = () => {
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
      return new UTSJSONObject({ minLat, maxLat, minLng, maxLng });
    };
    const togglePlayback = () => {
      if (isPlaying.value) {
        pausePlayback();
      } else {
        startPlayback();
      }
    };
    const startPlayback = () => {
      if (trackPoints.value.length === 0) {
        common_vendor.index.showToast({ title: "没有轨迹数据", icon: "none" });
        return null;
      }
      if (currentIndex.value >= trackPoints.value.length - 1) {
        resetPlayback();
      }
      isPlaying.value = true;
      const intervalDuration = 1e3 / playbackSpeed.value;
      playbackInterval.value = setInterval(playNextPoint, intervalDuration);
    };
    const playNextPoint = () => {
      if (currentIndex.value >= trackPoints.value.length - 1) {
        pausePlayback();
        updatePolyline();
        common_vendor.index.showToast({
          title: "轨迹回放完成",
          icon: "none",
          duration: 1500
        });
        setTimeout(() => {
          resetPlayback();
        }, 2e3);
        return null;
      }
      currentIndex.value++;
      updateCarPosition();
      updatePolyline();
      const point = trackPoints.value[currentIndex.value];
      currentSpeed.value = point.speed || 0;
      currentTime.value = point.deviceTime || "";
    };
    const updateCarPosition = () => {
      if (carMarker.value && trackPoints.value.length > 0 && currentIndex.value < trackPoints.value.length) {
        const point = trackPoints.value[currentIndex.value];
        Object.assign(carMarker.value, new UTSJSONObject({
          latitude: point.latitude,
          longitude: point.longitude,
          rotate: point.rotation || 0,
          animation: new UTSJSONObject({
            duration: 1e3 / playbackSpeed.value,
            type: "move"
          })
        }));
        markers.value = [carMarker.value];
        center.latitude = point.latitude;
        center.longitude = point.longitude;
      }
    };
    const pausePlayback = () => {
      isPlaying.value = false;
      if (playbackInterval.value) {
        clearInterval(playbackInterval.value);
        playbackInterval.value = null;
      }
    };
    const resetPlayback = () => {
      pausePlayback();
      currentIndex.value = 0;
      currentSpeed.value = 0;
      if (trackPoints.value.length > 0) {
        currentTime.value = trackPoints.value[0].deviceTime || "";
      }
      updateCarPosition();
      updatePolyline();
    };
    const setPlaybackSpeed = (e = null) => {
      playbackSpeed.value = e;
      if (isPlaying.value) {
        pausePlayback();
        const intervalDuration = 1e3 / playbackSpeed.value;
        playbackInterval.value = setInterval(playNextPoint, intervalDuration);
        isPlaying.value = true;
      }
    };
    const calculateTrackDistance = () => {
      totalDistance.value = 0;
      for (let i = 1; i < trackPoints.value.length; i++) {
        totalDistance.value += getDistance(trackPoints.value[i - 1].latitude, trackPoints.value[i - 1].longitude, trackPoints.value[i].latitude, trackPoints.value[i].longitude);
      }
    };
    const getDistance = (lat1, lng1, lat2, lng2) => {
      const rad = (d) => {
        return d * Math.PI / 180;
      };
      const radLat1 = rad(lat1);
      const radLat2 = rad(lat2);
      const a = radLat1 - radLat2;
      const b = rad(lng1) - rad(lng2);
      const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      return s * 6378.137 * 1e3;
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: common_vendor.p(new UTSJSONObject({
          title: "轨迹回放",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        })),
        b: carMarker.value
      }), carMarker.value ? new UTSJSONObject({
        c: carMarker.value.id,
        d: common_vendor.p(new UTSJSONObject({
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
        }))
      }) : new UTSJSONObject({}), new UTSJSONObject({
        e: common_vendor.p(new UTSJSONObject({
          showTime: false,
          currentCar: plateNo.value,
          showCar: true,
          carStatus: carStatus.value
        })),
        f: common_vendor.sei("myMap", "map"),
        g: center.latitude,
        h: center.longitude,
        i: markers.value,
        j: polyline.value,
        k: mapScale.value,
        l: common_vendor.p(new UTSJSONObject({
          name: "calendar",
          size: "25"
        })),
        m: common_vendor.t(startTime.value),
        n: common_vendor.o(($event = null) => {
          return showPicker("start");
        }),
        o: common_vendor.t(endTime.value),
        p: common_vendor.o(($event = null) => {
          return showPicker("end");
        }),
        q: common_vendor.o(togglePlayback),
        r: common_vendor.p(new UTSJSONObject({
          name: isPlaying.value ? "pause-circle" : "play-circle",
          size: "30"
        })),
        s: common_vendor.o(setPlaybackSpeed),
        t: common_vendor.o(($event = null) => {
          return playbackSpeed.value = $event;
        }),
        v: common_vendor.p(new UTSJSONObject({
          backgroundColor: "#f5f5f5",
          activeColor: "#1890FF",
          min: "1",
          max: "10",
          blockStyle: new UTSJSONObject({
            width: "32rpx",
            height: "32rpx",
            background: "url(/static/slider.png) no-repeat center/cover"
          }),
          modelValue: playbackSpeed.value
        })),
        w: common_vendor.t(playbackSpeed.value),
        x: common_vendor.t(currentTime.value),
        y: common_vendor.t(currentSpeed.value),
        z: common_vendor.t((totalDistance.value / 1e3).toFixed(1)),
        A: common_vendor.o(onConfirm),
        B: common_vendor.o(onCancel),
        C: common_vendor.p(new UTSJSONObject({
          ["confirm-btn"]: "确认",
          ["cancel-btn"]: "取消",
          title: pickerTitle.value,
          mode: 1 | 2 | 4 | 8 | 16 | 32
        })),
        D: common_vendor.o(($event = null) => {
          return showDateTimePicker.value = $event;
        }),
        E: common_vendor.p(new UTSJSONObject({
          position: "bottom",
          closeable: false,
          modelValue: showDateTimePicker.value
        })),
        F: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/playBack/playBack.js.map
