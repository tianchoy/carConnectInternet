"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uv_picker_1 = common_vendor.resolveComponent("uv-picker");
  _easycom_uv_picker_1();
}
const _easycom_uv_picker = () => "../../uni_modules/uv-picker/components/uv-picker/uv-picker.js";
if (!Math) {
  _easycom_uv_picker();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "sub-navBar",
  props: {
    showTime: {
      type: Boolean,
      default: true
    },
    currentTime: {
      type: String,
      default: ""
    },
    currentCar: {
      type: String,
      default: ""
    },
    carStatus: {
      type: String,
      default: "在线"
    },
    times: {
      type: Array,
      default: () => {
        return [[]];
      }
      // 默认值调整为二维数组
    },
    cars: {
      type: Array,
      default: () => {
        return [[]];
      }
      // 默认值调整为二维数组
    }
  },
  emits: ["update:currentTime", "update:currentCar"],
  setup(__props, _a) {
    var __emit = _a.emit;
    const props = __props;
    const columns = common_vendor.ref([]);
    const picker = common_vendor.ref(null);
    const currentPickerType = common_vendor.ref("");
    const handleTime = () => {
      var _a2;
      columns.value = props.times;
      currentPickerType.value = "time";
      (_a2 = picker.value) === null || _a2 === void 0 ? null : _a2.open();
    };
    const handleCar = () => {
      var _a2;
      columns.value = props.cars;
      currentPickerType.value = "car";
      (_a2 = picker.value) === null || _a2 === void 0 ? null : _a2.open();
    };
    const confirm = (e) => {
      const selected = e.value[0];
      if (currentPickerType.value === "time") {
        emit("update:currentTime", selected.label);
      } else if (currentPickerType.value === "car") {
        emit("update:currentCar", selected.label);
      }
      currentPickerType.value = "";
    };
    const emit = __emit;
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: __props.showTime
      }), __props.showTime ? new UTSJSONObject({
        b: common_vendor.t(__props.currentTime),
        c: common_assets._imports_0$4,
        d: common_vendor.o(handleTime)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        e: common_vendor.t(__props.currentCar),
        f: common_assets._imports_0$4,
        g: common_vendor.o(handleCar),
        h: common_vendor.t(__props.carStatus == "online" ? "在线" : "离线"),
        i: common_vendor.n(__props.carStatus == "online" ? "success" : "error"),
        j: common_vendor.sr(picker, "f630fc82-0", new UTSJSONObject({
          "k": "picker"
        })),
        k: common_vendor.o(confirm),
        l: common_vendor.p(new UTSJSONObject({
          columns: common_vendor.unref(columns),
          keyName: "label"
        }))
      }));
      return __returned__;
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f630fc82"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/sub-navBar/sub-navBar.js.map
