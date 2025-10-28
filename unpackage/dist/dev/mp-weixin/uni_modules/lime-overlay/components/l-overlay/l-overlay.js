"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_limeTransition_index = require("../../../lime-transition/index.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({
  name: "l-overlay"
}, { __name: "l-overlay", props: {
  ariaLabel: { default: "关闭" },
  ariaRole: { default: "button" },
  lClass: {},
  bgColor: {},
  lStyle: {},
  duration: { default: 300 },
  preventScrollThrough: { type: Boolean, default: true },
  visible: { type: Boolean, default: false },
  zIndex: { default: 998 }
}, emits: ["click", "before-enter", "enter", "after-enter", "before-leave", "leave", "after-leave"], setup(__props, _a) {
  var __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  const _b = uni_modules_limeTransition_index.useTransition({
    defaultName: "fade",
    appear: props.visible,
    emits: (name) => {
      emit(name);
    },
    visible: () => {
      return props.visible;
    },
    duration: props.duration
  }), inited = _b.inited, display = _b.display, classes = _b.classes, finished = _b.finished;
  const styles = common_vendor.computed(() => {
    const style = /* @__PURE__ */ new Map();
    if (props.bgColor != null) {
      style.set("background", props.bgColor);
    }
    if (props.zIndex > 0) {
      style.set("z-index", props.zIndex);
    }
    style.set("transition-duration", props.duration + "ms");
    if (!display.value) {
      style.set("display", "none");
    }
    return style;
  });
  const noop = () => {
  };
  const onClick = (event) => {
    emit("click", !props.visible);
  };
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: common_vendor.unref(inited)
    }, common_vendor.unref(inited) ? {
      b: common_vendor.sei(common_vendor.gei(_ctx, "", "r0-85e95612"), "view", "overlayRef"),
      c: common_vendor.n(_ctx.lClass),
      d: common_vendor.n(common_vendor.unref(classes)),
      e: common_vendor.s(common_vendor.unref(styles)),
      f: common_vendor.s(_ctx.lStyle),
      g: common_vendor.o(onClick),
      h: common_vendor.o(noop),
      i: common_vendor.o((...args) => {
        return common_vendor.unref(finished) && common_vendor.unref(finished)(...args);
      }),
      j: _ctx.ariaRole,
      k: _ctx.ariaLabel
    } : {});
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
