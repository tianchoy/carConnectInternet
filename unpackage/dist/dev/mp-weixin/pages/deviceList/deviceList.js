"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
const utils_cars = require("../../utils/cars.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_picker_1 = common_vendor.resolveComponent("uv-picker");
  (_easycom_custom_navBar_1 + _easycom_uv_icon_1 + _easycom_uv_picker_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_picker = () => "../../uni_modules/uv-picker/components/uv-picker/uv-picker.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_icon + _easycom_uv_picker)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "deviceList",
  setup(__props) {
    const mapScale = common_vendor.ref(4);
    const showMap = common_vendor.ref(true);
    const markers = common_vendor.ref([]);
    let mapCtx = void 0;
    const currentPickerType = common_vendor.ref("");
    const picker = common_vendor.ref(null);
    const iconColor = common_vendor.ref("#e6813e");
    const userLocation = common_vendor.ref(new common_vendor.UTSJSONObject({
      latitude: 0,
      longitude: 0
    }));
    const carState = common_vendor.ref([
      [new common_vendor.UTSJSONObject({
        name: "全部状态",
        value: "0"
      }), new common_vendor.UTSJSONObject({
        name: "在线",
        value: "1"
      }), new common_vendor.UTSJSONObject({
        name: "离线",
        value: "2"
      })]
    ]);
    common_vendor.ref([]);
    const columns = common_vendor.ref([[]]);
    const pickerStateTitle = common_vendor.ref("全部状态");
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
    const subMsg = () => {
      console.log("订阅消息");
      common_vendor.index.requestSubscribeMessage(new common_vendor.UTSJSONObject({
        tmplIds: ["VRR0UEO9VJOLs0MHlU0OilqX6MVFDwH3_3gz3Oc0NIc"],
        success: (res = null) => {
          console.log("订阅成功:", res);
        },
        fail: (err = null) => {
          console.log("订阅失败:", err);
        }
      }));
    };
    const handStatePicker = () => {
      var _a;
      columns.value = carState.value;
      currentPickerType.value = "state";
      (_a = picker.value) === null || _a === void 0 ? null : _a.open();
    };
    const confirm = (e) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const selected = e.value[0];
        pickerStateTitle.value = selected.name;
      });
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
    const loadUserDeviceList = (data = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
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
        yield loadUserDeviceList(common_vendor.UTS.JSON.parse(options.userDeviceList));
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
        a: common_vendor.o(subMsg, "57"),
        b: common_vendor.p({
          title: "全部设备",
          ["show-back"]: true,
          backgroundColor: "#f1f1f1",
          textColor: "#333",
          showCapsule: false,
          isIcon: true,
          Icon: "bell",
          iconColor: iconColor.value
        }),
        c: showMap.value
      }, showMap.value ? common_vendor.e({
        d: common_vendor.sei("myMap", "map"),
        e: markers.value,
        f: mapScale.value,
        g: common_vendor.o(handleTap, "60"),
        h: userLocation.value.latitude,
        i: userLocation.value.longitude,
        j: showMap.value
      }, showMap.value ? {
        k: common_vendor.t(totalCount.value),
        l: common_vendor.t(onlineCount.value),
        m: common_vendor.t(offlineCount.value)
      } : {}, {
        n: common_vendor.t(pickerStateTitle.value),
        o: common_vendor.p({
          name: "arrow-down",
          size: "15",
          color: "#fff"
        }),
        p: common_vendor.o(handStatePicker, "08")
      }) : {}, {
        q: common_vendor.sr(picker, "3f96c569-2", {
          "k": "picker"
        }),
        r: common_vendor.o(confirm, "84"),
        s: common_vendor.p({
          columns: columns.value,
          keyName: "name",
          class: "r"
        }),
        t: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        v: `${_ctx.u_s_b_h}px`,
        w: `${_ctx.u_s_a_i_b}px`,
        x: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
