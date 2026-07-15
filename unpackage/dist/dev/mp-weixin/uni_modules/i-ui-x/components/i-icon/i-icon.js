"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-icon" }, { __name: "i-icon", props: {
  name: {
    type: String,
    default: "home-3-fill"
  },
  fontSize: {
    type: [String, Number],
    default: "16"
  },
  fontFamily: {
    type: String,
    default: "remixicon"
  },
  code: {
    type: String,
    default: ""
  },
  color: {
    type: String,
    default: "black"
  },
  darkColor: {
    type: String,
    default: ""
  },
  spin: {
    type: Boolean,
    default: false
  },
  rotation: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 1500
  },
  type: {
    type: String,
    default: ""
  },
  size: {
    type: [String, Number],
    default: ""
  },
  plain: {
    type: Boolean,
    default: false
  },
  bgColor: {
    type: String,
    default: ""
  },
  label: {
    type: String,
    default: ""
  },
  customStyle: {
    type: String,
    default: ""
  }
}, emits: ["click"], setup(__props, _a) {
  var __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  const spinAngle = common_vendor.ref(0);
  let spinTimer = 0;
  const iconBgColor = common_vendor.computed(() => {
    return props.bgColor;
  });
  const remixCodeMap = /* @__PURE__ */ new Map([
    ["home-3-fill", "ee1a"],
    ["chat-3-line", "eb51"],
    ["chat-3-fill", "eb50"],
    ["contrast-drop-2-fill", "ebd5"],
    ["circle-line", "f3c2"],
    ["smartphone-line", "f15a"],
    ["git-repository-private-fill", "edc8"],
    ["mouse-fill", "ef7c"],
    ["arrow-up-line", "ea76"],
    ["information-line", "ee59"],
    ["gps-line", "eddb"],
    ["headphone-line", "ee05"],
    ["rocket-fill", "f095"],
    ["mic-2-line", "ef4e"],
    ["image-circle-line", "f413"],
    ["plane-line", "f005"],
    ["loader-line", "eeca"],
    ["refresh-line", "f064"],
    ["check-line", "eb7b"],
    ["close-line", "eb99"],
    ["add-line", "ea13"],
    ["subtract-line", "f1af"],
    ["search-line", "f0d1"],
    ["star-fill", "f186"],
    ["map-pin-line", "ef14"],
    ["error-warning-line", "eca1"],
    ["arrow-right-line", "ea6c"],
    ["arrow-left-line", "ea60"]
  ]);
  const legacyNameMap = /* @__PURE__ */ new Map([
    ["check", "check-line"],
    ["close", "close-line"],
    ["plus", "add-line"],
    ["minus", "subtract-line"],
    ["search", "search-line"],
    ["star", "star-fill"],
    ["map", "map-pin-line"],
    ["warning", "error-warning-line"],
    ["arrow-right", "arrow-right-line"],
    ["arrow-left", "arrow-left-line"]
  ]);
  const legacyGlyphMap = /* @__PURE__ */ new Map([
    ["check", "✓"],
    ["close", "x"],
    ["plus", "+"],
    ["minus", "-"],
    ["search", "⌕"],
    ["star", "★"],
    ["map", "⌖"],
    ["warning", "!"],
    ["arrow-right", ">"],
    ["arrow-left", "<"]
  ]);
  const normalizedName = common_vendor.computed(() => {
    const value = props.name;
    if (legacyNameMap.has(value))
      return common_vendor.UTS.mapGet(legacyNameMap, value);
    if (value.indexOf("ri-") == 0)
      return value.substring(3);
    return value;
  });
  const isImage = common_vendor.computed(() => {
    const value = props.name;
    return value.indexOf("http://") == 0 || value.indexOf("https://") == 0 || value.indexOf("/") == 0 || value.indexOf("./") == 0 || value.indexOf("../") == 0 || value.indexOf("@/") == 0;
  });
  const iconCode = common_vendor.computed(() => {
    if (props.code.length > 0)
      return props.code;
    const value = normalizedName.value;
    if (remixCodeMap.has(value))
      return common_vendor.UTS.mapGet(remixCodeMap, value);
    return "";
  });
  const iconText = common_vendor.computed(() => {
    const code = iconCode.value;
    if (code.length > 0)
      return String.fromCharCode(parseInt(code, 16));
    if (legacyGlyphMap.has(props.name))
      return common_vendor.UTS.mapGet(legacyGlyphMap, props.name);
    return props.name;
  });
  const normalizedSize = common_vendor.computed(() => {
    const value = String(props.size);
    if (value == "mini" || value == "normal" || value == "large")
      return value;
    if (value.length > 0)
      return "custom";
    return "";
  });
  const hasBadge = common_vendor.computed(() => {
    return props.type.length > 0 || iconBgColor.value.length > 0 || props.plain;
  });
  const iconClass = common_vendor.computed(() => {
    const classes = ["i-icon"];
    if (hasBadge.value) {
      classes.push("i-icon--badge");
      if (props.type.length > 0)
        classes.push("i-icon--" + props.type);
      if (normalizedSize.value.length > 0)
        classes.push("i-icon--" + normalizedSize.value);
      if (props.plain)
        classes.push("i-icon--plain");
    }
    return classes.join(" ");
  });
  const textClass = common_vendor.computed(() => {
    const classes = ["i-icon__text"];
    if (props.spin)
      classes.push("i-icon__text--spin");
    if (hasBadge.value)
      classes.push("i-icon__text--badge");
    if (hasBadge.value && props.plain && props.type.length > 0) {
      classes.push("i-icon__text--" + props.type);
    }
    return classes.join(" ");
  });
  const imageClass = common_vendor.computed(() => {
    const classes = ["i-icon__image"];
    if (props.spin)
      classes.push("i-icon__image--spin");
    return classes.join(" ");
  });
  const resolvedFontSize = common_vendor.computed(() => {
    const value = String(props.size);
    if (value == "mini")
      return "14px";
    if (value == "normal")
      return "17px";
    if (value == "large")
      return "22px";
    if (value.length > 0)
      return formatSize(value);
    return formatSize(props.fontSize);
  });
  const badgeSize = common_vendor.computed(() => {
    const value = String(props.size);
    if (value == "mini")
      return "26px";
    if (value == "normal")
      return "34px";
    if (value == "large")
      return "44px";
    if (value.length > 0)
      return formatSize(value);
    const numberSize = Number(props.fontSize);
    if (isNaN(numberSize))
      return formatSize(props.fontSize);
    return formatSize(numberSize + 18);
  });
  const wrapStyle = common_vendor.computed(() => {
    let style = props.customStyle;
    if (hasBadge.value) {
      const size = badgeSize.value;
      style = style + "width:" + size + ";height:" + size + ";border-radius:" + size + ";";
    }
    if (iconBgColor.value.length > 0) {
      style = style + "background-color:" + iconBgColor.value + ";";
    }
    return style;
  });
  const imageStyle = common_vendor.computed(() => {
    const size = resolvedFontSize.value;
    let style = "width:" + size + ";height:" + size + ";";
    const angle = activeRotation.value;
    if (angle != 0)
      style = style + "transform:rotate(" + String(angle) + "deg);";
    return style;
  });
  const textStyle = common_vendor.computed(() => {
    let style = "font-size:" + resolvedFontSize.value + ";";
    if (props.fontFamily.length > 0 && iconCode.value.length > 0) {
      style = style + "font-family:" + props.fontFamily + ";";
    }
    let color = props.color;
    if (hasBadge.value && props.color == "black") {
      color = props.plain ? iconTypeColor() : "#ffffff";
    }
    if (color.length > 0)
      style = style + "color:" + color + ";";
    const angle = activeRotation.value;
    if (angle != 0)
      style = style + "transform:rotate(" + String(angle) + "deg);";
    return style;
  });
  const activeRotation = common_vendor.computed(() => {
    return normalizeAngle(props.rotation + spinAngle.value);
  });
  common_vendor.watch(() => {
    return props.spin;
  }, (nextValue) => {
    if (nextValue) {
      startSpin();
    } else {
      stopSpin();
    }
  });
  common_vendor.watch(() => {
    return props.duration;
  }, () => {
    if (props.spin) {
      stopSpin();
      startSpin();
    }
  });
  common_vendor.onMounted(() => {
    if (props.spin)
      startSpin();
  });
  common_vendor.onUnmounted(() => {
    stopSpin();
  });
  function startSpin() {
    if (spinTimer > 0)
      return null;
    spinTimer = setInterval(() => {
      const duration = Math.max(120, Number(props.duration));
      const step = Math.max(6, Math.round(360 * 50 / duration));
      spinAngle.value = normalizeAngle(spinAngle.value + step);
    }, 50);
  }
  function stopSpin() {
    if (spinTimer > 0) {
      clearInterval(spinTimer);
      spinTimer = 0;
    }
    spinAngle.value = 0;
  }
  function normalizeAngle(value) {
    let angle = value % 360;
    if (angle < 0)
      angle = angle + 360;
    return angle;
  }
  function iconTypeColor() {
    if (props.type == "primary")
      return "#2979ff";
    if (props.type == "success")
      return "#19be6b";
    if (props.type == "warning")
      return "#ff9900";
    if (props.type == "danger")
      return "#fa3534";
    return "#303133";
  }
  function formatSize(value = null) {
    const text = String(value);
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("rem") >= 0 || text.indexOf("%") >= 0) {
      return text;
    }
    return text + "px";
  }
  function handleClick() {
    emit("click", new common_vendor.UTSJSONObject({
      name: props.name,
      code: iconCode.value,
      label: props.label
    }));
  }
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: isImage.value
    }, isImage.value ? {
      b: common_vendor.n(imageClass.value),
      c: props.name,
      d: common_vendor.s(imageStyle.value)
    } : {
      e: common_vendor.t(iconText.value),
      f: common_vendor.n(textClass.value),
      g: common_vendor.s(textStyle.value)
    }, {
      h: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      i: common_vendor.n(iconClass.value),
      j: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass),
      k: common_vendor.s(wrapStyle.value),
      l: common_vendor.s({
        "--status-bar-height": `${_ctx.u_s_b_h}px`,
        "--uni-safe-area-inset-bottom": `${_ctx.u_s_a_i_b}px`
      }),
      m: common_vendor.o(handleClick, "6d")
    });
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
