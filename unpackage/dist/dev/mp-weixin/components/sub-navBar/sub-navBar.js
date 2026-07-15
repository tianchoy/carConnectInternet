"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "sub-navBar",
  props: {
    showTime: {
      type: Boolean,
      default: true
    },
    showPickerTime: {
      type: Boolean,
      default: true
    },
    showCar: {
      type: Boolean,
      default: false
    },
    showPicker: {
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
    _a.emit;
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
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: __props.showTime
      }, __props.showTime ? common_vendor.e({
        b: common_vendor.t(__props.currentTime),
        c: !__props.showPickerTime
      }, !__props.showPickerTime ? {} : {}, {
        d: __props.showPickerTime
      }, __props.showPickerTime ? {
        e: common_assets._imports_0$4
      } : {}, {
        f: common_vendor.o(($event) => {
          return __props.showPickerTime ? handleTime : null;
        }, "02")
      }) : {}, {
        g: __props.showCar
      }, __props.showCar ? {
        h: common_vendor.t(__props.currentCar),
        i: common_vendor.o(($event) => {
          return __props.showPicker ? handleCar : null;
        }, "4f")
      } : {}, {
        j: common_vendor.t(__props.carStatus == "online" ? "在线" : "离线"),
        k: common_vendor.n(__props.carStatus == "online" ? "success" : "error"),
        l: common_vendor.sei(common_vendor.gei(_ctx, ""), "cover-view"),
        m: `${_ctx.u_s_b_h}px`,
        n: `${_ctx.u_s_a_i_b}px`,
        o: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f630fc82"]]);
wx.createComponent(Component);
