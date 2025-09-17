"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_request = require("../../api/request.js");
const utils_coordTransform = require("../../utils/coordTransform.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_indexListMode_1 = common_vendor.resolveComponent("indexListMode");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_picker_1 = common_vendor.resolveComponent("uv-picker");
  (_easycom_custom_navBar_1 + _easycom_indexListMode_1 + _easycom_uv_icon_1 + _easycom_uv_picker_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_indexListMode = () => "../../components/indexListMode/indexListMode.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_picker = () => "../../uni_modules/uv-picker/components/uv-picker/uv-picker.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_indexListMode + _easycom_uv_icon + _easycom_uv_picker)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const Login = common_vendor.ref(false);
    const mapScale = common_vendor.ref(4);
    const showMap = common_vendor.ref(true);
    const markers = common_vendor.ref([]);
    let mapCtx = void 0;
    const currentPickerType = common_vendor.ref("");
    const picker = common_vendor.ref(null);
    const carState = common_vendor.ref([
      [new UTSJSONObject({
        name: "全部状态",
        value: "0"
      }), new UTSJSONObject({
        name: "在线",
        value: "1"
      }), new UTSJSONObject({
        name: "离线",
        value: "2"
      })]
    ]);
    const carGroup = common_vendor.ref([]);
    const columns = common_vendor.ref([[]]);
    const pickerStateTitle = common_vendor.ref("全部状态");
    const pickerGroupTitle = common_vendor.ref("全部分组");
    const originalDeviceList = common_vendor.ref([]);
    const currentGroupId = common_vendor.ref("");
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
    const handStatePicker = () => {
      var _a;
      columns.value = carState.value;
      currentPickerType.value = "state";
      (_a = picker.value) === null || _a === void 0 ? null : _a.open();
    };
    const handGroupPicker = () => {
      var _a;
      columns.value = carGroup.value;
      currentPickerType.value = "group";
      (_a = picker.value) === null || _a === void 0 ? null : _a.open();
    };
    const confirm = (e) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const selected = e.value[0];
        if (currentPickerType.value == "state") {
          pickerStateTitle.value = selected.name;
        } else if (currentPickerType.value == "group") {
          pickerGroupTitle.value = selected.name;
          currentGroupId.value = selected.id;
          yield loadUserDeviceList(selected.id);
        }
        currentPickerType.value = "";
      });
    };
    const addCar = () => {
      common_vendor.index.navigateTo({
        url: "/pages/addCar/addCar"
      });
    };
    const toggleMapMode = () => {
      showMap.value = !showMap.value;
    };
    const handleTap = (e = null) => {
      const markerId = e.detail.markerId;
      const selectedDevice = UTS.arrayFind(originalDeviceList.value, (device = null) => {
        return device.deviceId == markerId;
      });
      if (selectedDevice) {
        common_vendor.index.navigateTo({
          url: `/pages/carInfoDetail/carInfoDetail?imei=${selectedDevice.imei}&deptId=${selectedDevice.companyId}&deviceId=${selectedDevice.deviceId}`
        });
      } else {
        common_vendor.index.__f__("warn", "at pages/index/index.uvue:155", "未找到对应的设备信息", markerId);
      }
    };
    const updateMarkers = (devices = null) => {
      if (!Array.isArray(devices)) {
        devices = [];
      }
      markers.value = devices.map((device = null, index = null) => {
        if (!device || typeof device !== "object") {
          common_vendor.index.__f__("warn", "at pages/index/index.uvue:166", "无效的设备数据", device);
          return null;
        }
        const lat = Number(device.latitude);
        const lng = Number(device.longitude);
        if (isNaN(lat) || isNaN(lng)) {
          common_vendor.index.__f__("warn", "at pages/index/index.uvue:174", "设备经纬度无效", device);
          return null;
        }
        return new UTSJSONObject({
          id: Number(device.deviceId),
          latitude: lat,
          longitude: lng,
          iconPath: device.connectionStatus == "online" ? "/static/car.png" : "/static/offline.png",
          width: 25,
          height: 25,
          callout: new UTSJSONObject({
            padding: 5,
            borderWidth: 1,
            borderRadius: 10,
            bgColor: "#ffffff",
            content: device.plateNo || "未命名设备",
            display: "ALWAYS"
          }),
          joinCluster: true,
          clusterId: `${lat.toFixed(2)}_${lng.toFixed(2)}`
        });
      }).filter((marker = null) => {
        return marker !== null;
      });
    };
    const loadGroupData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const groupRes = yield api_request.getUserGroupList();
          if ((groupRes === null || groupRes === void 0 ? null : groupRes.code) !== 0 || !Array.isArray(groupRes.data)) {
            throw new Error("获取分组数据失败");
          }
          const allGroupOption = new UTSJSONObject({
            name: "全部分组",
            value: "all",
            id: "all"
          });
          const formattedData = groupRes.data.map((item = null) => {
            return new UTSJSONObject({
              name: item.name || "未命名分组",
              value: item.id || "",
              id: item.id || ""
            });
          });
          formattedData.unshift(allGroupOption);
          carGroup.value = [formattedData];
          pickerGroupTitle.value = "全部分组";
          currentGroupId.value = "all";
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:230", "加载分组数据失败:", err);
          common_vendor.index.showToast({
            title: "加载分组失败",
            icon: "none"
          });
        }
      });
    };
    const refresh = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        yield loadUserDeviceList();
      });
    };
    const loadUserDeviceList = (groupId = "") => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          let params = new UTSJSONObject(
            {}
            // 如果不是全部分组，添加分组ID参数
          );
          if (groupId && groupId !== "all") {
            params = new UTSJSONObject({ groupId });
          }
          const res = yield api_request.getUserDeviceList(params);
          common_vendor.index.__f__("log", "at pages/index/index.uvue:251", "API响应数据:", res);
          let deviceList = [];
          if (res === null || res === void 0 ? null : res.data) {
            if (Array.isArray(res.data)) {
              deviceList = res.data;
            } else if (Array.isArray(res.data.list)) {
              deviceList = res.data.list;
            } else if (Array.isArray(res.data.devices)) {
              deviceList = res.data.devices;
            } else if (Array.isArray(res.data.items)) {
              deviceList = res.data.items;
            } else if (res.data.totalCount !== void 0) {
              deviceList = [];
            }
          }
          common_vendor.index.__f__("log", "at pages/index/index.uvue:268", "解析后的设备列表:", deviceList);
          originalDeviceList.value = utils_coordTransform.CoordTransform.batchConvertCoordinates(deviceList, "tencent");
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:274", "获取设备列表失败:", err);
          common_vendor.index.showToast({
            title: "获取设备列表失败",
            icon: "none"
          });
        }
      });
    };
    const refreshDeviceList = () => {
      common_vendor.index.__f__("log", "at pages/index/index.uvue:284", "收到刷新事件，重新加载设备列表");
      loadUserDeviceList(currentGroupId.value);
    };
    const getUserIn = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield api_request.getUserInfo();
          if ((res === null || res === void 0 ? null : res.code) === 0) {
            common_vendor.index.setStorageSync("userType", res.data.type);
          }
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:295", "获取用户信息失败:", err);
        }
      });
    };
    common_vendor.onShow(() => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const token = common_vendor.index.getStorageSync("token");
        if (token) {
          common_vendor.index.$on("refreshDeviceList", refreshDeviceList);
          const needRefresh = common_vendor.index.getStorageSync("needRefreshHome");
          if (needRefresh) {
            yield loadUserDeviceList(currentGroupId.value);
            common_vendor.index.removeStorageSync("needRefreshHome");
          }
        }
      });
    });
    common_vendor.onHide(() => {
      common_vendor.index.$off("refreshDeviceList", refreshDeviceList);
    });
    common_vendor.onLoad(() => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          common_vendor.index.redirectTo({ url: "/pages/login/login" });
          Login.value = false;
        } else {
          Login.value = true;
          yield loadGroupData();
          yield loadUserDeviceList();
          yield getUserIn();
          mapCtx = common_vendor.index.createMapContext("myMap", this);
          if (mapCtx && mapCtx.initMarkerCluster) {
            mapCtx.initMarkerCluster(new UTSJSONObject({
              enableDefaultStyle: true,
              zoomOnClick: true,
              gridSize: 60,
              complete: () => {
                common_vendor.index.__f__("log", "at pages/index/index.uvue:339", "聚合初始化完成");
              }
            }));
          }
        }
      });
    });
    common_vendor.onUnload(() => {
      common_vendor.index.$off("refreshDeviceList", refreshDeviceList);
    });
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: common_vendor.p(new UTSJSONObject({
          title: "首页",
          ["show-back"]: false,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        })),
        b: showMap.value
      }), showMap.value ? new UTSJSONObject({
        c: common_vendor.sei("myMap", "map"),
        d: markers.value,
        e: mapScale.value,
        f: common_vendor.o(handleTap)
      }) : new UTSJSONObject({
        g: common_vendor.p(new UTSJSONObject({
          lists: filteredDevices.value
        }))
      }), new UTSJSONObject({
        h: common_assets._imports_0,
        i: common_vendor.o(refresh),
        j: common_assets._imports_1,
        k: common_vendor.o(addCar),
        l: showMap.value ? "/static/list.png" : "/static/map.png",
        m: common_vendor.o(toggleMapMode),
        n: showMap.value
      }), showMap.value ? new UTSJSONObject({
        o: common_vendor.t(totalCount.value),
        p: common_vendor.t(onlineCount.value),
        q: common_vendor.t(offlineCount.value)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        r: common_vendor.t(pickerStateTitle.value),
        s: common_vendor.p(new UTSJSONObject({
          name: "arrow-down",
          color: "#fff"
        })),
        t: common_vendor.o(handStatePicker),
        v: !showMap.value
      }), !showMap.value ? new UTSJSONObject({
        w: common_vendor.t(pickerGroupTitle.value),
        x: common_vendor.p(new UTSJSONObject({
          name: "arrow-down",
          color: "#fff"
        })),
        y: common_vendor.o(handGroupPicker)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        z: common_vendor.sr(picker, "a4fca7fa-4", new UTSJSONObject({
          "k": "picker"
        })),
        A: common_vendor.o(confirm),
        B: common_vendor.p(new UTSJSONObject({
          columns: columns.value,
          keyName: "name"
        })),
        C: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
