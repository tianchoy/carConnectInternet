"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_request = require("../../api/request.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
const utils_gettime = require("../../utils/gettime.js");
const utils_formateTime = require("../../utils/formateTime.js");
const utils_cars = require("../../utils/cars.js");
if (!Array) {
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_line_progress_1 = common_vendor.resolveComponent("uv-line-progress");
  const _easycom_uv_picker_1 = common_vendor.resolveComponent("uv-picker");
  (_easycom_uv_icon_1 + _easycom_uv_line_progress_1 + _easycom_uv_picker_1)();
}
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_line_progress = () => "../../uni_modules/uv-line-progress/components/uv-line-progress/uv-line-progress.js";
const _easycom_uv_picker = () => "../../uni_modules/uv-picker/components/uv-picker/uv-picker.js";
if (!Math) {
  (_easycom_uv_icon + _easycom_uv_line_progress + _easycom_uv_picker)();
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
    const menuButtonInfo = common_vendor.ref(null);
    const navBarHeight = common_vendor.ref(44);
    const deviceList = common_vendor.ref([]);
    const picker = common_vendor.ref(null);
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
        // 新增：保存选中的设备索引
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
        return new common_vendor.UTSJSONObject(Object.assign(Object.assign({}, device), { displayName: `${device.name} (${device.connectionStatus === "online" ? "在线" : "离线"})`, name: device.name }));
      })];
    });
    const initDimensions = () => {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = systemInfo.statusBarHeight || 20;
      try {
        const menuRect = common_vendor.index.getMenuButtonBoundingClientRect();
        if (menuRect) {
          menuButtonInfo.value = menuRect;
          const gap = menuRect.top - statusBarHeight.value;
          navBarHeight.value = gap * 2 + menuRect.height + 4;
        }
      } catch (e) {
        console.warn("胶囊按钮信息获取失败", e);
      }
    };
    const delay = (ms) => {
      return new Promise((resolve) => {
        return setTimeout(resolve, ms);
      });
    };
    const saveSelectedDevice = (device) => {
      try {
        const deviceInfo = new common_vendor.UTSJSONObject({
          name: device.name,
          imei: device.value,
          deptId: device.deptId,
          deviceId: device.deviceId,
          iccid: device.iccid,
          simMerchant: device.simMerchant,
          connectionStatus: device.connectionStatus,
          carType: device.carType,
          plateNo: device.plateNo
        });
        common_vendor.index.setStorageSync(STORAGE_KEYS.SELECTED_DEVICE, deviceInfo);
        console.log("保存选中设备成功:", deviceInfo);
      } catch (error) {
        console.error("保存选中设备失败:", error);
      }
    };
    const getSavedSelectedDevice = () => {
      try {
        const savedDevice = common_vendor.index.getStorageSync(STORAGE_KEYS.SELECTED_DEVICE);
        if (savedDevice && savedDevice.imei) {
          console.log("获取保存设备成功:", savedDevice);
          return savedDevice;
        }
      } catch (error) {
        console.error("获取保存设备失败:", error);
      }
      return null;
    };
    const clearSavedSelectedDevice = () => {
      try {
        common_vendor.index.removeStorageSync(STORAGE_KEYS.SELECTED_DEVICE);
        console.log("清除保存设备成功");
      } catch (error) {
        console.error("清除保存设备失败:", error);
      }
    };
    const saveSelectedDeviceIndex = (index) => {
      try {
        common_vendor.index.setStorageSync(STORAGE_KEYS.SELECTED_DEVICE_INDEX, index);
      } catch (error) {
        console.error("保存选中设备索引失败:", error);
      }
    };
    const getSavedSelectedDeviceIndex = () => {
      try {
        const savedIndex = common_vendor.index.getStorageSync(STORAGE_KEYS.SELECTED_DEVICE_INDEX);
        if (savedIndex !== void 0 && savedIndex !== null) {
          return savedIndex;
        }
      } catch (error) {
        console.error("获取保存设备索引失败:", error);
      }
      return null;
    };
    const clearSavedSelectedDeviceIndex = () => {
      try {
        common_vendor.index.removeStorageSync(STORAGE_KEYS.SELECTED_DEVICE_INDEX);
      } catch (error) {
        console.error("清除保存设备索引失败:", error);
      }
    };
    const setCurrentCarFromSavedDevice = (savedDevice = null) => {
      currentCarName.value = savedDevice.name;
      currentCarImei.value = savedDevice.value;
      currentCarDeptId.value = savedDevice.deptId;
      currentCarDeviceId.value = savedDevice.deviceId;
      currentCarIccId.value = savedDevice.iccid;
      currentCarSimMerchant.value = savedDevice.simMerchant;
      currentCarConnectionStatus.value = savedDevice.connectionStatus;
      currentCarCarType.value = savedDevice.carType;
      currentCarPlateNo.value = savedDevice.plateNo;
      center.latitude = savedDevice.latitude;
      center.longitude = savedDevice.longitude;
    };
    const handlePicker = () => {
      var _a2;
      if (deviceList.value.length === 0) {
        common_vendor.index.showToast({
          title: "暂无车辆数据",
          icon: "none"
        });
        return null;
      }
      (_a2 = picker.value) === null || _a2 === void 0 ? null : _a2.open();
      const savedIndex = getSavedSelectedDeviceIndex();
      if (savedIndex !== null && savedIndex >= 0 && savedIndex < deviceList.value.length) {
        setTimeout(() => {
          var _a3;
          (_a3 = picker.value) === null || _a3 === void 0 ? null : _a3.setIndexs([savedIndex], true);
          console.log("设置 picker 选中索引:", savedIndex);
        }, 100);
      } else {
        const currentIndex = deviceList.value.findIndex((device) => {
          return device.value === currentCarImei.value;
        });
        if (currentIndex !== -1) {
          setTimeout(() => {
            var _a3;
            (_a3 = picker.value) === null || _a3 === void 0 ? null : _a3.setIndexs([currentIndex], true);
            console.log("根据当前设备设置 picker 选中索引:", currentIndex);
          }, 100);
        }
      }
    };
    const confirm = (e = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a2;
        const selectedDevice = e.value[0];
        currentCarName.value = selectedDevice.name;
        currentCarImei.value = selectedDevice.value;
        currentCarDeptId.value = selectedDevice.deptId;
        currentCarDeviceId.value = selectedDevice.deviceId;
        currentCarIccId.value = selectedDevice.iccid;
        currentCarSimMerchant.value = selectedDevice.simMerchant;
        currentCarConnectionStatus.value = selectedDevice.connectionStatus;
        currentCarCarType.value = selectedDevice.carType;
        currentCarPlateNo.value = selectedDevice.plateNo;
        center.latitude = selectedDevice.latitude;
        center.longitude = selectedDevice.longitude;
        const selectedIndex = deviceList.value.findIndex((device) => {
          return device.deviceId === selectedDevice.deviceId;
        });
        if (selectedIndex !== -1) {
          saveSelectedDeviceIndex(selectedIndex);
          (_a2 = picker.value) === null || _a2 === void 0 ? null : _a2.setIndexs([selectedIndex], true);
        }
        saveSelectedDevice(selectedDevice);
        common_vendor.index.showLoading(new common_vendor.UTSJSONObject({
          title: "加载车辆数据...",
          mask: true
        }));
        try {
          yield loadDeviceDetail(selectedDevice.deviceId);
          yield loadDevicePos(new common_vendor.UTSJSONObject({
            deviceId: selectedDevice.deviceId,
            deviceids: selectedDevice.value
          }));
          yield loadTrackPos(new common_vendor.UTSJSONObject({
            imei: selectedDevice.value,
            startTime: utils_formateTime.formatTimes(todayZero),
            endTime: utils_formateTime.formatTimes(nowTime),
            minParkTime: 120,
            withStop: false,
            withPos: false,
            withTrip: true
          }));
        } catch (error) {
          console.error("切换车辆失败", error);
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
          const res = yield api_request.getUserDeviceList({
            pageSize: 1e3
          });
          if (res.code == 0 && res.data && res.data.list && res.data.list.length > 0) {
            userDeviceList.value = res.data;
            deviceList.value = res.data.list.map((item = null) => {
              return new common_vendor.UTSJSONObject({
                name: item.deviceName || item.imei,
                value: item.imei,
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
            if (savedIndex !== null && savedIndex >= 0 && savedIndex < deviceList.value.length) {
              selectedDevice = deviceList.value[savedIndex];
            }
            if (!selectedDevice && savedDevice && savedDevice.imei) {
              selectedDevice = common_vendor.UTS.arrayFind(deviceList.value, (device) => {
                return device.value === savedDevice.imei;
              });
              if (selectedDevice) {
                console.log("使用保存的设备信息选择设备:", selectedDevice === null || selectedDevice === void 0 ? null : selectedDevice.name);
              } else {
                clearSavedSelectedDevice();
                clearSavedSelectedDeviceIndex();
                console.log("保存的设备已不存在，使用第一个设备");
              }
            }
            if (!selectedDevice && deviceList.value.length > 0) {
              selectedDevice = deviceList.value[0];
              saveSelectedDevice(selectedDevice);
              saveSelectedDeviceIndex(0);
              console.log("使用第一个设备作为默认:", selectedDevice === null || selectedDevice === void 0 ? null : selectedDevice.name);
            }
            if (selectedDevice) {
              setCurrentCarFromSavedDevice(selectedDevice);
              yield loadDeviceDetail(selectedDevice.deviceId);
              console.log("加载车辆详情:", selectedDevice);
              yield loadDevicePos(new common_vendor.UTSJSONObject({
                deviceId: selectedDevice.deviceId,
                deviceids: selectedDevice.value
              }));
              yield loadTrackPos(new common_vendor.UTSJSONObject({
                imei: selectedDevice.value,
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
          console.error("加载车辆列表失败", error);
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
            console.warn("获取设备详情失败:", res.msg);
          }
        } catch (error) {
          console.error("加载设备详情失败", error);
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
          console.error("加载轨迹失败", error);
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
              console.error("经纬度格式错误", res.data[0].latitude, res.data[0].longitude);
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
              console.error("坐标转换失败:", transformError);
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
            console.log("标记点更新完成");
            return true;
          } else {
            console.warn("获取设备位置失败:", res.msg);
            isMapReady.value = false;
            common_vendor.index.showToast({
              title: res.msg || "获取位置失败",
              icon: "none"
            });
            return false;
          }
        } catch (error) {
          console.error("加载设备位置失败", error);
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
          console.error("刷新位置失败", error);
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
      console.log("toDeviceList");
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
          console.error("调起地图失败:", err);
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
          console.log(res);
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
      console.log(iccid);
      needRefresh.value = true;
      common_vendor.wx$1.openEmbeddedMiniProgram(new common_vendor.UTSJSONObject({
        appId: "wx1d647f2cfdc089e6",
        path: "/pages/home/userSimRecharge?iccid=" + iccid,
        envVersion: "release",
        success(res = null) {
          console.log("打开小程序成功", res);
        },
        fail(res = null) {
          console.log("打开小程序失败", res);
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
      }, checkToken() ? {
        b: common_vendor.t(currentCarName.value ?? "加载中…"),
        c: common_vendor.o(handlePicker, "ae")
      } : {
        d: common_vendor.o(gotoLogin, "a8")
      }, {}, {
        g: common_vendor.o(toDeviceList, "5d"),
        h: common_vendor.p({
          name: "grid-fill",
          size: "25",
          class: "data-v-00a60067"
        }),
        i: common_vendor.o(toAdd, "39"),
        j: common_vendor.p({
          name: "plus-circle",
          size: "25",
          class: "data-v-00a60067"
        }),
        k: safeDeviceDetail.value.deviceStatus.batteryPercent && safeDeviceDetail.value.deviceStatus.voltage
      }, safeDeviceDetail.value.deviceStatus.batteryPercent && safeDeviceDetail.value.deviceStatus.voltage ? common_vendor.e({
        l: safeDeviceDetail.value.deviceStatus.batteryPercent
      }, safeDeviceDetail.value.deviceStatus.batteryPercent ? {
        m: common_vendor.p({
          percentage: safeDeviceDetail.value.deviceStatus.batteryPercent,
          height: "20rpx",
          activeColor: "#19be6b",
          inactiveColor: "#999",
          class: "data-v-00a60067"
        })
      } : {}, {
        n: safeDeviceDetail.value.deviceStatus.batteryPercent
      }, safeDeviceDetail.value.deviceStatus.batteryPercent ? {
        o: common_vendor.t(safeDeviceDetail.value.deviceStatus.batteryPercent)
      } : {}, {
        p: safeDeviceDetail.value.deviceStatus.voltage
      }, safeDeviceDetail.value.deviceStatus.voltage ? {
        q: common_vendor.t(safeDeviceDetail.value.deviceStatus.voltage)
      } : {}) : {}, {
        r: common_assets._imports_1,
        s: common_vendor.t(safeDeviceDetail.value.connectionStatus === "online" ? "在线" : "离线"),
        t: safeDeviceDetail.value.connectionStatus === "online" ? 1 : "",
        v: common_vendor.t(devicePosInfo.value.positionUpdateTime ?? "暂无位置"),
        w: statusBarHeight.value + 50 + "px",
        x: common_vendor.o(refreshLocation, "88"),
        y: isMapReady.value
      }, isMapReady.value ? {
        z: common_vendor.sei("myMap", "map"),
        A: center.latitude,
        B: center.longitude,
        C: markers.value,
        D: mapScale.value
      } : {}, {
        E: common_vendor.o(toRecordDetail, "41"),
        F: common_vendor.t(totalTrips.value),
        G: common_vendor.t((totalMileage.value / 1e3).toFixed(2)),
        H: common_assets._imports_2,
        I: common_vendor.p({
          name: "arrow-right",
          class: "data-v-00a60067"
        }),
        J: common_vendor.o(toDeviceDetail, "80"),
        K: common_assets._imports_3,
        L: common_vendor.p({
          name: "arrow-right",
          class: "data-v-00a60067"
        }),
        M: common_vendor.o(toFindCar, "14"),
        N: common_assets._imports_4,
        O: common_vendor.p({
          name: "arrow-right",
          class: "data-v-00a60067"
        }),
        P: common_vendor.o(toFence, "dc"),
        Q: common_assets._imports_5,
        R: common_vendor.o(toMsgCenter, "c5"),
        S: common_assets._imports_6,
        T: common_vendor.o(($event) => {
          return toPay(currentCarIccId.value, currentCarSimMerchant.value);
        }, "c1"),
        U: common_assets._imports_7,
        V: common_vendor.o(contactCustomerService, "26"),
        W: common_assets._imports_8,
        X: common_vendor.o(unbindDevice, "bd"),
        Y: common_vendor.sr(picker, "00a60067-6", {
          "k": "picker"
        }),
        Z: common_vendor.o(confirm, "0d"),
        aa: common_vendor.p({
          color: "#333",
          activeColor: "#ea7312",
          columns: pickerColumns.value,
          keyName: "displayName",
          class: "r data-v-00a60067"
        }),
        ab: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        ac: `${_ctx.u_s_b_h}px`,
        ad: `${_ctx.u_s_a_i_b}px`,
        ae: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-00a60067"]]);
wx.createPage(MiniProgramPage);
