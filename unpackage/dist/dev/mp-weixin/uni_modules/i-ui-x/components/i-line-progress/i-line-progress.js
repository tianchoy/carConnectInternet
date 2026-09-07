"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-line-progress" }, { __name: "i-line-progress", props: {
  percent: { type: Number, default: 45 },
  title: { type: String, default: "" },
  activeColor: { type: String, default: "#19be6b" },
  inactiveColor: { type: String, default: "#ebeef5" },
  height: { type: Number, default: 8 },
  showText: { type: Boolean, default: true }
}, emits: ["click", "change", "update:percent"], setup(__props, _a) {
  var __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  const current = common_vendor.ref(props.percent);
  const normalized = common_vendor.computed(() => {
    if (current.value < 0)
      return 0;
    if (current.value > 100)
      return 100;
    return Math.round(current.value);
  });
  function emitClick() {
    emit("click", current.value);
  }
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: common_vendor.s("width:" + normalized.value + "%;background-color:" + __props.activeColor),
      b: common_vendor.s("height:" + __props.height + "px;background-color:" + __props.inactiveColor),
      c: common_vendor.t(__props.title),
      d: __props.showText
    }, __props.showText ? {
      e: common_vendor.t(normalized.value)
    } : {}, {
      f: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      g: common_vendor.o(emitClick, "d7"),
      h: `${_ctx.u_s_b_h}px`,
      i: `${_ctx.u_s_a_i_b}px`,
      j: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
    });
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/i-ui-x/components/i-line-progress/i-line-progress.js.map
