"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_request = require("../../api/request.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
const utils_gettime = require("../../utils/gettime.js");
const utils_formateTime = require("../../utils/formateTime.js");
const utils_cars = require("../../utils/cars.js");
if (!Array) {
  const _easycom_i_icon_1 = common_vendor.resolveComponent("i-icon");
  const _easycom_i_line_progress_1 = common_vendor.resolveComponent("i-line-progress");
  const _easycom_i_picker_1 = common_vendor.resolveComponent("i-picker");
  (_easycom_i_icon_1 + _easycom_i_line_progress_1 + _easycom_i_picker_1)();
}
const _easycom_i_icon = () => "../../uni_modules/i-ui-x/components/i-icon/i-icon.js";
const _easycom_i_line_progress = () => "../../uni_modules/i-ui-x/components/i-line-progress/i-line-progress.js";
const _easycom_i_picker = () => "../../uni_modules/i-ui-x/components/i-picker/i-picker.js";
if (!Math) {
  (_easycom_i_icon + _easycom_i_line_progress + _easycom_i_picker)();
}
class Device extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          name: { type: String, optional: false },
          deviceName: { type: String, optional: false },
          value: { type: String, optional: false },
          imei: { type: String, optional: false },
          deptId: { type: String, optional: false },
          deviceId: { type: String, optional: false },
          iccid: { type: String, optional: false },
          simMerchant: { type: String, optional: false },
          connectionStatus: { type: String, optional: false },
          carType: { type: String, optional: false },
          plateNo: { type: String, optional: false },
          latitude: { type: Number, optional: false },
          longitude: { type: Number, optional: false }
        };
      },
      name: "Device"
    };
  }
  constructor(options, metadata = Device.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.name = this.__props__.name;
    this.deviceName = this.__props__.deviceName;
    this.value = this.__props__.value;
    this.imei = this.__props__.imei;
    this.deptId = this.__props__.deptId;
    this.deviceId = this.__props__.deviceId;
    this.iccid = this.__props__.iccid;
    this.simMerchant = this.__props__.simMerchant;
    this.connectionStatus = this.__props__.connectionStatus;
    this.carType = this.__props__.carType;
    this.plateNo = this.__props__.plateNo;
    this.latitude = this.__props__.latitude;
    this.longitude = this.__props__.longitude;
    delete this.__props__;
  }
}
class MapCenter extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          latitude: { type: Number, optional: false },
          longitude: { type: Number, optional: false }
        };
      },
      name: "MapCenter"
    };
  }
  constructor(options, metadata = MapCenter.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.latitude = this.__props__.latitude;
    this.longitude = this.__props__.longitude;
    delete this.__props__;
  }
}
class UserDeviceListData extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          list: { type: "Unknown", optional: false }
        };
      },
      name: "UserDeviceListData"
    };
  }
  constructor(options, metadata = UserDeviceListData.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.list = this.__props__.list;
    delete this.__props__;
  }
}
class DeviceStatus extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          batteryPercent: { type: Number, optional: false },
          voltage: { type: Number, optional: false },
          signalStrength: { type: Number, optional: false }
        };
      },
      name: "DeviceStatus"
    };
  }
  constructor(options, metadata = DeviceStatus.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.batteryPercent = this.__props__.batteryPercent;
    this.voltage = this.__props__.voltage;
    this.signalStrength = this.__props__.signalStrength;
    delete this.__props__;
  }
}
class DeviceDetailState extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          deviceStatus: { type: DeviceStatus, optional: false },
          connectionStatus: { type: String, optional: false },
          lastUpdateTime: { type: String, optional: false }
        };
      },
      name: "DeviceDetailState"
    };
  }
  constructor(options, metadata = DeviceDetailState.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.deviceStatus = this.__props__.deviceStatus;
    this.connectionStatus = this.__props__.connectionStatus;
    this.lastUpdateTime = this.__props__.lastUpdateTime;
    delete this.__props__;
  }
}
const SELECTED_DEVICE_STORAGE_KEY = "selected_device_info";
const SELECTED_DEVICE_INDEX_STORAGE_KEY = "selected_device_index";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const timeRange = utils_gettime.getTodayZeroTime();
    const nowTime = timeRange.nowTime;
    const todayZero = timeRange.todayZero;
    const center = common_vendor.reactive(new MapCenter({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const userDeviceList = common_vendor.ref([]);
    const isMapReady = common_vendor.ref(false);
    const mapScale = common_vendor.ref(12);
    const statusBarHeight = common_vendor.ref(20);
    common_vendor.ref(null);
    common_vendor.ref(44);
    const deviceList = common_vendor.ref([]);
    const showPicker = common_vendor.ref(false);
    const pickerDefaultIndex = common_vendor.ref([0]);
    const pickerKey = common_vendor.ref(0);
    const currentCarImei = common_vendor.ref("");
    const currentCarDeptId = common_vendor.ref("");
    const currentCarDeviceId = common_vendor.ref("");
    const currentCarIccId = common_vendor.ref("");
    const currentCarName = common_vendor.ref("");
    const currentCarSimMerchant = common_vendor.ref("");
    const currentCarConnectionStatus = common_vendor.ref("");
    const currentCarCarType = common_vendor.ref("");
    const currentCarPlateNo = common_vendor.ref("");
    const deviceDetail = common_vendor.ref(new DeviceDetailState({
      deviceStatus: new DeviceStatus({
        batteryPercent: 0,
        voltage: 0,
        signalStrength: 0
      }),
      connectionStatus: "offline",
      lastUpdateTime: ""
    }));
    const markers = common_vendor.ref([]);
    const lastUpdateTime = common_vendor.ref("--:--:--");
    const safeDeviceDetail = common_vendor.computed(() => {
      const detail = deviceDetail.value;
      return new DeviceDetailState({
        deviceStatus: new DeviceStatus({
          batteryPercent: detail.deviceStatus.batteryPercent,
          voltage: detail.deviceStatus.voltage,
          signalStrength: detail.deviceStatus.signalStrength
        }),
        connectionStatus: detail.connectionStatus,
        lastUpdateTime: detail.lastUpdateTime
      });
    });
    const pickerColumns = common_vendor.computed(() => {
      return [deviceList.value.map((device) => {
        const displayName = device.deviceName || device.name || device.imei || "未命名设备";
        const statusText = device.connectionStatus === "online" ? "在线" : "离线";
        return `${displayName} (${statusText})`;
      })];
    });
    const closePicker = () => {
      showPicker.value = false;
    };
    const initDimensions = () => {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = systemInfo.statusBarHeight != null ? systemInfo.statusBarHeight : 20;
    };
    const delay = (ms) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    };
    const saveSelectedDevice = (device) => {
      try {
        const deviceInfo = new common_vendor.UTSJSONObject({
          name: device.deviceName || device.name || device.imei,
          deviceName: device.deviceName || device.name || device.imei,
          imei: device.imei || device.value,
          deptId: device.deptId,
          deviceId: device.deviceId,
          iccid: device.iccid,
          simMerchant: device.simMerchant,
          connectionStatus: device.connectionStatus,
          carType: device.carType,
          plateNo: device.plateNo
        });
        common_vendor.index.setStorageSync(SELECTED_DEVICE_STORAGE_KEY, deviceInfo);
        common_vendor.index.__f__("log", "at pages/index/index.uvue:310", "保存选中设备成功:", deviceInfo);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.uvue:312", "保存选中设备失败:", error);
      }
    };
    const getSavedSelectedDevice = () => {
      try {
        const savedDevice = common_vendor.index.getStorageSync(SELECTED_DEVICE_STORAGE_KEY);
        if (savedDevice != null && savedDevice.imei) {
          return savedDevice;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.uvue:337", "获取保存设备失败:", error);
      }
      return null;
    };
    const clearSavedSelectedDevice = () => {
      try {
        common_vendor.index.removeStorageSync(SELECTED_DEVICE_STORAGE_KEY);
        common_vendor.index.__f__("log", "at pages/index/index.uvue:346", "清除保存设备成功");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.uvue:348", "清除保存设备失败:", error);
      }
    };
    const saveSelectedDeviceIndex = (index) => {
      try {
        common_vendor.index.setStorageSync(SELECTED_DEVICE_INDEX_STORAGE_KEY, index);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.uvue:357", "保存选中设备索引失败:", error);
      }
    };
    const getSavedSelectedDeviceIndex = () => {
      try {
        const savedIndex = common_vendor.index.getStorageSync(SELECTED_DEVICE_INDEX_STORAGE_KEY);
        if (savedIndex != null) {
          return savedIndex;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.uvue:369", "获取保存设备索引失败:", error);
      }
      return null;
    };
    const clearSavedSelectedDeviceIndex = () => {
      try {
        common_vendor.index.removeStorageSync(SELECTED_DEVICE_INDEX_STORAGE_KEY);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.uvue:379", "清除保存设备索引失败:", error);
      }
    };
    const handlePicker = () => {
      if (deviceList.value.length === 0) {
        common_vendor.index.showToast({
          title: "暂无车辆数据",
          icon: "none"
        });
        return null;
      }
      pickerKey.value++;
      const savedIndex = getSavedSelectedDeviceIndex();
      if (savedIndex !== null && savedIndex >= 0 && savedIndex < deviceList.value.length) {
        pickerDefaultIndex.value = [savedIndex];
      } else {
        const currentIndex = deviceList.value.findIndex((device) => {
          return device.imei === currentCarImei.value || device.deviceId === currentCarDeviceId.value;
        });
        if (currentIndex !== -1) {
          pickerDefaultIndex.value = [currentIndex];
        } else {
          pickerDefaultIndex.value = [0];
        }
      }
      common_vendor.nextTick$1(() => {
        showPicker.value = true;
      });
    };
    const createMarker = (id, lat, lng, type, title = null) => {
      const isOnline = currentCarConnectionStatus.value === "online";
      const iconPath = utils_cars.getDeviceIcon(currentCarConnectionStatus.value, currentCarCarType.value);
      const marker = new common_vendor.UTSJSONObject({
        id,
        latitude: lat,
        longitude: lng,
        width: 30,
        height: 30,
        iconPath,
        callout: new common_vendor.UTSJSONObject({
          content: title || "爱车位置",
          color: isOnline ? "#ffffff" : "#999999",
          borderRadius: 6,
          bgColor: isOnline ? "#07C160" : "#CCCCCC",
          padding: 4,
          fontSize: 12,
          display: "ALWAYS"
        }),
        anchor: new common_vendor.UTSJSONObject({ x: 0.5, y: 0.5 })
      });
      return marker;
    };
    const loadDeviceDetail = (deviceId) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
          const res = yield api_request.getDeviceDetail(deviceId);
          const detail = res.data;
          if (detail != null) {
            const deviceStatus = detail.getJSON("deviceStatus");
            deviceDetail.value = {
              deviceStatus: {
                batteryPercent: (_a = deviceStatus === null || deviceStatus === void 0 ? null : deviceStatus.getNumber("batteryPercent", 0)) !== null && _a !== void 0 ? _a : 0,
                voltage: (_b = deviceStatus === null || deviceStatus === void 0 ? null : deviceStatus.getNumber("voltage", 0)) !== null && _b !== void 0 ? _b : 0,
                signalStrength: (_c = deviceStatus === null || deviceStatus === void 0 ? null : deviceStatus.getNumber("signalStrength", 0)) !== null && _c !== void 0 ? _c : 0
              },
              connectionStatus: detail.getString("connectionStatus", "offline"),
              lastUpdateTime: detail.getString("lastUpdateTime", "")
            };
            const updateTime = detail.getString("lastUpdateTime", "");
            if (updateTime) {
              const date = new Date(updateTime);
              lastUpdateTime.value = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
            }
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:483", "加载设备详情失败", error);
        }
      });
    };
    common_vendor.ref(new common_vendor.UTSJSONObject({}));
    const tripData = common_vendor.ref([]);
    const totalMileage = common_vendor.ref(0);
    const averageSpeed = common_vendor.ref(0);
    const processTripData = (data) => {
      const trips = data.getArray("trips");
      if (trips != null && trips.length > 0) {
        tripData.value = trips;
        let totalDistance = 0;
        let totalDuration = 0;
        let totalAvgSpeed = 0;
        trips.forEach((trip) => {
          totalDistance += trip.getNumber("distance", 0);
          totalDuration += trip.getNumber("duration", 0);
          totalAvgSpeed += trip.getNumber("averageSpeed", 0);
        });
        totalMileage.value = totalDistance;
        averageSpeed.value = totalAvgSpeed / trips.length;
      } else {
        tripData.value = [];
        totalMileage.value = 0;
        averageSpeed.value = 0;
      }
    };
    const loadTrackPos = (data) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield api_request.getTrackPos(data);
          if (res.getNumber("code", 0) == 401) {
            common_vendor.index.showToast({
              title: "登录过期，请重新登录",
              icon: "none",
              duration: 2e3
            });
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.reLaunch({
              url: "/pages/index/index"
            });
            return Promise.resolve(null);
          }
          const trackData = res.getJSON("data");
          if (trackData != null) {
            processTripData(trackData);
          }
          common_vendor.index.hideLoading();
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:539", "加载轨迹失败", error);
        }
      });
    };
    const devicePosInfo = common_vendor.ref(null);
    const devicePositionUpdateTime = common_vendor.computed(() => {
      const position = devicePosInfo.value;
      return position != null ? position.getString("positionUpdateTime", "暂无位置") : "暂无位置";
    });
    const loadDevicePos = (data) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield api_request.getDevicePos(data);
          if (res.code == 0 && res.data && res.data.length > 0) {
            const position = res.data[0];
            devicePosInfo.value = position;
            const lat = position.getNumber("latitude", 0);
            const lng = position.getNumber("longitude", 0);
            if (isNaN(lat) || isNaN(lng)) {
              common_vendor.index.__f__("error", "at pages/index/index.uvue:560", "经纬度格式错误", position.getString("latitude", ""), position.getString("longitude", ""));
              common_vendor.index.showToast({
                title: "定位数据异常",
                icon: "none"
              });
              return false;
            }
            const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(lat, lng);
            center.latitude = convertedCoord.lat;
            center.longitude = convertedCoord.lng;
            isMapReady.value = true;
            yield delay(100);
            const deviceMarker = createMarker(1, convertedCoord.lat, convertedCoord.lng, "device", currentCarName.value);
            markers.value = [];
            yield delay(50);
            markers.value = [deviceMarker];
            common_vendor.index.__f__("log", "at pages/index/index.uvue:588", "标记点更新完成");
            return true;
          } else {
            common_vendor.index.__f__("warn", "at pages/index/index.uvue:591", "获取设备位置失败");
            isMapReady.value = false;
            common_vendor.index.showToast({
              title: "获取位置失败",
              icon: "none"
            });
            return false;
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:600", "加载设备位置失败", error);
          common_vendor.index.showToast({
            title: "定位失败，请重试",
            icon: "none"
          });
          return false;
        }
      });
    };
    const loadDeviceData = (device) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/index/index.uvue:611", "开始加载设备数据:", device);
        try {
          yield loadDeviceDetail(device.deviceId);
          yield loadDevicePos(new common_vendor.UTSJSONObject({
            deviceId: device.deviceId,
            deviceids: device.imei || device.value
          }));
          yield loadTrackPos(new common_vendor.UTSJSONObject({
            imei: device.imei || device.value,
            startTime: utils_formateTime.formatTimes(todayZero),
            endTime: utils_formateTime.formatTimes(nowTime),
            minParkTime: 120,
            withStop: false,
            withPos: false,
            withTrip: true
          }));
          common_vendor.index.showToast({
            title: "切换成功",
            icon: "success"
          });
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:632", "切换车辆失败", error);
          common_vendor.index.showToast({
            title: "切换失败，请重试",
            icon: "none"
          });
        } finally {
          common_vendor.index.hideLoading();
        }
      });
    };
    const handleConfirm = (e) => {
      showPicker.value = false;
      let selectedIndex = e.indexs.length > 0 ? e.indexs[0] : -1;
      if (selectedIndex < 0 || selectedIndex >= deviceList.value.length) {
        common_vendor.index.__f__("warn", "at pages/index/index.uvue:657", "无法解析选中的索引，使用当前设备");
        const currentIndex = deviceList.value.findIndex((device) => {
          return device.imei === currentCarImei.value || device.deviceId === currentCarDeviceId.value;
        });
        if (currentIndex !== -1) {
          selectedIndex = currentIndex;
          common_vendor.index.__f__("log", "at pages/index/index.uvue:663", "使用当前设备索引:", selectedIndex);
        } else {
          selectedIndex = 0;
          common_vendor.index.__f__("log", "at pages/index/index.uvue:666", "使用默认索引: 0");
        }
      }
      const selectedDevice = deviceList.value[selectedIndex];
      if (!selectedDevice) {
        common_vendor.index.showToast({
          title: "选择设备失败",
          icon: "none"
        });
        return null;
      }
      if (selectedDevice.imei === currentCarImei.value && selectedDevice.deviceId === currentCarDeviceId.value) {
        common_vendor.index.__f__("log", "at pages/index/index.uvue:681", "选择的设备与当前设备相同，不重复加载");
        return null;
      }
      common_vendor.index.__f__("log", "at pages/index/index.uvue:685", "最终选中的设备:", selectedDevice);
      common_vendor.index.__f__("log", "at pages/index/index.uvue:686", "设备名称:", selectedDevice.deviceName || selectedDevice.name);
      common_vendor.index.__f__("log", "at pages/index/index.uvue:687", "设备 IMEI:", selectedDevice.imei);
      common_vendor.index.__f__("log", "at pages/index/index.uvue:688", "选中的索引:", selectedIndex);
      common_vendor.index.__f__("log", "at pages/index/index.uvue:689", "============================================");
      const deviceName = selectedDevice.deviceName || selectedDevice.name || "未命名设备";
      currentCarName.value = deviceName;
      currentCarImei.value = selectedDevice.imei || selectedDevice.value;
      currentCarDeptId.value = selectedDevice.deptId;
      currentCarDeviceId.value = selectedDevice.deviceId;
      currentCarIccId.value = selectedDevice.iccid;
      currentCarSimMerchant.value = selectedDevice.simMerchant;
      currentCarConnectionStatus.value = selectedDevice.connectionStatus;
      currentCarCarType.value = selectedDevice.carType;
      currentCarPlateNo.value = selectedDevice.plateNo;
      center.latitude = selectedDevice.latitude;
      center.longitude = selectedDevice.longitude;
      if (selectedIndex !== -1) {
        saveSelectedDeviceIndex(selectedIndex);
        pickerDefaultIndex.value = [selectedIndex];
      }
      saveSelectedDevice(selectedDevice);
      common_vendor.index.showLoading(new common_vendor.UTSJSONObject({
        title: "加载车辆数据...",
        mask: true
      }));
      loadDeviceData(selectedDevice);
    };
    const loadDeviceList = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield api_request.getUserDeviceList(new common_vendor.UTSJSONObject({
            pageSize: 1e3
          }));
          if (res.code == 0 && res.data && res.data.list && res.data.list.length > 0) {
            userDeviceList.value = res.data.list;
            deviceList.value = res.data.list.map((item) => {
              const imei = item.getString("imei", "");
              const rawDeviceName = item.getString("deviceName", "");
              const deviceName = rawDeviceName != "" ? rawDeviceName : imei != "" ? imei : "未命名设备";
              return new Device({
                name: deviceName,
                deviceName,
                value: imei,
                imei,
                deptId: item.getString("companyId", ""),
                deviceId: item.getString("deviceId", ""),
                iccid: item.getString("iccid", ""),
                simMerchant: item.getString("simMerchant", ""),
                connectionStatus: item.getString("connectionStatus", ""),
                carType: item.getString("carType", ""),
                plateNo: item.getString("plateNo", ""),
                latitude: item.getNumber("latitude", 0),
                longitude: item.getNumber("longitude", 0)
              });
            });
            const savedDevice = getSavedSelectedDevice();
            const savedIndex = getSavedSelectedDeviceIndex();
            let selectedDevice = null;
            let selectedIdx = -1;
            if (savedIndex !== null && savedIndex >= 0 && savedIndex < deviceList.value.length) {
              selectedDevice = deviceList.value[savedIndex];
              selectedIdx = savedIndex;
            }
            if (selectedDevice == null && savedDevice != null && savedDevice.imei != "") {
              selectedDevice = common_vendor.UTS.arrayFind(deviceList.value, (device) => {
                return device.imei === savedDevice.imei || device.value === savedDevice.imei;
              });
              if (selectedDevice) {
                selectedIdx = deviceList.value.indexOf(selectedDevice);
              } else {
                clearSavedSelectedDevice();
                clearSavedSelectedDeviceIndex();
              }
            }
            if (!selectedDevice && deviceList.value.length > 0) {
              selectedDevice = deviceList.value[0];
              selectedIdx = 0;
              saveSelectedDevice(selectedDevice);
              saveSelectedDeviceIndex(0);
              common_vendor.index.__f__("log", "at pages/index/index.uvue:788", "使用第一个设备作为默认:", selectedDevice === null || selectedDevice === void 0 ? null : selectedDevice.deviceName);
            }
            if (selectedDevice != null) {
              const device = selectedDevice;
              const deviceName = device.deviceName != "" ? device.deviceName : device.name != "" ? device.name : "未命名设备";
              currentCarName.value = deviceName;
              currentCarImei.value = device.imei != "" ? device.imei : device.value;
              currentCarDeptId.value = device.deptId;
              currentCarDeviceId.value = device.deviceId;
              currentCarIccId.value = device.iccid;
              currentCarSimMerchant.value = device.simMerchant;
              currentCarConnectionStatus.value = device.connectionStatus;
              currentCarCarType.value = device.carType;
              currentCarPlateNo.value = device.plateNo;
              center.latitude = device.latitude;
              center.longitude = device.longitude;
              if (selectedIdx !== -1) {
                pickerDefaultIndex.value = [selectedIdx];
              }
              yield loadDeviceDetail(device.deviceId);
              yield loadDevicePos(new common_vendor.UTSJSONObject({
                deviceId: device.deviceId,
                deviceids: device.imei != "" ? device.imei : device.value
              }));
              yield loadTrackPos(new common_vendor.UTSJSONObject({
                imei: device.imei != "" ? device.imei : device.value,
                startTime: utils_formateTime.formatTimes(todayZero),
                endTime: utils_formateTime.formatTimes(nowTime),
                minParkTime: 120,
                withStop: false,
                withPos: false,
                withTrip: true
              }));
            }
          } else {
            common_vendor.index.showToast({
              title: "暂无车辆数据",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:834", "加载车辆列表失败", error);
          common_vendor.index.showToast({
            title: "加载失败，请下拉重试",
            icon: "none"
          });
        }
      });
    };
    const totalTrips = common_vendor.computed(() => {
      return tripData.value.length;
    });
    const refreshLocation = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!currentCarDeviceId.value) {
          common_vendor.index.showToast({
            title: "请先选择车辆",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        common_vendor.index.showLoading(new common_vendor.UTSJSONObject({
          title: "刷新位置中...",
          mask: true
        }));
        try {
          yield loadDeviceDetail(currentCarDeviceId.value);
          const success = yield loadDevicePos(new common_vendor.UTSJSONObject({
            deviceId: currentCarDeviceId.value,
            deviceids: currentCarImei.value
          }));
          if (success) {
            common_vendor.index.showToast({
              title: "位置已更新",
              icon: "success"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:873", "刷新位置失败", error);
          common_vendor.index.showToast({
            title: "刷新失败",
            icon: "none"
          });
        } finally {
          common_vendor.index.hideLoading();
        }
      });
    };
    function checkToken() {
      const token = common_vendor.index.getStorageSync("token");
      return token != null && token.toString() != "";
    }
    function isLogin() {
      if (!checkToken()) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        return false;
      }
      return true;
    }
    const toRecordDetail = () => {
      if (!isLogin())
        return null;
      common_vendor.index.navigateTo({
        url: "/pages/playBack/playBack?imei=" + currentCarImei.value + "&connectionStatus=" + currentCarConnectionStatus.value + "&plateNo=" + currentCarPlateNo.value + "&carType=" + currentCarCarType.value + "&lat=" + center.latitude + "&lng=" + center.longitude
      });
    };
    const toDeviceList = () => {
      common_vendor.index.__f__("log", "at pages/index/index.uvue:909", "toDeviceList");
      if (!isLogin())
        return null;
      common_vendor.index.navigateTo({
        url: "/pages/deviceList/deviceList?userDeviceList=" + common_vendor.UTS.JSON.stringify(userDeviceList.value)
      });
    };
    const toDeviceDetail = (e = null) => {
      if (!isLogin())
        return null;
      if (!currentCarImei.value || !currentCarDeptId.value || !currentCarDeviceId.value) {
        common_vendor.index.showToast({
          title: "请先选择车辆",
          icon: "none"
        });
        return null;
      }
      common_vendor.index.navigateTo({
        url: `/pages/carInfoDetail/carInfoDetail?imei=${currentCarImei.value}&deptId=${currentCarDeptId.value}&deviceId=${currentCarDeviceId.value}`
      });
    };
    const toAdd = () => {
      if (!isLogin())
        return null;
      common_vendor.index.navigateTo({
        url: "/pages/addCar/addCar"
      });
    };
    const toMsgCenter = () => {
      if (!isLogin())
        return null;
      common_vendor.index.switchTab({
        url: "/pages/message/message"
      });
    };
    const toFindCar = () => {
      if (!isLogin())
        return null;
      common_vendor.index.openLocation({
        latitude: center.latitude,
        longitude: center.longitude,
        name: currentCarName.value,
        scale: 18,
        success: () => {
          common_vendor.index.showToast({
            title: "成功调起地图",
            icon: "none"
          });
        },
        fail: (err) => {
          common_vendor.index.showToast({
            title: "调起地图失败",
            icon: "none"
          });
          common_vendor.index.__f__("error", "at pages/index/index.uvue:966", "调起地图失败:", err);
        }
      });
    };
    const toFence = () => {
      if (!isLogin())
        return null;
      common_vendor.index.navigateTo({
        url: "/pages/geofencing/geofencing?imei=" + currentCarImei.value + "&connectionStatus=" + currentCarConnectionStatus.value + "&plateNo=" + currentCarPlateNo.value + "&carType=" + currentCarCarType.value + "&deptId=" + currentCarDeptId.value + "&deviceName=" + currentCarName.value
      });
    };
    const contactCustomerService = () => {
      common_vendor.index.openCustomerServiceChat(new common_vendor.UTSJSONObject({
        extInfo: new common_vendor.UTSJSONObject({ url: "https://work.weixin.qq.com/kfid/kfc030824eb947a0c9a" }),
        corpId: "ww686122ec6a4db85a",
        success(res = null) {
          common_vendor.index.__f__("log", "at pages/index/index.uvue:986", res);
        }
      }));
    };
    const needRefresh = common_vendor.ref(false);
    const toPay = (iccid, simMerchant) => {
      if (!isLogin())
        return null;
      if (simMerchant.toLowerCase() == "zddx") {
        iccid = iccid.substring(0, iccid.length - 1);
      }
      common_vendor.index.__f__("log", "at pages/index/index.uvue:1008", iccid);
      needRefresh.value = true;
      common_vendor.index.openEmbeddedMiniProgram(new common_vendor.UTSJSONObject({
        appId: "wx1d647f2cfdc089e6",
        path: "/pages/home/userSimRecharge?iccid=" + iccid,
        envVersion: "release",
        success(res = null) {
          common_vendor.index.__f__("log", "at pages/index/index.uvue:1017", "打开小程序成功", res);
        },
        fail(res = null) {
          common_vendor.index.__f__("log", "at pages/index/index.uvue:1020", "打开小程序失败", res);
          needRefresh.value = false;
          common_vendor.index.showToast({
            title: "打开支付页面失败",
            icon: "none"
          });
        }
      }));
    };
    const gotoLogin = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    };
    function unbindCurrentDevice() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const result = yield api_request.delDevice(currentCarImei.value);
        if (result.code == 0) {
          common_vendor.index.showToast({
            title: "解绑成功",
            icon: "success"
          });
          clearSavedSelectedDevice();
          clearSavedSelectedDeviceIndex();
        } else {
          common_vendor.index.showToast({
            title: "解绑失败",
            icon: "error"
          });
        }
        yield loadDeviceList();
      });
    }
    const unbindDevice = () => {
      if (!isLogin())
        return null;
      common_vendor.index.showModal(new common_vendor.UTSJSONObject({
        title: "解绑车辆",
        content: "确定解绑当前车辆吗？",
        success: (res) => {
          if (res.confirm) {
            void unbindCurrentDevice();
          }
        }
      }));
    };
    common_vendor.onShow(() => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (checkToken()) {
          const needRefresh_1 = common_vendor.index.getStorageSync("needRefreshHome");
          if (needRefresh_1) {
            yield loadDeviceList();
            common_vendor.index.removeStorageSync("needRefreshHome");
          }
        }
      });
    });
    const handleReload = () => {
      if (!isLogin())
        return null;
      loadDeviceList();
    };
    common_vendor.onLoad(() => {
      common_vendor.index.hideTabBar();
      initDimensions();
      if (checkToken()) {
        loadDeviceList();
      }
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: checkToken()
      }, checkToken() ? common_vendor.e({
        b: currentCarName.value
      }, currentCarName.value ? {
        c: common_vendor.t(currentCarName.value ?? "加载中…"),
        d: common_vendor.o(handlePicker, "56")
      } : {}) : {
        e: common_vendor.o(gotoLogin, "13")
      }, {
        f: common_vendor.p({
          name: "/static/right-bottom.png",
          fontSize: "7",
          class: "data-v-00a60067"
        })
      }, {}, {
        i: common_vendor.o(handleReload, "5c"),
        j: common_vendor.p({
          name: "/static/reload.png",
          fontSize: "20",
          class: "data-v-00a60067"
        }),
        k: common_vendor.o(toDeviceList, "4a"),
        l: common_vendor.p({
          name: "/static/maps.png",
          fontSize: "20",
          class: "nav-tool-spacing data-v-00a60067"
        }),
        m: common_vendor.o(toAdd, "ee"),
        n: common_vendor.p({
          name: "/static/addNew.png",
          fontSize: "20",
          class: "nav-tool-spacing data-v-00a60067"
        }),
        o: safeDeviceDetail.value.deviceStatus.batteryPercent && safeDeviceDetail.value.deviceStatus.voltage
      }, safeDeviceDetail.value.deviceStatus.batteryPercent && safeDeviceDetail.value.deviceStatus.voltage ? common_vendor.e({
        p: safeDeviceDetail.value.deviceStatus.batteryPercent
      }, safeDeviceDetail.value.deviceStatus.batteryPercent ? {
        q: common_vendor.p({
          percent: safeDeviceDetail.value.deviceStatus.batteryPercent,
          class: "data-v-00a60067"
        })
      } : {}, {
        r: safeDeviceDetail.value.deviceStatus.batteryPercent
      }, safeDeviceDetail.value.deviceStatus.batteryPercent ? {
        s: common_vendor.t(safeDeviceDetail.value.deviceStatus.batteryPercent)
      } : {}, {
        t: safeDeviceDetail.value.deviceStatus.voltage
      }, safeDeviceDetail.value.deviceStatus.voltage ? {
        v: common_vendor.t(safeDeviceDetail.value.deviceStatus.voltage)
      } : {}) : {}, {
        w: common_assets._imports_1,
        x: common_vendor.t(safeDeviceDetail.value.connectionStatus === "online" ? "在线" : "离线"),
        y: safeDeviceDetail.value.connectionStatus === "online" ? 1 : "",
        z: common_vendor.t(devicePositionUpdateTime.value),
        A: statusBarHeight.value + 50 + "px",
        B: common_vendor.o(refreshLocation, "35"),
        C: isMapReady.value
      }, isMapReady.value ? {
        D: common_vendor.sei("myMap", "map"),
        E: center.latitude,
        F: center.longitude,
        G: markers.value,
        H: mapScale.value
      } : {}, {
        I: common_vendor.o(toRecordDetail, "20"),
        J: common_vendor.t(totalTrips.value),
        K: common_vendor.t((totalMileage.value / 1e3).toFixed(2)),
        L: common_assets._imports_2,
        M: common_vendor.p({
          name: "/static/arrow-right.png",
          fontSize: "15",
          class: "data-v-00a60067"
        }),
        N: common_vendor.o(toDeviceDetail, "5e"),
        O: common_assets._imports_3,
        P: common_vendor.p({
          name: "/static/arrow-right.png",
          fontSize: "15",
          class: "data-v-00a60067"
        }),
        Q: common_vendor.o(toFindCar, "5c"),
        R: common_assets._imports_4,
        S: common_vendor.p({
          name: "/static/arrow-right.png",
          fontSize: "15",
          class: "data-v-00a60067"
        }),
        T: common_vendor.o(toFence, "93"),
        U: common_assets._imports_5,
        V: common_vendor.o(toMsgCenter, "09"),
        W: common_assets._imports_6,
        X: common_vendor.o(($event) => {
          return toPay(currentCarIccId.value, currentCarSimMerchant.value);
        }, "59"),
        Y: common_assets._imports_7,
        Z: common_vendor.o(contactCustomerService, "1b"),
        aa: common_assets._imports_8,
        ab: common_vendor.o(unbindDevice, "44"),
        ac: showPicker.value
      }, showPicker.value ? {
        ad: pickerKey.value,
        ae: common_vendor.o(handleConfirm, "ef"),
        af: common_vendor.o(closePicker, "96"),
        ag: common_vendor.o(closePicker, "69"),
        ah: common_vendor.p({
          show: showPicker.value,
          columns: pickerColumns.value,
          defaultIndex: pickerDefaultIndex.value,
          visibleItemCount: 5,
          class: "data-v-00a60067"
        })
      } : {}, {
        ai: common_vendor.sei(common_vendor.gei(_ctx, ""), "scroll-view"),
        aj: `${_ctx.u_s_b_h}px`,
        ak: `${_ctx.u_s_a_i_b}px`,
        al: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-00a60067"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
