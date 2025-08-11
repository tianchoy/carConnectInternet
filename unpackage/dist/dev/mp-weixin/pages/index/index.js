"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
require("../../utils/amap-wx.130.js");
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
    common_vendor.ref("");
    common_vendor.ref(new UTSJSONObject({}));
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
    const carList = common_vendor.ref([]);
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
      if (currentPickerType.value === "state") {
        pickerStateTitle.value = selected.label;
        common_vendor.index.__f__("log", "at pages/index/index.uvue:100", "选择了状态:", selected.value);
      } else if (currentPickerType.value === "group") {
        pickerGroupTitle.value = selected.label;
        carList.value = selected.devices;
      }
      currentPickerType.value = "";
    };
    const addCar = () => {
      common_vendor.index.navigateTo({
        url: "/pages/addCar/addCar"
      });
    };
    common_vendor.onMounted(() => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
      });
    });
    const handleTap = (e = null) => {
      common_vendor.index.navigateTo({
        url: "/pages/carInfoDetail/carInfoDetail"
      });
    };
    const toggleMapMode = () => {
      showMap.value = !showMap.value;
    };
    const handleRegionChange = (e = null) => {
      if (e.type == "end")
        ;
    };
    const loadGroupData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const userRes = yield api_request.getUserInfo();
          const deviceRes = yield api_request.getCustomDeviceList(userRes.data.deptId);
          const formattedData = deviceRes.data.map((item = null) => {
            return new UTSJSONObject({
              label: item.name,
              value: item.id.toString(),
              devices: item.devices
            });
          });
          carGroup.value = [formattedData];
          if (formattedData.length > 0) {
            let allDevices = [];
            formattedData.forEach((group = null) => {
              if (group.devices && group.devices.length > 0) {
                allDevices = allDevices.concat(group.devices);
              }
            });
            carList.value = allDevices;
            pickerGroupTitle.value = "全部分组";
          }
        } catch (err) {
          common_vendor.index.__f__("error", "at pages/index/index.uvue:330", "加载分组数据失败:", err);
          common_vendor.index.showToast({
            title: "加载分组失败",
            icon: "none"
          });
        }
      });
    };
    common_vendor.onLoad(() => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const token = common_vendor.index.getStorageSync("token");
        if (token == "") {
          common_vendor.index.redirectTo({ url: "/pages/login/login" });
          Login.value = false;
        } else {
          Login.value = true;
          loadGroupData();
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
          showCapsule: false
        })),
        b: showMap.value
      }), showMap.value ? new UTSJSONObject({
        c: common_vendor.sei("myMap", "map"),
        d: common_vendor.unref(center).latitude,
        e: common_vendor.unref(center).longitude,
        f: markers.value,
        g: mapScale.value,
        h: common_vendor.o(handleRegionChange),
        i: common_vendor.o(handleTap)
      }) : new UTSJSONObject({
        j: common_vendor.p(new UTSJSONObject({
          lists: carList.value
        }))
      }), new UTSJSONObject({
        k: common_assets._imports_0,
        l: common_vendor.o(addCar),
        m: showMap.value ? "/static/list.png" : "/static/map.png",
        n: common_vendor.o(toggleMapMode),
        o: showMap.value
      }), showMap.value ? new UTSJSONObject({}) : new UTSJSONObject({}), new UTSJSONObject({
        p: common_vendor.t(pickerStateTitle.value),
        q: common_vendor.p(new UTSJSONObject({
          name: "arrow-down",
          color: "#fff"
        })),
        r: common_vendor.o(handStatePicker),
        s: !showMap.value
      }), !showMap.value ? new UTSJSONObject({
        t: common_vendor.t(pickerGroupTitle.value),
        v: common_vendor.p(new UTSJSONObject({
          name: "arrow-down",
          color: "#fff"
        })),
        w: common_vendor.o(handGroupPicker)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        x: common_vendor.sr(picker, "a4fca7fa-4", new UTSJSONObject({
          "k": "picker"
        })),
        y: common_vendor.o(confirm),
        z: common_vendor.p(new UTSJSONObject({
          columns: columns.value,
          keyName: "label"
        })),
        A: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
