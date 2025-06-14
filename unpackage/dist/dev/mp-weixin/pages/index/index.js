"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(new UTSJSONObject({
  __name: "index",
  setup(__props) {
    const center = common_vendor.reactive(new UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(13);
    const currentMode = common_vendor.ref("draw");
    const isDrawing = common_vendor.ref(false);
    const points = common_vendor.ref([]);
    const polygons = common_vendor.ref([]);
    const trackPoints = common_vendor.ref([]);
    const polyline = common_vendor.ref([]);
    const isPlaying = common_vendor.ref(false);
    const playbackSpeed = common_vendor.ref(50);
    const totalDistance = common_vendor.ref(0);
    const playbackInterval = common_vendor.ref(null);
    const currentIndex = common_vendor.ref(0);
    const carMarker = common_vendor.ref(null);
    const markers = common_vendor.ref([]);
    const amapFile = require("../../static/libs/amap-wx.130.js");
    amapFile.AMapWX(new UTSJSONObject({ key: "e3e773ad74f7ba25f38775c9c8db6474" }));
    common_vendor.onMounted(() => {
      loadSampleTrack();
      polygons.value = [new UTSJSONObject({
        points: [
          new UTSJSONObject({ latitude: 39.911224745973904, longitude: 116.4004448639945 }),
          new UTSJSONObject({ latitude: 39.90158231816865, longitude: 116.39965115224538 }),
          new UTSJSONObject({ latitude: 39.90225756812269, longitude: 116.4126210618266 }),
          new UTSJSONObject({ latitude: 39.910544072055366, longitude: 116.41189424747824 })
        ],
        strokeWidth: 2,
        strokeColor: "#FF0000",
        fillColor: "rgba(255,0,0,0.2)",
        zIndex: 1
      })];
    });
    common_vendor.onLoad(() => {
      getlocation();
    });
    const getlocation = () => {
      common_vendor.index.getLocation(new UTSJSONObject({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/index/index.uvue:109", res);
          center.latitude = res.latitude;
          center.longitude = res.longitude;
        }
      }));
    };
    const toggleMode = () => {
      currentMode.value = currentMode.value === "draw" ? "track" : "draw";
      if (currentMode.value === "track") {
        initCarMarker();
        resetPlayback();
        adjustMapToFitTrack();
      }
    };
    const initCarMarker = () => {
      if (trackPoints.value.length > 0 && !carMarker.value) {
        carMarker.value = new UTSJSONObject({
          id: 999,
          latitude: trackPoints.value[0].latitude,
          longitude: trackPoints.value[0].longitude,
          iconPath: "/static/car.png",
          width: 32,
          height: 32,
          anchor: new UTSJSONObject({ x: 0.5, y: 0.5 })
        });
        markers.value = [carMarker.value];
      }
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
    const startDrawing = () => {
      isDrawing.value = true;
      points.value = [];
      updateMapDisplay();
    };
    const handleMapTap = (e = null) => {
      if (!isDrawing.value || currentMode.value !== "draw")
        return null;
      addNewPoint(e.detail.latitude, e.detail.longitude);
    };
    const addPoint = () => {
      common_vendor.index.createSelectorQuery().select("#fenceMap").context((res = null) => {
        const mapContext = res.context;
        mapContext.getCenterLocation(new UTSJSONObject({
          success: (centerRes = null) => {
            addNewPoint(centerRes.latitude, centerRes.longitude);
          }
        }));
      }).exec();
    };
    const addNewPoint = (lat, lng) => {
      points.value.push({ latitude: lat, longitude: lng });
      updateMapDisplay();
    };
    const removePoint = (index) => {
      points.value.splice(index, 1);
      updateMapDisplay();
    };
    const finishDrawing = () => {
      if (points.value.length < 3) {
        common_vendor.index.showToast({ title: "至少需要3个顶点", icon: "none" });
        return null;
      }
      isDrawing.value = false;
      common_vendor.index.showToast({ title: `围栏创建成功，共${points.value.length}个顶点` });
      common_vendor.index.__f__("log", "at pages/index/index.uvue:221", "电子围栏坐标:", UTS.JSON.stringify(points.value));
    };
    const clearAll = () => {
      isDrawing.value = false;
      points.value = [];
      polygons.value = [];
      updateMapDisplay();
    };
    const loadSampleTrack = () => {
      const mockTrack = [];
      const baseLat = 39.90469;
      const baseLng = 116.40717;
      for (let i = 0; i < 50; i++) {
        mockTrack.push({
          latitude: baseLat + Math.sin(i / 10) * 0.01,
          longitude: baseLng + Math.cos(i / 10) * 0.01,
          timestamp: Date.now() - (50 - i) * 6e4
        });
      }
      trackPoints.value = mockTrack;
      calculateTrackDistance();
      updatePolyline();
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
    const startPlayback = () => {
      if (trackPoints.value.length === 0) {
        common_vendor.index.showToast({ title: "没有轨迹数据", icon: "none" });
        return null;
      }
      isPlaying.value = true;
      currentIndex.value = 0;
      initCarMarker();
      playbackInterval.value = setInterval(playNextPoint, 1e3 / playbackSpeed.value);
    };
    const playNextPoint = () => {
      if (currentIndex.value >= trackPoints.value.length - 1) {
        pausePlayback();
        return null;
      }
      currentIndex.value++;
      const point = trackPoints.value[currentIndex.value];
      if (carMarker.value) {
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
      updatePolyline();
      if (trackPoints.value.length > 0) {
        initCarMarker();
        if (carMarker.value) {
          carMarker.value.latitude = trackPoints.value[0].latitude;
          carMarker.value.longitude = trackPoints.value[0].longitude;
          markers.value = [carMarker.value];
        }
      }
    };
    const clearTrack = () => {
      pausePlayback();
      trackPoints.value = [];
      polyline.value = [];
      totalDistance.value = 0;
      carMarker.value = null;
      markers.value = [];
    };
    const setPlaybackSpeed = (e = null) => {
      playbackSpeed.value = e.detail.value;
      if (isPlaying.value) {
        pausePlayback();
        startPlayback();
      }
    };
    const updatePolyline = () => {
      if (!trackPoints.value || trackPoints.value.length === 0) {
        polyline.value = [];
        return null;
      }
      polyline.value = [new UTSJSONObject({
        points: trackPoints.value.map((p) => {
          return new UTSJSONObject({ latitude: p.latitude, longitude: p.longitude });
        }),
        color: "#1890FF",
        width: 4,
        arrowLine: true,
        borderColor: "#FFF",
        borderWidth: 2
      })];
    };
    const updateMapDisplay = () => {
      const newMarkers = [];
      if (currentMode.value === "draw") {
        newMarkers.push(...points.value.map((point, index) => {
          return new UTSJSONObject({
            id: index + 1,
            latitude: point.latitude,
            longitude: point.longitude,
            iconPath: "/static/marker.png",
            width: 20,
            height: 20,
            callout: new UTSJSONObject({ content: `顶点${index + 1}`, display: "ALWAYS" })
          });
        }));
      }
      if (carMarker.value) {
        newMarkers.push(carMarker.value);
      }
      markers.value = newMarkers;
      if (currentMode.value === "draw" && points.value.length >= 3) {
        polygons.value = [new UTSJSONObject({
          points: points.value,
          strokeWidth: 2,
          strokeColor: "#FF0000",
          fillColor: "rgba(255,0,0,0.2)",
          zIndex: 1
        })];
      } else {
        polygons.value = [];
      }
      if (currentMode.value === "track") {
        updatePolyline();
      }
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: common_vendor.sei("fenceMap", "map"),
        b: common_vendor.unref(center).latitude,
        c: common_vendor.unref(center).longitude,
        d: common_vendor.unref(polygons),
        e: common_vendor.unref(markers),
        f: common_vendor.unref(polyline),
        g: common_vendor.unref(mapScale),
        h: common_vendor.o(handleMapTap),
        i: common_vendor.t(common_vendor.unref(currentMode) === "draw" ? "绘制模式" : "轨迹模式"),
        j: common_vendor.o(toggleMode),
        k: common_vendor.unref(currentMode) === "draw" ? "primary" : "default",
        l: common_vendor.o(getlocation),
        m: common_vendor.unref(currentMode) === "draw"
      }), common_vendor.unref(currentMode) === "draw" ? new UTSJSONObject({
        n: common_vendor.o(startDrawing),
        o: common_vendor.unref(isDrawing),
        p: common_vendor.o(addPoint),
        q: !common_vendor.unref(isDrawing),
        r: common_vendor.o(finishDrawing),
        s: !common_vendor.unref(isDrawing) || common_vendor.unref(points).length < 3,
        t: common_vendor.o(clearAll)
      }) : new UTSJSONObject({
        v: common_vendor.o(startPlayback),
        w: common_vendor.unref(isPlaying),
        x: common_vendor.o(pausePlayback),
        y: !common_vendor.unref(isPlaying),
        z: common_vendor.o(clearTrack),
        A: common_vendor.unref(playbackSpeed),
        B: common_vendor.o(setPlaybackSpeed)
      }), new UTSJSONObject({
        C: common_vendor.unref(currentMode) === "draw" && common_vendor.unref(points).length > 0
      }), common_vendor.unref(currentMode) === "draw" && common_vendor.unref(points).length > 0 ? new UTSJSONObject({
        D: common_vendor.t(common_vendor.unref(points).length),
        E: common_vendor.f(common_vendor.unref(points), (point = null, index = null, i0 = null) => {
          return new UTSJSONObject({
            a: common_vendor.t(index + 1),
            b: common_vendor.t(point.latitude.toFixed(6)),
            c: common_vendor.t(point.longitude.toFixed(6)),
            d: common_vendor.o(($event = null) => {
              return removePoint(index);
            }, index),
            e: index
          });
        })
      }) : new UTSJSONObject({
        F: common_vendor.t(common_vendor.unref(trackPoints).length),
        G: common_vendor.t((common_vendor.unref(totalDistance) / 1e3).toFixed(2)),
        H: common_vendor.t(common_vendor.unref(playbackSpeed))
      }), new UTSJSONObject({
        I: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
}));
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
