"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-empty" }, { __name: "i-empty", props: {
  icon: { type: String, default: "∅" },
  image: { type: String, default: "" },
  text: { type: String, default: "暂无数据" },
  description: { type: String, default: "可以点击按钮重新加载。" },
  buttonText: { type: String, default: "重新加载" },
  showButton: { type: Boolean, default: true },
  iconSize: { type: [String, Number], default: 42 },
  iconColor: { type: String, default: "#c0c4cc" },
  textColor: { type: String, default: "#303133" },
  descriptionColor: { type: String, default: "#909399" },
  buttonColor: { type: String, default: "#2979ff" },
  buttonTextColor: { type: String, default: "#ffffff" },
  padding: { type: [String, Number], default: "28px 16px" },
  bgColor: { type: String, default: "#ffffff" }
}, emits: ["click", "retry"], setup(__props, _a) {
  var __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  function formatSize(value) {
    const text = value.toString();
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0)
      return text;
    return text + "px";
  }
  function formatBoxSize(value) {
    const text = value.toString();
    if (text.indexOf(" ") >= 0)
      return text;
    return formatSize(value);
  }
  const bgColor = common_vendor.computed(() => {
    return props.bgColor;
  });
  const wrapStyle = common_vendor.computed(() => {
    return "padding:" + formatBoxSize(props.padding) + ";background-color:" + bgColor.value + ";";
  });
  const iconStyle = common_vendor.computed(() => {
    return "font-size:" + formatSize(props.iconSize) + ";color:" + props.iconColor + ";";
  });
  const textStyle = common_vendor.computed(() => {
    return "color:" + props.textColor + ";";
  });
  const descStyle = common_vendor.computed(() => {
    return "color:" + props.descriptionColor + ";";
  });
  const buttonStyle = common_vendor.computed(() => {
    return "background-color:" + props.buttonColor + ";";
  });
  const buttonTextStyle = common_vendor.computed(() => {
    return "color:" + props.buttonTextColor + ";";
  });
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: __props.image.length > 0
    }, __props.image.length > 0 ? {
      b: __props.image
    } : {
      c: common_vendor.t(__props.icon),
      d: common_vendor.s(iconStyle.value)
    }, {
      e: common_vendor.t(__props.text),
      f: common_vendor.s(textStyle.value),
      g: __props.description.length > 0
    }, __props.description.length > 0 ? {
      h: common_vendor.t(__props.description),
      i: common_vendor.s(descStyle.value)
    } : {}, {
      j: __props.showButton
    }, __props.showButton ? {
      k: common_vendor.t(__props.buttonText),
      l: common_vendor.s(buttonTextStyle.value),
      m: common_vendor.s(buttonStyle.value),
      n: common_vendor.o(($event) => {
        return emit("retry");
      }, "dc")
    } : {}, {
      o: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      p: common_vendor.s(wrapStyle.value),
      q: common_vendor.s({
        "--status-bar-height": `${_ctx.u_s_b_h}px`,
        "--uni-safe-area-inset-bottom": `${_ctx.u_s_a_i_b}px`
      }),
      r: common_vendor.o(($event) => {
        return emit("click");
      }, "d4"),
      s: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
    });
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/i-ui-x/components/i-empty/i-empty.js.map
