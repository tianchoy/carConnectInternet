"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_toast = require("../../utils/toast.js");
const api_request = require("../../api/request.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
const utils_cars = require("../../utils/cars.js");
const utils_device = require("../../utils/device.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_tag_1 = common_vendor.resolveComponent("i-tag");
  const _easycom_indexListMode_1 = common_vendor.resolveComponent("indexListMode");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  (_easycom_custom_navBar_1 + _easycom_i_tag_1 + _easycom_indexListMode_1 + _easycom_app_toast_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_i_tag = () => "../../uni_modules/i-ui-x/components/i-tag/i-tag.js";
const _easycom_indexListMode = () => "../../components/indexListMode/indexListMode.js";
const _easycom_app_toast = () => "../../components/app-toast/app-toast.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_tag + _easycom_indexListMode + _easycom_app_toast)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "deviceList",
  setup(__props) {
    const mapScale = common_vendor.ref(4);
    const showMap = common_vendor.ref(true);
    const markers = common_vendor.ref([]);
    const iconColor = common_vendor.ref("#1296db");
    const userLocation = common_vendor.ref(new common_vendor.UTSJSONObject({
      latitude: 0,
      longitude: 0
    }));
    const pickerStateTitle = common_vendor.ref("全部状态");
    const showWhat = () => {
      showMap.value = !showMap.value;
    };
    const originalDeviceList = common_vendor.ref([]);
    const deviceListItems = common_vendor.computed(() => {
      return originalDeviceList.value.map((item) => {
        const imei = item.getString("imei", "");
        const rawDeviceName = item.getString("deviceName", "");
        return new utils_device.DeviceItem({
          plateNo: item.getString("plateNo", ""),
          imei,
          status: item.getNumber("status", 0),
          companyId: item.getString("companyId", ""),
          deviceName: rawDeviceName != "" ? rawDeviceName : imei,
          deviceId: item.getString("deviceId", ""),
          iccid: item.getString("iccid", ""),
          simMerchant: item.getString("simMerchant", ""),
          connectionStatus: item.getString("connectionStatus", "")
        });
      });
    });
    const filteredDevices = common_vendor.computed(() => {
      if (!Array.isArray(originalDeviceList.value))
        return [];
      let result = [...originalDeviceList.value];
      if (pickerStateTitle.value == "在线") {
        result = result.filter((device) => {
          return device["connectionStatus"] == "online";
        });
      } else if (pickerStateTitle.value === "离线") {
        result = result.filter((device) => {
          return device["connectionStatus"] == "offline";
        });
      }
      return result;
    });
    const totalCount = common_vendor.computed(() => {
      return originalDeviceList.value.length;
    });
    const onlineCount = common_vendor.computed(() => {
      return originalDeviceList.value.filter((d) => {
        return d["connectionStatus"] == "online";
      }).length;
    });
    const offlineCount = common_vendor.computed(() => {
      return totalCount.value - onlineCount.value;
    });
    const updateMarkers = (devices) => {
      var _a, _b, _c, _d;
      const nextMarkers = [];
      for (let index = 0; index < devices.length; index++) {
        const device = devices[index];
        const latitude = device["latitude"];
        const longitude = device["longitude"];
        if (latitude == null || longitude == null)
          continue;
        const lat = parseFloat(latitude.toString());
        const lng = parseFloat(longitude.toString());
        if (isNaN(lat) || isNaN(lng))
          continue;
        const connectionStatus = (_a = device["connectionStatus"]) !== null && _a !== void 0 ? _a : "";
        const carType = (_b = device["carType"]) !== null && _b !== void 0 ? _b : "";
        const idValue = device["deviceId"];
        const parsedId = idValue != null ? parseInt(idValue.toString()) : NaN;
        const markerId = isNaN(parsedId) ? index + 1 : parsedId;
        const deviceName = (_d = (_c = device["deviceName"]) !== null && _c !== void 0 ? _c : device["plateNo"]) !== null && _d !== void 0 ? _d : "设备";
        nextMarkers.push({
          id: markerId,
          latitude: lat,
          longitude: lng,
          iconPath: utils_cars.getDeviceIcon(connectionStatus, carType),
          width: 30,
          height: 30,
          callout: new common_vendor.UTSJSONObject({
            content: deviceName,
            display: "ALWAYS",
            padding: 8,
            borderRadius: 8,
            bgColor: "#ffffff"
          }),
          anchor: { x: 0.5, y: 0.5 }
        });
      }
      markers.value = nextMarkers;
      if (nextMarkers.length > 0 && userLocation.value.latitude == 0 && userLocation.value.longitude == 0) {
        const firstMarker = nextMarkers[0];
        userLocation.value.latitude = firstMarker.latitude;
        userLocation.value.longitude = firstMarker.longitude;
      }
    };
    common_vendor.watchEffect(() => {
      if (showMap.value) {
        updateMarkers(filteredDevices.value);
      }
    });
    const loadUserDeviceList = (data, from) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          let deviceList = data;
          if (from) {
            const params = new common_vendor.UTSJSONObject({ pageSize: 1e3 });
            const res = yield api_request.getUserDeviceList(params);
            const list = res.code == 0 && res.data != null ? res.data.list : null;
            if (list == null || !Array.isArray(list)) {
              common_vendor.index.__f__("warn", "at pages/deviceList/deviceList.uvue:147", "获取设备列表返回异常:", res);
              originalDeviceList.value = [];
              markers.value = [];
              return Promise.resolve(null);
            }
            deviceList = list !== null && list !== void 0 ? list : [];
          }
          if (!Array.isArray(deviceList))
            deviceList = [];
          originalDeviceList.value = utils_coordTransform.CoordTransform.batchConvertCoordinates(deviceList, "tencent");
          updateMarkers(originalDeviceList.value);
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/deviceList/deviceList.uvue:158", "获取设备列表失败:", err);
          originalDeviceList.value = [];
          markers.value = [];
          utils_toast.showAppToast({ title: "获取设备列表失败", icon: "none" });
        }
      });
    };
    const unbindDevice = (imei) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const res = yield api_request.delDevice(imei);
        if (res.code == 0) {
          utils_toast.showAppToast({
            title: "解绑成功",
            icon: "success"
          });
          common_vendor.index.setStorageSync("needRefreshHome", true);
        } else {
          utils_toast.showAppToast({
            title: "解绑失败",
            icon: "error"
          });
        }
        yield loadUserDeviceList([], true);
      });
    };
    const getLocation = () => {
      common_vendor.index.getLocation(new common_vendor.UTSJSONObject({
        type: "wgs84",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/deviceList/deviceList.uvue:187", "获取位置成功:", res);
          userLocation.value.latitude = res.latitude;
          userLocation.value.longitude = res.longitude;
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/deviceList/deviceList.uvue:192", "获取位置失败:", err);
        }
      }));
    };
    const changeState = (type) => {
      pickerStateTitle.value = type;
    };
    const handleTap = (event = null) => {
      var _a, _b, _c;
      const detail = event;
      const markerId = detail != null ? detail["markerId"] : null;
      const selectedDevice = common_vendor.UTS.arrayFind(originalDeviceList.value, (device) => {
        return device["deviceId"] == markerId;
      });
      if (selectedDevice == null) {
        common_vendor.index.__f__("warn", "at pages/deviceList/deviceList.uvue:222", "未找到对应的设备信息", markerId);
        return null;
      }
      const imeiValue = (_a = selectedDevice["imei"]) !== null && _a !== void 0 ? _a : "";
      const companyId = (_b = selectedDevice["companyId"]) !== null && _b !== void 0 ? _b : "";
      const deviceId = (_c = selectedDevice["deviceId"]) !== null && _c !== void 0 ? _c : "";
      common_vendor.index.navigateTo({
        url: "/pages/carInfoDetail/carInfoDetail?imei=" + imeiValue + "&deptId=" + companyId.toString() + "&deviceId=" + deviceId.toString()
      });
    };
    common_vendor.onLoad((options) => {
      getLocation();
      loadUserDeviceList([], true);
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.o(showWhat, "f0"),
        b: common_vendor.p({
          title: "全部设备",
          ["show-back"]: true,
          backgroundColor: "#f1f1f1",
          textColor: "#333",
          showCapsule: true,
          isIcon: true,
          Icon: "/static/maps.png",
          iconColor: iconColor.value
        }),
        c: showMap.value
      }, showMap.value ? common_vendor.e({
        d: common_vendor.sei("myMap", "map"),
        e: mapScale.value,
        f: common_vendor.o(handleTap, "c8"),
        g: userLocation.value.latitude,
        h: userLocation.value.longitude,
        i: markers.value,
        j: showMap.value
      }, showMap.value ? {
        k: common_vendor.o(($event) => {
          return changeState("全部");
        }, "4c"),
        l: common_vendor.p({
          type: "primary",
          text: `全部 ${totalCount.value}`
        }),
        m: common_vendor.o(($event) => {
          return changeState("在线");
        }, "c1"),
        n: common_vendor.p({
          type: "success",
          text: `在线 ${onlineCount.value}`
        }),
        o: common_vendor.o(($event) => {
          return changeState("离线");
        }, "c7"),
        p: common_vendor.p({
          type: "danger",
          text: `离线 ${offlineCount.value}`
        })
      } : {}) : {
        q: common_vendor.o(unbindDevice, "1d"),
        r: common_vendor.p({
          lists: deviceListItems.value
        })
      }, {
        s: `${_ctx.u_s_b_h}px`,
        t: `${_ctx.u_s_a_i_b}px`
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/deviceList/deviceList.js.map
