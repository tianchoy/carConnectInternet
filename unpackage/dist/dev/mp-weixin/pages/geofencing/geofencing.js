"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_toast = require("../../utils/toast.js");
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
  const _easycom_i_switch_1 = common_vendor.resolveComponent("i-switch");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  (_easycom_custom_navBar_1 + _easycom_sub_navBar_1 + _easycom_i_icon_1 + _easycom_i_button_1 + _easycom_i_popup_1 + _easycom_i_input_1 + _easycom_i_radio_1 + _easycom_i_switch_1 + _easycom_app_toast_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_sub_navBar = () => "../../components/sub-navBar/sub-navBar.js";
const _easycom_i_icon = () => "../../uni_modules/i-ui-x/components/i-icon/i-icon.js";
const _easycom_i_button = () => "../../uni_modules/i-ui-x/components/i-button/i-button.js";
const _easycom_i_popup = () => "../../uni_modules/i-ui-x/components/i-popup/i-popup.js";
const _easycom_i_input = () => "../../uni_modules/i-ui-x/components/i-input/i-input.js";
const _easycom_i_radio = () => "../../uni_modules/i-ui-x/components/i-radio/i-radio.js";
const _easycom_i_switch = () => "../../uni_modules/i-ui-x/components/i-switch/i-switch.js";
const _easycom_app_toast = () => "../../components/app-toast/app-toast.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_sub_navBar + _easycom_i_icon + _easycom_i_button + _easycom_i_popup + _easycom_i_input + _easycom_i_radio + _easycom_i_switch + _easycom_app_toast)();
}
class PaginationState extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          pageNum: { type: Number, optional: false },
          pageSize: { type: Number, optional: false },
          hasMore: { type: Boolean, optional: false },
          loadingMore: { type: Boolean, optional: false }
        };
      },
      name: "PaginationState"
    };
  }
  constructor(options, metadata = PaginationState.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.pageNum = this.__props__.pageNum;
    this.pageSize = this.__props__.pageSize;
    this.hasMore = this.__props__.hasMore;
    this.loadingMore = this.__props__.loadingMore;
    delete this.__props__;
  }
}
class Pagination extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          bind: { type: PaginationState, optional: false },
          unbind: { type: PaginationState, optional: false }
        };
      },
      name: "Pagination"
    };
  }
  constructor(options, metadata = Pagination.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.bind = this.__props__.bind;
    this.unbind = this.__props__.unbind;
    delete this.__props__;
  }
}
class CircleData extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          latitude: { type: Number, optional: false },
          longitude: { type: Number, optional: false },
          radius: { type: Number, optional: false }
        };
      },
      name: "CircleData"
    };
  }
  constructor(options, metadata = CircleData.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.latitude = this.__props__.latitude;
    this.longitude = this.__props__.longitude;
    this.radius = this.__props__.radius;
    delete this.__props__;
  }
}
class ModalResult extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          confirm: { type: Boolean, optional: false }
        };
      },
      name: "ModalResult"
    };
  }
  constructor(options, metadata = ModalResult.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.confirm = this.__props__.confirm;
    delete this.__props__;
  }
}
class FenceForm extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          name: { type: String, optional: false },
          alarmType: { type: String, optional: false }
        };
      },
      name: "FenceForm"
    };
  }
  constructor(options, metadata = FenceForm.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.name = this.__props__.name;
    this.alarmType = this.__props__.alarmType;
    delete this.__props__;
  }
}
class FenceResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: false }
        };
      },
      name: "FenceResponse"
    };
  }
  constructor(options, metadata = FenceResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    delete this.__props__;
  }
}
class SwitchChangeEvent extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          value: { type: Boolean, optional: false }
        };
      },
      name: "SwitchChangeEvent"
    };
  }
  constructor(options, metadata = SwitchChangeEvent.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.value = this.__props__.value;
    delete this.__props__;
  }
}
class CoordinateBounds extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          minLat: { type: Number, optional: false },
          maxLat: { type: Number, optional: false },
          minLng: { type: Number, optional: false },
          maxLng: { type: Number, optional: false }
        };
      },
      name: "CoordinateBounds"
    };
  }
  constructor(options, metadata = CoordinateBounds.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.minLat = this.__props__.minLat;
    this.maxLat = this.__props__.maxLat;
    this.minLng = this.__props__.minLng;
    this.maxLng = this.__props__.maxLng;
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
    const alarmTypeOptions = ["0", "1", "2", "3"];
    const fenceForm = common_vendor.reactive(new FenceForm({
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
    const pagination = common_vendor.reactive(new Pagination({
      bind: new PaginationState({
        pageNum: 1,
        pageSize: 10,
        hasMore: true,
        loadingMore: false
        // 加载更多中状态
      }),
      unbind: new PaginationState({
        pageNum: 1,
        pageSize: 10,
        hasMore: true,
        loadingMore: false
      })
    }));
    const canFinishDrawing = common_vendor.computed(() => {
      if (drawingMode.value === "polygon") {
        return points.value.length >= 3;
      } else if (drawingMode.value === "circle") {
        return circleCenter.value !== null && circleRadius.value > 0;
      }
      return false;
    });
    const loadingMore = common_vendor.computed(() => {
      return activeTab.value === "bind" ? pagination.bind.loadingMore : pagination.unbind.loadingMore;
    });
    const hasMore = common_vendor.computed(() => {
      return activeTab.value === "bind" ? pagination.bind.hasMore : pagination.unbind.hasMore;
    });
    const loadInitialPosition = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.showLoading(new common_vendor.UTSJSONObject({
          title: "获取车辆位置中..."
        }));
        try {
          const data = new common_vendor.UTSJSONObject({ deptId: deptId.value, deviceids: imei.value });
          const res = yield api_request.getDevicePos(data);
          res.data.forEach((item) => {
            if (item.getString("imei", "") == imei.value) {
              const deviceData = item;
              const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(deviceData.getNumber("latitude", 0), deviceData.getNumber("longitude", 0));
              center.latitude = convertedCoord.lat;
              center.longitude = convertedCoord.lng;
              const position = {
                latitude: convertedCoord.lat,
                longitude: convertedCoord.lng
              };
              lastDirection.value = deviceData.getNumber("direction", 0);
              carMarker.value = {
                id: 0,
                latitude: position.latitude,
                longitude: position.longitude,
                iconPath: utils_cars.getDeviceIcon(connectionStatus.value.toString(), carType.value.toString()),
                width: 25,
                height: 25,
                rotate: lastDirection.value >= 360 ? lastDirection.value - 360 : lastDirection.value < 0 ? lastDirection.value + 360 : lastDirection.value,
                callout: new common_vendor.UTSJSONObject({
                  content: deviceName.value || "爱车位置",
                  color: connectionStatus.value == "online" ? "#fff" : "#666",
                  bgColor: connectionStatus.value == "online" ? "#07C160" : "#ccc",
                  padding: 5,
                  borderRadius: 4,
                  display: "ALWAYS"
                })
              };
              const marker = carMarker.value;
              if (marker != null) {
                markers.value = [marker];
              }
              currentSpeed.value = deviceData.speed ? parseFloat(deviceData.speed.toString()) : 0;
              currentAddress.value = deviceData.positionUpdateTime ? `最后定位: ${deviceData.positionUpdateTime}` : "未知位置";
              connectionStatus.value = deviceData.connectionStatus ? deviceData.connectionStatus.toString() : "unknown";
            }
          });
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:357", "获取初始位置失败:", err);
          utils_toast.showAppToast({
            title: "获取车辆位置失败",
            icon: "none"
          });
        } finally {
          common_vendor.index.hideLoading();
        }
      });
    };
    function getFenceType(fence) {
      const type = fence.getString("type", "");
      if (type && type !== "null") {
        return type;
      }
      const area = fence.getString("area", "");
      if (area.startsWith("CIRCLE")) {
        return "circle";
      } else if (area.startsWith("POLYGON")) {
        return "polygon";
      }
      return "polygon";
    }
    function parsePolygon(polygonStr) {
      if (!polygonStr)
        return [];
      const coordStr = polygonStr.replace(/POLYGON \(\(/, "").replace(/\)\)/, "");
      const coordPoints = coordStr.split(",");
      return coordPoints.map((point) => {
        const values = point.trim().split(" ");
        const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(parseFloat(values[0]), parseFloat(values[1]));
        return {
          latitude: convertedCoord.lat,
          longitude: convertedCoord.lng
        };
      });
    }
    function parseCircle(circleStr) {
      if (!circleStr || !circleStr.startsWith("CIRCLE"))
        return null;
      try {
        const coordStr = circleStr.replace(/CIRCLE \(/, "").replace(/\)/, "");
        const parts = coordStr.split(",");
        if (parts.length != 2)
          return null;
        const centerValues = parts[0].trim().split(" ");
        const lat = parseFloat(centerValues[0]);
        const lng = parseFloat(centerValues[1]);
        const radius = parseFloat(parts[1].trim());
        if (isNaN(lat) || isNaN(lng) || isNaN(radius) || radius <= 0) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:417", "无效的圆形围栏数据:", circleStr);
          return null;
        }
        const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(lat, lng);
        return {
          latitude: convertedCoord.lat,
          longitude: convertedCoord.lng,
          radius
        };
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:427", "解析圆形围栏失败:", error, "数据:", circleStr);
        return null;
      }
    }
    function updateMarkers() {
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
              callout: new common_vendor.UTSJSONObject({ content: `顶点${index + 1}`, display: "ALWAYS" }),
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
            callout: new common_vendor.UTSJSONObject({ content: "圆心", display: "ALWAYS" }),
            anchor: { x: 0.5, y: 0.5 }
          });
        }
      } else {
        const selected = selectedFence.value;
        if (selected == null) {
          markers.value = newMarkers;
          return null;
        }
        const fenceType = getFenceType(selected);
        const area = selected.getString("area", "");
        if (fenceType === "circle") {
          const circleData = parseCircle(area);
          if (circleData != null) {
            newMarkers.push({
              id: 2e3,
              latitude: circleData.latitude,
              longitude: circleData.longitude,
              iconPath: "/static/marker.png",
              width: 32,
              height: 32,
              callout: new common_vendor.UTSJSONObject({ content: "圆心", display: "ALWAYS" }),
              anchor: { x: 0.5, y: 0.5 }
            });
          }
        } else {
          const fencePoints = parsePolygon(area);
          fencePoints.forEach((point, index) => {
            newMarkers.push({
              id: 2e3 + index,
              latitude: point.latitude,
              longitude: point.longitude,
              iconPath: "/static/marker.png",
              width: 32,
              height: 32,
              callout: new common_vendor.UTSJSONObject({ content: `顶点${index + 1}`, display: "ALWAYS" }),
              anchor: { x: 0.5, y: 0.5 }
            });
          });
        }
      }
      markers.value = newMarkers;
    }
    const renderFencesOnMap = () => {
      if (!fenceList.value || fenceList.value.length == 0) {
        polygons.value = [];
        circles.value = [];
        updateMarkers();
        return null;
      }
      const fencePolygons = [];
      const fenceCircles = [];
      let colorIndex = 0;
      fenceList.value.forEach((fence) => {
        const fenceType = getFenceType(fence);
        if (fenceType === "circle") {
          const circleData = parseCircle(fence.getString("area", ""));
          if (circleData != null) {
            const displayRadius = circleData.radius > 1e5 ? 1e5 : circleData.radius;
            fenceCircles.push({
              latitude: circleData.latitude,
              longitude: circleData.longitude,
              radius: displayRadius,
              strokeWidth: 2,
              color: "#FF0000",
              fillColor: `rgba(255,0,0,0.2)`
            });
          }
        } else {
          const fencePoints = parsePolygon(fence.getString("area", ""));
          if (fencePoints.length >= 3) {
            fencePolygons.push({
              points: fencePoints,
              strokeWidth: 2,
              strokeColor: "#FF0000",
              fillColor: colorIndex++ == 0 ? "rgba(255,0,0,0.2)" : `rgba(${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},0.2)`,
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
        mapScale.value = firstCircle.radius > 5e4 ? 8 : firstCircle.radius > 2e4 ? 9 : firstCircle.radius > 1e4 ? 10 : firstCircle.radius > 5e3 ? 11 : firstCircle.radius > 2e3 ? 12 : firstCircle.radius > 1e3 ? 13 : firstCircle.radius > 500 ? 14 : firstCircle.radius > 200 ? 15 : 16;
      }
    };
    function updateMapDisplay() {
      updateMarkers();
      if (isDrawing.value) {
        if (drawingMode.value === "polygon") {
          polygons.value = points.value.length >= 3 ? [{
            points: points.value,
            strokeWidth: 2,
            strokeColor: "#FF0000",
            fillColor: "rgba(255,0,0,0.2)",
            zIndex: 1
          }] : [];
          circles.value = [];
        } else if (drawingMode.value === "circle") {
          const drawingCenter = circleCenter.value;
          if (drawingCenter != null && circleRadius.value > 0) {
            const drawingCircle = {
              latitude: drawingCenter.latitude,
              longitude: drawingCenter.longitude,
              radius: circleRadius.value,
              strokeWidth: 2,
              color: "#FF0000",
              fillColor: "rgba(255,0,0,0.2)"
            };
            circles.value = [drawingCircle];
          } else {
            circles.value = [];
          }
          polygons.value = [];
        }
      } else {
        renderFencesOnMap();
      }
    }
    const loadGeofenceList = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield api_request.getGeofenceList();
          if (res.code == 0) {
            fenceList.value = res.data;
          } else {
            utils_toast.showAppToast({ title: "获取围栏列表失败", icon: "none" });
            fenceList.value = [];
          }
          renderFencesOnMap();
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:622", "加载围栏列表失败:", error);
          utils_toast.showAppToast({ title: "获取围栏列表失败", icon: "none" });
          fenceList.value = [];
          renderFencesOnMap();
        }
      });
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
      points2.forEach((point) => {
        minLat = Math.min(minLat, point.latitude);
        maxLat = Math.max(maxLat, point.latitude);
        minLng = Math.min(minLng, point.longitude);
        maxLng = Math.max(maxLng, point.longitude);
      });
      return new CoordinateBounds({ minLat, maxLat, minLng, maxLng });
    };
    const setMapCenterToFence = (fence) => {
      const fenceType = getFenceType(fence);
      const area = fence.getString("area", "");
      if (fenceType === "circle") {
        const circleData = parseCircle(area);
        if (circleData != null) {
          center.latitude = circleData.latitude;
          center.longitude = circleData.longitude;
          const displayRadius = circleData.radius > 1e5 ? 1e5 : circleData.radius;
          mapScale.value = calculateZoomLevelFromRadius(displayRadius);
        }
      } else {
        const fencePoints = parsePolygon(area);
        if (fencePoints.length == 0)
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
    const showFenceList = () => {
      var _a;
      (_a = fencesPopup.value) === null || _a === void 0 ? null : _a.$callMethod("open");
    };
    const selectFence = (fence) => {
      var _a, _b;
      selectedFence.value = fence;
      (_a = fencesPopup.value) === null || _a === void 0 ? null : _a.$callMethod("close");
      (_b = showFenceModal.value) === null || _b === void 0 ? null : _b.$callMethod("open");
      const fenceType = getFenceType(fence);
      const area = fence.getString("area", "");
      if (fenceType === "circle") {
        const circleData = parseCircle(area);
        if (circleData != null) {
          circleCenter.value = { latitude: circleData.latitude, longitude: circleData.longitude };
          circleRadius.value = circleData.radius;
          points.value = [];
        }
      } else {
        const fencePoints = parsePolygon(area);
        points.value = fencePoints;
        circleCenter.value = null;
        circleRadius.value = 0;
      }
      setMapCenterToFence(fence);
      updateMapDisplay();
    };
    const editFence = (fence) => {
      var _a;
      editingFence.value = fence;
      fenceForm.name = fence.getString("name", "");
      const alarmTypeText = fence.getString("alarmType", "");
      const alarmType = alarmTypeText.length > 0 ? alarmTypeText : fence.getNumber("alarmType", 1).toString();
      fenceForm.alarmType = alarmTypeOptions.includes(alarmType) ? alarmType : "1";
      const fenceType = getFenceType(fence);
      drawingMode.value = fenceType;
      const area = fence.getString("area", "");
      if (fenceType === "circle") {
        const circleData = parseCircle(area);
        if (circleData != null) {
          circleCenter.value = {
            latitude: circleData.latitude,
            longitude: circleData.longitude
          };
          circleRadius.value = circleData.radius;
          points.value = [];
        }
      } else {
        const fencePoints = parsePolygon(area);
        if (fencePoints.length >= 3) {
          points.value = fencePoints;
          circleCenter.value = null;
          circleRadius.value = 0;
        }
      }
      updateMapDisplay();
      (_a = editDialogPopup.value) === null || _a === void 0 ? null : _a.$callMethod("open");
    };
    function deleteFenceById(id) {
      var _a;
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const result = yield api_request.deleteGeofence(id);
          if (result.code == 0) {
            utils_toast.showAppToast({ title: "删除成功" });
            selectedFence.value = null;
            points.value = [];
            circleCenter.value = null;
            circleRadius.value = 0;
            isDrawing.value = false;
            polygons.value = [];
            circles.value = [];
            updateMarkers();
            (_a = showFenceModal.value) === null || _a === void 0 ? null : _a.$callMethod("close");
            yield loadGeofenceList();
          } else {
            utils_toast.showAppToast({ title: "删除失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:830", "删除围栏失败:", error);
          utils_toast.showAppToast({ title: "删除失败", icon: "none" });
        }
      });
    }
    const deleteFence = (id) => {
      common_vendor.index.showModal(new common_vendor.UTSJSONObject({
        title: "确认删除",
        content: "确定要删除这个围栏吗？",
        success: (res) => {
          if (res.confirm) {
            void deleteFenceById(id.toString());
          }
        }
      }));
    };
    const saveFence = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (!fenceForm.name) {
          utils_toast.showAppToast({ title: "请输入围栏名称", icon: "none" });
          return Promise.resolve(null);
        }
        let area = "";
        if (editingFence.value) {
          if (drawingMode.value === "polygon" && points.value.length >= 3) {
            area = generatePolygonString(points.value);
          } else if (drawingMode.value === "circle" && circleCenter.value && circleRadius.value > 0) {
            area = generateCircleString(circleCenter.value, circleRadius.value);
          } else {
            area = editingFence.value.getString("area", "");
          }
        } else {
          if (drawingMode.value === "polygon" && points.value.length < 3) {
            utils_toast.showAppToast({ title: "请绘制有效的围栏区域（至少3个顶点）", icon: "none" });
            return Promise.resolve(null);
          } else if (drawingMode.value === "circle" && (!circleCenter.value || circleRadius.value <= 0)) {
            utils_toast.showAppToast({ title: "请绘制有效的圆形围栏", icon: "none" });
            return Promise.resolve(null);
          }
          if (drawingMode.value === "polygon") {
            area = generatePolygonString(points.value);
          } else if (drawingMode.value === "circle" && circleCenter.value) {
            area = generateCircleString(circleCenter.value, circleRadius.value);
          }
        }
        if (!area) {
          utils_toast.showAppToast({ title: "围栏数据无效，请重新绘制", icon: "none" });
          return Promise.resolve(null);
        }
        if (!alarmTypeOptions.includes(fenceForm.alarmType)) {
          utils_toast.showAppToast({ title: "请选择有效的告警类型", icon: "none" });
          return Promise.resolve(null);
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
            common_vendor.index.showLoading(new common_vendor.UTSJSONObject({ title: "更新中..." }));
            result = yield api_request.updateGeofence(new common_vendor.UTSJSONObject(Object.assign({ id: editingFence.value.id }, fenceData)));
          } else {
            common_vendor.index.showLoading(new common_vendor.UTSJSONObject({ title: "保存中..." }));
            result = yield api_request.addGeofence(fenceData);
          }
          common_vendor.index.hideLoading();
          if (result.code == 0) {
            utils_toast.showAppToast({ title: editingFence.value ? "更新成功" : "保存成功" });
            (_a = editDialogPopup.value) === null || _a === void 0 ? null : _a.$callMethod("close");
            const tempFence = editingFence.value;
            editingFence.value = null;
            isDrawing.value = false;
            points.value = [];
            circleCenter.value = null;
            circleRadius.value = 0;
            yield loadGeofenceList();
            if (tempFence) {
              selectedFence.value = null;
              (_b = showFenceModal.value) === null || _b === void 0 ? null : _b.$callMethod("close");
            }
          } else {
            utils_toast.showAppToast({ title: result.msg || "保存失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:941", "保存围栏失败:", error);
          utils_toast.showAppToast({ title: "保存失败，请重试", icon: "none" });
        }
      });
    };
    function resetPagination(page) {
      page.pageNum = 1;
      page.pageSize = 10;
      page.hasMore = true;
      page.loadingMore = false;
    }
    function initPagination(tabType) {
      if (tabType == "bind") {
        resetPagination(pagination.bind);
      } else {
        resetPagination(pagination.unbind);
      }
      if (activeTab.value == tabType) {
        deviceList.value = [];
      }
    }
    function loadBoundDevices(fenceId) {
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
          if (res.code == 0) {
            const dataList = res.data.list || [];
            if (page.pageNum == 1) {
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
    }
    function loadUnboundDevices() {
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
          if (res.code == 0) {
            const dataList = res.data.list || [];
            if (page.pageNum == 1) {
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
    }
    const showBindDevices = (fenceId) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a;
        currentFenceId.value = fenceId;
        const selected = selectedFence.value;
        currentFenceName.value = selected != null ? selected.getString("name", "") : "";
        (_a = deviceDialogPopup.value) === null || _a === void 0 ? null : _a.$callMethod("open");
        activeTab.value = "bind";
        scrollTop.value = 0;
        initPagination("bind");
        yield loadBoundDevices(fenceId);
      });
    };
    const switchTab = (tab) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/geofencing/geofencing.uvue:1042", "switchTab", tab, currentFenceId.value);
        if (activeTab.value === tab)
          return Promise.resolve(null);
        activeTab.value = tab;
        scrollTop.value = 0;
        deviceList.value = [];
        initPagination(tab);
        if (tab === "bind") {
          common_vendor.index.__f__("log", "at pages/geofencing/geofencing.uvue:1054", "switchTab,bind:", currentFenceId.value);
          yield loadBoundDevices(currentFenceId.value);
        } else {
          yield loadUnboundDevices();
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
        common_vendor.index.__f__("log", "at pages/geofencing/geofencing.uvue:1074", "toggleDeviceBinding", deviceImei, bound);
        loading.value = true;
        try {
          const params = new common_vendor.UTSJSONObject({
            geofenceId: currentFenceId.value,
            imeis: [deviceImei]
          });
          common_vendor.index.__f__("log", "at pages/geofencing/geofencing.uvue:1081", "toggleDeviceBindingparams", params);
          let result = null;
          if (bound) {
            result = yield api_request.bindDevices(params);
          } else {
            result = yield api_request.unbindDevices(params);
          }
          if (result.code == 0) {
            utils_toast.showAppToast({ title: bound ? "绑定成功" : "解绑成功" });
            initPagination(activeTab.value);
            scrollTop.value = 0;
            if (activeTab.value === "bind") {
              yield loadBoundDevices(currentFenceId.value);
            } else {
              yield loadUnboundDevices();
            }
          } else {
            utils_toast.showAppToast({ title: result.msg || "操作失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:1104", "设备绑定操作失败:", error);
          utils_toast.showAppToast({ title: "操作失败", icon: "none" });
        } finally {
          loading.value = false;
        }
      });
    };
    const isDeviceBound = (deviceImei) => {
      return boundDevices.value.some((device) => {
        return device.getString("imei", "") === deviceImei;
      });
    };
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
    function handleDeviceBindingChange(deviceImei, bound) {
      void toggleDeviceBinding(deviceImei, bound);
    }
    function getDeviceImei(device) {
      return device.getString("imei", "");
    }
    function isDeviceOnline(device) {
      return device.getString("connectionStatus", "") === "online";
    }
    function getDeviceDisplayName(device) {
      const deviceName2 = device.getString("deviceName", "");
      return deviceName2 ? deviceName2 : device.getString("plateNo", "");
    }
    function closeEditDialog() {
      var _a;
      (_a = editDialogPopup.value) === null || _a === void 0 ? null : _a.$callMethod("close");
    }
    function getSelectedFenceName() {
      const fence = selectedFence.value;
      return fence != null ? fence.getString("name", "") : "";
    }
    function editSelectedFence() {
      const fence = selectedFence.value;
      if (fence != null) {
        editFence(fence);
      }
    }
    function deleteSelectedFence() {
      const fence = selectedFence.value;
      common_vendor.index.__f__("log", "at pages/geofencing/geofencing.uvue:1174", "删除电子围栏", fence);
      if (fence != null) {
        const fenceId = fence.getString("id", "");
        common_vendor.index.__f__("log", "at pages/geofencing/geofencing.uvue:1178", "删除电子围栏ID", fenceId);
        if (fenceId !== "") {
          deleteFence(fenceId);
        } else {
          utils_toast.showAppToast({
            title: "围栏ID无效",
            icon: "none"
          });
        }
      }
    }
    function showSelectedFenceDevices() {
      const fence = selectedFence.value;
      if (fence != null) {
        void showBindDevices(fence.getString("id", ""));
      }
    }
    function calculateDistance(lat1, lng1, lat2, lng2) {
      const R = 6371e3;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }
    function addNewPoint(lat, lng) {
      const point = { latitude: lat, longitude: lng };
      points.value.push(point);
      updateMapDisplay();
    }
    const handleMapTap = (e) => {
      const detail = e.detail;
      if (!isDrawing.value || detail == null || detail.latitude == null || detail.longitude == null)
        return null;
      const latitude = detail.latitude;
      const longitude = detail.longitude;
      if (isDrawing.value) {
        if (drawingMode.value === "polygon") {
          addNewPoint(latitude, longitude);
        } else if (drawingMode.value === "circle") {
          if (!circleCenter.value) {
            circleCenter.value = {
              latitude,
              longitude
            };
            updateMapDisplay();
          } else {
            const radius = calculateDistance(circleCenter.value.latitude, circleCenter.value.longitude, latitude, longitude);
            circleRadius.value = radius < 10 ? 10 : radius;
            updateMapDisplay();
          }
        }
      }
    };
    const finishDrawing = () => {
      var _a;
      if (drawingMode.value === "polygon" && points.value.length < 3) {
        utils_toast.showAppToast({ title: "至少需要3个顶点", icon: "none" });
        return null;
      } else if (drawingMode.value === "circle" && (!circleCenter.value || circleRadius.value <= 0)) {
        utils_toast.showAppToast({ title: "请设置有效的圆形围栏", icon: "none" });
        return null;
      }
      isDrawing.value = false;
      fenceForm.name = `${drawingMode.value === "circle" ? "圆形" : "多边形"}围栏${fenceList.value.length + 1}`;
      (_a = editDialogPopup.value) === null || _a === void 0 ? null : _a.$callMethod("open");
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
    common_vendor.onLoad((option) => {
      connectionStatus.value = option.connectionStatus;
      imei.value = option.imei;
      currentCar.value = option.plateNo;
      deptId.value = option.deptId;
      carType.value = option.carType;
      deviceName.value = option.deviceName;
      loadInitialPosition();
      loadGeofenceList();
    });
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
        b: common_vendor.sei("myMap", "map"),
        c: center.latitude,
        d: center.longitude,
        e: mapScale.value,
        f: polygons.value,
        g: markers.value,
        h: circles.value,
        i: common_vendor.o(handleMapTap, "c6"),
        j: common_vendor.p({
          showTime: false,
          currentCar: currentCar.value,
          showCar: true,
          carStatus: connectionStatus.value,
          class: "sub-nav-overlay"
        }),
        k: isDrawing.value
      }, isDrawing.value ? common_vendor.e({
        l: drawingMode.value === "polygon"
      }, drawingMode.value === "polygon" ? {} : {}, {
        m: drawingMode.value === "circle"
      }, drawingMode.value === "circle" ? {} : {}) : {}, {
        n: selectedFence.value
      }, selectedFence.value ? {
        o: common_vendor.t(getSelectedFenceName()),
        p: common_vendor.o(($event) => {
          var _a;
          selectedFence.value = null;
          (_a = showFenceModal.value) == null ? void 0 : _a.$callMethod("close");
        }, "0c"),
        q: common_vendor.p({
          name: "close"
        }),
        r: common_vendor.o(editSelectedFence, "57"),
        s: common_vendor.p({
          size: "small"
        }),
        t: common_vendor.o(deleteSelectedFence, "16"),
        v: common_vendor.p({
          size: "small",
          type: "error"
        }),
        w: common_vendor.o(showSelectedFenceDevices, "ba"),
        x: common_vendor.p({
          size: "small",
          type: "primary"
        })
      } : {}, {
        y: common_vendor.sr(showFenceModal, "45be0509-2", {
          "k": "showFenceModal"
        }),
        z: common_vendor.p({
          mode: "bottom",
          round: "10",
          showClose: true,
          class: "r"
        }),
        A: !isDrawing.value && !selectedFence.value
      }, !isDrawing.value && !selectedFence.value ? {
        B: common_vendor.o(($event) => {
          return setDrawingMode("polygon");
        }, "1a"),
        C: common_vendor.p({
          type: drawingMode.value == "polygon" ? "success" : "default",
          size: "small",
          customStyle: "border:1rpx solid #ebedf0"
        }),
        D: common_vendor.o(($event) => {
          return setDrawingMode("circle");
        }, "9f"),
        E: common_vendor.p({
          type: drawingMode.value == "circle" ? "success" : "default",
          size: "small",
          customStyle: "border:1rpx solid #ebedf0",
          class: "mode-button-spacing"
        })
      } : {}, {
        F: common_vendor.o(startDrawing, "b3"),
        G: common_vendor.p({
          disabled: isDrawing.value || selectedFence.value != null,
          size: "small"
        }),
        H: common_vendor.o(finishDrawing, "17"),
        I: common_vendor.p({
          disabled: !isDrawing.value || !canFinishDrawing.value,
          size: "small"
        }),
        J: common_vendor.o(clearDrawing, "78"),
        K: common_vendor.p({
          size: "small"
        }),
        L: common_vendor.o(showFenceList, "8b"),
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
        R: common_vendor.t(circleRadius.value.toFixed(2))
      } : {}, {
        S: common_vendor.f(fenceList.value, (fence, k0, i0) => {
          return {
            a: common_vendor.t(fence.name),
            b: common_vendor.t(getFenceType(fence) === "circle" ? "圆形" : "多边形"),
            c: common_vendor.t(fence.deviceCount || 0),
            d: "45be0509-14-" + i0 + ",45be0509-13",
            e: fence.id,
            f: common_vendor.o(($event) => {
              return selectFence(fence);
            }, fence.id)
          };
        }),
        T: common_vendor.p({
          name: "/static/arrow-right.png",
          fontSize: "15"
        }),
        U: fenceList.value.length == 0
      }, fenceList.value.length == 0 ? {} : {}, {
        V: common_vendor.sr(fencesPopup, "45be0509-13", {
          "k": "fencesPopup"
        }),
        W: common_vendor.p({
          mode: "bottom",
          round: "10",
          height: "800rpx",
          disabledScroll: true,
          contentMargin: "0",
          showClose: true,
          class: "r"
        }),
        X: common_vendor.t(editingFence.value ? "编辑围栏" : "新增围栏"),
        Y: common_vendor.o(($event) => {
          return fenceForm.name = $event;
        }, "d2"),
        Z: common_vendor.p({
          placeholder: "请输入围栏名称",
          border: "surround",
          modelValue: fenceForm.name
        }),
        aa: common_vendor.o(($event) => {
          return fenceForm.alarmType = $event;
        }, "fe"),
        ab: common_vendor.p({
          name: "0",
          iconPlacement: "left",
          modelValue: fenceForm.alarmType
        }),
        ac: common_vendor.o(($event) => {
          return fenceForm.alarmType = $event;
        }, "ff"),
        ad: common_vendor.p({
          name: "1",
          iconPlacement: "left",
          modelValue: fenceForm.alarmType
        }),
        ae: common_vendor.o(($event) => {
          return fenceForm.alarmType = $event;
        }, "2e"),
        af: common_vendor.p({
          name: "2",
          iconPlacement: "left",
          modelValue: fenceForm.alarmType
        }),
        ag: common_vendor.o(($event) => {
          return fenceForm.alarmType = $event;
        }, "00"),
        ah: common_vendor.p({
          name: "3",
          iconPlacement: "left",
          modelValue: fenceForm.alarmType
        }),
        ai: common_vendor.o(closeEditDialog, "80"),
        aj: common_vendor.o(saveFence, "69"),
        ak: common_vendor.p({
          type: "primary"
        }),
        al: common_vendor.sr(editDialogPopup, "45be0509-15", {
          "k": "editDialogPopup"
        }),
        am: common_vendor.p({
          mode: "bottom",
          round: "10",
          contentDraggable: false,
          showClose: true,
          class: "r"
        }),
        an: common_vendor.t(currentFenceName.value),
        ao: common_vendor.n(activeTab.value === "bind" ? "active" : ""),
        ap: common_vendor.o(($event) => {
          return switchTab("bind");
        }, "bd"),
        aq: common_vendor.n(activeTab.value === "unbind" ? "active" : ""),
        ar: common_vendor.o(($event) => {
          return switchTab("unbind");
        }, "a0"),
        as: common_vendor.f(deviceList.value, (device, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(getDeviceDisplayName(device)),
            b: getDeviceImei(device)
          }, getDeviceImei(device) ? {
            c: common_vendor.t(isDeviceOnline(device) ? "在线" : "离线")
          } : {}, {
            d: common_vendor.o(($event) => {
              return handleDeviceBindingChange(getDeviceImei(device), $event);
            }, getDeviceImei(device)),
            e: "45be0509-24-" + i0 + ",45be0509-23",
            f: common_vendor.p({
              ["model-value"]: isDeviceBound(getDeviceImei(device)),
              disabled: loading.value || loadingMore.value,
              size: "20"
            }),
            g: getDeviceImei(device)
          });
        }),
        at: deviceList.value.length == 0 && !loading.value
      }, deviceList.value.length == 0 && !loading.value ? {
        av: common_vendor.t(activeTab.value === "bind" ? "暂无绑定设备" : "暂无可用设备")
      } : {}, {
        aw: loadingMore.value
      }, loadingMore.value ? {} : {}, {
        ax: deviceList.value.length > 0 && !hasMore.value && !loadingMore.value
      }, deviceList.value.length > 0 && !hasMore.value && !loadingMore.value ? {} : {}, {
        ay: scrollTop.value,
        az: common_vendor.o(handleLoadMore, "58"),
        aA: common_vendor.sr(deviceDialogPopup, "45be0509-23", {
          "k": "deviceDialogPopup"
        }),
        aB: common_vendor.p({
          mode: "bottom",
          round: "10",
          closeOnMask: true,
          showClose: true,
          class: "r"
        }),
        aC: `${_ctx.u_s_b_h}px`,
        aD: `${_ctx.u_s_a_i_b}px`
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/geofencing/geofencing.js.map
