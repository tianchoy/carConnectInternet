"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_amapWx_130 = require("../../utils/amap-wx.130.js");
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
    const center = common_vendor.reactive(new UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(15);
    const markers = common_vendor.ref([]);
    const polylines = common_vendor.ref([]);
    const routeInfo = common_vendor.reactive(new UTSJSONObject({
      distance: 0,
      duration: 0
    }));
    const amapInstance = common_vendor.ref(null);
    const isTracking = common_vendor.ref(false);
    const trackingInterval = common_vendor.ref(null);
    const trackPoints = common_vendor.ref([]);
    const currentSpeed = common_vendor.ref(0);
    const currentAddress = common_vendor.ref("获取中...");
    common_vendor.ref("在线");
    const currentTime = common_vendor.ref("10s");
    const currentCar = common_vendor.ref("京A12345");
    const times = common_vendor.ref([
      [
        new UTSJSONObject({ label: "5s", value: "5" }),
        new UTSJSONObject({ label: "10s", value: "10" }),
        new UTSJSONObject({ label: "20s", value: "20" }),
        new UTSJSONObject({ label: "30s", value: "30" })
      ]
    ]);
    const cars = common_vendor.ref([
      [
        new UTSJSONObject({ label: "京A12345", value: "12345" }),
        new UTSJSONObject({ label: "京A12346", value: "12346" }),
        new UTSJSONObject({ label: "京A12347", value: "12347" })
      ]
    ]);
    common_vendor.watch(currentTime, (newVal) => {
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:98", "时间变化:", newVal);
    });
    common_vendor.watch(currentCar, (newVal) => {
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:103", "车辆变化:", newVal);
    });
    common_vendor.onMounted(() => {
      initAMap();
    });
    const initAMap = () => {
      amapInstance.value = new utils_amapWx_130.amap.AMapWX(new UTSJSONObject({
        key: "e3e773ad74f7ba25f38775c9c8db6474"
        // 替换为你的key
      }));
    };
    const setMarkers = () => {
      if (trackPoints.value.length === 0)
        return null;
      markers.value = [
        new UTSJSONObject(
          // 起点
          {
            id: 0,
            latitude: trackPoints.value[0].latitude,
            longitude: trackPoints.value[0].longitude,
            iconPath: "/static/start.png",
            width: 60,
            height: 60,
            callout: new UTSJSONObject({
              content: "起点",
              color: "#ffffff",
              bgColor: "#1aad19",
              padding: 5,
              borderRadius: 4,
              display: "ALWAYS"
            })
          }
        ),
        new UTSJSONObject(
          // 终点
          {
            id: 1,
            latitude: trackPoints.value[trackPoints.value.length - 1].latitude,
            longitude: trackPoints.value[trackPoints.value.length - 1].longitude,
            iconPath: "/static/end.png",
            width: 60,
            height: 60,
            callout: new UTSJSONObject({
              content: "终点",
              color: "#ffffff",
              bgColor: "#e64340",
              padding: 5,
              borderRadius: 4,
              display: "ALWAYS"
            })
          }
        ),
        new UTSJSONObject(
          // 当前位置
          {
            id: 2,
            latitude: trackPoints.value[trackPoints.value.length - 1].latitude,
            longitude: trackPoints.value[trackPoints.value.length - 1].longitude,
            iconPath: "/static/car.png",
            width: 40,
            height: 40,
            rotate: getCarDirection(),
            callout: new UTSJSONObject({
              content: "当前位置",
              color: "#ffffff",
              bgColor: "#1296db",
              padding: 5,
              borderRadius: 4,
              display: "ALWAYS"
            })
          }
        )
      ];
    };
    const getCarDirection = () => {
      if (trackPoints.value.length < 2)
        return 0;
      const last = trackPoints.value[trackPoints.value.length - 1];
      const prev = trackPoints.value[trackPoints.value.length - 2];
      const dx = last.longitude - prev.longitude;
      const dy = last.latitude - prev.latitude;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      return angle;
    };
    const toggleTracking = () => {
      if (isTracking.value) {
        stopTracking();
      } else {
        startTracking();
      }
    };
    const startTracking = () => {
      isTracking.value = true;
      trackPoints.value = [];
      const interval = parseInt(currentTime.value.replace("s", "")) * 1e3;
      getCurrentPosition();
      trackingInterval.value = setInterval(() => {
        getCurrentPosition();
      }, interval);
    };
    const stopTracking = () => {
      isTracking.value = false;
      if (trackingInterval.value) {
        clearInterval(trackingInterval.value);
        trackingInterval.value = null;
      }
      if (trackPoints.value.length >= 2) {
        getRealRoute();
      }
    };
    const getCurrentPosition = () => {
      common_vendor.index.showLoading({
        title: "获取位置中..."
      });
      setTimeout(() => {
        if (trackPoints.value.length === 0) {
          trackPoints.value.push(new UTSJSONObject({
            latitude: center.latitude,
            longitude: center.longitude
          }));
          currentAddress.value = getAddressName(center.latitude, center.longitude);
        } else {
          const lastPoint_1 = trackPoints.value[trackPoints.value.length - 1];
          const randomLat = Math.random() * 0.01 - 5e-3;
          const randomLng = Math.random() * 0.01 - 5e-3;
          const newPoint = new UTSJSONObject({
            latitude: lastPoint_1.latitude + randomLat,
            longitude: lastPoint_1.longitude + randomLng
          });
          trackPoints.value.push(newPoint);
          currentAddress.value = getAddressName(newPoint.latitude, newPoint.longitude);
        }
        currentSpeed.value = Math.floor(Math.random() * 80 + 20);
        const lastPoint = trackPoints.value[trackPoints.value.length - 1];
        center.latitude = lastPoint.latitude;
        center.longitude = lastPoint.longitude;
        setMarkers();
        if (isTracking.value && trackPoints.value.length >= 2) {
          drawTempRoute();
        }
        common_vendor.index.hideLoading();
      }, 500);
    };
    const getAddressName = (lat = null, lng = null) => {
      const streets = ["朝阳路", "建国路", "东三环", "西直门大街", "中关村大街"];
      const numbers = Math.floor(Math.random() * 100) + "号";
      return "北京市" + streets[Math.floor(Math.random() * streets.length)] + numbers;
    };
    const drawTempRoute = () => {
      polylines.value = [
        new UTSJSONObject({
          points: trackPoints.value,
          color: "#1296db",
          width: 6,
          arrowLine: true,
          borderColor: "#ffffff",
          borderWidth: 2
        })
      ];
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
      const waypoints = trackPoints.value.slice(1, -1).map((point = null) => {
        return `${point.longitude},${point.latitude}`;
      }).join(";");
      amapInstance.value.getDrivingRoute(new UTSJSONObject({
        origin: `${trackPoints.value[0].longitude},${trackPoints.value[0].latitude}`,
        destination: `${trackPoints.value[trackPoints.value.length - 1].longitude},${trackPoints.value[trackPoints.value.length - 1].latitude}`,
        waypoints: waypoints || void 0,
        strategy: 5,
        success: (res = null) => {
          common_vendor.index.hideLoading();
          if (res.paths && res.paths[0]) {
            drawRoadRoute(res.paths[0]);
          } else {
            common_vendor.index.showToast({
              title: "未找到合适路线",
              icon: "none"
            });
          }
        },
        fail: (err = null) => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "路线获取失败",
            icon: "none"
          });
          common_vendor.index.__f__("error", "at pages/vehicleTracking/vehicleTracking.uvue:337", "路线规划失败:", err);
        }
      }));
    };
    const drawRoadRoute = (path = null) => {
      const roadPoints = [];
      path.steps.forEach((step = null) => {
        const polyline = step.polyline.split(";");
        polyline.forEach((item) => {
          const coords = item.split(",");
          roadPoints.push({
            longitude: parseFloat(coords[0]),
            latitude: parseFloat(coords[1])
          });
        });
      });
      polylines.value = [
        new UTSJSONObject(
          // 道路底色
          {
            points: roadPoints,
            color: "#4a90e2",
            width: 12,
            level: "low"
          }
        ),
        new UTSJSONObject(
          // 主路线
          {
            points: roadPoints,
            color: "#1a73e8",
            width: 8,
            arrowLine: true,
            arrowIconPath: "/static/road-arrow.png",
            level: "high"
          }
        ),
        new UTSJSONObject(
          // 路线高亮
          {
            points: roadPoints,
            color: "#ffffff",
            width: 2,
            level: "highest"
          }
        )
      ];
      routeInfo.distance = path.distance;
      routeInfo.duration = path.duration;
      adjustMapView(roadPoints);
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
    const handleRegionChange = (e = null) => {
      common_vendor.index.__f__("log", "at pages/vehicleTracking/vehicleTracking.uvue:448", "地图区域变化:", e);
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: common_vendor.p(new UTSJSONObject({
          title: "车辆跟踪",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        })),
        b: common_vendor.o((val = null) => {
          return currentTime.value = val;
        }),
        c: common_vendor.o((val = null) => {
          return currentCar.value = val;
        }),
        d: common_vendor.p(new UTSJSONObject({
          currentTime: currentTime.value,
          currentCar: currentCar.value,
          times: times.value,
          cars: cars.value
        })),
        e: common_vendor.sei("myMap", "map"),
        f: center.latitude,
        g: center.longitude,
        h: markers.value,
        i: polylines.value,
        j: mapScale.value,
        k: common_vendor.o(handleRegionChange),
        l: common_vendor.t(isTracking.value ? "停止跟踪" : "开始跟踪"),
        m: common_vendor.o(toggleTracking),
        n: isTracking.value ? "#e64340" : "#1296db",
        o: common_vendor.t(currentSpeed.value),
        p: common_vendor.t(currentAddress.value),
        q: routeInfo.distance
      }), routeInfo.distance ? new UTSJSONObject({
        r: common_vendor.t(formatDistance(routeInfo.distance)),
        s: common_vendor.t(formatDuration(routeInfo.duration))
      }) : new UTSJSONObject({}), new UTSJSONObject({
        t: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/vehicleTracking/vehicleTracking.js.map
