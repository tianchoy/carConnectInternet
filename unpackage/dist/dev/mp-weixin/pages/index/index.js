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
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const _a = utils_gettime.getTodayZeroTime(), nowTime = _a.nowTime, todayZero = _a.todayZero;
    const center = common_vendor.reactive(new common_vendor.UTSJSONObject({
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
    const deviceDetail = common_vendor.ref(new common_vendor.UTSJSONObject({
      deviceStatus: new common_vendor.UTSJSONObject({
        batteryPercent: 0,
        voltage: 0,
        signalStrength: 0
      }),
      connectionStatus: "offline",
      lastUpdateTime: null
    }));
    const markers = common_vendor.ref([]);
    const lastUpdateTime = common_vendor.ref("--:--:--");
    const STORAGE_KEYS = new common_vendor.UTSJSONObject(
      {
        SELECTED_DEVICE: "selected_device_info",
        SELECTED_DEVICE_INDEX: "selected_device_index"
      }
      // 计算属性 
    );
    const safeDeviceDetail = common_vendor.computed(() => {
      var _a2, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _q, _r;
      return new common_vendor.UTSJSONObject({
        deviceStatus: new common_vendor.UTSJSONObject({
          batteryPercent: (_c = (_b = (_a2 = deviceDetail.value) === null || _a2 === void 0 ? null : _a2.deviceStatus) === null || _b === void 0 ? null : _b.batteryPercent) !== null && _c !== void 0 ? _c : 0,
          voltage: (_g = (_f = (_d = deviceDetail.value) === null || _d === void 0 ? null : _d.deviceStatus) === null || _f === void 0 ? null : _f.voltage) !== null && _g !== void 0 ? _g : 0,
          signalStrength: (_k = (_j = (_h = deviceDetail.value) === null || _h === void 0 ? null : _h.deviceStatus) === null || _j === void 0 ? null : _j.signalStrength) !== null && _k !== void 0 ? _k : 0
        }),
        connectionStatus: (_m = (_l = deviceDetail.value) === null || _l === void 0 ? null : _l.connectionStatus) !== null && _m !== void 0 ? _m : "offline",
        lastUpdateTime: (_r = (_q = deviceDetail.value) === null || _q === void 0 ? null : _q.lastUpdateTime) !== null && _r !== void 0 ? _r : null
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
        return setTimeout(resolve, ms);
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
        common_vendor.index.setStorageSync(STORAGE_KEYS.SELECTED_DEVICE, deviceInfo);
        common_vendor.index.__f__("log", "at pages/index/index.uvue:281", "保存选中设备成功:", deviceInfo);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.uvue:283", "保存选中设备失败:", error);
      }
    };
    const getSavedSelectedDevice = () => {
      try {
        const savedDevice = common_vendor.index.getStorageSync(STORAGE_KEYS.SELECTED_DEVICE);
        if (savedDevice && savedDevice.imei) {
          return savedDevice;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.uvue:295", "获取保存设备失败:", error);
      }
      return null;
    };
    const clearSavedSelectedDevice = () => {
      try {
        common_vendor.index.removeStorageSync(STORAGE_KEYS.SELECTED_DEVICE);
        common_vendor.index.__f__("log", "at pages/index/index.uvue:304", "清除保存设备成功");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.uvue:306", "清除保存设备失败:", error);
      }
    };
    const saveSelectedDeviceIndex = (index) => {
      try {
        common_vendor.index.setStorageSync(STORAGE_KEYS.SELECTED_DEVICE_INDEX, index);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.uvue:315", "保存选中设备索引失败:", error);
      }
    };
    const getSavedSelectedDeviceIndex = () => {
      try {
        const savedIndex = common_vendor.index.getStorageSync(STORAGE_KEYS.SELECTED_DEVICE_INDEX);
        if (savedIndex !== void 0 && savedIndex !== null) {
          return savedIndex;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.uvue:327", "获取保存设备索引失败:", error);
      }
      return null;
    };
    const clearSavedSelectedDeviceIndex = () => {
      try {
        common_vendor.index.removeStorageSync(STORAGE_KEYS.SELECTED_DEVICE_INDEX);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.uvue:337", "清除保存设备索引失败:", error);
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
    const handleConfirm = (e = null) => {
      showPicker.value = false;
      let selectedIndex = -1;
      if (e && e.indexs && Array.isArray(e.indexs) && e.indexs.length > 0) {
        selectedIndex = e.indexs[0];
      } else if (e && e.index !== void 0 && e.index !== null) {
        selectedIndex = typeof e.index === "number" ? e.index : parseInt(e.index);
      } else if (e && e.detail) {
        if (e.detail.indexs && Array.isArray(e.detail.indexs) && e.detail.indexs.length > 0) {
          selectedIndex = e.detail.indexs[0];
        } else if (e.detail.index !== void 0) {
          selectedIndex = e.detail.index;
        }
      } else if (e && e.value && typeof e.value === "object") {
        const text = e.value.text || e.value.value;
        if (text && typeof text === "string") {
          const matchedDevice = common_vendor.UTS.arrayFind(deviceList.value, (device) => {
            const displayName = device.deviceName || device.name || device.imei || "未命名设备";
            const statusText = device.connectionStatus === "online" ? "在线" : "离线";
            const fullDisplay = `${displayName} (${statusText})`;
            return fullDisplay === text;
          });
          if (matchedDevice) {
            selectedIndex = deviceList.value.indexOf(matchedDevice);
          }
        }
      }
      if (selectedIndex < 0 || selectedIndex >= deviceList.value.length) {
        common_vendor.index.__f__("warn", "at pages/index/index.uvue:436", "无法解析选中的索引，使用当前设备");
        const currentIndex = deviceList.value.findIndex((device) => {
          return device.imei === currentCarImei.value || device.deviceId === currentCarDeviceId.value;
        });
        if (currentIndex !== -1) {
          selectedIndex = currentIndex;
          common_vendor.index.__f__("log", "at pages/index/index.uvue:442", "使用当前设备索引:", selectedIndex);
        } else {
          selectedIndex = 0;
          common_vendor.index.__f__("log", "at pages/index/index.uvue:445", "使用默认索引: 0");
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
        common_vendor.index.__f__("log", "at pages/index/index.uvue:460", "选择的设备与当前设备相同，不重复加载");
        return null;
      }
      common_vendor.index.__f__("log", "at pages/index/index.uvue:464", "最终选中的设备:", selectedDevice);
      common_vendor.index.__f__("log", "at pages/index/index.uvue:465", "设备名称:", selectedDevice.deviceName || selectedDevice.name);
      common_vendor.index.__f__("log", "at pages/index/index.uvue:466", "设备 IMEI:", selectedDevice.imei);
      common_vendor.index.__f__("log", "at pages/index/index.uvue:467", "选中的索引:", selectedIndex);
      common_vendor.index.__f__("log", "at pages/index/index.uvue:468", "============================================");
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
    const loadDeviceData = (device) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/index/index.uvue:504", "开始加载设备数据:", device);
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
          common_vendor.index.__f__("error", "at pages/index/index.uvue:525", "切换车辆失败", error);
          common_vendor.index.showToast({
            title: "切换失败，请重试",
            icon: "none"
          });
        } finally {
          common_vendor.index.hideLoading();
        }
      });
    };
    const loadDeviceList = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield api_request.getUserDeviceList(new common_vendor.UTSJSONObject({
            pageSize: 1e3
          }));
          if (res.code == 0 && res.data && res.data.list && res.data.list.length > 0) {
            userDeviceList.value = res.data;
            deviceList.value = res.data.list.map((item = null) => {
              return new common_vendor.UTSJSONObject({
                name: item.deviceName || item.imei || "未命名设备",
                deviceName: item.deviceName || item.imei || "未命名设备",
                value: item.imei,
                imei: item.imei,
                deptId: item.companyId,
                deviceId: item.deviceId,
                iccid: item.iccid,
                simMerchant: item.simMerchant,
                connectionStatus: item.connectionStatus,
                carType: item.carType,
                plateNo: item.plateNo,
                latitude: item.latitude,
                longitude: item.longitude
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
            if (!selectedDevice && savedDevice && savedDevice.imei) {
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
              common_vendor.index.__f__("log", "at pages/index/index.uvue:595", "使用第一个设备作为默认:", selectedDevice === null || selectedDevice === void 0 ? null : selectedDevice.deviceName);
            }
            if (selectedDevice) {
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
              if (selectedIdx !== -1) {
                pickerDefaultIndex.value = [selectedIdx];
              }
              yield loadDeviceDetail(selectedDevice.deviceId);
              yield loadDevicePos(new common_vendor.UTSJSONObject({
                deviceId: selectedDevice.deviceId,
                deviceids: selectedDevice.imei || selectedDevice.value
              }));
              yield loadTrackPos(new common_vendor.UTSJSONObject({
                imei: selectedDevice.imei || selectedDevice.value,
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
              title: res.msg || "暂无车辆数据",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:640", "加载车辆列表失败", error);
          common_vendor.index.showToast({
            title: "加载失败，请下拉重试",
            icon: "none"
          });
        }
      });
    };
    const loadDeviceDetail = (deviceId) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a2, _b, _c, _d, _f, _g, _h, _j;
        try {
          const res = yield api_request.getDeviceDetail(deviceId);
          if (res.code == 0 && res.data) {
            deviceDetail.value = {
              deviceStatus: {
                batteryPercent: (_b = (_a2 = res.data.deviceStatus) === null || _a2 === void 0 ? null : _a2.batteryPercent) !== null && _b !== void 0 ? _b : 0,
                voltage: (_d = (_c = res.data.deviceStatus) === null || _c === void 0 ? null : _c.voltage) !== null && _d !== void 0 ? _d : 0,
                signalStrength: (_g = (_f = res.data.deviceStatus) === null || _f === void 0 ? null : _f.signalStrength) !== null && _g !== void 0 ? _g : 0
              },
              connectionStatus: (_h = res.data.connectionStatus) !== null && _h !== void 0 ? _h : "offline",
              lastUpdateTime: (_j = res.data.lastUpdateTime) !== null && _j !== void 0 ? _j : null
            };
            if (res.data.lastUpdateTime) {
              const date = new Date(res.data.lastUpdateTime);
              lastUpdateTime.value = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
            }
          } else {
            common_vendor.index.__f__("warn", "at pages/index/index.uvue:669", "获取设备详情失败:", res.msg);
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:672", "加载设备详情失败", error);
        }
      });
    };
    common_vendor.ref(new common_vendor.UTSJSONObject({}));
    const tripData = common_vendor.ref([]);
    const totalMileage = common_vendor.ref(0);
    const averageSpeed = common_vendor.ref(0);
    const loadTrackPos = (data = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield api_request.getTrackPos(data);
          if (res.code == 401) {
            common_vendor.index.showToast({
              title: "登录过期，请重新登录",
              icon: "none",
              duration: 2e3
            });
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.reLaunch({
              url: "/pages/index/index"
            });
            return false;
          }
          yield processTripData(res.data);
          common_vendor.index.hideLoading();
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:700", "加载轨迹失败", error);
        }
      });
    };
    const totalTrips = common_vendor.computed(() => {
      return tripData.value.length;
    });
    const processTripData = (data = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (data.trips && data.trips.length > 0) {
          const processedTrips = yield Promise.all(data.trips.map((trip = null) => {
            return common_vendor.__awaiter(this, void 0, void 0, function* () {
              return new common_vendor.UTSJSONObject(Object.assign({}, trip));
            });
          }));
          tripData.value = processedTrips;
          let totalDistance = 0;
          let totalDuration = 0;
          let totalAvgSpeed = 0;
          processedTrips.forEach((trip = null) => {
            totalDistance += trip.distance || 0;
            totalDuration += trip.duration || 0;
            totalAvgSpeed += trip.averageSpeed || 0;
          });
          totalMileage.value = totalDistance;
          averageSpeed.value = processedTrips.length > 0 ? totalAvgSpeed / processedTrips.length : 0;
        } else {
          tripData.value = [];
          totalMileage.value = 0;
          averageSpeed.value = 0;
        }
      });
    };
    const devicePosInfo = common_vendor.ref(new common_vendor.UTSJSONObject({}));
    const loadDevicePos = (data = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield api_request.getDevicePos(data);
          if (res.code == 0 && res.data && res.data.length > 0) {
            devicePosInfo.value = res.data[0];
            const lat = Number(res.data[0].latitude);
            const lng = Number(res.data[0].longitude);
            if (isNaN(lat) || isNaN(lng)) {
              common_vendor.index.__f__("error", "at pages/index/index.uvue:753", "经纬度格式错误", res.data[0].latitude, res.data[0].longitude);
              common_vendor.index.showToast({
                title: "定位数据异常",
                icon: "none"
              });
              return false;
            }
            let convertedCoord = null;
            try {
              convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(lat, lng);
            } catch (transformError) {
              common_vendor.index.__f__("error", "at pages/index/index.uvue:765", "坐标转换失败:", transformError);
              convertedCoord = new common_vendor.UTSJSONObject({ lat, lng });
            }
            center.latitude = convertedCoord.lat;
            center.longitude = convertedCoord.lng;
            isMapReady.value = true;
            yield delay(100);
            const deviceMarker = createMarker(1, convertedCoord.lat, convertedCoord.lng, "device", currentCarName.value);
            markers.value = [];
            yield delay(50);
            markers.value = [deviceMarker];
            common_vendor.index.__f__("log", "at pages/index/index.uvue:787", "标记点更新完成");
            return true;
          } else {
            common_vendor.index.__f__("warn", "at pages/index/index.uvue:790", "获取设备位置失败:", res.msg);
            isMapReady.value = false;
            common_vendor.index.showToast({
              title: res.msg || "获取位置失败",
              icon: "none"
            });
            return false;
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:799", "加载设备位置失败", error);
          common_vendor.index.showToast({
            title: "定位失败，请重试",
            icon: "none"
          });
          return false;
        }
      });
    };
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
            const mapContext = common_vendor.index.createMapContext("myMap", this);
            mapContext.moveToLocation(new common_vendor.UTSJSONObject({
              latitude: center.latitude,
              longitude: center.longitude
            }));
            common_vendor.index.showToast({
              title: "位置已更新",
              icon: "success"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:839", "刷新位置失败", error);
          common_vendor.index.showToast({
            title: "刷新失败",
            icon: "none"
          });
        } finally {
          common_vendor.index.hideLoading();
        }
      });
    };
    const toRecordDetail = () => {
      if (!isLogin())
        return null;
      common_vendor.index.navigateTo({
        url: "/pages/playBack/playBack?imei=" + currentCarImei.value + "&connectionStatus=" + currentCarConnectionStatus.value + "&plateNo=" + currentCarPlateNo.value + "&carType=" + currentCarCarType.value + "&lat=" + center.latitude + "&lng=" + center.longitude
      });
    };
    const toDeviceList = () => {
      common_vendor.index.__f__("log", "at pages/index/index.uvue:859", "toDeviceList");
      if (!isLogin())
        return null;
      common_vendor.index.navigateTo({
        url: "/pages/deviceList/deviceList?userDeviceList=" + common_vendor.UTS.JSON.stringify(userDeviceList.value)
      });
    };
    const createMarker = (id, lat, lng, type, title = null) => {
      const isOnline = safeDeviceDetail.value.connectionStatus === "online";
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
          common_vendor.index.__f__("error", "at pages/index/index.uvue:941", "调起地图失败:", err);
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
          common_vendor.index.__f__("log", "at pages/index/index.uvue:960", res);
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
      common_vendor.index.__f__("log", "at pages/index/index.uvue:973", iccid);
      needRefresh.value = true;
      common_vendor.index.openEmbeddedMiniProgram(new common_vendor.UTSJSONObject({
        appId: "wx1d647f2cfdc089e6",
        path: "/pages/home/userSimRecharge?iccid=" + iccid,
        envVersion: "release",
        success(res = null) {
          common_vendor.index.__f__("log", "at pages/index/index.uvue:982", "打开小程序成功", res);
        },
        fail(res = null) {
          common_vendor.index.__f__("log", "at pages/index/index.uvue:985", "打开小程序失败", res);
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
    const unbindDevice = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!isLogin())
          return Promise.resolve(null);
        common_vendor.index.showModal(new common_vendor.UTSJSONObject({
          title: "解绑车辆",
          content: "确定解绑当前车辆吗？",
          success: (res) => {
            return common_vendor.__awaiter(this, void 0, void 0, function* () {
              if (res.confirm) {
                const res_1 = yield api_request.delDevice(currentCarImei.value);
                if (res_1.code == 0) {
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
                loadDeviceList();
              }
            });
          }
        }));
      });
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
    const checkToken = () => {
      const token = common_vendor.index.getStorageSync("token");
      return !!token;
    };
    const isLogin = () => {
      if (!checkToken()) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        return false;
      }
      return true;
    };
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
        d: common_vendor.o(handlePicker, "b1")
      } : {}) : {
        e: common_vendor.o(gotoLogin, "c1")
      }, {}, {
        h: common_vendor.o(handleReload, "b0"),
        i: common_vendor.p({
          name: "/static/reload.png",
          fontSize: "20",
          class: "data-v-00a60067"
        }),
        j: common_vendor.o(toDeviceList, "b3"),
        k: common_vendor.p({
          name: "/static/maps.png",
          fontSize: "20",
          class: "data-v-00a60067"
        }),
        l: common_vendor.o(toAdd, "78"),
        m: common_vendor.p({
          name: "/static/addNew.png",
          fontSize: "20",
          class: "data-v-00a60067"
        }),
        n: safeDeviceDetail.value.deviceStatus.batteryPercent && safeDeviceDetail.value.deviceStatus.voltage
      }, safeDeviceDetail.value.deviceStatus.batteryPercent && safeDeviceDetail.value.deviceStatus.voltage ? common_vendor.e({
        o: safeDeviceDetail.value.deviceStatus.batteryPercent
      }, safeDeviceDetail.value.deviceStatus.batteryPercent ? {
        p: common_vendor.p({
          percent: safeDeviceDetail.value.deviceStatus.batteryPercent,
          class: "data-v-00a60067"
        })
      } : {}, {
        q: safeDeviceDetail.value.deviceStatus.batteryPercent
      }, safeDeviceDetail.value.deviceStatus.batteryPercent ? {
        r: common_vendor.t(safeDeviceDetail.value.deviceStatus.batteryPercent)
      } : {}, {
        s: safeDeviceDetail.value.deviceStatus.voltage
      }, safeDeviceDetail.value.deviceStatus.voltage ? {
        t: common_vendor.t(safeDeviceDetail.value.deviceStatus.voltage)
      } : {}) : {}, {
        v: common_assets._imports_1,
        w: common_vendor.t(safeDeviceDetail.value.connectionStatus === "online" ? "在线" : "离线"),
        x: safeDeviceDetail.value.connectionStatus === "online" ? 1 : "",
        y: common_vendor.t(devicePosInfo.value.positionUpdateTime ?? "暂无位置"),
        z: statusBarHeight.value + 50 + "px",
        A: common_vendor.o(refreshLocation, "f9"),
        B: isMapReady.value
      }, isMapReady.value ? {
        C: common_vendor.sei("myMap", "map"),
        D: center.latitude,
        E: center.longitude,
        F: markers.value,
        G: mapScale.value
      } : {}, {
        H: common_vendor.o(toRecordDetail, "1a"),
        I: common_vendor.t(totalTrips.value),
        J: common_vendor.t((totalMileage.value / 1e3).toFixed(2)),
        K: common_assets._imports_2,
        L: common_vendor.p({
          name: "/static/arrow-right.png",
          fontSize: "15",
          class: "data-v-00a60067"
        }),
        M: common_vendor.o(toDeviceDetail, "ed"),
        N: common_assets._imports_3,
        O: common_vendor.p({
          name: "/static/arrow-right.png",
          fontSize: "15",
          class: "data-v-00a60067"
        }),
        P: common_vendor.o(toFindCar, "24"),
        Q: common_assets._imports_4,
        R: common_vendor.p({
          name: "/static/arrow-right.png",
          fontSize: "15",
          class: "data-v-00a60067"
        }),
        S: common_vendor.o(toFence, "3e"),
        T: common_assets._imports_5,
        U: common_vendor.o(toMsgCenter, "d8"),
        V: common_assets._imports_6,
        W: common_vendor.o(($event) => {
          return toPay(currentCarIccId.value, currentCarSimMerchant.value);
        }, "45"),
        X: common_assets._imports_7,
        Y: common_vendor.o(contactCustomerService, "f7"),
        Z: common_assets._imports_8,
        aa: common_vendor.o(unbindDevice, "d5"),
        ab: showPicker.value
      }, showPicker.value ? {
        ac: pickerKey.value,
        ad: common_vendor.o(handleConfirm, "b5"),
        ae: common_vendor.o(closePicker, "0f"),
        af: common_vendor.o(closePicker, "17"),
        ag: common_vendor.p({
          show: showPicker.value,
          columns: pickerColumns.value,
          defaultIndex: pickerDefaultIndex.value,
          visibleItemCount: 5,
          class: "data-v-00a60067"
        })
      } : {}, {
        ah: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        ai: `${_ctx.u_s_b_h}px`,
        aj: `${_ctx.u_s_a_i_b}px`,
        ak: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-00a60067"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
