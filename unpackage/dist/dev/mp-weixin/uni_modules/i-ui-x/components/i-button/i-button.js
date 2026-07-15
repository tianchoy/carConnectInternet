"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-button" }, { __name: "i-button", props: {
  hairline: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: "default"
  },
  size: {
    type: String,
    default: "normal"
  },
  block: {
    type: Boolean,
    default: false
  },
  shape: {
    type: String,
    default: "square"
  },
  plain: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  round: {
    type: [String, Number],
    default: "4px"
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingMode: {
    type: String,
    default: "spinner"
  },
  loadingSize: {
    type: [String, Number],
    default: 15
  },
  openType: {
    type: String,
    default: ""
  },
  formType: {
    type: String,
    default: ""
  },
  appParameter: {
    type: String,
    default: ""
  },
  hoverStopPropagation: {
    type: Boolean,
    default: true
  },
  lang: {
    type: String,
    default: "en"
  },
  sessionFrom: {
    type: String,
    default: ""
  },
  sendMessageTitle: {
    type: String,
    default: ""
  },
  sendMessagePath: {
    type: String,
    default: ""
  },
  sendMessageImg: {
    type: String,
    default: ""
  },
  showMessageCard: {
    type: Boolean,
    default: false
  },
  dataName: {
    type: String,
    default: ""
  },
  throttleTime: {
    type: [String, Number],
    default: 0
  },
  hoverStartTime: {
    type: [String, Number],
    default: 0
  },
  hoverStayTime: {
    type: [String, Number],
    default: 200
  },
  hoverClass: {
    type: String,
    default: "i-button--hover"
  },
  text: {
    type: [String, Number],
    default: ""
  },
  icon: {
    type: String,
    default: ""
  },
  iconColor: {
    type: String,
    default: ""
  },
  iconPosition: {
    type: String,
    default: "left"
  },
  color: {
    type: String,
    default: ""
  },
  customStyle: {
    type: String,
    default: ""
  }
}, emits: [
  "click",
  "getphonenumber",
  "getuserinfo",
  "error",
  "opensetting",
  "launchapp",
  "agreeprivacyauthorization"
], setup(__props, _a) {
  var __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  const lastClickTime = common_vendor.ref(0);
  const loadingAngle = common_vendor.ref(0);
  let loadingTimer = 0;
  const normalizedType = common_vendor.computed(() => {
    if (props.type == "danger")
      return "error";
    return props.type;
  });
  const contentText = common_vendor.computed(() => {
    return String(props.text).length > 0 ? String(props.text) : "";
  });
  const computedHoverClass = common_vendor.computed(() => {
    if (props.disabled || props.loading)
      return "none";
    return props.hoverClass;
  });
  const useNativeButton = common_vendor.computed(() => {
    return props.openType.length > 0 || props.formType.length > 0;
  });
  const buttonClass = common_vendor.computed(() => {
    const classes = ["i-button", "i-button--" + normalizedType.value, "i-button--" + props.size];
    if (props.block)
      classes.push("i-button--block");
    if (props.plain)
      classes.push("i-button--plain");
    if (props.plain)
      classes.push("i-button--plain-" + normalizedType.value);
    if (props.hairline && props.plain)
      classes.push("i-button--hairline");
    if (props.shape == "circle")
      classes.push("i-button--circle");
    if (props.disabled)
      classes.push("i-button--disabled");
    if (props.loading)
      classes.push("i-button--loading");
    return classes.join(" ");
  });
  const textClass = common_vendor.computed(() => {
    const classes = ["i-button__text"];
    if (props.size == "small" || props.size == "mini")
      classes.push("i-button__text--small");
    if (normalizedType.value == "default")
      classes.push("i-button__text--default");
    if (props.plain)
      classes.push("i-button__text--plain-" + normalizedType.value);
    if (props.color.length > 0 && props.plain)
      classes.push("i-button__text--custom");
    if (props.disabled)
      classes.push("i-button__text--disabled");
    if (props.loading)
      classes.push("i-button__text--loading");
    return classes.join(" ");
  });
  const iconClass = common_vendor.computed(() => {
    const classes = ["i-button__icon"];
    if (props.iconPosition == "right")
      classes.push("i-button__icon--right");
    return classes.join(" ");
  });
  const loadingClass = common_vendor.computed(() => {
    const classes = ["i-button__loading"];
    if (props.loadingMode == "circle")
      classes.push("i-button__loading--circle");
    if (normalizedType.value == "default" || props.plain)
      classes.push("i-button__loading--muted");
    if (props.plain)
      classes.push("i-button__loading--plain-" + normalizedType.value);
    return classes.join(" ");
  });
  const buttonStyle = common_vendor.computed(() => {
    let style = "";
    if (props.shape != "circle")
      style = style + "border-radius:" + formatSize(props.round) + ";";
    if (props.color.length > 0) {
      if (props.plain) {
        style = style + "background-color:transparent;border-color:" + props.color + ";";
      } else {
        style = style + "background:" + props.color + ";border-color:transparent;";
      }
    }
    if (props.customStyle.length > 0)
      style = style + props.customStyle;
    return style;
  });
  const textStyle = common_vendor.computed(() => {
    if (props.color.length > 0 && props.plain)
      return "color:" + props.color + ";";
    return "";
  });
  const iconStyle = common_vendor.computed(() => {
    if (props.iconColor.length > 0)
      return "color:" + props.iconColor + ";";
    if (props.color.length > 0 && props.plain)
      return "color:" + props.color + ";";
    return "";
  });
  const loadingStyle = common_vendor.computed(() => {
    const size = formatSize(props.loadingSize);
    return "width:" + size + ";height:" + size + ";transform:rotate(" + String(loadingAngle.value) + "deg);";
  });
  common_vendor.watch(() => {
    return props.loading;
  }, (nextValue) => {
    if (nextValue) {
      startLoading();
    } else {
      stopLoading();
    }
  });
  common_vendor.onMounted(() => {
    if (props.loading)
      startLoading();
  });
  common_vendor.onUnmounted(() => {
    stopLoading();
  });
  function startLoading() {
    if (loadingTimer > 0)
      return null;
    loadingTimer = setInterval(() => {
      loadingAngle.value = normalizeAngle(loadingAngle.value + 24);
    }, 50);
  }
  function stopLoading() {
    if (loadingTimer > 0) {
      clearInterval(loadingTimer);
      loadingTimer = 0;
    }
    loadingAngle.value = 0;
  }
  function normalizeAngle(value) {
    let angle = value % 360;
    if (angle < 0)
      angle = angle + 360;
    return angle;
  }
  function formatSize(value = null) {
    const text = String(value);
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0)
      return text;
    return text + "px";
  }
  function canClick() {
    if (props.disabled || props.loading)
      return false;
    const wait = Number(props.throttleTime);
    if (wait <= 0)
      return true;
    const now = Date.now();
    if (now - lastClickTime.value < wait)
      return false;
    lastClickTime.value = now;
    return true;
  }
  function handleClick(event = null) {
    if (!canClick())
      return null;
    emit("click", event);
  }
  function handleGetPhoneNumber(event = null) {
    emit("getphonenumber", event);
  }
  function handleGetUserInfo(event = null) {
    emit("getuserinfo", event);
  }
  function handleError(event = null) {
    emit("error", event);
  }
  function handleOpenSetting(event = null) {
    emit("opensetting", event);
  }
  function handleLaunchApp(event = null) {
    emit("launchapp", event);
  }
  function handleAgreePrivacyAuthorization(event = null) {
    emit("agreeprivacyauthorization", event);
  }
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: useNativeButton.value
    }, useNativeButton.value ? common_vendor.e({
      b: __props.loading
    }, __props.loading ? {
      c: common_vendor.n(loadingClass.value),
      d: common_vendor.s(loadingStyle.value)
    } : {}, {
      e: __props.icon.length > 0 && __props.iconPosition == "left" && !__props.loading
    }, __props.icon.length > 0 && __props.iconPosition == "left" && !__props.loading ? {
      f: common_vendor.t(__props.icon),
      g: common_vendor.n(iconClass.value),
      h: common_vendor.s(iconStyle.value)
    } : {}, {
      i: contentText.value.length > 0
    }, contentText.value.length > 0 ? {
      j: common_vendor.t(contentText.value),
      k: common_vendor.n(textClass.value),
      l: common_vendor.s(textStyle.value)
    } : {
      m: common_vendor.n(textClass.value),
      n: common_vendor.s(textStyle.value)
    }, {
      o: __props.icon.length > 0 && __props.iconPosition == "right" && !__props.loading
    }, __props.icon.length > 0 && __props.iconPosition == "right" && !__props.loading ? {
      p: common_vendor.t(__props.icon),
      q: common_vendor.n(iconClass.value),
      r: common_vendor.s(iconStyle.value)
    } : {}, {
      s: common_vendor.n(buttonClass.value),
      t: common_vendor.s(buttonStyle.value),
      v: common_vendor.s({
        "--status-bar-height": `${_ctx.u_s_b_h}px`,
        "--uni-safe-area-inset-bottom": `${_ctx.u_s_a_i_b}px`
      }),
      w: __props.disabled || __props.loading,
      x: __props.formType,
      y: __props.openType,
      z: __props.appParameter,
      A: computedHoverClass.value,
      B: __props.hoverStopPropagation,
      C: Number(__props.hoverStartTime),
      D: Number(__props.hoverStayTime),
      E: __props.lang,
      F: __props.sessionFrom,
      G: __props.sendMessageTitle,
      H: __props.sendMessagePath,
      I: __props.sendMessageImg,
      J: __props.showMessageCard,
      K: __props.dataName,
      L: common_vendor.o(handleClick, "98"),
      M: common_vendor.o(handleGetPhoneNumber, "1a"),
      N: common_vendor.o(handleGetUserInfo, "e0"),
      O: common_vendor.o(handleError, "c9"),
      P: common_vendor.o(handleOpenSetting, "cb"),
      Q: common_vendor.o(handleLaunchApp, "89"),
      R: common_vendor.o(handleAgreePrivacyAuthorization, "d7")
    }) : common_vendor.e({
      S: __props.loading
    }, __props.loading ? {
      T: common_vendor.n(loadingClass.value),
      U: common_vendor.s(loadingStyle.value)
    } : {}, {
      V: __props.icon.length > 0 && __props.iconPosition == "left" && !__props.loading
    }, __props.icon.length > 0 && __props.iconPosition == "left" && !__props.loading ? {
      W: common_vendor.t(__props.icon),
      X: common_vendor.n(iconClass.value),
      Y: common_vendor.s(iconStyle.value)
    } : {}, {
      Z: contentText.value.length > 0
    }, contentText.value.length > 0 ? {
      aa: common_vendor.t(contentText.value),
      ab: common_vendor.n(textClass.value),
      ac: common_vendor.s(textStyle.value)
    } : {
      ad: common_vendor.n(textClass.value),
      ae: common_vendor.s(textStyle.value)
    }, {
      af: __props.icon.length > 0 && __props.iconPosition == "right" && !__props.loading
    }, __props.icon.length > 0 && __props.iconPosition == "right" && !__props.loading ? {
      ag: common_vendor.t(__props.icon),
      ah: common_vendor.n(iconClass.value),
      ai: common_vendor.s(iconStyle.value)
    } : {}, {
      aj: common_vendor.n(buttonClass.value),
      ak: common_vendor.s(buttonStyle.value),
      al: common_vendor.s({
        "--status-bar-height": `${_ctx.u_s_b_h}px`,
        "--uni-safe-area-inset-bottom": `${_ctx.u_s_a_i_b}px`
      }),
      am: computedHoverClass.value,
      an: __props.hoverStopPropagation,
      ao: Number(__props.hoverStartTime),
      ap: Number(__props.hoverStayTime),
      aq: __props.dataName,
      ar: common_vendor.o(handleClick, "97")
    }));
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
