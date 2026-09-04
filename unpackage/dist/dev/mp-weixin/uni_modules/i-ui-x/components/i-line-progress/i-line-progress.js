"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-line-progress" }, { __name: "i-line-progress", props: {
  percent: { type: Number, default: 45 },
  title: { type: String, default: "上传进度" },
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
  common_vendor.watch(() => {
    return props.percent;
  }, (nextValue) => {
    current.value = nextValue;
  });
  function step(delta) {
    current.value = Math.min(100, Math.max(0, current.value + delta));
    emit("change", current.value);
    emit("update:percent", current.value);
  }
  function emitClick() {
    emit("click", current.value);
  }
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: common_vendor.t(__props.title),
      b: __props.showText
    }, __props.showText ? {
      c: common_vendor.t(normalized.value)
    } : {}, {
      d: common_vendor.s("width:" + normalized.value + "%;background-color:" + __props.activeColor),
      e: common_vendor.s("height:" + __props.height + "px;background-color:" + __props.inactiveColor),
      f: common_vendor.o(($event) => {
        return step(-15);
      }, "15"),
      g: common_vendor.o(($event) => {
        return step(15);
      }, "03"),
      h: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      i: common_vendor.o(emitClick, "d7"),
      j: `${_ctx.u_s_b_h}px`,
      k: `${_ctx.u_s_a_i_b}px`,
      l: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
    });
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/i-ui-x/components/i-line-progress/i-line-progress.js.map
