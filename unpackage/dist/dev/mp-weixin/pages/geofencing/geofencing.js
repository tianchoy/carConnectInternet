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
  const _easycom_uv_grid_item_1 = common_vendor.resolveComponent("uv-grid-item");
  const _easycom_uv_radio_group_1 = common_vendor.resolveComponent("uv-radio-group");
  const _easycom_uv_grid_1 = common_vendor.resolveComponent("uv-grid");
  const _easycom_uv_switch_1 = common_vendor.resolveComponent("uv-switch");
  (_easycom_custom_navBar_1 + _easycom_sub_navBar_1 + _easycom_uv_icon_1 + _easycom_uv_button_1 + _easycom_uv_popup_1 + _easycom_uv_input_1 + _easycom_uv_radio_1 + _easycom_uv_grid_item_1 + _easycom_uv_radio_group_1 + _easycom_uv_grid_1 + _easycom_uv_switch_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_sub_navBar = () => "../../components/sub-navBar/sub-navBar.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_uv_popup = () => "../../uni_modules/uv-popup/components/uv-popup/uv-popup.js";
const _easycom_uv_input = () => "../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_uv_radio = () => "../../uni_modules/uv-radio/components/uv-radio/uv-radio.js";
const _easycom_uv_grid_item = () => "../../uni_modules/uv-grid/components/uv-grid-item/uv-grid-item.js";
const _easycom_uv_radio_group = () => "../../uni_modules/uv-radio/components/uv-radio-group/uv-radio-group.js";
const _easycom_uv_grid = () => "../../uni_modules/uv-grid/components/uv-grid/uv-grid.js";
const _easycom_uv_switch = () => "../../uni_modules/uv-switch/components/uv-switch/uv-switch.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_sub_navBar + _easycom_uv_icon + _easycom_uv_button + _easycom_uv_popup + _easycom_uv_input + _easycom_uv_radio + _easycom_uv_grid_item + _easycom_uv_radio_group + _easycom_uv_grid + _easycom_uv_switch)();
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
    const circles = common_vendor.ref([]);
    common_vendor.ref(false);
    const isDrawing = common_vendor.ref(false);
    const drawingMode = common_vendor.ref("polygon");
    const points = common_vendor.ref([]);
    const polygons = common_vendor.ref([]);
    const circleCenter = common_vendor.ref(null);
    const circleRadius = common_vendor.ref(0);
    const currentSpeed = common_vendor.ref(0);
    const currentAddress = common_vendor.ref("获取中...");
    const currentCar = common_vendor.ref("京A12345");
    const lastDirection = common_vendor.ref(0);
    const showFenceModal = common_vendor.ref(null);
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
    const pagination = common_vendor.reactive(new UTSJSONObject({
      bind: new UTSJSONObject({
        pageNum: 1,
        pageSize: 10,
        hasMore: true,
        loadingMore: false
        // 加载更多中状态
      }),
      unbind: new UTSJSONObject({
        pageNum: 1,
        pageSize: 10,
        hasMore: true,
        loadingMore: false
      })
    }));
    const currentPagination = common_vendor.computed(() => {
      return pagination[activeTab.value];
    });
    const canFinishDrawing = common_vendor.computed(() => {
      if (drawingMode.value === "polygon") {
        return points.value.length >= 3;
      } else if (drawingMode.value === "circle") {
        return circleCenter.value !== null && circleRadius.value > 0;
      }
      return false;
    });
    const loadingMore = common_vendor.computed(() => {
      return currentPagination.value.loadingMore;
    });
    const hasMore = common_vendor.computed(() => {
      return currentPagination.value.hasMore;
    });
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
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:336", "获取初始位置失败:", err);
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
            fenceList.value = res.data || [];
          } else {
            common_vendor.index.showToast({ title: "获取围栏列表失败", icon: "none" });
            fenceList.value = [];
          }
          renderFencesOnMap();
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:369", "加载围栏列表失败:", error);
          common_vendor.index.showToast({ title: "获取围栏列表失败", icon: "none" });
          fenceList.value = [];
          renderFencesOnMap();
        }
      });
    };
    const getFenceType = (fence = null) => {
      if (fence.type && fence.type !== "null") {
        return fence.type;
      }
      if (fence.area && fence.area.startsWith("CIRCLE")) {
        return "circle";
      } else if (fence.area && fence.area.startsWith("POLYGON")) {
        return "polygon";
      }
      return "polygon";
    };
    const renderFencesOnMap = () => {
      if (!fenceList.value || fenceList.value.length === 0) {
        polygons.value = [];
        circles.value = [];
        updateMarkers();
        return null;
      }
      const fencePolygons = [];
      const fenceCircles = [];
      fenceList.value.forEach((fence = null, index) => {
        const fenceType = getFenceType(fence);
        if (fenceType === "circle") {
          const circleData = parseCircle(fence.area);
          if (circleData) {
            const displayRadius = circleData.radius > 1e5 ? 1e5 : circleData.radius;
            fenceCircles.push({
              id: fence.id,
              latitude: circleData.latitude,
              longitude: circleData.longitude,
              radius: displayRadius,
              strokeWidth: 2,
              strokeColor: "#FF0000",
              fillColor: `rgba(255,0,0,0.2)`,
              zIndex: 1,
              centerMarker: true
            });
          }
        } else {
          const fencePoints = parsePolygon(fence.area);
          if (fencePoints.length >= 3) {
            fencePolygons.push({
              id: fence.id,
              points: fencePoints,
              strokeWidth: 2,
              strokeColor: "#FF0000",
              fillColor: index === 0 ? "rgba(255,0,0,0.2)" : `rgba(${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},0.2)`,
              zIndex: 1
            });
          }
        }
      });
      polygons.value = fencePolygons;
      circles.value = fenceCircles;
      if (fenceCircles.length > 0 && !selectedFence.value) {
        const firstCircle = fenceCircles[0];
        center.latitude = firstCircle.latitude;
        center.longitude = firstCircle.longitude;
        mapScale.value = calculateZoomLevelFromRadius(firstCircle.radius);
      }
    };
    const parsePolygon = (polygonStr) => {
      if (!polygonStr)
        return [];
      const coordStr = polygonStr.replace(/POLYGON \(\(/, "").replace(/\)\)/, "");
      const coordPoints = coordStr.split(",");
      return coordPoints.map((point) => {
        const _a = common_vendor.__read(point.trim().split(" ").map(Number), 2), lat = _a[0], lng = _a[1];
        const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(lat, lng);
        return new UTSJSONObject({
          latitude: convertedCoord.lat,
          longitude: convertedCoord.lng
        });
      });
    };
    const parseCircle = (circleStr) => {
      if (!circleStr || !circleStr.startsWith("CIRCLE"))
        return null;
      try {
        const coordStr = circleStr.replace(/CIRCLE \(/, "").replace(/\)/, "");
        const parts = coordStr.split(",");
        if (parts.length !== 2)
          return null;
        const _a = common_vendor.__read(parts, 2), centerStr = _a[0], radiusStr = _a[1];
        const _b = common_vendor.__read(centerStr.trim().split(" ").map(Number), 2), lat = _b[0], lng = _b[1];
        const radius = Number(radiusStr.trim());
        if (isNaN(lat) || isNaN(lng) || isNaN(radius) || radius <= 0) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:494", "无效的圆形围栏数据:", circleStr);
          return null;
        }
        const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(lat, lng);
        return new UTSJSONObject({
          latitude: convertedCoord.lat,
          longitude: convertedCoord.lng,
          radius
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:507", "解析圆形围栏失败:", error, "数据:", circleStr);
        return null;
      }
    };
    const generatePolygonString = (points2) => {
      const coords = points2.map((point) => {
        const originalCoord = utils_coordTransform.CoordTransform.tencentToWgs84(point.latitude, point.longitude);
        return `${originalCoord.lat} ${originalCoord.lng}`;
      }).join(", ");
      return `POLYGON ((${coords}))`;
    };
    const generateCircleString = (center2, radius) => {
      const originalCoord = utils_coordTransform.CoordTransform.tencentToWgs84(center2.latitude, center2.longitude);
      return `CIRCLE (${originalCoord.lat} ${originalCoord.lng}, ${radius})`;
    };
    const setMapCenterToFence = (fence = null) => {
      const fenceType = getFenceType(fence);
      if (fenceType === "circle") {
        const circleData = parseCircle(fence.area);
        if (circleData) {
          center.latitude = circleData.latitude;
          center.longitude = circleData.longitude;
          const displayRadius = circleData.radius > 1e5 ? 1e5 : circleData.radius;
          mapScale.value = calculateZoomLevelFromRadius(displayRadius);
        }
      } else {
        const fencePoints = parsePolygon(fence.area);
        if (fencePoints.length === 0)
          return null;
        let totalLat = 0;
        let totalLng = 0;
        fencePoints.forEach((point) => {
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
      }
    };
    const calculateZoomLevelFromRadius = (radius) => {
      if (radius > 5e4)
        return 8;
      if (radius > 2e4)
        return 9;
      if (radius > 1e4)
        return 10;
      if (radius > 5e3)
        return 11;
      if (radius > 2e3)
        return 12;
      if (radius > 1e3)
        return 13;
      if (radius > 500)
        return 14;
      if (radius > 200)
        return 15;
      return 16;
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
      var _a, _b;
      selectedFence.value = fence;
      (_a = fencesPopup.value) === null || _a === void 0 ? null : _a.close();
      (_b = showFenceModal.value) === null || _b === void 0 ? null : _b.open();
      const fenceType = getFenceType(fence);
      if (fenceType === "circle") {
        const circleData = parseCircle(fence.area);
        if (circleData) {
          circleCenter.value = { latitude: circleData.latitude, longitude: circleData.longitude };
          circleRadius.value = circleData.radius;
          points.value = [];
        }
      } else {
        const fencePoints = parsePolygon(fence.area);
        points.value = fencePoints;
        circleCenter.value = null;
        circleRadius.value = 0;
      }
      setMapCenterToFence(fence);
      updateMapDisplay();
    };
    const editFence = (fence = null) => {
      var _a;
      editingFence.value = fence;
      fenceForm.name = fence.name;
      fenceForm.alarmType = fence.alarmType.toString();
      drawingMode.value = getFenceType(fence);
      (_a = editDialogPopup.value) === null || _a === void 0 ? null : _a.open();
    };
    const deleteFence = (id) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.showModal({
          title: "确认删除",
          content: "确定要删除这个围栏吗？",
          success: (res) => {
            return common_vendor.__awaiter(this, void 0, void 0, function* () {
              var _a;
              if (res.confirm) {
                try {
                  const result = yield api_request.deleteGeofence(id);
                  if (result.code === 0) {
                    common_vendor.index.showToast({ title: "删除成功" });
                    selectedFence.value = null;
                    points.value = [];
                    circleCenter.value = null;
                    circleRadius.value = 0;
                    isDrawing.value = false;
                    polygons.value = [];
                    circles.value = [];
                    updateMarkers();
                    (_a = showFenceModal.value) === null || _a === void 0 ? null : _a.close();
                    yield loadGeofenceList();
                  } else {
                    common_vendor.index.showToast({ title: "删除失败", icon: "none" });
                  }
                } catch (error) {
                  common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:669", "删除围栏失败:", error);
                  common_vendor.index.showToast({ title: "删除失败", icon: "none" });
                }
              }
            });
          }
        });
      });
    };
    const saveFence = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!fenceForm.name) {
          common_vendor.index.showToast({ title: "请输入围栏名称", icon: "none" });
          return Promise.resolve(null);
        }
        let area = "";
        if (drawingMode.value === "polygon" && points.value.length < 3) {
          common_vendor.index.showToast({ title: "请绘制有效的围栏区域", icon: "none" });
          return Promise.resolve(null);
        } else if (drawingMode.value === "circle" && (!circleCenter.value || circleRadius.value <= 0)) {
          common_vendor.index.showToast({ title: "请绘制有效的圆形围栏", icon: "none" });
          return Promise.resolve(null);
        }
        if (drawingMode.value === "polygon") {
          area = generatePolygonString(points.value);
        } else if (drawingMode.value === "circle" && circleCenter.value) {
          area = generateCircleString(circleCenter.value, circleRadius.value);
        }
        const fenceData = new UTSJSONObject({
          name: fenceForm.name,
          area,
          alarmType: parseInt(fenceForm.alarmType),
          type: drawingMode.value
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
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:725", "保存围栏失败:", error);
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
        initPagination("bind");
        yield loadBoundDevices(fenceId);
      });
    };
    const initPagination = (tabType) => {
      pagination[tabType] = {
        pageNum: 1,
        pageSize: 10,
        hasMore: true,
        loadingMore: false
      };
      if (activeTab.value === tabType) {
        deviceList.value = [];
      }
    };
    const loadBoundDevices = (fenceId) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const _a = pagination.bind, pageNum = _a.pageNum, pageSize = _a.pageSize, hasMore2 = _a.hasMore;
        if (!hasMore2)
          return Promise.resolve(null);
        pagination.bind.loadingMore = true;
        try {
          const res = yield api_request.getBoundDevices({
            pageNum,
            pageSize,
            geoId: fenceId
          });
          if (res.code === 0) {
            const dataList = res.data.list || [];
            if (pageNum === 1) {
              boundDevices.value = dataList;
              deviceList.value = dataList;
            } else {
              boundDevices.value = [...boundDevices.value, ...dataList];
              deviceList.value = [...deviceList.value, ...dataList];
            }
            pagination.bind.hasMore = dataList.length >= pageSize;
            pagination.bind.pageNum += 1;
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:785", "加载已绑定设备失败:", error);
        } finally {
          pagination.bind.loadingMore = false;
        }
      });
    };
    const loadUnboundDevices = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const _a = pagination.unbind, pageNum = _a.pageNum, pageSize = _a.pageSize, hasMore2 = _a.hasMore;
        if (!hasMore2)
          return Promise.resolve(null);
        pagination.unbind.loadingMore = true;
        try {
          const res = yield api_request.getUnboundDevices({
            pageNum,
            pageSize
          });
          if (res.code === 0) {
            const dataList = res.data.list || [];
            if (pageNum === 1) {
              deviceList.value = dataList;
            } else {
              deviceList.value = [...deviceList.value, ...dataList];
            }
            pagination.unbind.hasMore = dataList.length >= pageSize;
            pagination.unbind.pageNum += 1;
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:819", "加载未绑定设备失败:", error);
        } finally {
          pagination.unbind.loadingMore = false;
        }
      });
    };
    const handleLoadMore = () => {
      if (loadingMore.value || !hasMore.value)
        return null;
      if (activeTab.value === "bind") {
        loadBoundDevices(currentFenceId.value);
      } else {
        loadUnboundDevices();
      }
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
              initPagination("bind");
              yield loadBoundDevices(currentFenceId.value);
            } else {
              initPagination("unbind");
              yield loadUnboundDevices();
            }
          } else {
            common_vendor.index.showToast({ title: "操作失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:867", "设备绑定操作失败:", error);
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
    common_vendor.watch(activeTab, (newVal, oldVal) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        initPagination(newVal);
        if (newVal === "bind") {
          yield loadBoundDevices(currentFenceId.value);
        } else {
          yield loadUnboundDevices();
        }
      });
    });
    const setDrawingMode = (mode) => {
      drawingMode.value = mode;
      if (isDrawing.value) {
        points.value = [];
        circleCenter.value = null;
        circleRadius.value = 0;
        updateMapDisplay();
      }
    };
    const startDrawing = () => {
      isDrawing.value = true;
      points.value = [];
      circleCenter.value = null;
      circleRadius.value = 0;
      selectedFence.value = null;
      updateMapDisplay();
    };
    const handleMapTap = (e = null) => {
      if (isDrawing.value) {
        if (drawingMode.value === "polygon") {
          addNewPoint(e.detail.latitude, e.detail.longitude);
        } else if (drawingMode.value === "circle") {
          if (!circleCenter.value) {
            circleCenter.value = {
              latitude: e.detail.latitude,
              longitude: e.detail.longitude
            };
            updateMapDisplay();
          } else {
            const radius = calculateDistance(circleCenter.value.latitude, circleCenter.value.longitude, e.detail.latitude, e.detail.longitude);
            circleRadius.value = radius < 10 ? 10 : radius;
            updateMapDisplay();
          }
        }
      }
    };
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371e3;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    };
    const addNewPoint = (lat, lng) => {
      points.value.push({ latitude: lat, longitude: lng });
      updateMapDisplay();
    };
    const finishDrawing = () => {
      var _a;
      if (drawingMode.value === "polygon" && points.value.length < 3) {
        common_vendor.index.showToast({ title: "至少需要3个顶点", icon: "none" });
        return null;
      } else if (drawingMode.value === "circle" && (!circleCenter.value || circleRadius.value <= 0)) {
        common_vendor.index.showToast({ title: "请设置有效的圆形围栏", icon: "none" });
        return null;
      }
      isDrawing.value = false;
      fenceForm.name = `${drawingMode.value === "circle" ? "圆形" : "多边形"}围栏${fenceList.value.length + 1}`;
      (_a = editDialogPopup.value) === null || _a === void 0 ? null : _a.open();
    };
    const updateMarkers = () => {
      const newMarkers = [];
      if (carMarker.value) {
        newMarkers.push(carMarker.value);
      }
      if (isDrawing.value) {
        if (drawingMode.value === "polygon") {
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
        } else if (drawingMode.value === "circle" && circleCenter.value) {
          newMarkers.push({
            id: 1e3,
            latitude: circleCenter.value.latitude,
            longitude: circleCenter.value.longitude,
            iconPath: "/static/marker.png",
            width: 32,
            height: 32,
            callout: { content: "圆心", display: "ALWAYS" },
            anchor: { x: 0.5, y: 0.5 }
          });
        }
      } else if (selectedFence.value) {
        const fenceType = getFenceType(selectedFence.value);
        if (fenceType === "circle") {
          const circleData = parseCircle(selectedFence.value.area);
          if (circleData) {
            newMarkers.push({
              id: 2e3,
              latitude: circleData.latitude,
              longitude: circleData.longitude,
              iconPath: "/static/marker.png",
              width: 32,
              height: 32,
              callout: { content: "圆心", display: "ALWAYS" },
              anchor: { x: 0.5, y: 0.5 }
            });
          }
        } else {
          const fencePoints = parsePolygon(selectedFence.value.area);
          fencePoints.forEach((point, index) => {
            newMarkers.push({
              id: 2e3 + index,
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
      }
      markers.value = newMarkers;
    };
    const updateFencePolygon = () => {
      if (drawingMode.value === "polygon") {
        polygons.value = points.value.length >= 3 ? [new UTSJSONObject({
          points: points.value,
          strokeWidth: 2,
          strokeColor: "#FF0000",
          fillColor: "rgba(255,0,0,0.2)",
          zIndex: 1
        })] : [];
      } else {
        polygons.value = [];
      }
    };
    const updateFenceCircle = () => {
      if (drawingMode.value === "circle" && circleCenter.value && circleRadius.value > 0) {
        circles.value = [new UTSJSONObject({
          latitude: circleCenter.value.latitude,
          longitude: circleCenter.value.longitude,
          radius: circleRadius.value,
          strokeWidth: 2,
          strokeColor: "#FF0000",
          fillColor: "rgba(255,0,0,0.2)",
          zIndex: 1
        })];
      } else {
        circles.value = [];
      }
    };
    const updateMapDisplay = () => {
      updateMarkers();
      if (isDrawing.value) {
        if (drawingMode.value === "polygon") {
          updateFencePolygon();
          circles.value = [];
        } else if (drawingMode.value === "circle") {
          updateFenceCircle();
          polygons.value = [];
        }
      } else {
        renderFencesOnMap();
      }
    };
    const clearDrawing = () => {
      isDrawing.value = false;
      points.value = [];
      circleCenter.value = null;
      circleRadius.value = 0;
      selectedFence.value = null;
      polygons.value = [];
      circles.value = [];
      updateMarkers();
      renderFencesOnMap();
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
        i: circles.value,
        j: common_vendor.o(handleMapTap),
        k: isDrawing.value
      }), isDrawing.value ? common_vendor.e(new UTSJSONObject({
        l: drawingMode.value === "polygon"
      }), drawingMode.value === "polygon" ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        m: drawingMode.value === "circle"
      }), drawingMode.value === "circle" ? new UTSJSONObject({}) : new UTSJSONObject({})) : new UTSJSONObject({}), new UTSJSONObject({
        n: selectedFence.value
      }), selectedFence.value ? {
        o: common_vendor.t(selectedFence.value.name),
        p: common_vendor.o(($event = null) => {
          var _a;
          selectedFence.value = null;
          (_a = showFenceModal.value) === null || _a === void 0 ? null : _a.close();
        }),
        q: common_vendor.p(new UTSJSONObject({
          name: "close"
        })),
        r: common_vendor.o(($event = null) => {
          return editFence(selectedFence.value);
        }),
        s: common_vendor.p(new UTSJSONObject({
          size: "small"
        })),
        t: common_vendor.o(($event = null) => {
          return deleteFence(selectedFence.value.id);
        }),
        v: common_vendor.p(new UTSJSONObject({
          size: "small",
          type: "error"
        })),
        w: common_vendor.o(($event = null) => {
          return showBindDevices(selectedFence.value.id);
        }),
        x: common_vendor.p(new UTSJSONObject({
          size: "small",
          type: "primary"
        }))
      } : new UTSJSONObject({}), new UTSJSONObject({
        y: common_vendor.sr(showFenceModal, "45be0509-2", new UTSJSONObject({
          "k": "showFenceModal"
        })),
        z: common_vendor.p(new UTSJSONObject({
          mode: "center",
          round: "10"
        })),
        A: !isDrawing.value && !selectedFence.value
      }), !isDrawing.value && !selectedFence.value ? new UTSJSONObject({
        B: common_vendor.o(($event = null) => {
          return setDrawingMode("polygon");
        }),
        C: common_vendor.p(new UTSJSONObject({
          type: drawingMode.value == "polygon" ? "success" : "default",
          size: "small",
          customStyle: "border:1rpx solid #ebedf0"
        })),
        D: common_vendor.o(($event = null) => {
          return setDrawingMode("circle");
        }),
        E: common_vendor.p(new UTSJSONObject({
          type: drawingMode.value == "circle" ? "success" : "default",
          size: "small",
          customStyle: "border:1rpx solid #ebedf0"
        }))
      }) : new UTSJSONObject({}), new UTSJSONObject({
        F: common_vendor.o(startDrawing),
        G: common_vendor.p(new UTSJSONObject({
          disabled: isDrawing.value || selectedFence.value
        })),
        H: common_vendor.o(finishDrawing),
        I: common_vendor.p(new UTSJSONObject({
          disabled: !isDrawing.value || !canFinishDrawing.value
        })),
        J: common_vendor.o(clearDrawing),
        K: common_vendor.o(showFenceList),
        L: common_vendor.t(drawingMode.value === "polygon" ? "多边形" : "圆形"),
        M: drawingMode.value === "polygon"
      }), drawingMode.value === "polygon" ? new UTSJSONObject({
        N: common_vendor.t(points.value.length)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        O: drawingMode.value === "circle"
      }), drawingMode.value === "circle" ? new UTSJSONObject({
        P: common_vendor.t(circleRadius.value.toFixed(2) || 0)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        Q: common_vendor.o(($event = null) => {
          return fencesPopup.value.close();
        }),
        R: common_vendor.p(new UTSJSONObject({
          name: "close"
        })),
        S: common_vendor.f(fenceList.value, (fence = null, k0 = null, i0 = null) => {
          return new UTSJSONObject({
            a: common_vendor.t(fence.name),
            b: common_vendor.t(getFenceType(fence) === "circle" ? "圆形" : "多边形"),
            c: common_vendor.t(fence.deviceCount || 0),
            d: "45be0509-15-" + i0 + ",45be0509-13",
            e: fence.id,
            f: common_vendor.o(($event = null) => {
              return selectFence(fence);
            }, fence.id)
          });
        }),
        T: common_vendor.p(new UTSJSONObject({
          name: "arrow-right"
        })),
        U: fenceList.value.length === 0
      }), fenceList.value.length === 0 ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        V: common_vendor.sr(fencesPopup, "45be0509-13", new UTSJSONObject({
          "k": "fencesPopup"
        })),
        W: common_vendor.p(new UTSJSONObject({
          mode: "bottom",
          round: "10"
        })),
        X: common_vendor.t(editingFence.value ? "编辑围栏" : "新增围栏"),
        Y: common_vendor.o(($event = null) => {
          return fenceForm.name = $event;
        }),
        Z: common_vendor.p(new UTSJSONObject({
          placeholder: "请输入围栏名称",
          border: "surround",
          modelValue: fenceForm.name
        })),
        aa: common_vendor.p(new UTSJSONObject({
          name: "0"
        })),
        ab: common_vendor.p(new UTSJSONObject({
          name: "1"
        })),
        ac: common_vendor.p(new UTSJSONObject({
          name: "2"
        })),
        ad: common_vendor.p(new UTSJSONObject({
          name: "3"
        })),
        ae: common_vendor.o(($event = null) => {
          return fenceForm.alarmType = $event;
        }),
        af: common_vendor.p(new UTSJSONObject({
          iconPlacement: "left",
          modelValue: fenceForm.alarmType
        })),
        ag: common_vendor.p(new UTSJSONObject({
          col: 2
        })),
        ah: common_vendor.o(($event = null) => {
          return editDialogPopup.value.close();
        }),
        ai: common_vendor.o(saveFence),
        aj: common_vendor.p(new UTSJSONObject({
          type: "primary"
        })),
        ak: common_vendor.sr(editDialogPopup, "45be0509-16", new UTSJSONObject({
          "k": "editDialogPopup"
        })),
        al: common_vendor.p(new UTSJSONObject({
          mode: "center",
          round: "10"
        })),
        am: common_vendor.t(currentFenceName.value),
        an: common_vendor.o(($event = null) => {
          return deviceDialogPopup.value.close();
        }),
        ao: common_vendor.p(new UTSJSONObject({
          name: "close"
        })),
        ap: common_vendor.n(activeTab.value === "bind" ? "active" : ""),
        aq: common_vendor.o(($event = null) => {
          return activeTab.value = "bind";
        }),
        ar: common_vendor.n(activeTab.value === "unbind" ? "active" : ""),
        as: common_vendor.o(($event = null) => {
          return activeTab.value = "unbind";
        }),
        at: common_vendor.f(deviceList.value, (device = null, k0 = null, i0 = null) => {
          return common_vendor.e(new UTSJSONObject({
            a: common_vendor.t(device.plateNo || device.imei),
            b: device.connectionStatus
          }), device.connectionStatus ? new UTSJSONObject({
            c: common_vendor.t(device.connectionStatus === "online" ? "在线" : "离线")
          }) : new UTSJSONObject({}), new UTSJSONObject({
            d: common_vendor.o(($event = null) => {
              return toggleDeviceBinding(device.imei, $event);
            }, device.imei),
            e: "45be0509-32-" + i0 + ",45be0509-30",
            f: common_vendor.p(new UTSJSONObject({
              ["model-value"]: isDeviceBound(device.imei),
              disabled: loading.value || loadingMore.value,
              size: "20"
            })),
            g: device.imei
          }));
        }),
        av: deviceList.value.length === 0 && !loading.value
      }), deviceList.value.length === 0 && !loading.value ? new UTSJSONObject({
        aw: common_vendor.t(activeTab.value === "bind" ? "暂无绑定设备" : "暂无可用设备")
      }) : new UTSJSONObject({}), new UTSJSONObject({
        ax: loadingMore.value
      }), loadingMore.value ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        ay: deviceList.value.length > 0 && !hasMore.value && !loadingMore.value
      }), deviceList.value.length > 0 && !hasMore.value && !loadingMore.value ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        az: common_vendor.o(handleLoadMore),
        aA: common_vendor.o(($event = null) => {
          return deviceDialogPopup.value.close();
        }),
        aB: common_vendor.sr(deviceDialogPopup, "45be0509-30", new UTSJSONObject({
          "k": "deviceDialogPopup"
        })),
        aC: common_vendor.p(new UTSJSONObject({
          mode: "bottom",
          round: "10"
        })),
        aD: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/geofencing/geofencing.js.map
