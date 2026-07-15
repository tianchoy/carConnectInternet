"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-modal" }, { __name: "i-modal", props: {
  show: { type: Boolean, default: false },
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  confirmText: { type: String, default: "确认" },
  cancelText: { type: String, default: "取消" },
  showConfirmButton: { type: Boolean, default: true },
  showCancelButton: { type: Boolean, default: false },
  confirmColor: { type: String, default: "#2979ff" },
  cancelColor: { type: String, default: "#606266" },
  duration: { type: [String, Number], default: 200 },
  buttonReverse: { type: Boolean, default: false },
  zoom: { type: Boolean, default: true },
  zIndex: { type: [String, Number], default: 10075 },
  asyncClose: { type: Boolean, default: false },
  closeable: { type: Boolean, default: false },
  closeOnMask: { type: Boolean, default: false },
  negativeTop: { type: [String, Number], default: 0 },
  width: { type: [String, Number], default: "320px" },
  confirmButtonShape: { type: String, default: "100px" },
  round: { type: [String, Number], default: "6px" },
  buttonModel: { type: String, default: "text" },
  buttonRadius: { type: String, default: "100px" },
  confirmBgColor: { type: String, default: "" },
  cancelBgColor: { type: String, default: "" },
  customStyle: { type: [String, Object], default: "" }
}, emits: ["confirm", "cancel", "close", "update:show"], setup(__props, _a) {
  var __expose = _a.expose, __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  const opened = common_vendor.ref(props.show);
  const active = common_vendor.ref(props.show);
  const loading = common_vendor.ref(false);
  let closeTimer = 0;
  const maskStyle = common_vendor.computed(() => {
    return "z-index:" + String(props.zIndex) + ";opacity:" + (active.value ? "1" : "0") + ";transition-duration:" + formatMs(props.duration) + ";";
  });
  const modalClass = common_vendor.computed(() => {
    const classes = ["i-modal"];
    return classes.join(" ");
  });
  const modalStyle = common_vendor.computed(() => {
    let style = "width:" + formatSize(props.width) + ";";
    style = style + "border-radius:" + formatSize(props.round) + ";";
    style = style + "transition-duration:" + formatMs(props.duration) + ";";
    const top = formatSize(props.negativeTop);
    const scaleValue = props.zoom ? active.value ? "1" : "0.86" : "1";
    const translateValue = top != "0px" ? "-" + top : "0px";
    style = style + "opacity:" + (active.value ? "1" : "0") + ";";
    style = style + "transform:translateY(" + translateValue + ") scale(" + scaleValue + ");";
    style = style + stringifyStyle(props.customStyle);
    return style;
  });
  const confirmButtonClass = common_vendor.computed(() => {
    const classes = ["i-modal__button", "i-modal__button--confirm"];
    if (props.buttonModel == "button")
      classes.push("i-modal__button--model-button");
    if (props.confirmButtonShape == "square")
      classes.push("i-modal__button--square");
    return classes.join(" ");
  });
  const cancelButtonClass = common_vendor.computed(() => {
    const classes = ["i-modal__button", "i-modal__button--cancel"];
    if (props.buttonModel == "button")
      classes.push("i-modal__button--model-button");
    return classes.join(" ");
  });
  const confirmTextStyle = common_vendor.computed(() => {
    return "color:" + props.confirmColor + ";";
  });
  const cancelTextStyle = common_vendor.computed(() => {
    return "color:" + props.cancelColor + ";";
  });
  const confirmButtonStyle = common_vendor.computed(() => {
    if (props.buttonModel != "button")
      return "";
    let style = "border-radius:" + formatSize(props.buttonRadius) + ";";
    if (props.confirmBgColor.length > 0)
      style = style + "background-color:" + props.confirmBgColor + ";";
    return style;
  });
  const cancelButtonStyle = common_vendor.computed(() => {
    if (props.buttonModel != "button")
      return "";
    let style = "border-radius:" + formatSize(props.buttonRadius) + ";";
    if (props.cancelBgColor.length > 0)
      style = style + "background-color:" + props.cancelBgColor + ";";
    return style;
  });
  common_vendor.watch(() => {
    return props.show;
  }, (nextValue) => {
    if (nextValue) {
      openPanel();
    } else {
      closePanel(false);
    }
  });
  function open() {
    openPanel();
    emit("update:show", true);
  }
  function close() {
    closePanel(true);
  }
  function openPanel() {
    clearCloseTimer();
    opened.value = true;
    setTimeout(() => {
      active.value = true;
    }, 20);
  }
  function closePanel(shouldEmitUpdate) {
    clearCloseTimer();
    active.value = false;
    loading.value = false;
    closeTimer = setTimeout(() => {
      opened.value = false;
      closeTimer = 0;
      if (shouldEmitUpdate)
        emit("update:show", false);
    }, animationDuration());
  }
  function clearCloseTimer() {
    if (closeTimer > 0) {
      clearTimeout(closeTimer);
      closeTimer = 0;
    }
  }
  function animationDuration() {
    const text = String(props.duration);
    if (text.indexOf("ms") >= 0)
      return Number(text.replace("ms", ""));
    if (text.indexOf("s") >= 0)
      return Number(text.replace("s", "")) * 1e3;
    const duration = Number(text);
    if (isNaN(duration))
      return 200;
    return duration;
  }
  function confirm() {
    if (loading.value)
      return null;
    emit("confirm");
    if (props.asyncClose) {
      loading.value = true;
      return null;
    }
    close();
  }
  function cancel() {
    emit("cancel");
    closePanel(true);
  }
  function closeByIcon() {
    emit("close");
    closePanel(true);
  }
  function handleOverlayClick() {
    if (!props.closeOnMask)
      return null;
    emit("close");
    closePanel(true);
  }
  function formatMs(value = null) {
    const text = String(value);
    if (text.indexOf("ms") >= 0 || text.indexOf("s") >= 0)
      return text;
    return text + "ms";
  }
  function formatSize(value = null) {
    const text = String(value);
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
      return text;
    }
    return text + "px";
  }
  function stringifyStyle(value = null) {
    if (value == null)
      return "";
    const text = String(value);
    if (text == "[object Object]" || text.length == 0)
      return "";
    return text.endsWith(";") ? text : text + ";";
  }
  __expose({
    open,
    close
  });
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: opened.value
    }, opened.value ? common_vendor.e({
      b: __props.closeable
    }, __props.closeable ? {
      c: common_vendor.o(closeByIcon, "53")
    } : {}, {
      d: __props.title.length > 0
    }, __props.title.length > 0 ? {
      e: common_vendor.t(__props.title)
    } : {}, {
      f: common_vendor.t(__props.content),
      g: __props.buttonReverse
    }, __props.buttonReverse ? common_vendor.e({
      h: __props.showConfirmButton
    }, __props.showConfirmButton ? {
      i: common_vendor.t(loading.value ? "..." : __props.confirmText),
      j: common_vendor.s(confirmTextStyle.value),
      k: common_vendor.n(confirmButtonClass.value),
      l: common_vendor.s(confirmButtonStyle.value),
      m: common_vendor.o(confirm, "b7")
    } : {}, {
      n: __props.showCancelButton
    }, __props.showCancelButton ? {
      o: common_vendor.t(__props.cancelText),
      p: common_vendor.s(cancelTextStyle.value),
      q: common_vendor.n(cancelButtonClass.value),
      r: common_vendor.s(cancelButtonStyle.value),
      s: common_vendor.o(cancel, "f9")
    } : {}) : common_vendor.e({
      t: __props.showCancelButton
    }, __props.showCancelButton ? {
      v: common_vendor.t(__props.cancelText),
      w: common_vendor.s(cancelTextStyle.value),
      x: common_vendor.n(cancelButtonClass.value),
      y: common_vendor.s(cancelButtonStyle.value),
      z: common_vendor.o(cancel, "62")
    } : {}, {
      A: __props.showConfirmButton
    }, __props.showConfirmButton ? {
      B: common_vendor.t(loading.value ? "..." : __props.confirmText),
      C: common_vendor.s(confirmTextStyle.value),
      D: common_vendor.n(confirmButtonClass.value),
      E: common_vendor.s(confirmButtonStyle.value),
      F: common_vendor.o(confirm, "a6")
    } : {}), {
      G: common_vendor.n(__props.buttonModel == "button" ? "i-modal__footer--button" : ""),
      H: common_vendor.n(modalClass.value),
      I: common_vendor.s(modalStyle.value),
      J: common_vendor.o(() => {
      }, "ee"),
      K: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      L: common_vendor.s(maskStyle.value),
      M: common_vendor.s({
        "--status-bar-height": `${_ctx.u_s_b_h}px`,
        "--uni-safe-area-inset-bottom": `${_ctx.u_s_a_i_b}px`
      }),
      N: common_vendor.o(handleOverlayClick, "a9"),
      O: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
    }) : {});
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
