"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../utils/amap-wx.130.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_slider_1 = common_vendor.resolveComponent("uv-slider");
  const _easycom_l_date_time_picker_1 = common_vendor.resolveComponent("l-date-time-picker");
  const _easycom_l_popup_1 = common_vendor.resolveComponent("l-popup");
  (_easycom_custom_navBar_1 + _easycom_uv_icon_1 + _easycom_uv_slider_1 + _easycom_l_date_time_picker_1 + _easycom_l_popup_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_slider = () => "../../uni_modules/uv-slider/components/uv-slider/uv-slider.js";
const _easycom_l_date_time_picker = () => "../../uni_modules/lime-date-time-picker/components/l-date-time-picker/l-date-time-picker.js";
const _easycom_l_popup = () => "../../uni_modules/lime-popup/components/l-popup/l-popup.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_icon + _easycom_uv_slider + _easycom_l_date_time_picker + _easycom_l_popup)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "playBack",
  setup(__props) {
    const center = common_vendor.reactive(new UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(18);
    const showDateTimePicker = common_vendor.ref(false);
    const currentPickerType = common_vendor.ref("start");
    const pickerTitle = common_vendor.ref("选择开始时间");
    const trackPoints = common_vendor.ref([]);
    const polyline = common_vendor.ref([]);
    const isPlaying = common_vendor.ref(false);
    const playbackSpeed = common_vendor.ref(1);
    const totalDistance = common_vendor.ref(0);
    const playbackInterval = common_vendor.ref(null);
    const currentIndex = common_vendor.ref(0);
    const carMarker = common_vendor.ref(null);
    const startTime = common_vendor.ref("");
    const endTime = common_vendor.ref("");
    const markers = common_vendor.ref([]);
    common_vendor.onMounted(() => {
      loadSampleTrack();
      initDateTime();
    });
    const initDateTime = () => {
      const now = /* @__PURE__ */ new Date();
      const formatTime = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      };
      startTime.value = formatTime(now);
      const endDate = new Date(now.getTime() + 36e5);
      endTime.value = formatTime(endDate);
    };
    const showPicker = (type) => {
      currentPickerType.value = type;
      pickerTitle.value = type === "start" ? "选择开始时间" : "选择结束时间";
      showDateTimePicker.value = true;
    };
    const onConfirm = (value) => {
      if (currentPickerType.value === "start") {
        startTime.value = value;
      } else {
        endTime.value = value;
      }
      showDateTimePicker.value = false;
    };
    const onCancel = () => {
      showDateTimePicker.value = false;
    };
    const loadSampleTrack = () => {
      const mockTrack = [
        new UTSJSONObject({ "latitude": 35.26677197770503, "longitude": 115.40126244387386 }),
        new UTSJSONObject({ "latitude": 35.23764782824115, "longitude": 115.39397562325496 }),
        new UTSJSONObject({ "latitude": 35.23905101311781, "longitude": 115.44459367195407 }),
        new UTSJSONObject({ "latitude": 35.270452534471225, "longitude": 115.44611973480175 }),
        new UTSJSONObject({ "latitude": 35.26677197770503, "longitude": 115.40126244387386 })
      ];
      trackPoints.value = mockTrack;
      calculateTrackDistance();
      initCarMarker();
      updatePolyline();
      adjustMapToFitTrack();
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
          anchor: new UTSJSONObject({ x: 0.5, y: 0.5 }),
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
            color: "#ccc",
            width: 6,
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
      isPlaying.value = true;
      playbackInterval.value = setInterval(playNextPoint, 1e3 / playbackSpeed.value);
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
    };
    const updateCarPosition = () => {
      if (carMarker.value && trackPoints.value.length > 0 && currentIndex.value < trackPoints.value.length) {
        const point = trackPoints.value[currentIndex.value];
        carMarker.value.latitude = point.latitude;
        carMarker.value.longitude = point.longitude;
        markers.value = [carMarker.value];
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
      updateCarPosition();
      updatePolyline();
    };
    const setPlaybackSpeed = (e = null) => {
      playbackSpeed.value = e;
      if (isPlaying.value) {
        pausePlayback();
        startPlayback();
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
      const __returned__ = {
        a: common_vendor.p({
          title: "轨迹回放",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.sei("myMap", "map"),
        c: common_vendor.unref(center).latitude,
        d: common_vendor.unref(center).longitude,
        e: common_vendor.unref(markers),
        f: common_vendor.unref(polyline),
        g: common_vendor.unref(mapScale),
        h: common_vendor.p({
          name: "calendar",
          size: "25"
        }),
        i: common_vendor.t(common_vendor.unref(startTime)),
        j: common_vendor.o(($event = null) => {
          return showPicker("start");
        }),
        k: common_vendor.t(common_vendor.unref(endTime)),
        l: common_vendor.o(($event = null) => {
          return showPicker("end");
        }),
        m: common_vendor.o(togglePlayback),
        n: common_vendor.p({
          name: common_vendor.unref(isPlaying) ? "pause-circle" : "play-circle",
          size: "30"
        }),
        o: common_vendor.o(setPlaybackSpeed),
        p: common_vendor.o(($event = null) => {
          return common_vendor.isRef(playbackSpeed) ? playbackSpeed.value = $event : null;
        }),
        q: common_vendor.p({
          backgroundColor: "pink",
          activeColor: "blue",
          min: "1",
          max: "5",
          blockStyle: {
            width: "32rpx",
            height: "32rpx",
            background: "url(/static/slider.png) no-repeat center/cover"
          },
          modelValue: common_vendor.unref(playbackSpeed)
        }),
        r: common_vendor.t(common_vendor.unref(playbackSpeed)),
        s: common_vendor.t(common_vendor.unref(startTime)),
        t: common_vendor.o(onConfirm),
        v: common_vendor.o(onCancel),
        w: common_vendor.p({
          ["confirm-btn"]: "确认",
          ["cancel-btn"]: "取消",
          title: common_vendor.unref(pickerTitle),
          mode: 1 | 2 | 4 | 8 | 16 | 32
        }),
        x: common_vendor.o(($event = null) => {
          return common_vendor.isRef(showDateTimePicker) ? showDateTimePicker.value = $event : null;
        }),
        y: common_vendor.p({
          position: "bottom",
          closeable: false,
          modelValue: common_vendor.unref(showDateTimePicker)
        }),
        z: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/playBack/playBack.js.map
