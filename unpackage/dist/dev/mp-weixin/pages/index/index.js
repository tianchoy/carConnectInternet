"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_request = require("../../api/request.js");
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
    const center = common_vendor.reactive(new UTSJSONObject({
      latitude: 39.90469,
      longitude: 116.40717
    }));
    const mapScale = common_vendor.ref(12);
    const showMap = common_vendor.ref(true);
    const markers = common_vendor.ref([]);
    const currentPickerType = common_vendor.ref("");
    const picker = common_vendor.ref(null);
    const carState = common_vendor.ref([
      [new UTSJSONObject({
        label: "全部状态",
        value: "0"
      }), new UTSJSONObject({
        label: "在线",
        value: "1"
      }), new UTSJSONObject({
        label: "离线",
        value: "2"
      })]
    ]);
    const carGroup = common_vendor.ref([]);
    const columns = common_vendor.ref([[]]);
    const pickerStateTitle = common_vendor.ref("全部状态");
    const pickerGroupTitle = common_vendor.ref("全部分组");
    const originalDeviceList = common_vendor.ref([]);
    const filteredDevices = common_vendor.computed(() => {
      var _a;
      if (!Array.isArray(originalDeviceList.value))
        return [];
      let result = [...originalDeviceList.value];
      if (pickerStateTitle.value == "在线") {
        result = result.filter((device = null) => {
          return (device === null || device === void 0 ? null : device.status) == 1;
        });
      } else if (pickerStateTitle.value === "离线") {
        result = result.filter((device = null) => {
          return (device === null || device === void 0 ? null : device.status) == 0;
        });
      }
      if (pickerGroupTitle.value !== "全部分组") {
        const selectedGroup = (_a = carGroup.value[0]) === null || _a === void 0 ? null : _a.find((group = null) => {
          return group.label === pickerGroupTitle.value;
        });
        if (selectedGroup && Array.isArray(selectedGroup.devices)) {
          const groupDeviceIds = selectedGroup.devices.map((d = null) => {
            return d.id;
          });
          result = result.filter((device = null) => {
            return groupDeviceIds.includes(device.id);
          });
        }
      }
      return result;
    });
    const totalCount = common_vendor.computed(() => {
      return originalDeviceList.value.length;
    });
    const onlineCount = common_vendor.computed(() => {
      return originalDeviceList.value.filter((d = null) => {
        return (d === null || d === void 0 ? null : d.status) === "1";
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
      const selected = e.value[0];
      if (currentPickerType.value == "state") {
        pickerStateTitle.value = selected.label;
      } else if (currentPickerType.value == "group") {
        pickerGroupTitle.value = selected.label;
      }
      currentPickerType.value = "";
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
      common_vendor.index.navigateTo({
        url: "/pages/carInfoDetail/carInfoDetail"
      });
    };
    const updateMarkers = (devices = null) => {
      if (!Array.isArray(devices)) {
        common_vendor.index.__f__("error", "at pages/index/index.uvue:156", "updateMarkers: devices参数不是数组", devices);
        devices = [];
      }
      markers.value = devices.map((device = null) => {
        if (!device || typeof device !== "object") {
          common_vendor.index.__f__("warn", "at pages/index/index.uvue:162", "无效的设备数据", device);
          return null;
        }
        const lat = Number(device.latitude);
        const lng = Number(device.longitude);
        if (isNaN(lat) || isNaN(lng)) {
          common_vendor.index.__f__("warn", "at pages/index/index.uvue:171", "设备经纬度无效", device);
          return null;
        }
        return new UTSJSONObject({
          id: device.id || Math.random().toString(36).substr(2, 9),
          latitude: lat,
          longitude: lng,
          iconPath: device.status === "1" ? "/static/online-marker.png" : "/static/offline-marker.png",
          width: 50,
          height: 50,
          callout: new UTSJSONObject({
            padding: 5,
            borderWidth: 1,
            borderRadius: 10,
            bgColor: "#ffffff",
            content: device.name || "未命名设备",
            display: "BYCLICK"
          })
        });
      }).filter((marker = null) => {
        return marker !== null;
      });
    };
    const loadGroupData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
          const userRes = yield api_request.getUserInfo();
          if (!((_a = userRes === null || userRes === void 0 ? null : userRes.data) === null || _a === void 0 ? null : _a.deptId)) {
            throw new Error("获取部门ID失败");
          }
          const deviceRes = yield api_request.getCustomDeviceList(userRes.data.deptId);
          if (!(deviceRes === null || deviceRes === void 0 ? null : deviceRes.data)) {
            throw new Error("获取分组数据失败");
          }
          const formattedData = deviceRes.data.map((item = null) => {
            var _a2;
            return {
              label: item.name || "未命名分组",
              value: ((_a2 = item.id) === null || _a2 === void 0 ? null : _a2.toString()) || Math.random().toString(36).substr(2, 9),
              devices: Array.isArray(item.devices) ? item.devices : []
            };
          });
          carGroup.value = [formattedData];
          let allDevices = [];
          formattedData.forEach((group = null) => {
            if (Array.isArray(group.devices)) {
              allDevices = allDevices.concat(group.devices);
            }
          });
          originalDeviceList.value = allDevices;
          pickerGroupTitle.value = "全部分组";
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:225", "加载分组数据失败:", err);
          common_vendor.index.showToast({
            title: "加载分组失败",
            icon: "none"
          });
        }
      });
    };
    const loadUserDeviceList = (data = new UTSJSONObject({})) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield api_request.getUserDeviceList(data);
          common_vendor.index.__f__("log", "at pages/index/index.uvue:236", "API响应数据:", res);
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
            }
          }
          common_vendor.index.__f__("log", "at pages/index/index.uvue:251", "解析后的设备列表:", deviceList);
          originalDeviceList.value = deviceList;
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:254", "获取设备列表失败:", err);
          common_vendor.index.showToast({
            title: "获取设备列表失败",
            icon: "none"
          });
        }
      });
    };
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
          common_vendor.index.createMapContext("myMap", this);
        }
      });
    });
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: common_vendor.p(new UTSJSONObject({
          title: "首页",
          ["show-back"]: false,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: true
        })),
        b: showMap.value
      }), showMap.value ? new UTSJSONObject({
        c: common_vendor.sei("myMap", "map"),
        d: center.latitude,
        e: center.longitude,
        f: markers.value,
        g: mapScale.value,
        h: common_vendor.o(handleTap)
      }) : new UTSJSONObject({
        i: common_vendor.p(new UTSJSONObject({
          lists: filteredDevices.value
        }))
      }), new UTSJSONObject({
        j: common_assets._imports_0,
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
          keyName: "label"
        })),
        C: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
