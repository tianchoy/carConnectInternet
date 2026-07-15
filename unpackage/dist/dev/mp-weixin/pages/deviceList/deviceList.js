"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
const utils_cars = require("../../utils/cars.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_indexListMode_1 = common_vendor.resolveComponent("indexListMode");
  (_easycom_custom_navBar_1 + _easycom_indexListMode_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_indexListMode = () => "../../components/indexListMode/indexListMode.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_indexListMode)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "deviceList",
  setup(__props) {
    const mapScale = common_vendor.ref(4);
    const showMap = common_vendor.ref(true);
    const markers = common_vendor.ref([]);
    let mapCtx = void 0;
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
    const filteredDevices = common_vendor.computed(() => {
      if (!Array.isArray(originalDeviceList.value))
        return [];
      let result = [...originalDeviceList.value];
      if (pickerStateTitle.value == "在线") {
        result = result.filter((device = null) => {
          return (device === null || device === void 0 ? null : device.connectionStatus) == "online";
        });
      } else if (pickerStateTitle.value === "离线") {
        result = result.filter((device = null) => {
          return (device === null || device === void 0 ? null : device.connectionStatus) == "offline";
        });
      }
      return result;
    });
    const totalCount = common_vendor.computed(() => {
      return originalDeviceList.value.length;
    });
    const onlineCount = common_vendor.computed(() => {
      return originalDeviceList.value.filter((d = null) => {
        return (d === null || d === void 0 ? null : d.connectionStatus) == "online";
      }).length;
    });
    const offlineCount = common_vendor.computed(() => {
      return totalCount.value - onlineCount.value;
    });
    common_vendor.watch([filteredDevices, showMap], (_a) => {
      var _b = common_vendor.__read(_a, 2), devices = _b[0], isMapVisible = _b[1];
      if (isMapVisible) {
        updateMarkers(devices);
      }
    });
    const unbindDevice = (imei) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const res = yield api_request.delDevice(imei);
        if (res.code == 0) {
          common_vendor.index.showToast({
            title: "解绑成功",
            icon: "success"
          });
          common_vendor.index.setStorageSync("needRefreshHome", true);
        } else {
          common_vendor.index.showToast({
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
          console.log("获取位置成功:", res);
          userLocation.value.latitude = res.latitude;
          userLocation.value.longitude = res.longitude;
        },
        fail: (err) => {
          console.log("获取位置失败:", err);
        }
      }));
    };
    const changeState = (type) => {
      pickerStateTitle.value = type;
    };
    const handleTap = (e = null) => {
      const markerId = e.detail.markerId;
      const selectedDevice = common_vendor.UTS.arrayFind(originalDeviceList.value, (device = null) => {
        return device.deviceId == markerId;
      });
      if (selectedDevice) {
        common_vendor.index.navigateTo({
          url: `/pages/carInfoDetail/carInfoDetail?imei=${selectedDevice.imei}&deptId=${selectedDevice.companyId}&deviceId=${selectedDevice.deviceId}`
        });
      } else {
        console.warn("未找到对应的设备信息", markerId);
      }
    };
    const updateMarkers = (devices = null) => {
      if (!Array.isArray(devices)) {
        devices = [];
      }
      markers.value = devices.map((device = null, index = null) => {
        if (!device || typeof device !== "object") {
          return null;
        }
        const lat = Number(device.latitude);
        const lng = Number(device.longitude);
        if (isNaN(lat) || isNaN(lng)) {
          return null;
        }
        const iconPath = utils_cars.getDeviceIcon(device.connectionStatus, device.carType);
        let markerId;
        if (device.deviceId && !isNaN(Number(device.deviceId))) {
          markerId = Number(device.deviceId);
        } else {
          markerId = index + 1;
        }
        return new common_vendor.UTSJSONObject({
          id: markerId,
          latitude: lat,
          longitude: lng,
          iconPath,
          width: 30,
          height: 30,
          callout: new common_vendor.UTSJSONObject({
            content: device.deviceName || device.plateNo || "设备",
            display: "ALWAYS",
            padding: 8,
            borderRadius: 8,
            bgColor: "#ffffff"
          }),
          joinCluster: true,
          anchor: new common_vendor.UTSJSONObject({ x: 0.5, y: 0.5 })
        });
      }).filter((marker = null) => {
        return marker !== null;
      });
    };
    const loadUserDeviceList = (data = null, from = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          if (from) {
            let params = new common_vendor.UTSJSONObject({
              pageSize: 1e3
            });
            const res = yield api_request.getUserDeviceList(params);
            data = res.data.list;
          }
          let deviceList = [];
          if (data) {
            if (Array.isArray(data)) {
              deviceList = data;
            } else if (Array.isArray(data.list)) {
              deviceList = data.list;
            } else if (Array.isArray(data.devices)) {
              deviceList = data.devices;
            } else if (Array.isArray(data.items)) {
              deviceList = data.items;
            } else if (data.totalCount !== void 0) {
              deviceList = [];
            }
          }
          originalDeviceList.value = utils_coordTransform.CoordTransform.batchConvertCoordinates(deviceList, "tencent");
          updateMarkers(originalDeviceList.value);
        } catch (err) {
          console.error("获取设备列表失败:", err);
          common_vendor.index.showToast({
            title: "获取设备列表失败",
            icon: "none"
          });
        }
      });
    };
    common_vendor.onLoad((options) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        getLocation();
        yield loadUserDeviceList(common_vendor.UTS.JSON.parse(options.userDeviceList), false);
        mapCtx = common_vendor.index.createMapContext("myMap", this);
        if (mapCtx && mapCtx.initMarkerCluster) {
          mapCtx.initMarkerCluster(new common_vendor.UTSJSONObject({
            enableDefaultStyle: true,
            zoomOnClick: true,
            gridSize: 60,
            complete: () => {
              console.log("聚合初始化完成");
            }
          }));
        }
      });
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
        e: markers.value,
        f: mapScale.value,
        g: common_vendor.o(handleTap, "41"),
        h: userLocation.value.latitude,
        i: userLocation.value.longitude,
        j: showMap.value
      }, showMap.value ? {
        k: common_vendor.t(totalCount.value),
        l: common_vendor.o(($event) => {
          return changeState("全部状态");
        }, "5f"),
        m: common_vendor.t(onlineCount.value),
        n: common_vendor.o(($event) => {
          return changeState("在线");
        }, "17"),
        o: common_vendor.t(offlineCount.value),
        p: common_vendor.o(($event) => {
          return changeState("离线");
        }, "8c")
      } : {}) : {
        q: common_vendor.o(unbindDevice, "1b"),
        r: common_vendor.p({
          lists: originalDeviceList.value
        })
      }, {
        s: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        t: `${_ctx.u_s_b_h}px`,
        v: `${_ctx.u_s_a_i_b}px`,
        w: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
