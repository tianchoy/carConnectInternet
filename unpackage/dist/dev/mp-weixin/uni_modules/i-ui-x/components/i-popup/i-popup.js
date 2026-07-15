"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-popup" }, { __name: "i-popup", props: {
  show: { type: Boolean, default: false },
  overlay: { type: Boolean, default: true },
  mode: { type: String, default: "bottom" },
  position: { type: String, default: "" },
  title: { type: String, default: "" },
  showTitle: { type: Boolean, default: true },
  showClose: { type: Boolean, default: false },
  showFooter: { type: Boolean, default: false },
  showCancel: { type: Boolean, default: true },
  cancelText: { type: String, default: "" },
  confirmText: { type: String, default: "" },
  titleStyle: { type: [String, Object], default: "" },
  duration: { type: [String, Number], default: 300 },
  closeable: { type: Boolean, default: false },
  overlayStyle: { type: [String, Object], default: "" },
  overlayOpacity: { type: [String, Number], default: 0.5 },
  closeOnMask: { type: Boolean, default: true },
  overlayClick: { type: Boolean, default: true },
  overflayBgColor: { type: String, default: "" },
  zIndex: { type: [String, Number], default: 10075 },
  safeBottom: { type: Boolean, default: true },
  safeTop: { type: Boolean, default: false },
  closeIcon: { type: String, default: "close" },
  closeIconColor: { type: String, default: "#909399" },
  closeIconSize: { type: [String, Number], default: 18 },
  closeIconPos: { type: String, default: "top-right" },
  margin: { type: [String, Number], default: 0 },
  navbarHeight: { type: Number, default: 0 },
  round: { type: [String, Number], default: 16 },
  zoom: { type: Boolean, default: true },
  bgColor: { type: String, default: "#ffffff" },
  size: { type: [String, Number], default: "" },
  maxHeight: { type: [String, Number], default: "" },
  width: { type: [String, Number], default: "" },
  height: { type: [String, Number], default: "" },
  customStyle: { type: [String, Object], default: "" },
  customWrapStyle: { type: [String, Object], default: "" },
  customFooterStyle: { type: [String, Object], default: "" },
  contentMargin: { type: [String, Number], default: 16 },
  widthCoverCenter: { type: Boolean, default: false },
  offsetTop: { type: [String, Number], default: "0" },
  offsetBottom: { type: [String, Number], default: "0" },
  lazy: { type: Boolean, default: false },
  disabledScroll: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  disabledConfirm: { type: Boolean, default: false },
  btnColor: { type: String, default: "" },
  swipeClose: { type: Boolean, default: false },
  swipeHandle: { type: Boolean, default: true },
  contentDraggable: { type: Boolean, default: true },
  swipeCloseThreshold: { type: [String, Number], default: 50 }
}, emits: [
  "click",
  "open",
  "close",
  "beforeOpen",
  "beforeClose",
  "cancel",
  "confirm",
  "update:show"
], setup(__props, _a) {
  var __expose = _a.expose, __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  const bgColor = common_vendor.computed(() => {
    return props.bgColor;
  });
  const opened = common_vendor.ref(props.show);
  const active = common_vendor.ref(props.show);
  const contentReady = common_vendor.ref(!props.lazy || props.show);
  const startX = common_vendor.ref(0);
  const startY = common_vendor.ref(0);
  const offsetX = common_vendor.ref(0);
  const offsetY = common_vendor.ref(0);
  const touching = common_vendor.ref(false);
  let closeTimer = 0;
  let lazyTimer = 0;
  const rootStyle = common_vendor.computed(() => {
    return "z-index:" + String(props.zIndex) + ";";
  });
  const panelClass = common_vendor.computed(() => {
    const classes = ["i-popup__panel"];
    classes.push("i-popup__panel--" + normalizedMode.value);
    if (shouldCoverCenter())
      classes.push("i-popup__panel--cover-center");
    return classes.join(" ");
  });
  const normalizedMode = common_vendor.computed(() => {
    if (drawerPosition.value == "left" || drawerPosition.value == "right" || drawerPosition.value == "top" || drawerPosition.value == "center") {
      return drawerPosition.value;
    }
    return "bottom";
  });
  const drawerPosition = common_vendor.computed(() => {
    if (props.position.length > 0)
      return props.position;
    return props.mode;
  });
  const overlayComputedStyle = common_vendor.computed(() => {
    let bgColor2 = "rgba(0,0,0," + String(props.overlayOpacity) + ")";
    if (props.overflayBgColor.length > 0)
      bgColor2 = props.overflayBgColor;
    let style = "background-color:" + bgColor2 + ";";
    style = style + "opacity:" + (active.value ? "1" : "0") + ";";
    style = style + "transition-duration:" + formatMs(props.duration) + ";";
    style = style + stringifyStyle(props.overlayStyle);
    return style;
  });
  const titleStyleText = common_vendor.computed(() => {
    return stringifyStyle(props.titleStyle);
  });
  const panelStyle = common_vendor.computed(() => {
    let style = "background-color:" + bgColor.value + ";";
    style = style + "transition-duration:" + formatMs(props.duration) + ";";
    style = style + marginStyle();
    style = style + sizeStyle();
    style = style + roundStyle();
    style = style + safeAreaStyle();
    style = style + transformStyle();
    style = style + stringifyStyle(props.customStyle);
    style = style + stringifyStyle(props.customWrapStyle);
    return style;
  });
  const bodyStyle = common_vendor.computed(() => {
    let style = "padding:" + formatSize(props.contentMargin) + ";";
    if (String(props.maxHeight).length > 0)
      style = style + "max-height:" + formatSize(props.maxHeight) + ";";
    return style;
  });
  const footerStyle = common_vendor.computed(() => {
    return stringifyStyle(props.customFooterStyle);
  });
  const confirmTextStyle = common_vendor.computed(() => {
    const color = props.btnColor.length > 0 ? props.btnColor : "#1989fa";
    return "color:" + color + ";";
  });
  const confirmTextValue = common_vendor.computed(() => {
    return props.confirmText.length > 0 ? props.confirmText : "确定";
  });
  const cancelTextValue = common_vendor.computed(() => {
    return props.cancelText.length > 0 ? props.cancelText : "取消";
  });
  const contentVisible = common_vendor.computed(() => {
    return !props.lazy || contentReady.value;
  });
  const closeClass = common_vendor.computed(() => {
    const classes = ["i-popup__close"];
    classes.push("i-popup__close--" + normalizeClosePos());
    return classes.join(" ");
  });
  const closeStyle = common_vendor.computed(() => {
    return "color:" + props.closeIconColor + ";font-size:" + formatSize(props.closeIconSize) + ";";
  });
  const closeIconText = common_vendor.computed(() => {
    if (props.closeIcon == "close")
      return "×";
    return props.closeIcon;
  });
  common_vendor.watch(() => {
    return props.show;
  }, (nextValue) => {
    if (nextValue) {
      openPanel(false);
    } else {
      closePanel(false);
    }
  });
  function open() {
    openPanel(true);
  }
  function close() {
    closePanel(true);
  }
  function openPanel(shouldEmitUpdate) {
    if (props.disabled)
      return null;
    if (opened.value && active.value)
      return null;
    clearTimers();
    emit("beforeOpen");
    opened.value = true;
    resetOffset();
    if (!props.lazy)
      contentReady.value = true;
    setTimeout(() => {
      active.value = true;
      if (props.lazy) {
        lazyTimer = setTimeout(() => {
          contentReady.value = true;
          lazyTimer = 0;
        }, animationDuration());
      }
      emit("open");
      if (shouldEmitUpdate)
        emit("update:show", true);
    }, 20);
  }
  function closePanel(shouldEmitUpdate) {
    if (!opened.value && !active.value)
      return null;
    clearTimers();
    emit("beforeClose");
    active.value = false;
    if (props.lazy)
      contentReady.value = false;
    resetOffset();
    closeTimer = setTimeout(() => {
      opened.value = false;
      closeTimer = 0;
      emit("close");
      if (shouldEmitUpdate)
        emit("update:show", false);
    }, animationDuration());
  }
  function clearTimers() {
    if (closeTimer > 0) {
      clearTimeout(closeTimer);
      closeTimer = 0;
    }
    if (lazyTimer > 0) {
      clearTimeout(lazyTimer);
      lazyTimer = 0;
    }
  }
  function handleOverlayClick() {
    emit("click");
    if (!props.overlayClick || !props.closeOnMask)
      return null;
    close();
  }
  function cancel() {
    emit("cancel");
    close();
  }
  function confirm() {
    if (props.disabledConfirm)
      return null;
    emit("confirm");
    close();
  }
  function handleHandleTouchStart(event = null) {
    handleTouchStart(event);
  }
  function handleTouchStart(event = null) {
    if (!props.swipeClose)
      return null;
    touching.value = true;
    startX.value = readTouchX(event);
    startY.value = readTouchY(event);
  }
  function handleTouchMove(event = null) {
    if (!props.swipeClose || !touching.value)
      return null;
    const currentX = readTouchX(event);
    const currentY = readTouchY(event);
    const deltaX = currentX - startX.value;
    const deltaY = currentY - startY.value;
    if (normalizedMode.value == "bottom" && deltaY > 0)
      offsetY.value = deltaY;
    if (normalizedMode.value == "top" && deltaY < 0)
      offsetY.value = deltaY;
    if (normalizedMode.value == "left" && deltaX < 0)
      offsetX.value = deltaX;
    if (normalizedMode.value == "right" && deltaX > 0)
      offsetX.value = deltaX;
    if (normalizedMode.value == "center" && deltaY > 0)
      offsetY.value = deltaY;
  }
  function handleTouchEnd() {
    if (!touching.value)
      return null;
    touching.value = false;
    const threshold = Number(props.swipeCloseThreshold);
    if (Math.abs(offsetX.value) >= threshold || Math.abs(offsetY.value) >= threshold) {
      close();
      return null;
    }
    resetOffset();
  }
  function resetOffset() {
    offsetX.value = 0;
    offsetY.value = 0;
    touching.value = false;
  }
  function transformStyle() {
    const x = String(offsetX.value);
    const y = String(offsetY.value);
    if (normalizedMode.value == "center") {
      const scale = props.zoom ? active.value ? "1" : "0.88" : "1";
      return "opacity:" + (active.value ? "1" : "0") + ";transform:translate(-50%,-50%) translate(" + x + "px," + y + "px) scale(" + scale + ");";
    }
    if (normalizedMode.value == "bottom") {
      const prefix = shouldCoverCenter() ? "translateX(-50%) " : "";
      return "transform:" + prefix + "translateY(" + (active.value ? y + "px" : "100%") + ");";
    }
    if (normalizedMode.value == "top") {
      const prefix = shouldCoverCenter() ? "translateX(-50%) " : "";
      return "transform:" + prefix + "translateY(" + (active.value ? y + "px" : "-100%") + ");";
    }
    if (normalizedMode.value == "left") {
      return "transform:translateX(" + (active.value ? x + "px" : "-100%") + ");";
    }
    if (normalizedMode.value == "right") {
      return "transform:translateX(" + (active.value ? x + "px" : "100%") + ");";
    }
    return "";
  }
  function marginStyle() {
    const margin = formatSize(props.margin);
    if (margin == "0px")
      return "";
    return "margin:" + margin + ";";
  }
  function sizeStyle() {
    let style = "";
    const size = String(props.size);
    if (normalizedMode.value == "left" || normalizedMode.value == "right") {
      if (String(props.width).length > 0) {
        style = style + "width:" + formatSize(props.width) + ";";
      } else if (size.length > 0) {
        style = style + "width:" + formatSize(size) + ";";
      }
    } else if (normalizedMode.value == "top" || normalizedMode.value == "bottom") {
      if (String(props.width).length == 0 && !shouldCoverCenter()) {
        style = style + "width:100%;";
      }
      if (String(props.height).length > 0) {
        style = style + "height:" + formatSize(props.height) + ";";
      } else if (size.length > 0) {
        style = style + "height:" + formatSize(size) + ";";
      }
      if (String(props.width).length > 0)
        style = style + "width:" + formatSize(props.width) + ";";
    } else {
      if (String(props.width).length > 0)
        style = style + "width:" + formatSize(props.width) + ";";
      if (String(props.height).length > 0)
        style = style + "height:" + formatSize(props.height) + ";";
    }
    if (normalizedMode.value == "top") {
      if (props.navbarHeight > 0)
        style = style + "top:" + String(props.navbarHeight) + "px;";
      if (String(props.offsetTop).length > 0)
        style = style + "top:" + formatSize(props.offsetTop) + ";";
    }
    if (normalizedMode.value == "bottom" && String(props.offsetBottom).length > 0) {
      style = style + "bottom:" + formatSize(props.offsetBottom) + ";";
    }
    return style;
  }
  function roundStyle() {
    const round = formatSize(props.round);
    if (normalizedMode.value == "top")
      return "border-radius:0 0 " + round + " " + round + ";";
    if (normalizedMode.value == "bottom")
      return "border-radius:" + round + " " + round + " 0 0;";
    if (normalizedMode.value == "left")
      return "border-radius:0 " + round + " " + round + " 0;";
    if (normalizedMode.value == "right")
      return "border-radius:" + round + " 0 0 " + round + ";";
    if (normalizedMode.value == "center")
      return "border-radius:" + round + ";";
    return "";
  }
  function safeAreaStyle() {
    let style = "";
    if (props.safeTop && normalizedMode.value == "top") {
      style = style + "padding-top:env(safe-area-inset-top);";
    }
    if (props.safeBottom && normalizedMode.value == "bottom") {
      style = style + "padding-bottom:env(safe-area-inset-bottom);";
    }
    return style;
  }
  function normalizeClosePos() {
    if (props.closeIconPos == "top-left" || props.closeIconPos == "bottom-left" || props.closeIconPos == "bottom-right") {
      return props.closeIconPos;
    }
    return "top-right";
  }
  function stringifyStyle(value = null) {
    if (value == null)
      return "";
    const text = String(value);
    if (text == "[object Object]")
      return "";
    if (text.length == 0)
      return "";
    return text.endsWith(";") ? text : text + ";";
  }
  function formatMs(value = null) {
    const text = String(value);
    if (text.indexOf("ms") >= 0 || text.indexOf("s") >= 0)
      return text;
    return text + "ms";
  }
  function animationDuration() {
    const text = String(props.duration);
    if (text.indexOf("ms") >= 0)
      return Number(text.replace("ms", ""));
    if (text.indexOf("s") >= 0)
      return Number(text.replace("s", "")) * 1e3;
    const duration = Number(text);
    if (isNaN(duration))
      return 300;
    return duration;
  }
  function isVerticalMode() {
    return normalizedMode.value == "top" || normalizedMode.value == "bottom";
  }
  function shouldCoverCenter() {
    return props.widthCoverCenter && isVerticalMode() && String(props.width).length > 0;
  }
  function formatSize(value = null) {
    const text = String(value);
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
      return text;
    }
    return text + "px";
  }
  function readTouchX(event = null) {
    let point = null;
    if (event.touches != null && event.touches.length > 0) {
      point = event.touches[0];
    } else if (event.changedTouches != null && event.changedTouches.length > 0) {
      point = event.changedTouches[0];
    }
    if (point == null)
      return 0;
    const clientX = Number(point.clientX);
    if (!isNaN(clientX))
      return clientX;
    return Number(point.pageX);
  }
  function readTouchY(event = null) {
    let point = null;
    if (event.touches != null && event.touches.length > 0) {
      point = event.touches[0];
    } else if (event.changedTouches != null && event.changedTouches.length > 0) {
      point = event.changedTouches[0];
    }
    if (point == null)
      return 0;
    const clientY = Number(point.clientY);
    if (!isNaN(clientY))
      return clientY;
    return Number(point.pageY);
  }
  __expose({
    open,
    close
  });
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: common_vendor.o(open, "9c"),
      b: opened.value
    }, opened.value ? common_vendor.e({
      c: __props.overlay
    }, __props.overlay ? {
      d: common_vendor.s(overlayComputedStyle.value),
      e: common_vendor.o(handleOverlayClick, "ce")
    } : {}, {
      f: __props.swipeClose && __props.swipeHandle
    }, __props.swipeClose && __props.swipeHandle ? {
      g: common_vendor.o(handleHandleTouchStart, "cb"),
      h: common_vendor.o(handleTouchMove, "9f"),
      i: common_vendor.o(handleTouchEnd, "96"),
      j: common_vendor.o(handleTouchEnd, "32")
    } : {}, {
      k: normalizedMode.value == "bottom"
    }, normalizedMode.value == "bottom" ? {} : {}, {
      l: __props.showTitle && __props.title.length > 0
    }, __props.showTitle && __props.title.length > 0 ? {
      m: common_vendor.t(__props.title),
      n: common_vendor.s(titleStyleText.value)
    } : {}, {
      o: __props.showClose
    }, __props.showClose ? {
      p: common_vendor.t(closeIconText.value),
      q: common_vendor.n(closeClass.value),
      r: common_vendor.s(closeStyle.value),
      s: common_vendor.o(close, "62")
    } : {}, {
      t: __props.disabledScroll
    }, __props.disabledScroll ? common_vendor.e({
      v: contentVisible.value
    }, contentVisible.value ? {} : {}, {
      w: common_vendor.s(bodyStyle.value)
    }) : common_vendor.e({
      x: contentVisible.value
    }, contentVisible.value ? {} : {}, {
      y: common_vendor.s(bodyStyle.value)
    }), {
      z: __props.showFooter
    }, __props.showFooter ? common_vendor.e({
      A: __props.showCancel
    }, __props.showCancel ? {
      B: common_vendor.t(cancelTextValue.value),
      C: common_vendor.o(cancel, "70")
    } : {}, {
      D: common_vendor.t(confirmTextValue.value),
      E: common_vendor.s(confirmTextStyle.value),
      F: common_vendor.n(__props.disabledConfirm ? "i-popup__footer-button i-popup__footer-button--confirm i-popup__footer-button--disabled" : "i-popup__footer-button i-popup__footer-button--confirm"),
      G: common_vendor.o(confirm, "b4"),
      H: common_vendor.s(footerStyle.value)
    }) : {}, {
      I: __props.closeable && !__props.showClose
    }, __props.closeable && !__props.showClose ? {
      J: common_vendor.t(closeIconText.value),
      K: common_vendor.n(closeClass.value),
      L: common_vendor.s(closeStyle.value),
      M: common_vendor.o(close, "80")
    } : {}, {
      N: common_vendor.n(panelClass.value),
      O: common_vendor.s(panelStyle.value),
      P: common_vendor.o(() => {
      }, "63"),
      Q: common_vendor.s(rootStyle.value)
    }) : {}, {
      R: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      S: `${_ctx.u_s_b_h}px`,
      T: `${_ctx.u_s_a_i_b}px`,
      U: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
    });
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
