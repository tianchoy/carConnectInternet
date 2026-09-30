"use strict";
const common_vendor = require("../../common/vendor.js");
const api_response = require("../../api/response.js");
const utils_toast = require("../../utils/toast.js");
const utils_modal = require("../../utils/modal.js");
const api_request = require("../../api/request.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
const utils_cars = require("../../utils/cars.js");
const utils_getUserLocation = require("../../utils/getUserLocation.js");
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
  const _easycom_app_modal_1 = common_vendor.resolveComponent("app-modal");
  (_easycom_custom_navBar_1 + _easycom_sub_navBar_1 + _easycom_i_icon_1 + _easycom_i_button_1 + _easycom_i_popup_1 + _easycom_i_input_1 + _easycom_i_radio_1 + _easycom_i_switch_1 + _easycom_app_toast_1 + _easycom_app_modal_1)();
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
const _easycom_app_modal = () => "../../components/app-modal/app-modal.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_sub_navBar + _easycom_i_icon + _easycom_i_button + _easycom_i_popup + _easycom_i_input + _easycom_i_radio + _easycom_i_switch + _easycom_app_toast + _easycom_app_modal)();
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
const FENCE_STROKE_COLOR = "#FF0000";
const FENCE_FILL_ALPHA_HEX = "33";
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
const FENCE_FIT_MARGIN = 0.8;
const FENCE_FIT_MIN_SCALE = 5;
const FENCE_FIT_MAX_SCALE = 18;
const FENCE_FIT_BOTTOM_RESERVE_RATIO = 0.22;
const FENCE_MAX_DISPLAY_RADIUS = 1e5;
const METERS_PER_DEGREE_LAT = 110540;
const METERS_PER_DEGREE_LNG = 111320;
const EARTH_RESOLUTION_BASE = 156543.03392;
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "geofencing",
  setup(__props) {
    const deviceNo = common_vendor.ref(null);
    const connectionStatus = common_vendor.ref(null);
    const deptId = common_vendor.ref(null);
    const carType = common_vendor.ref(null);
    const deviceName = common_vendor.ref(null);
    const center = common_vendor.reactive(new common_vendor.UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(16);
    const isMapReady = common_vendor.ref(false);
    const isInitialPositionSettled = common_vendor.ref(false);
    const hasUserLocationFallback = common_vendor.ref(false);
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
    const showUserLocationFallback = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const userLoc = yield utils_getUserLocation.getUserCurrentLocation();
        if (userLoc == null)
          return Promise.resolve(null);
        hasUserLocationFallback.value = true;
        center.latitude = userLoc.latitude;
        center.longitude = userLoc.longitude;
        mapScale.value = 12;
        const marker = {
          id: 10003,
          latitude: userLoc.latitude,
          longitude: userLoc.longitude,
          width: 25,
          height: 25,
          iconPath: "/static/current-location.png",
          callout: new common_vendor.UTSJSONObject({
            content: "当前位置",
            color: connectionStatus.value == "online" ? "#ffffff" : "#999999",
            borderRadius: 10,
            bgColor: connectionStatus.value == "online" ? "#1296db" : "#CCCCCC",
            padding: 5,
            display: "ALWAYS"
          })
        };
        markers.value = [marker];
        isMapReady.value = true;
      });
    };
    const loadInitialPosition = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.showLoading(new common_vendor.UTSJSONObject({
          title: "获取车辆位置中..."
        }));
        try {
          isMapReady.value = false;
          hasUserLocationFallback.value = false;
          const data = new common_vendor.UTSJSONObject({ deptId: deptId.value, deviceids: deviceNo.value });
          const res = yield api_request.getDevicePos(data);
          const positions = res.data;
          if (!api_response.isBusinessSuccessCode(res.code) || positions == null) {
            utils_toast.showAppToast({ title: res.msg || "获取车辆位置失败", icon: "none" });
            yield showUserLocationFallback();
            return Promise.resolve(null);
          }
          let foundDevice = false;
          positions.forEach((item) => {
            if (item.getString("deviceNo", "") == deviceNo.value) {
              foundDevice = true;
              const deviceData = item;
              const latitude = deviceData.getNumber("latitude", 0);
              const longitude = deviceData.getNumber("longitude", 0);
              if (!isFinite(latitude) || !isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180 || latitude == 0 || longitude == 0) {
                showUserLocationFallback();
                return null;
              }
              const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(latitude, longitude);
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
                isMapReady.value = true;
              }
              currentSpeed.value = deviceData.speed ? parseFloat(deviceData.speed.toString()) : 0;
              currentAddress.value = deviceData.positionUpdateTime ? `最后定位: ${deviceData.positionUpdateTime}` : "未知位置";
              connectionStatus.value = deviceData.connectionStatus ? deviceData.connectionStatus.toString() : "unknown";
            }
          });
          if (!foundDevice) {
            utils_toast.showAppToast({ title: "未找到设备位置", icon: "none" });
            yield showUserLocationFallback();
          }
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:417", "获取初始位置失败:", err);
          utils_toast.showAppToast({
            title: "获取车辆位置失败",
            icon: "none"
          });
        } finally {
          isInitialPositionSettled.value = true;
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
    function isValidCoordinate(latitude, longitude) {
      return isFinite(latitude) && isFinite(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
    }
    function parsePolygon(polygonStr) {
      if (!polygonStr)
        return [];
      const coordStr = polygonStr.replace(/POLYGON \(\(/, "").replace(/\)\)/, "");
      const points2 = [];
      coordStr.split(",").forEach((point) => {
        const values = point.trim().split(/\s+/);
        if (values.length != 2)
          return null;
        const latitude = parseFloat(values[0]);
        const longitude = parseFloat(values[1]);
        if (!isValidCoordinate(latitude, longitude))
          return null;
        const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(latitude, longitude);
        points2.push({
          latitude: convertedCoord.lat,
          longitude: convertedCoord.lng
        });
      });
      return points2;
    }
    function parseCircle(circleStr) {
      if (!circleStr || !circleStr.startsWith("CIRCLE"))
        return null;
      try {
        const coordStr = circleStr.replace(/CIRCLE \(/, "").replace(/\)/, "");
        const parts = coordStr.split(",");
        if (parts.length != 2)
          return null;
        const centerValues = parts[0].trim().split(/\s+/);
        if (centerValues.length != 2)
          return null;
        const lat = parseFloat(centerValues[0]);
        const lng = parseFloat(centerValues[1]);
        const radius = parseFloat(parts[1].trim());
        if (!isValidCoordinate(lat, lng) || !isFinite(radius) || radius <= 0) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:488", "无效的圆形围栏数据:", circleStr);
          return null;
        }
        const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(lat, lng);
        return {
          latitude: convertedCoord.lat,
          longitude: convertedCoord.lng,
          radius
        };
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:498", "解析圆形围栏失败:", error, "数据:", circleStr);
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
    const FENCE_FILL_COLORS = ["#FF0000", "#2979FF", "#00BFA5", "#FF8C00", "#8E24AA", "#00ACC1"];
    const buildFenceFillColor = (colorIndex) => {
      return FENCE_FILL_COLORS[colorIndex % FENCE_FILL_COLORS.length] + FENCE_FILL_ALPHA_HEX;
    };
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
              color: FENCE_STROKE_COLOR,
              fillColor: buildFenceFillColor(0)
            });
          }
        } else {
          const fencePoints = parsePolygon(fence.getString("area", ""));
          if (fencePoints.length >= 3) {
            fencePolygons.push({
              points: fencePoints,
              strokeWidth: 2,
              strokeColor: FENCE_STROKE_COLOR,
              fillColor: buildFenceFillColor(colorIndex++),
              zIndex: 1
            });
          }
        }
      });
      polygons.value = fencePolygons;
      circles.value = fenceCircles;
      if (fenceCircles.length > 0 && !selectedFence.value && isInitialPositionSettled.value && carMarker.value == null && !hasUserLocationFallback.value) {
        const firstCircle = fenceCircles[0];
        center.latitude = firstCircle.latitude;
        center.longitude = firstCircle.longitude;
        isMapReady.value = true;
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
            strokeColor: FENCE_STROKE_COLOR,
            fillColor: buildFenceFillColor(0),
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
              color: FENCE_STROKE_COLOR,
              fillColor: buildFenceFillColor(0)
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
          if (api_response.isBusinessSuccessCode(res.code) && res.data != null) {
            fenceList.value = res.data;
          } else {
            utils_toast.showAppToast({ title: res.msg || "获取围栏列表失败", icon: "none" });
            fenceList.value = [];
          }
          renderFencesOnMap();
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:705", "加载围栏列表失败:", error);
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
    let fenceMapViewWidth = 0;
    let fenceMapViewHeight = 0;
    let fenceMapViewSizeMeasured = false;
    function measureFenceMapViewportSize(callback) {
      try {
        const query = common_vendor.index.createSelectorQuery();
        query.select("#fence-map-container").boundingClientRect((rect = null) => {
          var _a, _b;
          if (rect != null) {
            const nodeInfo = rect;
            const width = (_a = nodeInfo.width) !== null && _a !== void 0 ? _a : 0;
            const height = (_b = nodeInfo.height) !== null && _b !== void 0 ? _b : 0;
            if (width > 0 && height > 0) {
              fenceMapViewWidth = width;
              fenceMapViewHeight = height;
              fenceMapViewSizeMeasured = true;
            }
          }
          callback();
        }).exec();
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/geofencing/geofencing.uvue:803", "测量地图容器尺寸失败:", error);
        callback();
      }
    }
    function ensureFenceMapViewportEstimate() {
      if (fenceMapViewWidth > 0 && fenceMapViewHeight > 0)
        return null;
      try {
        const info = common_vendor.index.getSystemInfoSync();
        fenceMapViewWidth = info.windowWidth;
        fenceMapViewHeight = info.windowHeight * 0.6;
      } catch (error) {
        fenceMapViewWidth = 375;
        fenceMapViewHeight = 420;
      }
    }
    const calculateFenceBounds = (fence) => {
      const fenceType = getFenceType(fence);
      const area = fence.getString("area", "");
      if (fenceType === "circle") {
        const circleData = parseCircle(area);
        if (circleData != null) {
          const radius = circleData.radius > FENCE_MAX_DISPLAY_RADIUS ? FENCE_MAX_DISPLAY_RADIUS : circleData.radius;
          if (isFinite(radius) && radius > 0) {
            const deltaLat = radius / METERS_PER_DEGREE_LAT;
            let circleCosLat = Math.cos(circleData.latitude * Math.PI / 180);
            if (circleCosLat < 0.01)
              circleCosLat = 0.01;
            const deltaLng = radius / (METERS_PER_DEGREE_LNG * circleCosLat);
            return {
              minLat: circleData.latitude - deltaLat,
              maxLat: circleData.latitude + deltaLat,
              minLng: circleData.longitude - deltaLng,
              maxLng: circleData.longitude + deltaLng
            };
          }
        }
        return null;
      }
      const fencePoints = parsePolygon(area);
      if (fencePoints.length == 0)
        return null;
      return calculateBounds(fencePoints);
    };
    const fitMapToFence = (fence) => {
      const nullableBounds = calculateFenceBounds(fence);
      if (nullableBounds == null)
        return null;
      const bounds = nullableBounds;
      const midLat = (bounds.minLat + bounds.maxLat) / 2;
      const midLng = (bounds.minLng + bounds.maxLng) / 2;
      ensureFenceMapViewportEstimate();
      if (fenceMapViewWidth <= 0 || fenceMapViewHeight <= 0)
        return null;
      let bottomReservePx = fenceMapViewHeight * FENCE_FIT_BOTTOM_RESERVE_RATIO;
      if (!isFinite(bottomReservePx) || bottomReservePx < 0)
        bottomReservePx = 0;
      const usableWidth = fenceMapViewWidth * FENCE_FIT_MARGIN;
      const usableHeight = (fenceMapViewHeight - bottomReservePx) * FENCE_FIT_MARGIN;
      if (usableWidth <= 0 || usableHeight <= 0)
        return null;
      let cosLat = Math.cos(midLat * Math.PI / 180);
      if (cosLat < 0.01)
        cosLat = 0.01;
      const spanLatMeters = (bounds.maxLat - bounds.minLat) * METERS_PER_DEGREE_LAT;
      const spanLngMeters = (bounds.maxLng - bounds.minLng) * METERS_PER_DEGREE_LNG * cosLat;
      const neededResolution = Math.max(spanLatMeters / usableHeight, spanLngMeters / usableWidth);
      let zoom = FENCE_FIT_MAX_SCALE;
      if (neededResolution > 1e-4) {
        const baseResolution = EARTH_RESOLUTION_BASE * cosLat;
        zoom = Math.log(baseResolution / neededResolution) / Math.log(2);
      }
      let finalZoom = Math.floor(zoom);
      if (finalZoom > FENCE_FIT_MAX_SCALE)
        finalZoom = FENCE_FIT_MAX_SCALE;
      if (finalZoom < FENCE_FIT_MIN_SCALE)
        finalZoom = FENCE_FIT_MIN_SCALE;
      mapScale.value = finalZoom;
      const resolutionAtZoom = EARTH_RESOLUTION_BASE * cosLat / Math.pow(2, finalZoom);
      const latOffset = bottomReservePx / 2 * resolutionAtZoom / METERS_PER_DEGREE_LAT;
      center.latitude = midLat - latOffset;
      center.longitude = midLng;
    };
    const applyFenceViewportFit = () => {
      const fence = editingFence.value;
      if (fence != null)
        fitMapToFence(fence);
      if (fenceMapViewSizeMeasured)
        return null;
      measureFenceMapViewportSize(() => {
        const currentFence = editingFence.value;
        if (currentFence != null)
          fitMapToFence(currentFence);
      });
    };
    const setMapCenterToFence = (fence) => {
      if (carMarker.value != null)
        return null;
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
      applyFenceViewportFit();
      (_a = editDialogPopup.value) === null || _a === void 0 ? null : _a.$callMethod("open");
    };
    function deleteFenceById(id) {
      var _a;
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const result = yield api_request.deleteGeofence(id);
          if (api_response.isBusinessSuccessCode(result.code)) {
            utils_toast.showAppToast({ title: result.msg || "删除成功", icon: "success" });
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
            utils_toast.showAppToast({ title: result.msg || "删除失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:1056", "删除围栏失败:", error);
          utils_toast.showAppToast({ title: "删除失败", icon: "none" });
        }
      });
    }
    const deleteFence = (id) => {
      utils_modal.showAppModal(new common_vendor.UTSJSONObject({
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
          if (api_response.isBusinessSuccessCode(result.code)) {
            utils_toast.showAppToast({ title: result.msg || (editingFence.value ? "更新成功" : "保存成功") });
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
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:1167", "保存围栏失败:", error);
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
          if (api_response.isBusinessSuccessCode(res.code)) {
            const pageData = res.data;
            const dataList = pageData != null ? pageData.list : [];
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
    function loadUnboundDevices(fenceId) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const page = pagination.unbind;
        if (!page.hasMore || page.loadingMore)
          return Promise.resolve(null);
        page.loadingMore = true;
        try {
          const res = yield api_request.getUnboundDevices(new common_vendor.UTSJSONObject({
            pageNum: page.pageNum,
            pageSize: page.pageSize,
            geoId: fenceId
          }));
          if (api_response.isBusinessSuccessCode(res.code)) {
            const pageData = res.data;
            const dataList = pageData != null ? pageData.list : [];
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
        common_vendor.index.__f__("log", "at pages/geofencing/geofencing.uvue:1271", "switchTab", tab, currentFenceId.value);
        if (activeTab.value === tab)
          return Promise.resolve(null);
        activeTab.value = tab;
        scrollTop.value = 0;
        deviceList.value = [];
        initPagination(tab);
        if (tab === "bind") {
          common_vendor.index.__f__("log", "at pages/geofencing/geofencing.uvue:1283", "switchTab,bind:", currentFenceId.value);
          yield loadBoundDevices(currentFenceId.value);
        } else {
          yield loadUnboundDevices(currentFenceId.value);
        }
      });
    };
    const handleLoadMore = () => {
      if (loadingMore.value || !hasMore.value)
        return null;
      if (activeTab.value === "bind") {
        loadBoundDevices(currentFenceId.value);
      } else {
        loadUnboundDevices(currentFenceId.value);
      }
    };
    const toggleDeviceBinding = (deviceNo2, bound) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a;
        common_vendor.index.__f__("log", "at pages/geofencing/geofencing.uvue:1303", "toggleDeviceBinding", deviceNo2, bound);
        loading.value = true;
        try {
          const params = new common_vendor.UTSJSONObject({
            geofenceId: (_a = currentFenceId.value) !== null && _a !== void 0 ? _a : "",
            deviceNos: [deviceNo2]
          });
          common_vendor.index.__f__("log", "at pages/geofencing/geofencing.uvue:1310", "toggleDeviceBindingparams", params);
          let result = null;
          if (bound) {
            result = yield api_request.bindDevices(params);
          } else {
            result = yield api_request.unbindDevices(params);
          }
          if (api_response.isBusinessSuccessCode(result.code)) {
            utils_toast.showAppToast({ title: result.msg || (bound ? "绑定成功" : "解绑成功") });
            initPagination(activeTab.value);
            scrollTop.value = 0;
            if (activeTab.value === "bind") {
              yield loadBoundDevices(currentFenceId.value);
            } else {
              yield loadUnboundDevices(currentFenceId.value);
            }
            loadGeofenceList();
          } else {
            utils_toast.showAppToast({ title: result.msg || "操作失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/geofencing/geofencing.uvue:1334", "设备绑定操作失败:", error);
          utils_toast.showAppToast({ title: "操作失败", icon: "none" });
        } finally {
          loading.value = false;
        }
      });
    };
    const isDeviceBound = (deviceNo2) => {
      return boundDevices.value.some((device) => {
        return device.getString("deviceNo", "") === deviceNo2;
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
    function handleDeviceBindingChange(deviceNo2, bound) {
      void toggleDeviceBinding(deviceNo2, bound);
    }
    function getDeviceNo(device) {
      return device.getString("deviceNo", "");
    }
    function isDeviceOnline(device) {
      return device.getString("connectionStatus", "") === "online";
    }
    function getDeviceDisplayName(device) {
      const deviceName2 = device.getString("deviceName", "");
      return deviceName2 ? deviceName2 : device.getString("plateNo", "") ? device.getString("plateNo", "") : device.getString("deviceNo", "");
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
      var _a;
      (_a = showFenceModal.value) === null || _a === void 0 ? null : _a.$callMethod("close");
      const fence = selectedFence.value;
      common_vendor.index.__f__("log", "at pages/geofencing/geofencing.uvue:1401", "删除电子围栏", fence);
      if (fence != null) {
        const fenceId = fence.getString("id", "");
        common_vendor.index.__f__("log", "at pages/geofencing/geofencing.uvue:1405", "删除电子围栏ID", fenceId);
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
    function clearDrawing() {
      isDrawing.value = false;
      points.value = [];
      circleCenter.value = null;
      circleRadius.value = 0;
      selectedFence.value = null;
      polygons.value = [];
      circles.value = [];
      updateMarkers();
      renderFencesOnMap();
    }
    function closeEditDialog() {
      var _a;
      (_a = editDialogPopup.value) === null || _a === void 0 ? null : _a.$callMethod("close");
      if (editingFence.value == null) {
        clearDrawing();
      }
    }
    const normalizeRouteValue = (value = null) => {
      if (value == null)
        return "";
      const text = value.toString().trim();
      if (text == "" || text == "null" || text == "undefined")
        return "";
      try {
        const decoded = decodeURIComponent(text);
        return decoded == null ? text : decoded.trim();
      } catch (error) {
        return text;
      }
    };
    common_vendor.onLoad((option) => {
      var _a, _b, _c, _d;
      common_vendor.index.__f__("log", "at pages/geofencing/geofencing.uvue:1566", "加载参数", option);
      connectionStatus.value = option.connectionStatus;
      deviceNo.value = option.deviceNo;
      const routeDeviceName = normalizeRouteValue((_a = option.deviceName) !== null && _a !== void 0 ? _a : "");
      const routePlateNo = normalizeRouteValue((_b = option.plateNo) !== null && _b !== void 0 ? _b : "");
      currentCar.value = routePlateNo != "" ? routePlateNo : routeDeviceName != "" ? routeDeviceName : (_c = deviceNo.value) !== null && _c !== void 0 ? _c : "未命名设备";
      deptId.value = option.deptId;
      carType.value = normalizeRouteValue((_d = option.carType) !== null && _d !== void 0 ? _d : "");
      deviceName.value = routeDeviceName != "" ? routeDeviceName : currentCar.value;
      loadInitialPosition();
      loadGeofenceList();
    });
    common_vendor.onReady(() => {
      measureFenceMapViewportSize(() => {
        common_vendor.index.__f__("log", "at pages/geofencing/geofencing.uvue:1584", "地图容器尺寸已测量:", fenceMapViewWidth, fenceMapViewHeight);
      });
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
        b: isMapReady.value
      }, isMapReady.value ? {
        c: common_vendor.sei("myMap", "map"),
        d: center.latitude,
        e: center.longitude,
        f: mapScale.value,
        g: polygons.value,
        h: markers.value,
        i: circles.value,
        j: common_vendor.o(handleMapTap, "a5")
      } : {}, {
        k: common_vendor.p({
          showTime: false,
          currentCar: currentCar.value,
          showCar: true,
          carStatus: connectionStatus.value,
          class: "sub-nav-overlay"
        }),
        l: isDrawing.value
      }, isDrawing.value ? common_vendor.e({
        m: drawingMode.value === "polygon"
      }, drawingMode.value === "polygon" ? {} : {}, {
        n: drawingMode.value === "circle"
      }, drawingMode.value === "circle" ? {} : {}) : {}, {
        o: common_vendor.sei("fence-map-container", "view"),
        p: selectedFence.value
      }, selectedFence.value ? {
        q: common_vendor.t(getSelectedFenceName()),
        r: common_vendor.o(($event) => {
          var _a;
          selectedFence.value = null;
          (_a = showFenceModal.value) == null ? void 0 : _a.$callMethod("close");
        }, "52"),
        s: common_vendor.p({
          size: "20",
          name: "/static/close.png"
        }),
        t: common_vendor.o(editSelectedFence, "61"),
        v: common_vendor.p({
          size: "small"
        }),
        w: common_vendor.o(deleteSelectedFence, "32"),
        x: common_vendor.p({
          size: "small",
          type: "error"
        }),
        y: common_vendor.o(showSelectedFenceDevices, "db"),
        z: common_vendor.p({
          size: "small",
          type: "primary"
        })
      } : {}, {
        A: common_vendor.sr(showFenceModal, "45be0509-2", {
          "k": "showFenceModal"
        }),
        B: common_vendor.p({
          mode: "bottom",
          round: "10",
          showClose: false,
          class: "r"
        }),
        C: !isDrawing.value && !selectedFence.value
      }, !isDrawing.value && !selectedFence.value ? {
        D: common_vendor.o(($event) => {
          return setDrawingMode("polygon");
        }, "10"),
        E: common_vendor.p({
          type: drawingMode.value == "polygon" ? "success" : "default",
          size: "small",
          customStyle: "border:1rpx solid #ebedf0"
        }),
        F: common_vendor.o(($event) => {
          return setDrawingMode("circle");
        }, "37"),
        G: common_vendor.p({
          type: drawingMode.value == "circle" ? "success" : "default",
          size: "small",
          customStyle: "border:1rpx solid #ebedf0",
          class: "mode-button-spacing"
        })
      } : {}, {
        H: common_vendor.o(startDrawing, "08"),
        I: common_vendor.p({
          disabled: isDrawing.value || selectedFence.value != null,
          size: "small"
        }),
        J: common_vendor.o(finishDrawing, "52"),
        K: common_vendor.p({
          disabled: !isDrawing.value || !canFinishDrawing.value,
          size: "small"
        }),
        L: common_vendor.o(clearDrawing, "ad"),
        M: common_vendor.p({
          size: "small"
        }),
        N: common_vendor.o(showFenceList, "00"),
        O: common_vendor.p({
          size: "small"
        }),
        P: common_vendor.t(drawingMode.value === "polygon" ? "多边形" : "圆形"),
        Q: drawingMode.value === "polygon"
      }, drawingMode.value === "polygon" ? {
        R: common_vendor.t(points.value.length)
      } : {}, {
        S: drawingMode.value === "circle"
      }, drawingMode.value === "circle" ? {
        T: common_vendor.t(circleRadius.value.toFixed(2))
      } : {}, {
        U: common_vendor.f(fenceList.value, (fence, k0, i0) => {
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
        V: common_vendor.p({
          name: "/static/arrow-right.png",
          fontSize: "15"
        }),
        W: fenceList.value.length == 0
      }, fenceList.value.length == 0 ? {} : {}, {
        X: common_vendor.sr(fencesPopup, "45be0509-13", {
          "k": "fencesPopup"
        }),
        Y: common_vendor.p({
          mode: "bottom",
          round: "10",
          height: "800rpx",
          disabledScroll: true,
          contentMargin: "0",
          showClose: true,
          class: "r"
        }),
        Z: common_vendor.t(editingFence.value ? "编辑围栏" : "新增围栏"),
        aa: common_vendor.o(($event) => {
          return fenceForm.name = $event;
        }, "cf"),
        ab: common_vendor.p({
          placeholder: "请输入围栏名称",
          border: "surround",
          modelValue: fenceForm.name
        }),
        ac: common_vendor.o(($event) => {
          return fenceForm.alarmType = $event;
        }, "86"),
        ad: common_vendor.p({
          name: "0",
          iconPlacement: "left",
          modelValue: fenceForm.alarmType,
          class: "alarm-radio"
        }),
        ae: common_vendor.o(($event) => {
          return fenceForm.alarmType = $event;
        }, "48"),
        af: common_vendor.p({
          name: "1",
          iconPlacement: "left",
          modelValue: fenceForm.alarmType,
          class: "alarm-radio"
        }),
        ag: common_vendor.o(($event) => {
          return fenceForm.alarmType = $event;
        }, "88"),
        ah: common_vendor.p({
          name: "2",
          iconPlacement: "left",
          modelValue: fenceForm.alarmType,
          class: "alarm-radio"
        }),
        ai: common_vendor.o(($event) => {
          return fenceForm.alarmType = $event;
        }, "21"),
        aj: common_vendor.p({
          name: "3",
          iconPlacement: "left",
          modelValue: fenceForm.alarmType,
          class: "alarm-radio"
        }),
        ak: common_vendor.o(closeEditDialog, "f0"),
        al: common_vendor.o(saveFence, "c3"),
        am: common_vendor.p({
          type: "primary"
        }),
        an: common_vendor.sr(editDialogPopup, "45be0509-15", {
          "k": "editDialogPopup"
        }),
        ao: common_vendor.p({
          mode: "bottom",
          round: "10",
          contentDraggable: false,
          showClose: true,
          class: "r"
        }),
        ap: common_vendor.t(currentFenceName.value),
        aq: common_vendor.n(activeTab.value === "bind" ? "active" : ""),
        ar: common_vendor.o(($event) => {
          return switchTab("bind");
        }, "c7"),
        as: common_vendor.n(activeTab.value === "unbind" ? "active" : ""),
        at: common_vendor.o(($event) => {
          return switchTab("unbind");
        }, "0b"),
        av: common_vendor.f(deviceList.value, (device, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(getDeviceDisplayName(device)),
            b: getDeviceNo(device)
          }, getDeviceNo(device) ? {
            c: common_vendor.t(isDeviceOnline(device) ? "在线" : "离线")
          } : {}, {
            d: common_vendor.o(($event) => {
              return handleDeviceBindingChange(getDeviceNo(device), $event);
            }, getDeviceNo(device)),
            e: "45be0509-24-" + i0 + ",45be0509-23",
            f: common_vendor.p({
              ["model-value"]: isDeviceBound(getDeviceNo(device)),
              disabled: loading.value || loadingMore.value,
              size: "20"
            }),
            g: getDeviceNo(device)
          });
        }),
        aw: deviceList.value.length == 0 && !loading.value
      }, deviceList.value.length == 0 && !loading.value ? {
        ax: common_vendor.t(activeTab.value === "bind" ? "暂无绑定设备" : "暂无可用设备")
      } : {}, {
        ay: loadingMore.value
      }, loadingMore.value ? {} : {}, {
        az: deviceList.value.length > 0 && !hasMore.value && !loadingMore.value
      }, deviceList.value.length > 0 && !hasMore.value && !loadingMore.value ? {} : {}, {
        aA: scrollTop.value,
        aB: common_vendor.o(handleLoadMore, "b0"),
        aC: common_vendor.sr(deviceDialogPopup, "45be0509-23", {
          "k": "deviceDialogPopup"
        }),
        aD: common_vendor.p({
          mode: "bottom",
          round: "10",
          closeOnMask: true,
          showClose: true,
          class: "r"
        }),
        aE: `${_ctx.u_s_b_h}px`,
        aF: `${_ctx.u_s_a_i_b}px`
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/geofencing/geofencing.js.map
