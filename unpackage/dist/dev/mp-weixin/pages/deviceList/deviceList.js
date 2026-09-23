"use strict";
const common_vendor = require("../../common/vendor.js");
const api_response = require("../../api/response.js");
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
class ClusterLabel extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          content: { type: String, optional: false },
          fontSize: { type: Number, optional: false },
          width: { type: Number, optional: false },
          height: { type: Number, optional: false },
          color: { type: String, optional: false },
          bgColor: { type: String, optional: false },
          borderRadius: { type: Number, optional: false },
          textAlign: { type: String, optional: false },
          anchorX: { type: Number, optional: false },
          anchorY: { type: Number, optional: false }
        };
      },
      name: "ClusterLabel"
    };
  }
  constructor(options, metadata = ClusterLabel.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.content = this.__props__.content;
    this.fontSize = this.__props__.fontSize;
    this.width = this.__props__.width;
    this.height = this.__props__.height;
    this.color = this.__props__.color;
    this.bgColor = this.__props__.bgColor;
    this.borderRadius = this.__props__.borderRadius;
    this.textAlign = this.__props__.textAlign;
    this.anchorX = this.__props__.anchorX;
    this.anchorY = this.__props__.anchorY;
    delete this.__props__;
  }
}
class ClusterMarker extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          clusterId: { type: Number, optional: false },
          latitude: { type: Number, optional: false },
          longitude: { type: Number, optional: false },
          iconPath: { type: String, optional: false },
          width: { type: Number, optional: false },
          height: { type: Number, optional: false },
          label: { type: ClusterLabel, optional: false }
        };
      },
      name: "ClusterMarker"
    };
  }
  constructor(options, metadata = ClusterMarker.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.clusterId = this.__props__.clusterId;
    this.latitude = this.__props__.latitude;
    this.longitude = this.__props__.longitude;
    this.iconPath = this.__props__.iconPath;
    this.width = this.__props__.width;
    this.height = this.__props__.height;
    this.label = this.__props__.label;
    delete this.__props__;
  }
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
    let clusterContext = null;
    let clusterReady = false;
    const toPlainObject = (value = null) => {
      const parsed = common_vendor.UTS.JSON.parse(common_vendor.UTS.JSON.stringify(value));
      return parsed != null ? parsed : value;
    };
    const syncClusterMarkers = () => {
      const context = clusterContext;
      if (!clusterReady || context == null)
        return null;
      try {
        context.addMarkers(toPlainObject(new common_vendor.UTSJSONObject({ markers: markers.value, clear: true })));
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/deviceList/deviceList.uvue:86", "车标同步到聚合器失败:", error);
      }
    };
    const setupMarkerCluster = () => {
      const context = clusterContext;
      if (clusterReady || context == null)
        return null;
      try {
        context.initMarkerCluster(toPlainObject(new common_vendor.UTSJSONObject({
          enableDefaultStyle: false,
          zoomOnClick: true,
          gridSize: 60
        })));
        context.on("markerClusterCreate", (res = null) => {
          const clusterList = res != null ? res["clusters"] : null;
          if (clusterList == null)
            return null;
          const clusterMarkers = [];
          clusterList.forEach((cluster = null) => {
            const center = cluster["center"];
            if (center == null)
              return null;
            const markerIds = cluster["markerIds"];
            const count = markerIds != null ? markerIds.length : 0;
            clusterMarkers.push(new ClusterMarker({
              clusterId: cluster["clusterId"],
              latitude: center["latitude"],
              longitude: center["longitude"],
              // 用透明图标占位，否则微信会给没有 iconPath 的标记渲染默认红色定位针
              iconPath: "/static/transparent.png",
              width: 1,
              height: 1,
              // 聚合簇用 label 显示数量
              label: new ClusterLabel({
                content: count.toString(),
                fontSize: 14,
                width: 40,
                height: 40,
                color: "#ffffff",
                bgColor: "#1296db",
                borderRadius: 20,
                textAlign: "center",
                anchorX: 0,
                anchorY: -20
              })
            }));
          });
          context.addMarkers(toPlainObject(new common_vendor.UTSJSONObject({ markers: clusterMarkers })));
        });
        clusterReady = true;
        syncClusterMarkers();
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/deviceList/deviceList.uvue:138", "点聚合初始化失败，回退为普通标记点:", error);
      }
    };
    const EMPTY_MARKERS = [];
    const mapMarkers = common_vendor.computed(() => {
      let result = markers.value;
      result = EMPTY_MARKERS;
      return result;
    });
    const pickerStateTitle = common_vendor.ref("全部状态");
    const showWhat = () => {
      showMap.value = !showMap.value;
      if (showMap.value) {
        clusterReady = false;
        setTimeout(() => {
          var _a, _b;
          clusterContext = common_vendor.index.createMapContext("myMap", (_b = (_a = common_vendor.getCurrentInstance()) === null || _a === void 0 ? null : _a.proxy) !== null && _b !== void 0 ? _b : null);
          setupMarkerCluster();
        }, 100);
      }
    };
    const originalDeviceList = common_vendor.ref([]);
    const deviceListItems = common_vendor.computed(() => {
      return originalDeviceList.value.map((item) => {
        const deviceNo = item.getString("deviceNo", "");
        const rawDeviceName = item.getString("deviceName", "");
        return new utils_device.DeviceItem({
          plateNo: item.getString("plateNo", ""),
          deviceNo,
          status: item.getNumber("status", 0),
          companyId: item.getString("companyId", ""),
          deviceName: rawDeviceName != "" ? rawDeviceName : deviceNo,
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
          // 声明参与微信小程序原生点聚合
          joinCluster: true,
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
      setupMarkerCluster();
      syncClusterMarkers();
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
            const list = api_response.isBusinessSuccessCode(res.code) && res.data != null ? res.data.list : null;
            if (list == null || !Array.isArray(list)) {
              common_vendor.index.__f__("warn", "at pages/deviceList/deviceList.uvue:280", "获取设备列表返回异常:", res);
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
          common_vendor.index.__f__("error", "at pages/deviceList/deviceList.uvue:291", "获取设备列表失败:", err);
          originalDeviceList.value = [];
          markers.value = [];
          utils_toast.showAppToast({ title: "获取设备列表失败", icon: "none" });
        }
      });
    };
    const unbindDevice = (deviceId) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const res = yield api_request.delDevice(deviceId);
        if (api_response.isBusinessSuccessCode(res.code)) {
          utils_toast.showAppToast({
            title: res.msg || "解绑成功",
            icon: "success"
          });
          common_vendor.index.setStorageSync("needRefreshHome", true);
        } else {
          utils_toast.showAppToast({
            title: res.msg || "解绑失败",
            icon: "error"
          });
        }
        yield loadUserDeviceList([], true);
      });
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
        common_vendor.index.__f__("warn", "at pages/deviceList/deviceList.uvue:330", "未找到对应的设备信息", markerId);
        return null;
      }
      const deviceNoValue = (_a = selectedDevice["deviceNo"]) !== null && _a !== void 0 ? _a : "";
      const companyId = (_b = selectedDevice["companyId"]) !== null && _b !== void 0 ? _b : "";
      const deviceId = (_c = selectedDevice["deviceId"]) !== null && _c !== void 0 ? _c : "";
      common_vendor.index.navigateTo({
        url: "/pages/carInfoDetail/carInfoDetail?deviceNo=" + deviceNoValue + "&deptId=" + companyId.toString() + "&deviceId=" + deviceId.toString()
      });
    };
    common_vendor.onReady(() => {
      var _a, _b;
      clusterContext = common_vendor.index.createMapContext("myMap", (_b = (_a = common_vendor.getCurrentInstance()) === null || _a === void 0 ? null : _a.proxy) !== null && _b !== void 0 ? _b : null);
      setupMarkerCluster();
    });
    common_vendor.onLoad((options) => {
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
          Icon: "/static/allDevice.png",
          iconColor: iconColor.value
        }),
        c: showMap.value
      }, showMap.value ? common_vendor.e({
        d: common_vendor.sei("myMap", "map"),
        e: mapScale.value,
        f: common_vendor.o(handleTap, "e9"),
        g: userLocation.value.latitude,
        h: userLocation.value.longitude,
        i: mapMarkers.value,
        j: showMap.value
      }, showMap.value ? {
        k: common_vendor.o(($event) => {
          return changeState("全部");
        }, "ed"),
        l: common_vendor.p({
          type: "primary",
          text: `全部 ${totalCount.value}`
        }),
        m: common_vendor.o(($event) => {
          return changeState("在线");
        }, "bd"),
        n: common_vendor.p({
          type: "success",
          text: `在线 ${onlineCount.value}`
        }),
        o: common_vendor.o(($event) => {
          return changeState("离线");
        }, "07"),
        p: common_vendor.p({
          type: "danger",
          text: `离线 ${offlineCount.value}`
        })
      } : {}) : {
        q: common_vendor.o(unbindDevice, "d2"),
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
