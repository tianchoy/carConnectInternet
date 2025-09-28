"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_limeTransition_index = require("../../../lime-transition/index.js");
const uni_modules_limePopup_components_lPopup_utils = require("./utils.js");
if (!Array) {
  const _easycom_l_overlay_1 = common_vendor.resolveComponent("l-overlay");
  const _easycom_l_icon_1 = common_vendor.resolveComponent("l-icon");
  (_easycom_l_overlay_1 + _easycom_l_icon_1)();
}
const _easycom_l_overlay = () => "../../../lime-overlay/components/l-overlay/l-overlay.js";
const _easycom_l_icon = () => "../../../lime-icon/components/l-icon/l-icon.js";
if (!Math) {
  (_easycom_l_overlay + _easycom_l_icon)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "l-popup",
  props: /* @__PURE__ */ common_vendor.mergeModels(new UTSJSONObject({
    closeable: { type: Boolean, default: false },
    closeOnClickOverlay: { type: Boolean, default: true },
    destroyOnClose: { type: Boolean, default: false },
    overlayStyle: {},
    position: { default: "center" },
    preventScrollThrough: { type: Boolean, default: true },
    overlay: { type: Boolean, default: true },
    transitionName: {},
    visible: { type: Boolean },
    zIndex: { default: 999 },
    duration: { default: 300 },
    bgColor: {},
    closeIcon: { default: "close" },
    iconColor: {},
    lStyle: {},
    safeAreaInsetBottom: { type: Boolean, default: true },
    safeAreaInsetTop: { type: Boolean, default: false },
    radius: {}
  }), new UTSJSONObject({
    "modelValue": { type: Boolean },
    "modelModifiers": {}
  })),
  emits: /* @__PURE__ */ common_vendor.mergeModels(["change", "click-overlay", "click-close", "open", "opened", "close", "closed", "before-enter", "enter", "after-enter", "before-leave", "leave", "after-leave"], ["update:modelValue"]),
  setup(__props, _a) {
    var _b;
    var __emit = _a.emit;
    const emit = __emit;
    const props = __props;
    const modelValue = common_vendor.useModel(__props, "modelValue");
    const innerValue = common_vendor.computed({
      set(value) {
        modelValue.value = value;
        emit("change", value);
      },
      get() {
        return props.visible || modelValue.value;
      }
    });
    const status = common_vendor.ref("before-enter");
    const _c = uni_modules_limeTransition_index.useTransition({
      defaultName: (_b = props.transitionName) !== null && _b !== void 0 ? _b : "popup-fade",
      appear: innerValue.value,
      emits: (name) => {
        status.value = name;
        if (name == "before-enter") {
          emit("open");
        } else if (name == "after-enter") {
          emit("opened");
        } else if (name == "before-leave") {
          emit("close");
        } else if (name == "after-leave") {
          emit("closed");
        }
        emit(name);
      },
      visible: () => {
        return innerValue.value;
      },
      duration: props.duration
    }), inited = _c.inited, display = _c.display, classes = _c.classes, finished = _c.finished;
    const overlayZIndex = common_vendor.computed(() => {
      return props.zIndex > 0 ? props.zIndex - 1 : 998;
    });
    const rootClass = common_vendor.computed(() => {
      const safe = props.safeAreaInsetTop && props.position == "top" ? "l-popup--safe-top" : props.safeAreaInsetBottom && props.position == "bottom" ? "l-popup--safe-bottom" : "";
      return `l-popup--${props.position} ${safe} ${classes.value}`;
    });
    common_vendor.index.getWindowInfo().safeAreaInsets;
    const styles = common_vendor.computed(() => {
      const style = /* @__PURE__ */ new Map();
      style.set("transition-duration", props.duration + "ms");
      if (props.bgColor != null) {
        style.set("background", props.bgColor);
      }
      if (props.zIndex > 0) {
        style.set("z-index", props.zIndex);
      }
      if (props.radius != null) {
        const values = uni_modules_limePopup_components_lPopup_utils.convertRadius(props.radius);
        style.set("border-top-left-radius", values[0]);
        style.set("border-top-right-radius", values[1]);
        style.set("border-bottom-right-radius", values[2]);
        style.set("border-bottom-left-radius", values[3]);
      }
      if (!display.value) {
        style.set("pointer-events", "none");
      }
      return style;
    });
    const handleOverlayClick = () => {
      if (props.closeOnClickOverlay) {
        innerValue.value = false;
        emit("click-overlay");
      }
    };
    const handleClose = () => {
      innerValue.value = false;
      emit("click-close");
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: _ctx.destroyOnClose ? common_vendor.unref(display) && _ctx.overlay : _ctx.overlay
      }, (_ctx.destroyOnClose ? common_vendor.unref(display) && _ctx.overlay : _ctx.overlay) ? {
        b: common_vendor.o(handleOverlayClick),
        c: common_vendor.p({
          visible: common_vendor.unref(innerValue),
          zIndex: common_vendor.unref(overlayZIndex),
          appear: true,
          preventScrollThrough: _ctx.preventScrollThrough,
          ["l-style"]: _ctx.overlayStyle
        })
      } : {}, {
        d: _ctx.destroyOnClose ? common_vendor.unref(display) : common_vendor.unref(inited)
      }, (_ctx.destroyOnClose ? common_vendor.unref(display) : common_vendor.unref(inited)) ? common_vendor.e({
        e: _ctx.closeable
      }, _ctx.closeable ? {
        f: common_vendor.p({
          name: _ctx.closeIcon,
          size: "27px",
          color: _ctx.iconColor
        }),
        g: common_vendor.o(handleClose)
      } : {}, {
        h: common_vendor.sei("r0-7cb52a4a", "view", "popupRef"),
        i: common_vendor.n(common_vendor.unref(rootClass)),
        j: common_vendor.s(common_vendor.unref(styles)),
        k: common_vendor.s(_ctx.lStyle),
        l: common_vendor.o((...args) => {
          return common_vendor.unref(finished) && common_vendor.unref(finished)(...args);
        })
      }) : {});
      return __returned__;
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/lime-popup/components/l-popup/l-popup.js.map
