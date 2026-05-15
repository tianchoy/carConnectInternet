"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
const utils_cars = require("../../utils/cars.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  _easycom_custom_navBar_1();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
if (!Math) {
  _easycom_custom_navBar();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "deviceList",
  setup(__props) {
    const mapScale = common_vendor.ref(4);
    const markers = common_vendor.ref([]);
    let mapCtx = void 0;
    const iconColor = common_vendor.ref("#e6813e");
    const userLocation = common_vendor.ref(new common_vendor.UTSJSONObject({
      latitude: 0,
      longitude: 0
    }));
    const originalDeviceList = common_vendor.ref([]);
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
    const intiMarker = () => {
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
    };
    common_vendor.onLoad((options) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        console.log("onLoad", options);
        getLocation();
        yield loadUserDeviceList(common_vendor.UTS.JSON.parse(options.userDeviceList));
        intiMarker();
      });
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
        a: common_vendor.o(subMsg, "57"),
        b: common_vendor.p({
          title: "设备列表",
          ["show-back"]: true,
          backgroundColor: "#f1f1f1",
          textColor: "#333",
          showCapsule: false,
          isIcon: true,
          Icon: "bell",
          iconColor: iconColor.value
        }),
        c: common_vendor.sei("myMap", "map"),
        d: markers.value,
        e: mapScale.value,
        f: common_vendor.o(handleTap, "9b"),
        g: userLocation.value.latitude,
        h: userLocation.value.longitude,
        i: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        j: `${_ctx.u_s_b_h}px`,
        k: `${_ctx.u_s_a_i_b}px`,
        l: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
