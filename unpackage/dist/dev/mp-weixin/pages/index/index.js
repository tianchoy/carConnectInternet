"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_request = require("../../api/request.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
const utils_gettime = require("../../utils/gettime.js");
const utils_formateTime = require("../../utils/formateTime.js");
if (!Array) {
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_line_progress_1 = common_vendor.resolveComponent("uv-line-progress");
  const _easycom_uv_button_1 = common_vendor.resolveComponent("uv-button");
  const _easycom_uv_picker_1 = common_vendor.resolveComponent("uv-picker");
  (_easycom_uv_icon_1 + _easycom_uv_line_progress_1 + _easycom_uv_button_1 + _easycom_uv_picker_1)();
}
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_line_progress = () => "../../uni_modules/uv-line-progress/components/uv-line-progress/uv-line-progress.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_uv_picker = () => "../../uni_modules/uv-picker/components/uv-picker/uv-picker.js";
if (!Math) {
  (_easycom_uv_icon + _easycom_uv_line_progress + _easycom_uv_button + _easycom_uv_picker)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const _a = utils_gettime.getTodayZeroTime(), nowTime = _a.nowTime, todayZero = _a.todayZero;
    const center = common_vendor.reactive(new common_vendor.UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const isLogin = common_vendor.ref(false);
    const isMapReady = common_vendor.ref(false);
    const mapScale = common_vendor.ref(17);
    const statusBarHeight = common_vendor.ref(20);
    const menuButtonInfo = common_vendor.ref(null);
    const navBarHeight = common_vendor.ref(44);
    common_vendor.ref(true);
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
    const safeDeviceDetail = common_vendor.computed(() => {
      var _a2, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _q, _r;
      return new common_vendor.UTSJSONObject({
        deviceStatus: new common_vendor.UTSJSONObject({
          batteryPercent: (_c = (_b = (_a2 = deviceDetail.value) === null || _a2 === void 0 ? null : _a2.deviceStatus) === null || _b === void 0 ? null : _b.batteryPercent) !== null && _c !== void 0 ? _c : 0,
          voltage: (_g = (_f = (_d = deviceDetail.value) === null || _d === void 0 ? null : _d.deviceStatus) === null || _f === void 0 ? null : _f.voltage) !== null && _g !== void 0 ? _g : "--",
          signalStrength: (_k = (_j = (_h = deviceDetail.value) === null || _h === void 0 ? null : _h.deviceStatus) === null || _j === void 0 ? null : _j.signalStrength) !== null && _k !== void 0 ? _k : 0
        }),
        connectionStatus: (_m = (_l = deviceDetail.value) === null || _l === void 0 ? null : _l.connectionStatus) !== null && _m !== void 0 ? _m : "offline",
        lastUpdateTime: (_r = (_q = deviceDetail.value) === null || _q === void 0 ? null : _q.lastUpdateTime) !== null && _r !== void 0 ? _r : null
      });
    });
    const pickerColumns = common_vendor.computed(() => {
      return [deviceList.value];
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
    };
    const confirm = (e = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!isLogin.value || !e.value || !e.value[0])
          return Promise.resolve(null);
        currentCarName.value = e.value[0].name;
        currentCarImei.value = e.value[0].value;
        currentCarDeptId.value = e.value[0].deptId;
        currentCarDeviceId.value = e.value[0].deviceId;
        currentCarIccId.value = e.value[0].iccid;
        currentCarSimMerchant.value = e.value[0].simMerchant;
        currentCarConnectionStatus.value = e.value[0].connectionStatus;
        currentCarCarType.value = e.value[0].carType;
        currentCarPlateNo.value = e.value[0].plateNo;
        common_vendor.index.showLoading(new common_vendor.UTSJSONObject({
          title: "加载车辆数据...",
          mask: true
        }));
        try {
          yield loadDeviceDetail(e.value[0].deviceId);
          yield loadDevicePos(new common_vendor.UTSJSONObject({
            deviceId: e.value[0].deviceId,
            deviceids: e.value[0].value
          }));
          yield loadTrackPos(new common_vendor.UTSJSONObject({
            imei: e.value[0].value,
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
        if (!checkToken())
          return Promise.resolve(null);
        isLogin.value = true;
        try {
          const res = yield api_request.getUserDeviceList({
            pageSize: 1e3
          });
          if (res.code == 0 && res.data && res.data.list && res.data.list.length > 0) {
            deviceList.value = res.data.list.map((item = null) => {
              return new common_vendor.UTSJSONObject({
                name: item.deviceName,
                value: item.imei,
                deptId: item.companyId,
                deviceId: item.deviceId,
                iccid: item.iccid,
                simMerchant: item.simMerchant,
                connectionStatus: item.connectionStatus,
                carType: item.carType,
                plateNo: item.plateNo
              });
            });
            currentCarName.value = deviceList.value[0].name;
            currentCarImei.value = deviceList.value[0].value;
            currentCarDeptId.value = deviceList.value[0].deptId;
            currentCarDeviceId.value = deviceList.value[0].deviceId;
            currentCarIccId.value = deviceList.value[0].iccid;
            currentCarSimMerchant.value = deviceList.value[0].simMerchant;
            currentCarConnectionStatus.value = deviceList.value[0].connectionStatus;
            currentCarCarType.value = deviceList.value[0].carType;
            currentCarPlateNo.value = deviceList.value[0].plateNo;
            yield loadDeviceDetail(deviceList.value[0].deviceId);
            yield loadDevicePos(new common_vendor.UTSJSONObject({
              deviceId: deviceList.value[0].deviceId,
              deviceids: deviceList.value[0].value
            }));
            yield loadTrackPos(new common_vendor.UTSJSONObject({
              imei: deviceList.value[0].value,
              startTime: utils_formateTime.formatTimes(todayZero),
              endTime: utils_formateTime.formatTimes(nowTime),
              minParkTime: 120,
              withStop: false,
              withPos: false,
              withTrip: true
            }));
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
                voltage: (_d = (_c = res.data.deviceStatus) === null || _c === void 0 ? null : _c.voltage) !== null && _d !== void 0 ? _d : "--",
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
          console.log("车辆轨迹:", res);
          if (res.code == 0 && res.data.trips && res.data.trips.length > 0) {
            yield processTripData(res.data);
          } else {
            console.warn("获取轨迹失败:", res.msg);
          }
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
              return new common_vendor.UTSJSONObject(Object.assign(Object.assign({}, trip), { startAddress: "查看位置", endAddress: "查看位置" }));
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
    const createMarker = (id, lat, lng, type, title = null) => {
      const isOnline = safeDeviceDetail.value.connectionStatus === "online";
      const marker = new common_vendor.UTSJSONObject({
        id,
        latitude: lat,
        longitude: lng,
        width: 35,
        height: 35,
        iconPath: isOnline ? "../../static/marker.png" : "../../static/offline-marker.png",
        callout: new common_vendor.UTSJSONObject({
          content: title || "爱车位置",
          color: isOnline ? "#ffffff" : "#999999",
          borderRadius: 10,
          bgColor: isOnline ? "#07C160" : "#CCCCCC",
          padding: 8,
          fontSize: 14,
          display: "ALWAYS"
        }),
        anchor: new common_vendor.UTSJSONObject({ x: 0.5, y: 0.5 })
      });
      return marker;
    };
    const toDeviceDetail = (e = null) => {
      if (!isLogin.value)
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
      if (!isLogin.value)
        return null;
      common_vendor.index.navigateTo({
        url: "/pages/addCar/addCar"
      });
    };
    const toMsgCenter = () => {
      if (!isLogin.value)
        return null;
      common_vendor.index.switchTab({
        url: "/pages/message/message"
      });
    };
    const toFindCar = () => {
      if (!isLogin.value)
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
      if (!isLogin.value)
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
      if (!isLogin.value)
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
    const refreshDeviceList = () => {
      console.log("收到刷新事件，重新加载设备列表");
      loadDeviceList();
    };
    const gotoLogin = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    };
    const unbindDevice = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!isLogin.value)
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
        const token = common_vendor.index.getStorageSync("token");
        if (token) {
          common_vendor.index.$on("refreshDeviceList", refreshDeviceList);
          const needRefresh_1 = common_vendor.index.getStorageSync("needRefreshHome");
          if (needRefresh_1) {
            yield loadDeviceList();
            common_vendor.index.removeStorageSync("needRefreshHome");
          }
        }
      });
    });
    common_vendor.onUnload(() => {
      common_vendor.index.$off("refreshDeviceList", refreshDeviceList);
    });
    const checkToken = () => {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
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
      loadDeviceList();
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.t(currentCarName.value || "请选择车辆"),
        b: common_vendor.o(handlePicker, "03"),
        c: common_vendor.o(toAdd, "34"),
        d: common_vendor.p({
          name: "plus-circle",
          size: "25",
          class: "data-v-00a60067"
        }),
        e: safeDeviceDetail.value.deviceStatus.batteryPercent
      }, safeDeviceDetail.value.deviceStatus.batteryPercent ? {
        f: common_vendor.p({
          percentage: safeDeviceDetail.value.deviceStatus.batteryPercent,
          height: "20rpx",
          activeColor: "#19be6b",
          inactiveColor: "#999",
          class: "data-v-00a60067"
        })
      } : {}, {
        g: safeDeviceDetail.value.deviceStatus.batteryPercent
      }, safeDeviceDetail.value.deviceStatus.batteryPercent ? {
        h: common_vendor.t(safeDeviceDetail.value.deviceStatus.batteryPercent)
      } : {}, {
        i: safeDeviceDetail.value.deviceStatus.voltage
      }, safeDeviceDetail.value.deviceStatus.voltage ? {
        j: common_vendor.t(safeDeviceDetail.value.deviceStatus.voltage)
      } : {}, {
        k: common_assets._imports_0,
        l: common_vendor.t(safeDeviceDetail.value.connectionStatus === "online" ? "在线" : "离线"),
        m: safeDeviceDetail.value.connectionStatus === "online" ? 1 : "",
        n: common_vendor.t(devicePosInfo.value.positionUpdateTime),
        o: statusBarHeight.value + 50 + "px",
        p: common_vendor.o(refreshLocation, "ca"),
        q: isMapReady.value
      }, isMapReady.value ? {
        r: common_vendor.sei("myMap", "map"),
        s: center.latitude,
        t: center.longitude,
        v: markers.value,
        w: mapScale.value
      } : {}, {
        x: common_vendor.t(totalTrips.value),
        y: common_vendor.t((totalMileage.value / 1e3).toFixed(2)),
        z: common_assets._imports_1,
        A: common_vendor.o(toDeviceDetail, "36"),
        B: common_vendor.p({
          name: "arrow-right",
          class: "data-v-00a60067"
        }),
        C: common_assets._imports_2,
        D: common_vendor.p({
          name: "arrow-right",
          class: "data-v-00a60067"
        }),
        E: common_vendor.o(toMsgCenter, "79"),
        F: common_assets._imports_3,
        G: common_vendor.t(currentCarIccId.value),
        H: common_vendor.o(($event) => {
          return toPay(currentCarIccId.value, currentCarSimMerchant.value);
        }, "c6"),
        I: common_vendor.p({
          type: "primary",
          size: "small",
          class: "data-v-00a60067"
        }),
        J: common_assets._imports_4,
        K: common_vendor.o(toFindCar, "e2"),
        L: common_assets._imports_5,
        M: common_vendor.o(toFence, "10"),
        N: common_assets._imports_6,
        O: common_vendor.o(contactCustomerService, "bd"),
        P: common_assets._imports_7,
        Q: common_vendor.o(unbindDevice, "45"),
        R: !isLogin.value
      }, !isLogin.value ? {
        S: common_vendor.o(gotoLogin, "a8")
      } : {}, {
        T: common_vendor.sr(picker, "00a60067-5", {
          "k": "picker"
        }),
        U: common_vendor.o(confirm, "d5"),
        V: common_vendor.p({
          columns: pickerColumns.value,
          keyName: "name",
          class: "r data-v-00a60067"
        }),
        W: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        X: `${_ctx.u_s_b_h}px`,
        Y: `${_ctx.u_s_a_i_b}px`,
        Z: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-00a60067"]]);
wx.createPage(MiniProgramPage);
