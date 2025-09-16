"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_sub_navBar_1 = common_vendor.resolveComponent("sub-navBar");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_button_1 = common_vendor.resolveComponent("uv-button");
  const _easycom_uv_popup_1 = common_vendor.resolveComponent("uv-popup");
  const _easycom_uv_input_1 = common_vendor.resolveComponent("uv-input");
  const _easycom_uv_radio_1 = common_vendor.resolveComponent("uv-radio");
  const _easycom_uv_radio_group_1 = common_vendor.resolveComponent("uv-radio-group");
  const _easycom_uv_switch_1 = common_vendor.resolveComponent("uv-switch");
  (_easycom_custom_navBar_1 + _easycom_sub_navBar_1 + _easycom_uv_icon_1 + _easycom_uv_button_1 + _easycom_uv_popup_1 + _easycom_uv_input_1 + _easycom_uv_radio_1 + _easycom_uv_radio_group_1 + _easycom_uv_switch_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_sub_navBar = () => "../../components/sub-navBar/sub-navBar.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_uv_popup = () => "../../uni_modules/uv-popup/components/uv-popup/uv-popup.js";
const _easycom_uv_input = () => "../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_uv_radio = () => "../../uni_modules/uv-radio/components/uv-radio/uv-radio.js";
const _easycom_uv_radio_group = () => "../../uni_modules/uv-radio/components/uv-radio-group/uv-radio-group.js";
const _easycom_uv_switch = () => "../../uni_modules/uv-switch/components/uv-switch/uv-switch.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_sub_navBar + _easycom_uv_icon + _easycom_uv_button + _easycom_uv_popup + _easycom_uv_input + _easycom_uv_radio + _easycom_uv_radio_group + _easycom_uv_switch)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "geofencing",
  setup(__props) {
    const imei = common_vendor.ref("");
    const connectionStatus = common_vendor.ref("");
    const deptId = common_vendor.ref("");
    const center = common_vendor.reactive(new UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(15);
    const markers = common_vendor.ref([]);
    const carMarker = common_vendor.ref(null);
    common_vendor.ref(false);
    const isDrawing = common_vendor.ref(false);
    const points = common_vendor.ref([]);
    const polygons = common_vendor.ref([]);
    const currentSpeed = common_vendor.ref(0);
    const currentAddress = common_vendor.ref("获取中...");
    const currentCar = common_vendor.ref("京A12345");
    const lastDirection = common_vendor.ref(0);
    const fenceList = common_vendor.ref([]);
    const selectedFence = common_vendor.ref(null);
    const fencesPopup = common_vendor.ref(null);
    const editDialogPopup = common_vendor.ref(null);
    const editingFence = common_vendor.ref(null);
    const fenceForm = common_vendor.reactive(new UTSJSONObject({
      name: "",
      alarmType: "1"
    }));
    const deviceDialogPopup = common_vendor.ref(null);
    const activeTab = common_vendor.ref("bind");
    const deviceList = common_vendor.ref([]);
    const boundDevices = common_vendor.ref([]);
    const currentFenceName = common_vendor.ref("");
    const currentFenceId = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    common_vendor.onLoad((option) => {
      connectionStatus.value = option.connectionStatus;
      imei.value = option.imei;
      currentCar.value = option.plateNo;
      deptId.value = option.deptId;
      loadInitialPosition();
      loadGeofenceList();
    });
    const loadInitialPosition = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.showLoading({
          title: "获取车辆位置中..."
        });
        try {
          const data = new UTSJSONObject({ deptId: deptId.value, deviceids: imei.value });
          const res = yield api_request.getDevicePos(data);
          common_vendor.index.__f__("log", "at pages/geofencing/geofencing.uvue:206", "跟踪位置", res.data, imei.value);
          res.data.forEach((item = null) => {
            return common_vendor.__awaiter(this, void 0, void 0, function* () {
              if (item.imei == imei.value) {
                const deviceData = item;
                const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(Number(deviceData.latitude), Number(deviceData.longitude));
                center.latitude = convertedCoord.lat;
                center.longitude = convertedCoord.lng;
                const position = new UTSJSONObject(
                  {
                    latitude: convertedCoord.lat,
                    longitude: convertedCoord.lng
                  }
                  // 记录初始方向
                );
                lastDirection.value = deviceData.direction || 0;
                carMarker.value = new UTSJSONObject(
                  {
                    id: 0,
                    latitude: position.latitude,
                    longitude: position.longitude,
                    iconPath: connectionStatus.value == "online" ? "/static/car.png" : "/static/offline.png",
                    width: 40,
                    height: 40,
                    rotate: calculateMapRotation(lastDirection.value),
                    callout: new UTSJSONObject({
                      content: connectionStatus.value == "online" ? `车辆位置 | 速度: ${deviceData.speed || 0}km/h` : "车辆已离线",
                      color: connectionStatus.value == "online" ? "#fff" : "#666",
                      bgColor: connectionStatus.value == "online" ? "#1296db" : "#ccc",
                      padding: 5,
                      borderRadius: 4,
                      display: "ALWAYS"
                    })
                  }
                  // 更新标记点数组，保留车辆标记点
                );
                updateMarkers();
                currentSpeed.value = deviceData.speed || 0;
                currentAddress.value = deviceData.positionUpdateTime ? `最后定位: ${deviceData.positionUpdateTime}` : "未知位置";
                connectionStatus.value = deviceData.connectionStatus || "unknown";
              }
            });
          });
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:259", "获取初始位置失败:", err);
          common_vendor.index.showToast({
            title: "获取车辆位置失败",
            icon: "none"
          });
        } finally {
          common_vendor.index.hideLoading();
        }
      });
    };
    const calculateMapRotation = (direction) => {
      let rotation = direction;
      if (rotation >= 360)
        rotation -= 360;
      if (rotation < 0)
        rotation += 360;
      return rotation;
    };
    const loadGeofenceList = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield api_request.getGeofenceList();
          if (res.code === 0) {
            fenceList.value = res.data;
            renderFencesOnMap();
          } else {
            common_vendor.index.showToast({ title: "获取围栏列表失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:290", "加载围栏列表失败:", error);
          common_vendor.index.showToast({ title: "获取围栏列表失败", icon: "none" });
        }
      });
    };
    const renderFencesOnMap = () => {
      if (!fenceList.value || fenceList.value.length === 0)
        return null;
      const fencePolygons = [];
      fenceList.value.forEach((fence = null, index) => {
        const fencePoints = parsePolygon(fence.area);
        if (fencePoints.length >= 3) {
          fencePolygons.push({
            id: fence.id,
            points: fencePoints,
            strokeWidth: 3,
            strokeColor: "#FF0000",
            fillColor: index === 0 ? "rgba(255,0,0,0.2)" : `rgba(${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},0.2)`,
            zIndex: 1
          });
        }
      });
      polygons.value = fencePolygons;
    };
    const parsePolygon = (polygonStr) => {
      if (!polygonStr)
        return [];
      const coordStr = polygonStr.replace(/POLYGON \(\(/, "").replace(/\)\)/, "");
      const coordPoints = coordStr.split(",");
      return coordPoints.map((point) => {
        const _a = common_vendor.__read(point.trim().split(" ").map(Number), 2), lat = _a[0], lng = _a[1];
        return new UTSJSONObject({
          latitude: lat,
          longitude: lng
        });
      });
    };
    const generatePolygonString = (points2) => {
      const coords = points2.map((point) => {
        return `${point.latitude} ${point.longitude}`;
      }).join(",");
      return `POLYGON ((${coords}))`;
    };
    const setMapCenterToFence = (fencePoints) => {
      if (fencePoints.length === 0)
        return null;
      let totalLat = 0;
      let totalLng = 0;
      fencePoints.forEach((point = null) => {
        totalLat += point.latitude;
        totalLng += point.longitude;
      });
      center.latitude = totalLat / fencePoints.length;
      center.longitude = totalLng / fencePoints.length;
      const bounds = calculateBounds(fencePoints);
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
    const calculateBounds = (points2) => {
      let minLat = points2[0].latitude;
      let maxLat = points2[0].latitude;
      let minLng = points2[0].longitude;
      let maxLng = points2[0].longitude;
      points2.forEach((point = null) => {
        minLat = Math.min(minLat, point.latitude);
        maxLat = Math.max(maxLat, point.latitude);
        minLng = Math.min(minLng, point.longitude);
        maxLng = Math.max(maxLng, point.longitude);
      });
      return new UTSJSONObject({ minLat, maxLat, minLng, maxLng });
    };
    const showFenceList = () => {
      var _a;
      (_a = fencesPopup.value) === null || _a === void 0 ? null : _a.open();
    };
    const selectFence = (fence = null) => {
      var _a;
      selectedFence.value = fence;
      (_a = fencesPopup.value) === null || _a === void 0 ? null : _a.close();
      const fencePoints = parsePolygon(fence.area);
      points.value = fencePoints;
      setMapCenterToFence(fencePoints);
      updateFencePolygon();
    };
    const editFence = (fence = null) => {
      var _a;
      editingFence.value = fence;
      fenceForm.name = fence.name;
      fenceForm.alarmType = fence.alarmType.toString();
      (_a = editDialogPopup.value) === null || _a === void 0 ? null : _a.open();
    };
    const deleteFence = (id) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.showModal(new UTSJSONObject({
          title: "确认删除",
          content: "确定要删除这个围栏吗？",
          success: (res) => {
            return common_vendor.__awaiter(this, void 0, void 0, function* () {
              if (res.confirm) {
                try {
                  const result = yield api_request.deleteGeofence(id);
                  if (result.code === 0) {
                    common_vendor.index.showToast({ title: "删除成功" });
                    selectedFence.value = null;
                    clearDrawing();
                    loadGeofenceList();
                  } else {
                    common_vendor.index.showToast({ title: "删除失败", icon: "none" });
                  }
                } catch (error) {
                  common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:432", "删除围栏失败:", error);
                  common_vendor.index.showToast({ title: "删除失败", icon: "none" });
                }
              }
            });
          }
        }));
      });
    };
    const saveFence = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!fenceForm.name) {
          common_vendor.index.showToast({ title: "请输入围栏名称", icon: "none" });
          return Promise.resolve(null);
        }
        if (points.value.length < 3) {
          common_vendor.index.showToast({ title: "请绘制有效的围栏区域", icon: "none" });
          return Promise.resolve(null);
        }
        const fenceData = new UTSJSONObject({
          name: fenceForm.name,
          area: generatePolygonString(points.value),
          alarmType: parseInt(fenceForm.alarmType)
        });
        try {
          let result = null;
          if (editingFence.value) {
            result = yield api_request.updateGeofence(Object.assign({ id: editingFence.value.id }, fenceData));
          } else {
            result = yield api_request.addGeofence(fenceData);
          }
          if (result.code === 0) {
            common_vendor.index.showToast({ title: "保存成功" });
            (_a = editDialogPopup.value) === null || _a === void 0 ? null : _a.close();
            editingFence.value = null;
            isDrawing.value = false;
            loadGeofenceList();
          } else {
            common_vendor.index.showToast({ title: "保存失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:476", "保存围栏失败:", error);
          common_vendor.index.showToast({ title: "保存失败", icon: "none" });
        }
      });
    };
    const showBindDevices = (fenceId) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a;
        currentFenceId.value = fenceId;
        currentFenceName.value = selectedFence.value.name;
        (_a = deviceDialogPopup.value) === null || _a === void 0 ? null : _a.open();
        activeTab.value = "bind";
        yield loadBoundDevices(fenceId);
      });
    };
    const loadBoundDevices = (fenceId) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield api_request.getBoundDevices({
            pageNum: 1,
            pageSize: 100,
            geoId: fenceId
          });
          if (res.code === 0) {
            boundDevices.value = res.data.list || [];
            deviceList.value = boundDevices.value;
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:504", "加载已绑定设备失败:", error);
        }
      });
    };
    const loadUnboundDevices = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield api_request.getUnboundDevices({
            pageNum: 1,
            pageSize: 100
          });
          if (res.code === 0) {
            deviceList.value = res.data.list || [];
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:520", "加载未绑定设备失败:", error);
        }
      });
    };
    const toggleDeviceBinding = (deviceImei, bound) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        loading.value = true;
        try {
          const params = new UTSJSONObject({
            geofenceId: currentFenceId.value,
            imeis: [deviceImei]
          });
          let result = null;
          if (bound) {
            result = yield api_request.bindDevices(params);
          } else {
            result = yield api_request.unbindDevices(params);
          }
          if (result.code === 0) {
            common_vendor.index.showToast({ title: bound ? "绑定成功" : "解绑成功" });
            if (activeTab.value === "bind") {
              yield loadBoundDevices(currentFenceId.value);
            } else {
              yield loadUnboundDevices();
            }
          } else {
            common_vendor.index.showToast({ title: "操作失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:552", "设备绑定操作失败:", error);
          common_vendor.index.showToast({ title: "操作失败", icon: "none" });
        } finally {
          loading.value = false;
        }
      });
    };
    const isDeviceBound = (deviceImei) => {
      return boundDevices.value.some((device = null) => {
        return device.imei === deviceImei;
      });
    };
    common_vendor.watch(activeTab, (newVal) => {
      if (newVal === "bind") {
        loadBoundDevices(currentFenceId.value);
      } else {
        loadUnboundDevices();
      }
    });
    const startDrawing = () => {
      isDrawing.value = true;
      points.value = [];
      selectedFence.value = null;
      updateMapDisplay();
    };
    const handleMapTap = (e = null) => {
      if (isDrawing.value) {
        addNewPoint(e.detail.latitude, e.detail.longitude);
      }
    };
    const addNewPoint = (lat, lng) => {
      points.value.push({ latitude: lat, longitude: lng });
      updateMapDisplay();
    };
    const finishDrawing = () => {
      var _a;
      if (points.value.length < 3) {
        common_vendor.index.showToast({ title: "至少需要3个顶点", icon: "none" });
        return null;
      }
      isDrawing.value = false;
      fenceForm.name = `围栏${fenceList.value.length + 1}`;
      (_a = editDialogPopup.value) === null || _a === void 0 ? null : _a.open();
    };
    const updateMarkers = () => {
      const newMarkers = [];
      if (carMarker.value) {
        newMarkers.push(carMarker.value);
      }
      if (isDrawing.value) {
        points.value.forEach((point, index) => {
          newMarkers.push({
            id: 1e3 + index,
            latitude: point.latitude,
            longitude: point.longitude,
            iconPath: "/static/marker.png",
            width: 32,
            height: 32,
            callout: { content: `顶点${index + 1}`, display: "ALWAYS" },
            anchor: { x: 0.5, y: 0.5 }
          });
        });
      }
      markers.value = newMarkers;
    };
    const updateFencePolygon = () => {
      polygons.value = [new UTSJSONObject({
        points: points.value,
        strokeWidth: 2,
        strokeColor: "#FF0000",
        fillColor: "rgba(255,0,0,0.2)",
        zIndex: 1
      })];
    };
    const updateMapDisplay = () => {
      updateMarkers();
      if (points.value.length >= 3) {
        updateFencePolygon();
      } else if (!isDrawing.value) {
        polygons.value = [];
      }
    };
    const clearDrawing = () => {
      isDrawing.value = false;
      points.value = [];
      polygons.value = [];
      selectedFence.value = null;
      renderFencesOnMap();
      updateMapDisplay();
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: common_vendor.p(new UTSJSONObject({
          title: "地理围栏",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        })),
        b: common_vendor.p(new UTSJSONObject({
          showTime: false,
          currentCar: currentCar.value,
          showCar: true,
          carStatus: connectionStatus.value
        })),
        c: common_vendor.sei("myMap", "map"),
        d: center.latitude,
        e: center.longitude,
        f: mapScale.value,
        g: polygons.value,
        h: markers.value,
        i: common_vendor.o(handleMapTap),
        j: isDrawing.value
      }), isDrawing.value ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        k: selectedFence.value
      }), selectedFence.value ? new UTSJSONObject({
        l: common_vendor.t(selectedFence.value.name),
        m: common_vendor.o(($event = null) => {
          selectedFence.value = null;
        }),
        n: common_vendor.p(new UTSJSONObject({
          name: "close"
        })),
        o: common_vendor.o(($event = null) => {
          return editFence(selectedFence.value);
        }),
        p: common_vendor.p(new UTSJSONObject({
          size: "small"
        })),
        q: common_vendor.o(($event = null) => {
          return deleteFence(selectedFence.value.id);
        }),
        r: common_vendor.p(new UTSJSONObject({
          size: "small",
          type: "error"
        })),
        s: common_vendor.o(($event = null) => {
          return showBindDevices(selectedFence.value.id);
        }),
        t: common_vendor.p(new UTSJSONObject({
          size: "small",
          type: "primary"
        }))
      }) : new UTSJSONObject({}), new UTSJSONObject({
        v: common_vendor.o(startDrawing),
        w: common_vendor.p(new UTSJSONObject({
          disabled: isDrawing.value || selectedFence.value
        })),
        x: common_vendor.o(finishDrawing),
        y: common_vendor.p(new UTSJSONObject({
          disabled: !isDrawing.value || points.value.length < 3
        })),
        z: common_vendor.o(clearDrawing),
        A: common_vendor.o(showFenceList),
        B: common_vendor.t(polygons.value.length > 0 ? "已设置" : "未设置"),
        C: common_vendor.t(points.value.length),
        D: common_vendor.o(($event = null) => {
          return fencesPopup.value.close();
        }),
        E: common_vendor.p(new UTSJSONObject({
          name: "close"
        })),
        F: common_vendor.f(fenceList.value, (fence = null, k0 = null, i0 = null) => {
          return new UTSJSONObject({
            a: common_vendor.t(fence.name),
            b: common_vendor.t(fence.deviceCount || 0),
            c: "45be0509-12-" + i0 + ",45be0509-10",
            d: fence.id,
            e: common_vendor.o(($event = null) => {
              return selectFence(fence);
            }, fence.id)
          });
        }),
        G: common_vendor.p(new UTSJSONObject({
          name: "arrow-right"
        })),
        H: fenceList.value.length === 0
      }), fenceList.value.length === 0 ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        I: common_vendor.sr(fencesPopup, "45be0509-10", new UTSJSONObject({
          "k": "fencesPopup"
        })),
        J: common_vendor.p(new UTSJSONObject({
          mode: "bottom",
          round: "10"
        })),
        K: common_vendor.t(editingFence.value ? "编辑围栏" : "新增围栏"),
        L: common_vendor.o(($event = null) => {
          return fenceForm.name = $event;
        }),
        M: common_vendor.p(new UTSJSONObject({
          placeholder: "请输入围栏名称",
          border: "bottom",
          modelValue: fenceForm.name
        })),
        N: common_vendor.p(new UTSJSONObject({
          name: "0"
        })),
        O: common_vendor.p(new UTSJSONObject({
          name: "1"
        })),
        P: common_vendor.p(new UTSJSONObject({
          name: "2"
        })),
        Q: common_vendor.p(new UTSJSONObject({
          name: "3"
        })),
        R: common_vendor.o(($event = null) => {
          return fenceForm.alarmType = $event;
        }),
        S: common_vendor.p(new UTSJSONObject({
          modelValue: fenceForm.alarmType
        })),
        T: common_vendor.o(($event = null) => {
          return editDialogPopup.value.close();
        }),
        U: common_vendor.o(saveFence),
        V: common_vendor.p(new UTSJSONObject({
          type: "primary"
        })),
        W: common_vendor.sr(editDialogPopup, "45be0509-13", new UTSJSONObject({
          "k": "editDialogPopup"
        })),
        X: common_vendor.p(new UTSJSONObject({
          mode: "center",
          round: "10"
        })),
        Y: common_vendor.t(currentFenceName.value),
        Z: common_vendor.o(($event = null) => {
          return deviceDialogPopup.value.close();
        }),
        aa: common_vendor.p(new UTSJSONObject({
          name: "close"
        })),
        ab: common_vendor.n(activeTab.value === "bind" ? "active" : ""),
        ac: common_vendor.o(($event = null) => {
          return activeTab.value = "bind";
        }),
        ad: common_vendor.n(activeTab.value === "unbind" ? "active" : ""),
        ae: common_vendor.o(($event = null) => {
          return activeTab.value = "unbind";
        }),
        af: common_vendor.f(deviceList.value, (device = null, k0 = null, i0 = null) => {
          return new UTSJSONObject({
            a: common_vendor.t(device.plateNo || device.imei),
            b: common_vendor.t(device.connectionStatus === "online" ? "在线" : "离线"),
            c: common_vendor.o(($event = null) => {
              return toggleDeviceBinding(device.imei, $event);
            }, device.imei),
            d: "45be0509-24-" + i0 + ",45be0509-22",
            e: common_vendor.p(new UTSJSONObject({
              ["model-value"]: isDeviceBound(device.imei),
              disabled: loading.value
            })),
            f: device.imei
          });
        }),
        ag: deviceList.value.length === 0
      }), deviceList.value.length === 0 ? new UTSJSONObject({
        ah: common_vendor.t(activeTab.value === "bind" ? "暂无绑定设备" : "暂无可用设备")
      }) : new UTSJSONObject({}), new UTSJSONObject({
        ai: common_vendor.o(($event = null) => {
          return deviceDialogPopup.value.close();
        }),
        aj: common_vendor.sr(deviceDialogPopup, "45be0509-22", new UTSJSONObject({
          "k": "deviceDialogPopup"
        })),
        ak: common_vendor.p(new UTSJSONObject({
          mode: "bottom",
          round: "10"
        })),
        al: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/geofencing/geofencing.js.map
