"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
const utils_getAdress = require("../../utils/getAdress.js");
const utils_cars = require("../../utils/cars.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_sub_navBar_1 = common_vendor.resolveComponent("sub-navBar");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_grid_item_1 = common_vendor.resolveComponent("uv-grid-item");
  const _easycom_uv_grid_1 = common_vendor.resolveComponent("uv-grid");
  const _easycom_uv_input_1 = common_vendor.resolveComponent("uv-input");
  const _easycom_uv_modal_1 = common_vendor.resolveComponent("uv-modal");
  (_easycom_custom_navBar_1 + _easycom_sub_navBar_1 + _easycom_uv_icon_1 + _easycom_uv_grid_item_1 + _easycom_uv_grid_1 + _easycom_uv_input_1 + _easycom_uv_modal_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_sub_navBar = () => "../../components/sub-navBar/sub-navBar.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_grid_item = () => "../../uni_modules/uv-grid/components/uv-grid-item/uv-grid-item.js";
const _easycom_uv_grid = () => "../../uni_modules/uv-grid/components/uv-grid/uv-grid.js";
const _easycom_uv_input = () => "../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_uv_modal = () => "../../uni_modules/uv-modal/components/uv-modal/uv-modal.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_sub_navBar + _easycom_uv_icon + _easycom_uv_grid_item + _easycom_uv_grid + _easycom_uv_input + _easycom_uv_modal)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "carInfoDetail",
  setup(__props) {
    const deptId = common_vendor.ref("");
    const imei = common_vendor.ref("");
    const deviceId = common_vendor.ref("");
    const center = common_vendor.reactive(new UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(15);
    const datainfo = common_vendor.ref({});
    const address = common_vendor.ref("");
    const currentTime = common_vendor.ref("5s");
    const times = common_vendor.ref([
      [
        new UTSJSONObject({ label: "5s", value: "5" }),
        new UTSJSONObject({ label: "10s", value: "10" }),
        new UTSJSONObject({ label: "20s", value: "20" }),
        new UTSJSONObject({ label: "30s", value: "30" }),
        new UTSJSONObject({ label: "停止刷新", value: "0" })
      ]
    ]);
    const refreshTimer = common_vendor.ref(null);
    const isRefreshing = common_vendor.ref(false);
    const popupRef = common_vendor.ref(null);
    const psw = common_vendor.ref("");
    const currentOperation = common_vendor.ref(0);
    const modalTitle = common_vendor.ref("验证密码");
    const userType = common_vendor.ref("");
    const markers = common_vendor.ref([]);
    common_vendor.ref(false);
    common_vendor.ref(new UTSJSONObject({
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
    const currentToolItem = common_vendor.ref(0);
    const currentCarInfo = common_vendor.ref(new UTSJSONObject({}));
    const getBatteryColor = (batteryPercent = null) => {
      if (!batteryPercent)
        return "#c9c9c9";
      const batteryValue = parseInt(batteryPercent);
      if (batteryValue >= 70) {
        return "#07C160";
      } else if (batteryValue >= 30) {
        return "#FF9C19";
      } else if (batteryValue >= 10) {
        return "#FF6B00";
      } else {
        return "#FF0000";
      }
    };
    common_vendor.watch(currentTime, (newVal) => {
      setupAutoRefresh(newVal);
    });
    const setupAutoRefresh = (intervalValue) => {
      if (refreshTimer.value !== null) {
        clearInterval(refreshTimer.value);
        refreshTimer.value = null;
        isRefreshing.value = false;
      }
      if (intervalValue == "0") {
        isRefreshing.value = false;
        return null;
      }
      if (datainfo.value.connectionStatus != "online") {
        isRefreshing.value = false;
        return null;
      }
      const intervalSeconds = parseInt(intervalValue);
      if (intervalSeconds > 0) {
        isRefreshing.value = true;
        const intervalMs = intervalSeconds * 1e3;
        loadData({
          deptId: deptId.value,
          deviceids: imei.value
        });
        refreshTimer.value = setInterval(() => {
          loadData({
            deptId: deptId.value,
            deviceids: imei.value
          });
        }, intervalMs);
      }
    };
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
      name: "/static/power.png",
      title: "恢复油电"
    }), new UTSJSONObject({
      name: "/static/offpower.png",
      title: "断开油电"
    }), new UTSJSONObject({
      name: "/static/dzwl.png",
      title: "电子围栏"
    }), new UTSJSONObject({
      name: "/static/navto.png",
      title: "一键寻车"
    })]);
    const click = (name = null) => {
      currentToolItem.value = name;
      if (name == 0) {
        common_vendor.index.navigateTo({
          url: "/pages/playBack/playBack?imei=" + imei.value + "&connectionStatus=" + datainfo.value.connectionStatus + "&plateNo=" + currentCarInfo.value.plateNo + "&carType=" + currentCarInfo.value.carType
        });
      }
      if (name == 1) {
        common_vendor.index.navigateTo({
          url: "/pages/vehicleTracking/vehicleTracking?imei=" + imei.value + "&deptId=" + deptId.value + "&connectionStatus=" + datainfo.value.connectionStatus + "&plateNo=" + currentCarInfo.value.plateNo + "&carType=" + currentCarInfo.value.carType
        });
      }
      if (name == 2) {
        common_vendor.index.navigateTo({
          url: "/pages/mileageRecord/mileageRecord?imei=" + imei.value
        });
      }
      if (name == 3) {
        common_vendor.index.navigateTo({
          url: "/pages/stopRecord/stopRecord?imei=" + imei.value + "&deptId=" + deptId.value
        });
      }
      if (name == 4) {
        if (userType.value == "1") {
          psw.value = "";
          currentOperation.value = 1;
          modalTitle.value = "验证密码";
          popupRef.value.open();
        } else {
          executeOperation(1);
        }
      }
      if (name == 5) {
        if (userType.value == "1") {
          psw.value = "";
          currentOperation.value = 2;
          modalTitle.value = "验证密码";
          popupRef.value.open();
        } else {
          executeOperation(2);
        }
      }
      if (name == 6) {
        common_vendor.index.navigateTo({
          url: "/pages/geofencing/geofencing?imei=" + imei.value + "&connectionStatus=" + datainfo.value.connectionStatus + "&plateNo=" + currentCarInfo.value.plateNo + "&carType=" + currentCarInfo.value.carType
        });
      }
      if (name == 7) {
        navTo();
      }
    };
    const executeOperation = (operationType = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        let predictCmdId = 0;
        let type = 0;
        if (operationType == 1) {
          predictCmdId = 2;
          type = 2;
        } else if (operationType == 2) {
          predictCmdId = 1;
          type = 1;
        } else {
          common_vendor.index.showToast({
            title: "操作类型错误",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        try {
          common_vendor.index.showLoading({
            title: "执行中...",
            mask: true
          });
          const res = yield api_request.sendCommand({
            imei: imei.value,
            password: userType.value == "1" ? psw.value : "",
            params: ["1111"],
            predictCmdId,
            type
          });
          common_vendor.index.hideLoading();
          if (res.code == 0) {
            common_vendor.index.showToast({
              title: operationType == 1 ? "恢复油电成功" : "断开油电成功",
              icon: "success"
            });
            psw.value = "";
          } else {
            common_vendor.index.showToast({
              title: res.msg || "操作失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/carInfoDetail/carInfoDetail.uvue:320", "操作失败:", error);
          common_vendor.index.showToast({
            title: "操作失败，请重试",
            icon: "none"
          });
        }
      });
    };
    const confirm = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (userType.value == "1" && psw.value == "") {
          common_vendor.index.showToast({
            title: "请输入密码",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        executeOperation(currentOperation.value);
      });
    };
    const carDetail = () => {
      common_vendor.index.navigateTo({
        url: "/pages/userCenter/carDetail/carDetail?deviceId=" + deviceId.value
      });
    };
    const navTo = () => {
      common_vendor.index.__f__("log", "at pages/carInfoDetail/carInfoDetail.uvue:348", address.value);
      common_vendor.index.openLocation({
        latitude: center.latitude,
        longitude: center.longitude,
        name: address.value,
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
          common_vendor.index.__f__("error", "at pages/carInfoDetail/carInfoDetail.uvue:366", "调起地图失败:", err);
        }
      });
    };
    const loadData = (data) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const res = yield api_request.getDevicePos(data);
        res.data.forEach((item = null) => {
          return common_vendor.__awaiter(this, void 0, void 0, function* () {
            if (item.imei == imei.value) {
              datainfo.value = item;
              const convertedCoord = utils_coordTransform.CoordTransform.wgs84ToTencent(item.latitude, item.longitude);
              center.latitude = convertedCoord.lat;
              center.longitude = convertedCoord.lng;
              const addr = yield utils_getAdress.getAddress(convertedCoord.lat, convertedCoord.lng);
              address.value = addr.result.formatted_address;
              const deviceMarker = createMarker(
                1,
                convertedCoord.lat,
                convertedCoord.lng,
                "device",
                item.deviceName
                // 使用设备名称作为标题
              );
              markers.value = [deviceMarker];
              if (item.connectionStatus != "online" && refreshTimer.value !== null) {
                clearInterval(refreshTimer.value);
                refreshTimer.value = null;
                isRefreshing.value = false;
              }
            }
          });
        });
      });
    };
    common_vendor.onLoad((option) => {
      deptId.value = option.deptId;
      imei.value = option.imei;
      deviceId.value = option.deviceId;
      userType.value = common_vendor.index.getStorageSync("userType");
      const data = new UTSJSONObject({
        deptId: deptId.value,
        deviceids: imei.value
      });
      loadData(data).then(() => {
        if (datainfo.value.connectionStatus == "online") {
          setupAutoRefresh(currentTime.value);
        }
      });
      loadDeviceDetail();
    });
    const loadDeviceDetail = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (deviceId.value !== null) {
          const res = yield api_request.getDeviceDetail(deviceId.value);
          currentCarInfo.value = res.data;
        } else {
          common_vendor.index.__f__("error", "at pages/carInfoDetail/carInfoDetail.uvue:431", "设备id获取失败");
        }
      });
    };
    const createMarker = (id, lat, lng, type, title = null) => {
      const marker = new UTSJSONObject({
        id,
        latitude: lat,
        longitude: lng,
        width: 25,
        height: 25,
        iconPath: datainfo.value.connectionStatus == "online" ? utils_cars.getOnlineDeviceIcon(currentCarInfo.value.carType) : utils_cars.getOfflineDeviceIcon(currentCarInfo.value.carType),
        callout: new UTSJSONObject({
          content: title || "爱车位置",
          color: datainfo.value.connectionStatus == "online" ? "#fff" : "#666",
          fontSize: 14,
          borderRadius: 10,
          bgColor: datainfo.value.connectionStatus == "online" ? "#07C160" : "#ccc",
          padding: 5,
          display: "ALWAYS"
        })
      });
      return marker;
    };
    common_vendor.onHide(() => {
      clearInterval(refreshTimer.value);
      refreshTimer.value = null;
      isRefreshing.value = false;
    });
    common_vendor.onUnmounted(() => {
      clearInterval(refreshTimer.value);
      refreshTimer.value = null;
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.p({
          title: "详情",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.o((val) => {
          return currentTime.value = val;
        }),
        c: common_vendor.p({
          currentTime: common_vendor.unref(currentTime),
          showTime: true,
          currentCar: common_vendor.unref(currentCarInfo).plateNo,
          times: common_vendor.unref(times),
          carStatus: common_vendor.unref(datainfo).connectionStatus,
          showPicker: false,
          showCar: true
        }),
        d: common_vendor.sei("myMap", "map"),
        e: common_vendor.unref(center).latitude,
        f: common_vendor.unref(center).longitude,
        g: common_vendor.unref(markers),
        h: common_vendor.unref(mapScale),
        i: common_vendor.t(common_vendor.unref(imei)),
        j: common_vendor.unref(currentCarInfo).voltage
      }, common_vendor.unref(currentCarInfo).voltage ? {
        k: common_vendor.t(common_vendor.unref(currentCarInfo).voltage)
      } : {}, {
        l: common_vendor.unref(datainfo).batteryPercent
      }, common_vendor.unref(datainfo).batteryPercent ? {
        m: common_vendor.t(common_vendor.unref(datainfo).batteryPercent),
        n: getBatteryColor(common_vendor.unref(datainfo).batteryPercent)
      } : {}, {
        o: common_vendor.p({
          name: "arrow-right",
          bold: true,
          size: 25
        }),
        p: common_vendor.t(common_vendor.unref(datainfo).positionUpdateTime),
        q: common_vendor.o(carDetail),
        r: common_vendor.f(common_vendor.unref(baseList), (item, index, i0) => {
          return {
            a: "6cb34a81-5-" + i0 + "," + ("6cb34a81-4-" + i0),
            b: common_vendor.p({
              customStyle: {
                paddingTop: "20rpx"
              },
              name: item.name,
              size: 45
            }),
            c: common_vendor.t(item.title),
            d: index,
            e: "6cb34a81-4-" + i0 + ",6cb34a81-3"
          };
        }),
        s: common_vendor.o(click),
        t: common_vendor.p({
          col: 5
        }),
        v: common_vendor.o(($event) => {
          return common_vendor.isRef(psw) ? psw.value = $event : null;
        }),
        w: common_vendor.p({
          placeholder: "请输入账户密码",
          prefixIcon: "lock",
          border: "surround",
          clearable: true,
          password: true,
          modelValue: common_vendor.unref(psw)
        }),
        x: common_vendor.sr(popupRef, "6cb34a81-6", {
          "k": "popupRef"
        }),
        y: common_vendor.o(confirm),
        z: common_vendor.p({
          title: common_vendor.unref(modalTitle)
        }),
        A: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/carInfoDetail/carInfoDetail.js.map
