"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_amapWx_130 = require("../../utils/amap-wx.130.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_deviceInfoComponent_1 = common_vendor.resolveComponent("deviceInfoComponent");
  const _easycom_indexListMode_1 = common_vendor.resolveComponent("indexListMode");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_grid_item_1 = common_vendor.resolveComponent("uv-grid-item");
  const _easycom_uv_grid_1 = common_vendor.resolveComponent("uv-grid");
  const _easycom_uv_button_1 = common_vendor.resolveComponent("uv-button");
  (_easycom_custom_navBar_1 + _easycom_deviceInfoComponent_1 + _easycom_indexListMode_1 + _easycom_uv_icon_1 + _easycom_uv_grid_item_1 + _easycom_uv_grid_1 + _easycom_uv_button_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_deviceInfoComponent = () => "../../components/deviceInfoComponent/deviceInfoComponent.js";
const _easycom_indexListMode = () => "../../components/indexListMode/indexListMode.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_grid_item = () => "../../uni_modules/uv-grid/components/uv-grid-item/uv-grid-item.js";
const _easycom_uv_grid = () => "../../uni_modules/uv-grid/components/uv-grid/uv-grid.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_deviceInfoComponent + _easycom_indexListMode + _easycom_uv_icon + _easycom_uv_grid_item + _easycom_uv_grid + _easycom_uv_button)();
}
const gdKey = "e3e773ad74f7ba25f38775c9c8db6474";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(new UTSJSONObject({
  __name: "index",
  setup(__props) {
    common_vendor.ref(88);
    const handleCapsule = (type = null) => {
      if (type === "close") {
        common_vendor.index.navigateBack();
      } else {
        common_vendor.index.showToast({ title: "菜单点击", icon: "none" });
      }
    };
    const center = common_vendor.reactive(new UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(12);
    const currentMode = common_vendor.ref("draw");
    const showMap = common_vendor.ref(true);
    const showMoreTools = common_vendor.ref(true);
    const carInFence = common_vendor.ref(false);
    const isDrawing = common_vendor.ref(false);
    const points = common_vendor.ref([]);
    const polygons = common_vendor.ref([]);
    const draggingIndex = common_vendor.ref(-1);
    const isDragging = common_vendor.ref(false);
    common_vendor.ref([]);
    const trackPoints = common_vendor.ref([]);
    const polyline = common_vendor.ref([]);
    common_vendor.ref(false);
    common_vendor.ref(1);
    const totalDistance = common_vendor.ref(0);
    common_vendor.ref(null);
    common_vendor.ref(0);
    const carMarker = common_vendor.ref(null);
    const address = common_vendor.ref("");
    const myAmapFun = common_vendor.ref();
    const markers = common_vendor.ref([]);
    const showDevicePopup = common_vendor.ref(false);
    const currentDeviceInfo = common_vendor.ref(new UTSJSONObject({
      deviceName: "",
      carNumber: "",
      deviceSerial: "",
      locationType: "",
      lngLat: "",
      updateTime: "",
      locationTime: "",
      speed: "",
      totalMileage: "",
      address: ""
    }));
    common_vendor.ref(0);
    const baseList = common_vendor.ref([new UTSJSONObject({
      name: "/static/gjhf.png",
      title: "轨迹回放"
    }), new UTSJSONObject({
      name: "/static/clgz.png",
      title: "车辆跟踪"
    }), new UTSJSONObject({
      name: "/static/lcjl.png",
      title: "里程记录"
    }), new UTSJSONObject({
      name: "/static/tcjl.png",
      title: "停车记录"
    }), new UTSJSONObject({
      name: "/static/dzwl.png",
      title: "电子围栏"
    })]);
    const click = (name = null) => {
      common_vendor.index.showToast({
        icon: "none",
        title: `点击了第${name}个`
      });
    };
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
      common_vendor.index.__f__("log", "at pages/index/index.uvue:206", `车辆位置: ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)} - ${inside ? "在围栏内" : "在围栏外"}`);
    };
    common_vendor.onMounted(() => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        myAmapFun.value = new utils_amapWx_130.amapFile.AMapWX(new UTSJSONObject({ key: gdKey }));
        yield getlocation();
        yield loadPolygons();
        yield loadSampleTrack();
        yield checkCarInFence(center);
      });
    });
    const getlocation = () => {
      common_vendor.index.getLocation(new UTSJSONObject({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/index/index.uvue:223", "当前坐标点：", res);
          center.latitude = res.latitude;
          center.longitude = res.longitude;
          getRegeo(res.latitude, res.longitude);
          checkCarInFence({ latitude: res.latitude, longitude: res.longitude });
        }
      }));
    };
    const getRegeo = (latitude = null, longitude = null) => {
      myAmapFun.value.getRegeo(new UTSJSONObject({
        location: `${longitude},${latitude}`,
        success: (data = null) => {
          common_vendor.index.__f__("log", "at pages/index/index.uvue:237", "获取地址信息:", data);
          if (data.length > 0) {
            address.value = data[0].regeocodeData.formatted_address;
            common_vendor.index.__f__("log", "at pages/index/index.uvue:240", "地址信息:", address.value);
            markers.value = [
              new UTSJSONObject({
                id: 1,
                latitude,
                longitude,
                iconPath: "/static/marker.png",
                width: 40,
                height: 40,
                callout: new UTSJSONObject({
                  content: address.value,
                  borderRadius: 5,
                  padding: 5,
                  display: "ALWAYS"
                })
              })
            ];
          } else {
            common_vendor.index.showToast({ title: "获取地址失败", icon: "none" });
          }
        },
        fail: (err = null) => {
          common_vendor.index.showToast({
            title: err.errMsg,
            icon: "none"
          });
        }
      }));
    };
    const handMarkerTap = (e = null) => {
      common_vendor.index.__f__("log", "at pages/index/index.uvue:287", "markertap event:", e);
      if (e.detail && e.detail.markerId !== void 0) {
        const markerId = e.detail.markerId;
        const marker = UTS.arrayFind(markers.value, (m = null) => {
          return m.id === markerId;
        });
        if (marker && marker.extData) {
          currentDeviceInfo.value = {
            deviceName: marker.extData.deviceName || "",
            carNumber: marker.extData.carNumber || "",
            deviceSerial: marker.extData.deviceSerial || "",
            locationType: marker.extData.locationType || "",
            lngLat: `${marker.extData.latitude},${marker.extData.longitude}` || "",
            updateTime: marker.extData.updateTime || "",
            locationTime: marker.extData.locationTime || "",
            speed: marker.extData.speed || "",
            totalMileage: marker.extData.totalMileage || "",
            address: marker.extData.address || ""
          };
          showDevicePopup.value = true;
          return null;
        }
      }
      common_vendor.index.__f__("warn", "at pages/index/index.uvue:312", "无法获取标记点信息", e);
      common_vendor.index.showToast({
        title: "无法获取设备信息",
        icon: "none"
      });
    };
    const closeDevicePopup = () => {
      showDevicePopup.value = false;
    };
    const toggleMapMode = () => {
      showMap.value = !showMap.value;
    };
    const toggleMoreTools = () => {
      showMoreTools.value = !showMoreTools.value;
    };
    const startDrawing = () => {
      isDrawing.value = true;
      points.value = [];
      updateMapDisplay();
    };
    const handleMapTap = (point) => {
      if (!isDrawing.value || currentMode.value !== "draw")
        return null;
      addNewPoint(point.detail.latitude, point.detail.longitude);
    };
    const addPoint = () => {
      addNewPoint(center.latitude, center.longitude);
    };
    const addNewPoint = (lat, lng) => {
      points.value.push({ latitude: lat, longitude: lng });
      updateMapDisplay();
    };
    const finishDrawing = () => {
      if (points.value.length < 3) {
        common_vendor.index.showToast({ title: "至少需要3个顶点", icon: "none" });
        return null;
      }
      isDrawing.value = false;
      common_vendor.index.showToast({ title: `围栏创建成功，共${points.value.length}个顶点` });
      common_vendor.index.__f__("log", "at pages/index/index.uvue:379", "电子围栏坐标:", UTS.JSON.stringify(points.value));
      updateFencePolygon();
      checkCarInFence(center);
    };
    const clearAll = () => {
      isDrawing.value = false;
      points.value = [];
      polygons.value = [];
      carInFence.value = false;
      isDragging.value = false;
      draggingIndex.value = -1;
      updateMapDisplay();
    };
    const loadPolygons = () => {
      polygons.value = [new UTSJSONObject({
        points: [new UTSJSONObject({ "latitude": 35.277849527708206, "longitude": 115.39025552959356 }), new UTSJSONObject({ "latitude": 35.22397928678945, "longitude": 115.37543744586583 }), new UTSJSONObject({ "latitude": 35.23341600978699, "longitude": 115.44904849298473 }), new UTSJSONObject({ "latitude": 35.279357522215726, "longitude": 115.45106784538075 })],
        strokeWidth: 2,
        strokeColor: "#FF0000",
        fillColor: "rgba(255,0,0,0.2)",
        zIndex: 1
      })];
    };
    function updateFencePolygon() {
      polygons.value = [new UTSJSONObject({
        points: points.value,
        strokeWidth: 2,
        strokeColor: isDragging.value ? "#00AA00" : "#FF0000",
        fillColor: isDragging.value ? "rgba(0,170,0,0.2)" : "rgba(255,0,0,0.2)",
        zIndex: 1
      })];
    }
    const loadSampleTrack = () => {
      const mockTrack = [new UTSJSONObject({ "latitude": 35.26677197770503, "longitude": 115.40126244387386 }), new UTSJSONObject({ "latitude": 35.23764782824115, "longitude": 115.39397562325496 }), new UTSJSONObject({ "latitude": 35.23905101311781, "longitude": 115.44459367195407 }), new UTSJSONObject({ "latitude": 35.270452534471225, "longitude": 115.44611973480175 }), new UTSJSONObject({ "latitude": 35.26677197770503, "longitude": 115.40126244387386 })];
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
            id: 1e3 + index,
            latitude: point.latitude,
            longitude: point.longitude,
            iconPath: isDragging.value && index === draggingIndex.value ? "/static/marker_active.png" : "/static/marker.png",
            width: 32,
            height: 32,
            callout: new UTSJSONObject({ content: `顶点${index + 1}`, display: "ALWAYS" }),
            draggable: !isDrawing.value,
            anchor: new UTSJSONObject({ x: 0.5, y: 0.5 })
            // 设置锚点为中心
          });
        }));
      }
      if (carMarker.value) {
        newMarkers.push(carMarker.value);
      }
      markers.value = newMarkers;
      if (currentMode.value === "draw" && points.value.length >= 3) {
        updateFencePolygon();
      } else {
        polygons.value = [];
      }
      if (currentMode.value === "track") {
        updatePolyline();
      }
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: common_vendor.o(handleCapsule),
        b: common_vendor.p(new UTSJSONObject({
          title: "首页",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: true
        })),
        c: common_vendor.unref(showMap)
      }), common_vendor.unref(showMap) ? new UTSJSONObject({
        d: common_vendor.sei("myMap", "map"),
        e: common_vendor.unref(center).latitude,
        f: common_vendor.unref(center).longitude,
        g: common_vendor.unref(polygons),
        h: common_vendor.unref(markers),
        i: common_vendor.unref(polyline),
        j: common_vendor.unref(mapScale),
        k: common_vendor.o(handleMapTap),
        l: common_vendor.o(handMarkerTap),
        m: common_vendor.o(closeDevicePopup),
        n: common_vendor.p(new UTSJSONObject({
          ["show-popup"]: common_vendor.unref(showDevicePopup),
          ["device-info"]: common_vendor.unref(currentDeviceInfo)
        }))
      }) : new UTSJSONObject({}), new UTSJSONObject({
        o: common_vendor.unref(showMap) ? "/static/list.png" : "/static/map.png",
        p: common_vendor.o(toggleMapMode),
        q: common_vendor.unref(showMap)
      }), common_vendor.unref(showMap) ? new UTSJSONObject({
        r: common_assets._imports_0,
        s: common_vendor.o(toggleMoreTools)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        t: common_vendor.unref(showMoreTools) && common_vendor.unref(showMap)
      }), common_vendor.unref(showMoreTools) && common_vendor.unref(showMap) ? new UTSJSONObject({
        v: common_vendor.f(common_vendor.unref(baseList), (item = null, index = null, i0 = null) => {
          return new UTSJSONObject({
            a: "a4fca7fa-5-" + i0 + "," + ("a4fca7fa-4-" + i0),
            b: common_vendor.p(new UTSJSONObject({
              customStyle: new UTSJSONObject({
                paddingTop: "20rpx"
              }),
              name: item.name,
              size: 54
            })),
            c: common_vendor.t(item.title),
            d: index,
            e: "a4fca7fa-4-" + i0 + ",a4fca7fa-3"
          });
        }),
        w: common_vendor.o(click),
        x: common_vendor.p(new UTSJSONObject({
          col: 5
        })),
        y: common_vendor.o(startDrawing),
        z: common_vendor.p(new UTSJSONObject({
          disabled: common_vendor.unref(isDrawing)
        })),
        A: common_vendor.o(addPoint),
        B: common_vendor.p(new UTSJSONObject({
          disabled: !common_vendor.unref(isDrawing)
        })),
        C: common_vendor.o(finishDrawing),
        D: common_vendor.p(new UTSJSONObject({
          disabled: !common_vendor.unref(isDrawing) || common_vendor.unref(points).length < 3
        })),
        E: common_vendor.o(clearAll)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        F: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
}));
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
