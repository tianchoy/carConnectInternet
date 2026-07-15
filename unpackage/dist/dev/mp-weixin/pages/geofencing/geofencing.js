"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
const utils_cars = require("../../utils/cars.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_sub_navBar_1 = common_vendor.resolveComponent("sub-navBar");
  const _easycom_i_icon_1 = common_vendor.resolveComponent("i-icon");
  const _easycom_i_button_1 = common_vendor.resolveComponent("i-button");
  const _easycom_i_popup_1 = common_vendor.resolveComponent("i-popup");
  const _easycom_i_input_1 = common_vendor.resolveComponent("i-input");
  const _easycom_i_radio_1 = common_vendor.resolveComponent("i-radio");
  const _component_i_radio_group = common_vendor.resolveComponent("i-radio-group");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_switch_1 = common_vendor.resolveComponent("uv-switch");
  const _easycom_uv_popup_1 = common_vendor.resolveComponent("uv-popup");
  (_easycom_custom_navBar_1 + _easycom_sub_navBar_1 + _easycom_i_icon_1 + _easycom_i_button_1 + _easycom_i_popup_1 + _easycom_i_input_1 + _easycom_i_radio_1 + _component_i_radio_group + _easycom_uv_icon_1 + _easycom_uv_switch_1 + _easycom_uv_popup_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_sub_navBar = () => "../../components/sub-navBar/sub-navBar.js";
const _easycom_i_icon = () => "../../uni_modules/i-ui-x/components/i-icon/i-icon.js";
const _easycom_i_button = () => "../../uni_modules/i-ui-x/components/i-button/i-button.js";
const _easycom_i_popup = () => "../../uni_modules/i-ui-x/components/i-popup/i-popup.js";
const _easycom_i_input = () => "../../uni_modules/i-ui-x/components/i-input/i-input.js";
const _easycom_i_radio = () => "../../uni_modules/i-ui-x/components/i-radio/i-radio.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_switch = () => "../../uni_modules/uv-switch/components/uv-switch/uv-switch.js";
const _easycom_uv_popup = () => "../../uni_modules/uv-popup/components/uv-popup/uv-popup.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_sub_navBar + _easycom_i_icon + _easycom_i_button + _easycom_i_popup + _easycom_i_input + _easycom_i_radio + _easycom_uv_icon + _easycom_uv_switch + _easycom_uv_popup)();
}
class Coordinate extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          latitude: { type: Number, optional: false },
          longitude: { type: Number, optional: false }
        };
      },
      name: "Coordinate"
    };
  }
  constructor(options, metadata = Coordinate.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.latitude = this.__props__.latitude;
    this.longitude = this.__props__.longitude;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "geofencing",
  setup(__props) {
    const imei = common_vendor.ref(null);
    const connectionStatus = common_vendor.ref(null);
    const deptId = common_vendor.ref(null);
    const carType = common_vendor.ref(null);
    const deviceName = common_vendor.ref(null);
    const center = common_vendor.reactive(new common_vendor.UTSJSONObject({
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
    const fenceForm = common_vendor.reactive(new common_vendor.UTSJSONObject({
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
    const scrollTop = common_vendor.ref(0);
    const pagination = common_vendor.reactive(new common_vendor.UTSJSONObject({
      bind: new common_vendor.UTSJSONObject({
        pageNum: 1,
        pageSize: 10,
        hasMore: true,
        loadingMore: false
        // 加载更多中状态
      }),
      unbind: new common_vendor.UTSJSONObject({
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
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        connectionStatus.value = option.connectionStatus;
        imei.value = option.imei;
        currentCar.value = option.plateNo;
        deptId.value = option.deptId;
        carType.value = option.carType;
        deviceName.value = option.deviceName;
        yield loadInitialPosition();
        yield loadGeofenceList();
      });
    });
    const loadInitialPosition = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.showLoading(new common_vendor.UTSJSONObject({
          title: "获取车辆位置中..."
        }));
        try {
          const data = new common_vendor.UTSJSONObject({ deptId: deptId.value, deviceids: imei.value });
          const res = yield api_request.getDevicePos(data);
          res.data.forEach((item = null) => {
            return common_vendor.__awaiter(this, void 0, void 0, function* () {
              if (item.imei == imei.value) {
                const deviceData = item;
                const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(Number(deviceData.latitude), Number(deviceData.longitude));
                center.latitude = convertedCoord.lat;
                center.longitude = convertedCoord.lng;
                const position = new common_vendor.UTSJSONObject(
                  {
                    latitude: convertedCoord.lat,
                    longitude: convertedCoord.lng
                  }
                  // 记录初始方向
                );
                lastDirection.value = deviceData.direction || 0;
                carMarker.value = {
                  id: 0,
                  latitude: position.latitude,
                  longitude: position.longitude,
                  iconPath: utils_cars.getDeviceIcon(connectionStatus.value, carType.value),
                  width: 25,
                  height: 25,
                  rotate: calculateMapRotation(lastDirection.value),
                  callout: new common_vendor.UTSJSONObject({
                    content: deviceName.value || "爱车位置",
                    color: connectionStatus.value == "online" ? "#fff" : "#666",
                    bgColor: connectionStatus.value == "online" ? "#07C160" : "#ccc",
                    padding: 5,
                    borderRadius: 4,
                    display: "ALWAYS"
                  })
                };
                updateMarkers();
                currentSpeed.value = deviceData.speed || 0;
                currentAddress.value = deviceData.positionUpdateTime ? `最后定位: ${deviceData.positionUpdateTime}` : "未知位置";
                connectionStatus.value = deviceData.connectionStatus || "unknown";
              }
            });
          });
        } catch (err) {
          console.error("获取初始位置失败:", err);
          common_vendor.index.showToast({
            title: "获取车辆位置失败",
            icon: "none"
          });
        } finally {
          common_vendor.index.hideLoading();
        }
      });
    };
    const calculateMapRotation = (direction = null) => {
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
          console.error("加载围栏列表失败:", error);
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
      fenceList.value.forEach((fence, index) => {
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
    const parsePolygon = (polygonStr = null) => {
      if (!polygonStr)
        return [];
      const coordStr = polygonStr.replace(/POLYGON \(\(/, "").replace(/\)\)/, "");
      const coordPoints = coordStr.split(",");
      return coordPoints.map((point = null) => {
        const _a = common_vendor.__read(point.trim().split(" ").map(Number), 2), lat = _a[0], lng = _a[1];
        const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(lat, lng);
        return new common_vendor.UTSJSONObject({
          latitude: convertedCoord.lat,
          longitude: convertedCoord.lng
        });
      });
    };
    const parseCircle = (circleStr = null) => {
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
          console.error("无效的圆形围栏数据:", circleStr);
          return null;
        }
        const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(lat, lng);
        return new common_vendor.UTSJSONObject({
          latitude: convertedCoord.lat,
          longitude: convertedCoord.lng,
          radius
        });
      } catch (error) {
        console.error("解析圆形围栏失败:", error, "数据:", circleStr);
        return null;
      }
    };
    const generatePolygonString = (points2 = null) => {
      const coords = points2.map((point = null) => {
        const originalCoord = utils_coordTransform.CoordTransform.tencentToWgs84(point.latitude, point.longitude);
        return `${originalCoord.lat} ${originalCoord.lng}`;
      }).join(", ");
      return `POLYGON ((${coords}))`;
    };
    const generateCircleString = (center2 = null, radius = null) => {
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
      }
    };
    const calculateZoomLevelFromRadius = (radius = null) => {
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
    const calculateBounds = (points2 = null) => {
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
      return new common_vendor.UTSJSONObject({ minLat, maxLat, minLng, maxLng });
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
    const deleteFence = (id = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.showModal(new common_vendor.UTSJSONObject({
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
                  console.error("删除围栏失败:", error);
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
        const fenceData = new common_vendor.UTSJSONObject({
          name: fenceForm.name,
          area,
          alarmType: parseInt(fenceForm.alarmType),
          type: drawingMode.value
        });
        try {
          let result = null;
          if (editingFence.value) {
            result = yield api_request.updateGeofence(new common_vendor.UTSJSONObject(Object.assign({ id: editingFence.value.id }, fenceData)));
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
          console.error("保存围栏失败:", error);
          common_vendor.index.showToast({ title: "保存失败", icon: "none" });
        }
      });
    };
    const showBindDevices = (fenceId = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a;
        currentFenceId.value = fenceId;
        currentFenceName.value = selectedFence.value.name;
        (_a = deviceDialogPopup.value) === null || _a === void 0 ? null : _a.open();
        activeTab.value = "bind";
        scrollTop.value = 0;
        initPagination("bind");
        yield loadBoundDevices(fenceId);
      });
    };
    const closeDeviceDialog = () => {
      var _a;
      (_a = deviceDialogPopup.value) === null || _a === void 0 ? null : _a.close();
      scrollTop.value = 0;
    };
    const switchTab = (tab = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (activeTab.value === tab)
          return Promise.resolve(null);
        activeTab.value = tab;
        scrollTop.value = 0;
        deviceList.value = [];
        initPagination(tab);
        if (tab === "bind") {
          yield loadBoundDevices(currentFenceId.value);
        } else {
          yield loadUnboundDevices();
        }
      });
    };
    const initPagination = (tabType = null) => {
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
    const loadBoundDevices = (fenceId = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const page = pagination.bind;
        if (!page.hasMore || page.loadingMore)
          return Promise.resolve(null);
        page.loadingMore = true;
        try {
          const res = yield api_request.getBoundDevices(new common_vendor.UTSJSONObject({
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            geoId: fenceId
          }));
          if (res.code === 0) {
            const dataList = res.data.list || [];
            if (page.pageNum === 1) {
              boundDevices.value = dataList;
              deviceList.value = dataList;
            } else {
              deviceList.value = [...deviceList.value, ...dataList];
            }
            page.hasMore = dataList.length === page.pageSize;
            if (page.hasMore)
              page.pageNum++;
          } else {
            page.hasMore = false;
          }
        } catch (error) {
          page.hasMore = false;
        } finally {
          page.loadingMore = false;
        }
      });
    };
    const loadUnboundDevices = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const page = pagination.unbind;
        if (!page.hasMore || page.loadingMore)
          return Promise.resolve(null);
        page.loadingMore = true;
        try {
          const res = yield api_request.getUnboundDevices(new common_vendor.UTSJSONObject({
            pageNum: page.pageNum,
            pageSize: page.pageSize
          }));
          if (res.code === 0) {
            const dataList = res.data.list || [];
            if (page.pageNum === 1) {
              deviceList.value = dataList;
            } else {
              deviceList.value = [...deviceList.value, ...dataList];
            }
            page.hasMore = dataList.length === page.pageSize;
            if (page.hasMore)
              page.pageNum++;
          } else {
            page.hasMore = false;
          }
        } catch (error) {
          page.hasMore = false;
        } finally {
          page.loadingMore = false;
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
    const toggleDeviceBinding = (deviceImei = null, bound = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        loading.value = true;
        try {
          const params = new common_vendor.UTSJSONObject({
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
            initPagination(activeTab.value);
            scrollTop.value = 0;
            if (activeTab.value === "bind") {
              yield loadBoundDevices(currentFenceId.value);
            } else {
              yield loadUnboundDevices();
            }
          } else {
            common_vendor.index.showToast({ title: result.msg || "操作失败", icon: "none" });
          }
        } catch (error) {
          console.error("设备绑定操作失败:", error);
          common_vendor.index.showToast({ title: "操作失败", icon: "none" });
        } finally {
          loading.value = false;
        }
      });
    };
    const isDeviceBound = (deviceImei = null) => {
      return boundDevices.value.some((device) => {
        return device.imei === deviceImei;
      });
    };
    const setDrawingMode = (mode = null) => {
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
    const calculateDistance = (lat1 = null, lng1 = null, lat2 = null, lng2 = null) => {
      const R = 6371e3;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    };
    const addNewPoint = (lat = null, lng = null) => {
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
          fencePoints.forEach((point = null, index = null) => {
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
        polygons.value = points.value.length >= 3 ? [{
          points: points.value,
          strokeWidth: 2,
          strokeColor: "#FF0000",
          fillColor: "rgba(255,0,0,0.2)",
          zIndex: 1
        }] : [];
      } else {
        polygons.value = [];
      }
    };
    const updateFenceCircle = () => {
      if (drawingMode.value === "circle" && circleCenter.value && circleRadius.value > 0) {
        circles.value = [{
          latitude: circleCenter.value.latitude,
          longitude: circleCenter.value.longitude,
          radius: circleRadius.value,
          strokeWidth: 2,
          strokeColor: "#FF0000",
          fillColor: "rgba(255,0,0,0.2)",
          zIndex: 1
        }];
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
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.p({
          title: "地理围栏",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.p({
          showTime: false,
          currentCar: currentCar.value,
          showCar: true,
          carStatus: connectionStatus.value
        }),
        c: common_vendor.sei("myMap", "map"),
        d: center.latitude,
        e: center.longitude,
        f: mapScale.value,
        g: polygons.value,
        h: markers.value,
        i: circles.value,
        j: common_vendor.o(handleMapTap, "1b"),
        k: isDrawing.value
      }, isDrawing.value ? common_vendor.e({
        l: drawingMode.value === "polygon"
      }, drawingMode.value === "polygon" ? {} : {}, {
        m: drawingMode.value === "circle"
      }, drawingMode.value === "circle" ? {} : {}) : {}, {
        n: selectedFence.value
      }, selectedFence.value ? {
        o: common_vendor.t(selectedFence.value.name),
        p: common_vendor.o(($event) => {
          var _a;
          selectedFence.value = null;
          (_a = showFenceModal.value) == null ? void 0 : _a.close();
        }, "05"),
        q: common_vendor.p({
          name: "close"
        }),
        r: common_vendor.o(($event) => {
          return editFence(selectedFence.value);
        }, "4d"),
        s: common_vendor.p({
          size: "small"
        }),
        t: common_vendor.o(($event) => {
          return deleteFence(selectedFence.value.id);
        }, "5b"),
        v: common_vendor.p({
          size: "small",
          type: "error"
        }),
        w: common_vendor.o(($event) => {
          return showBindDevices(selectedFence.value.id);
        }, "2e"),
        x: common_vendor.p({
          size: "small",
          type: "primary"
        })
      } : {}, {
        y: common_vendor.sr(showFenceModal, "45be0509-2", {
          "k": "showFenceModal"
        }),
        z: common_vendor.p({
          mode: "center",
          round: "10",
          class: "r"
        }),
        A: !isDrawing.value && !selectedFence.value
      }, !isDrawing.value && !selectedFence.value ? {
        B: common_vendor.o(($event) => {
          return setDrawingMode("polygon");
        }, "24"),
        C: common_vendor.p({
          type: drawingMode.value == "polygon" ? "success" : "default",
          size: "small",
          customStyle: "border:1rpx solid #ebedf0"
        }),
        D: common_vendor.o(($event) => {
          return setDrawingMode("circle");
        }, "3f"),
        E: common_vendor.p({
          type: drawingMode.value == "circle" ? "success" : "default",
          size: "small",
          customStyle: "border:1rpx solid #ebedf0"
        })
      } : {}, {
        F: common_vendor.o(startDrawing, "1b"),
        G: common_vendor.p({
          disabled: isDrawing.value || selectedFence.value,
          size: "small"
        }),
        H: common_vendor.o(finishDrawing, "48"),
        I: common_vendor.p({
          disabled: !isDrawing.value || !canFinishDrawing.value,
          size: "small"
        }),
        J: common_vendor.o(clearDrawing, "1a"),
        K: common_vendor.p({
          size: "small"
        }),
        L: common_vendor.o(showFenceList, "9b"),
        M: common_vendor.p({
          size: "small"
        }),
        N: common_vendor.t(drawingMode.value === "polygon" ? "多边形" : "圆形"),
        O: drawingMode.value === "polygon"
      }, drawingMode.value === "polygon" ? {
        P: common_vendor.t(points.value.length)
      } : {}, {
        Q: drawingMode.value === "circle"
      }, drawingMode.value === "circle" ? {
        R: common_vendor.t(circleRadius.value.toFixed(2) || 0)
      } : {}, {
        S: common_vendor.o(($event) => {
          return fencesPopup.value.close();
        }, "df"),
        T: common_vendor.p({
          name: "/static/close.png",
          fontSize: "15"
        }),
        U: common_vendor.f(fenceList.value, (fence, k0, i0) => {
          return {
            a: common_vendor.t(fence.name),
            b: common_vendor.t(getFenceType(fence) === "circle" ? "圆形" : "多边形"),
            c: common_vendor.t(fence.deviceCount || 0),
            d: "45be0509-15-" + i0 + ",45be0509-13",
            e: fence.id,
            f: common_vendor.o(($event) => {
              return selectFence(fence);
            }, fence.id)
          };
        }),
        V: common_vendor.p({
          name: "/static/arrow-right.png",
          fontSize: "15"
        }),
        W: fenceList.value.length === 0
      }, fenceList.value.length === 0 ? {} : {}, {
        X: common_vendor.sr(fencesPopup, "45be0509-13", {
          "k": "fencesPopup"
        }),
        Y: common_vendor.p({
          mode: "bottom",
          round: "10",
          class: "r"
        }),
        Z: common_vendor.t(editingFence.value ? "编辑围栏" : "新增围栏"),
        aa: common_vendor.o(($event) => {
          return fenceForm.name = $event;
        }, "3e"),
        ab: common_vendor.p({
          placeholder: "请输入围栏名称",
          border: "surround",
          modelValue: fenceForm.name
        }),
        ac: common_vendor.p({
          name: "0"
        }),
        ad: common_vendor.p({
          name: "1"
        }),
        ae: common_vendor.p({
          name: "2"
        }),
        af: common_vendor.p({
          name: "3"
        }),
        ag: common_vendor.o(($event) => {
          return fenceForm.alarmType = $event;
        }, "80"),
        ah: common_vendor.p({
          iconPlacement: "left",
          modelValue: fenceForm.alarmType
        }),
        ai: common_vendor.o(($event) => {
          return editDialogPopup.value.close();
        }, "93"),
        aj: common_vendor.o(saveFence, "45"),
        ak: common_vendor.p({
          type: "primary"
        }),
        al: common_vendor.sr(editDialogPopup, "45be0509-16", {
          "k": "editDialogPopup"
        }),
        am: common_vendor.p({
          mode: "center",
          round: "10",
          class: "r"
        }),
        an: common_vendor.t(currentFenceName.value),
        ao: common_vendor.o(closeDeviceDialog, "f5"),
        ap: common_vendor.p({
          name: "close"
        }),
        aq: common_vendor.n(activeTab.value === "bind" ? "active" : ""),
        ar: common_vendor.o(($event) => {
          return switchTab("bind");
        }, "8d"),
        as: common_vendor.n(activeTab.value === "unbind" ? "active" : ""),
        at: common_vendor.o(($event) => {
          return switchTab("unbind");
        }, "34"),
        av: common_vendor.f(deviceList.value, (device, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(device.deviceName || device.plateNo),
            b: device.connectionStatus
          }, device.connectionStatus ? {
            c: common_vendor.t(device.connectionStatus === "online" ? "在线" : "离线")
          } : {}, {
            d: common_vendor.o(($event) => {
              return toggleDeviceBinding(device.imei, $event);
            }, device.imei),
            e: "45be0509-27-" + i0 + ",45be0509-25",
            f: common_vendor.p({
              ["model-value"]: isDeviceBound(device.imei),
              disabled: loading.value || loadingMore.value,
              size: "20"
            }),
            g: device.imei
          });
        }),
        aw: deviceList.value.length === 0 && !loading.value
      }, deviceList.value.length === 0 && !loading.value ? {
        ax: common_vendor.t(activeTab.value === "bind" ? "暂无绑定设备" : "暂无可用设备")
      } : {}, {
        ay: loadingMore.value
      }, loadingMore.value ? {} : {}, {
        az: deviceList.value.length > 0 && !hasMore.value && !loadingMore.value
      }, deviceList.value.length > 0 && !hasMore.value && !loadingMore.value ? {} : {}, {
        aA: scrollTop.value,
        aB: common_vendor.o(handleLoadMore, "fd"),
        aC: common_vendor.sr(deviceDialogPopup, "45be0509-25", {
          "k": "deviceDialogPopup"
        }),
        aD: common_vendor.p({
          mode: "bottom",
          round: "10",
          ["mask-click-able"]: false,
          class: "r"
        }),
        aE: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        aF: `${_ctx.u_s_b_h}px`,
        aG: `${_ctx.u_s_a_i_b}px`,
        aH: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
