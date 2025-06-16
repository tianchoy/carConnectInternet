"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_MapComponent_1 = common_vendor.resolveComponent("MapComponent");
  const _easycom_indexListMode_1 = common_vendor.resolveComponent("indexListMode");
  const _easycom_uv_button_1 = common_vendor.resolveComponent("uv-button");
  (_easycom_MapComponent_1 + _easycom_indexListMode_1 + _easycom_uv_button_1)();
}
const _easycom_MapComponent = () => "../../components/MapComponent/MapComponent.js";
const _easycom_indexListMode = () => "../../components/indexListMode/indexListMode.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
if (!Math) {
  (_easycom_MapComponent + _easycom_indexListMode + _easycom_uv_button)();
}
const gdKey = "7609efb7050c60178c2670401e2ff0b0";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(new UTSJSONObject({
  __name: "index",
  setup(__props) {
    const center = common_vendor.reactive(new UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(13);
    const currentMode = common_vendor.ref("draw");
    const showMap = common_vendor.ref(true);
    const carInFence = common_vendor.ref(false);
    const isDrawing = common_vendor.ref(false);
    const points = common_vendor.ref([]);
    const polygons = common_vendor.ref([]);
    const trackPoints = common_vendor.ref([]);
    const polyline = common_vendor.ref([]);
    const isPlaying = common_vendor.ref(false);
    const playbackSpeed = common_vendor.ref(1);
    const totalDistance = common_vendor.ref(0);
    const playbackInterval = common_vendor.ref(null);
    const currentIndex = common_vendor.ref(0);
    const carMarker = common_vendor.ref(null);
    const address = common_vendor.ref("");
    const markers = common_vendor.ref([]);
    const checkCarInFence = (point) => {
      if (polygons.value.length === 0 || polygons.value[0].points.length < 3) {
        carInFence.value = false;
        return null;
      }
      const polygon = polygons.value[0].points;
      const x = point.longitude;
      const y = point.latitude;
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].longitude;
        const yi = polygon[i].latitude;
        const xj = polygon[j].longitude;
        const yj = polygon[j].latitude;
        const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
        if (intersect)
          inside = !inside;
      }
      carInFence.value = inside;
      common_vendor.index.__f__("log", "at pages/index/index.uvue:164", `车辆位置: ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)} - ${inside ? "在围栏内" : "在围栏外"}`);
    };
    common_vendor.onMounted(() => {
      getlocation();
      loadSampleTrack();
      polygons.value = [new UTSJSONObject({
        points: [new UTSJSONObject({ "latitude": 35.26677197770503, "longitude": 115.40126244387386 }), new UTSJSONObject({ "latitude": 35.23764782824115, "longitude": 115.39397562325496 }), new UTSJSONObject({ "latitude": 35.23905101311781, "longitude": 115.44459367195407 }), new UTSJSONObject({ "latitude": 35.270452534471225, "longitude": 115.44611973480175 })],
        strokeWidth: 2,
        strokeColor: "#FF0000",
        fillColor: "rgba(255,0,0,0.2)",
        zIndex: 1
      })];
      checkCarInFence(center);
    });
    const getlocation = () => {
      common_vendor.index.getLocation(new UTSJSONObject({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/index/index.uvue:190", "当前坐标点：", res);
          center.latitude = res.latitude;
          center.longitude = res.longitude;
          getAddress(res.latitude, res.longitude);
          checkCarInFence({ latitude: res.latitude, longitude: res.longitude });
        }
      }));
    };
    const getAddress = (lat, lng) => {
      common_vendor.index.__f__("log", "at pages/index/index.uvue:202", lat, lng);
      common_vendor.index.request({
        url: `https://restapi.amap.com/v3/geocode/regeo?parameters&location=${lng},${lat}&key=${gdKey}&radius=10&extensions=all`,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/index/index.uvue:206", "获取地址信息:", res.data.regeocode);
          if (res.data.status === "1") {
            address.value = res.data.regeocode.formatted_address;
            common_vendor.index.__f__("log", "at pages/index/index.uvue:209", "地址信息:", address.value);
            common_vendor.index.showToast({ title: address.value, icon: "none", duration: 2e3 });
          } else {
            common_vendor.index.showToast({ title: "获取地址失败", icon: "none" });
          }
        }
      });
    };
    const toggleMapMode = () => {
      showMap.value = !showMap.value;
    };
    const toggleMode = (mode) => {
      currentMode.value = mode;
      if (mode === "track") {
        initCarMarker();
        resetPlayback();
        adjustMapToFitTrack();
      }
    };
    const startDrawing = () => {
      isDrawing.value = true;
      points.value = [];
      updateMapDisplay();
    };
    const handleMapTap = (point) => {
      if (!isDrawing.value || currentMode.value !== "draw")
        return null;
      addNewPoint(point.latitude, point.longitude);
    };
    const addPoint = () => {
      addNewPoint(center.latitude, center.longitude);
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
      common_vendor.index.__f__("log", "at pages/index/index.uvue:266", "电子围栏坐标:", UTS.JSON.stringify(points.value));
      polygons.value = [new UTSJSONObject({
        points: points.value,
        strokeWidth: 2,
        strokeColor: "#FF0000",
        fillColor: "rgba(255,0,0,0.2)",
        zIndex: 1
      })];
      checkCarInFence(center);
    };
    const clearAll = () => {
      isDrawing.value = false;
      points.value = [];
      polygons.value = [];
      carInFence.value = false;
      updateMapDisplay();
    };
    const loadSampleTrack = () => {
      const mockTrack = [new UTSJSONObject({ "latitude": 35.26677197770503, "longitude": 115.40126244387386 }), new UTSJSONObject({ "latitude": 35.23764782824115, "longitude": 115.39397562325496 }), new UTSJSONObject({ "latitude": 35.23905101311781, "longitude": 115.44459367195407 }), new UTSJSONObject({ "latitude": 35.270452534471225, "longitude": 115.44611973480175 }), new UTSJSONObject({ "latitude": 35.26677197770503, "longitude": 115.40126244387386 })];
      trackPoints.value = mockTrack;
      calculateTrackDistance();
      updatePolyline();
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
      checkCarInFence(point);
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
        checkCarInFence(trackPoints.value[0]);
      }
    };
    const clearTrack = () => {
      pausePlayback();
      trackPoints.value = [];
      polyline.value = [];
      totalDistance.value = 0;
      carMarker.value = null;
      markers.value = [];
      carInFence.value = false;
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
        a: common_vendor.unref(showMap)
      }), common_vendor.unref(showMap) ? new UTSJSONObject({
        b: common_vendor.o(handleMapTap),
        c: common_vendor.p(new UTSJSONObject({
          center: common_vendor.unref(center),
          mapScale: common_vendor.unref(mapScale),
          polygons: common_vendor.unref(polygons),
          markers: common_vendor.unref(markers),
          polyline: common_vendor.unref(polyline),
          isDrawing: common_vendor.unref(isDrawing),
          currentMode: common_vendor.unref(currentMode)
        }))
      }) : new UTSJSONObject({}), new UTSJSONObject({
        d: common_assets._imports_0,
        e: common_vendor.o(($event = null) => {
          return getlocation();
        }),
        f: common_vendor.unref(showMap) ? "/static/list.png" : "/static/map.png",
        g: common_vendor.o(toggleMapMode),
        h: common_vendor.n(common_vendor.unref(currentMode) === "draw" ? "active" : ""),
        i: common_vendor.o(($event = null) => {
          return toggleMode("draw");
        }),
        j: common_vendor.n(common_vendor.unref(currentMode) === "track" ? "active" : ""),
        k: common_vendor.o(($event = null) => {
          return toggleMode("track");
        }),
        l: common_vendor.unref(currentMode) === "draw"
      }), common_vendor.unref(currentMode) === "draw" ? new UTSJSONObject({
        m: common_vendor.o(startDrawing),
        n: common_vendor.p(new UTSJSONObject({
          disabled: common_vendor.unref(isDrawing)
        })),
        o: common_vendor.o(addPoint),
        p: common_vendor.p(new UTSJSONObject({
          disabled: !common_vendor.unref(isDrawing)
        })),
        q: common_vendor.o(finishDrawing),
        r: common_vendor.p(new UTSJSONObject({
          disabled: !common_vendor.unref(isDrawing) || common_vendor.unref(points).length < 3
        })),
        s: common_vendor.o(clearAll)
      }) : new UTSJSONObject({
        t: common_vendor.o(startPlayback),
        v: common_vendor.p(new UTSJSONObject({
          disabled: common_vendor.unref(isPlaying)
        })),
        w: common_vendor.o(pausePlayback),
        x: common_vendor.p(new UTSJSONObject({
          disabled: !common_vendor.unref(isPlaying)
        })),
        y: common_vendor.o(clearTrack),
        z: common_vendor.t(common_vendor.unref(playbackSpeed)),
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
            e: "a4fca7fa-13-" + i0,
            f: index
          });
        }),
        F: common_vendor.p(new UTSJSONObject({
          text: "删除"
        }))
      }) : new UTSJSONObject({
        G: common_vendor.t(common_vendor.unref(trackPoints).length),
        H: common_vendor.t((common_vendor.unref(totalDistance) / 1e3).toFixed(2)),
        I: common_vendor.t(common_vendor.unref(playbackSpeed))
      }), new UTSJSONObject({
        J: common_assets._imports_1,
        K: common_vendor.t(common_vendor.unref(carInFence) ? "车辆在围栏内" : "车辆在围栏外"),
        L: common_vendor.n(common_vendor.unref(carInFence) ? "in" : "out"),
        M: common_vendor.n(common_vendor.unref(carInFence) ? "in-fence" : "out-fence"),
        N: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
}));
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
