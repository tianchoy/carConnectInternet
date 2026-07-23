"use strict";
const common_vendor = require("../../common/vendor.js");
class PickerItem extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          label: { type: String, optional: false },
          value: { type: String, optional: false }
        };
      },
      name: "PickerItem"
    };
  }
  constructor(options, metadata = PickerItem.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.label = this.__props__.label;
    this.value = this.__props__.value;
    delete this.__props__;
  }
}
class PickerConfirmEvent extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          value: { type: "Unknown", optional: false }
        };
      },
      name: "PickerConfirmEvent"
    };
  }
  constructor(options, metadata = PickerConfirmEvent.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.value = this.__props__.value;
    delete this.__props__;
  }
}
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
    common_vendor.ref(null);
    const currentPickerType = common_vendor.ref("");
    const handleTime = () => {
      columns.value = props.times;
      currentPickerType.value = "time";
    };
    const handleCar = () => {
      columns.value = props.cars;
      currentPickerType.value = "car";
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: __props.showTime
      }, __props.showTime ? common_vendor.e({
        b: common_vendor.t(__props.currentTime),
        c: !__props.showPickerTime
      }, !__props.showPickerTime ? {} : {}, {
        d: common_vendor.o(($event) => {
          return __props.showPickerTime ? handleTime : null;
        }, "51")
      }) : {}, {
        e: __props.showCar
      }, __props.showCar ? {
        f: common_vendor.t(__props.currentCar),
        g: common_vendor.o(($event) => {
          return __props.showPicker ? handleCar : null;
        }, "00")
      } : {}, {
        h: common_vendor.t(__props.carStatus == "online" ? "在线" : "离线"),
        i: common_vendor.n(__props.carStatus == "online" ? "success" : "error"),
        j: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        k: `${_ctx.u_s_b_h}px`,
        l: `${_ctx.u_s_a_i_b}px`,
        m: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f630fc82"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/sub-navBar/sub-navBar.js.map
