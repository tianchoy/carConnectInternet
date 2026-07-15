"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Array) {
  const _easycom_i_icon_1 = common_vendor.resolveComponent("i-icon");
  _easycom_i_icon_1();
}
const _easycom_i_icon = () => "../i-icon/i-icon.js";
if (!Math) {
  _easycom_i_icon();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-tag" }, { __name: "i-tag", props: {
  type: {
    type: String,
    default: "primary"
  },
  plain: {
    type: Boolean,
    default: false
  },
  skin: {
    type: String,
    default: "normal"
  },
  round: {
    type: [Boolean, String, Number],
    default: false
  },
  text: {
    type: [String, Number],
    default: ""
  },
  size: {
    type: String,
    default: "normal"
  },
  width: {
    type: [String, Number],
    default: ""
  },
  height: {
    type: [String, Number],
    default: ""
  },
  closable: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ""
  },
  iconSize: {
    type: [String, Number],
    default: ""
  },
  fontSize: {
    type: [String, Number],
    default: ""
  },
  color: {
    type: String,
    default: ""
  },
  fontColor: {
    type: String,
    default: ""
  },
  bgColor: {
    type: String,
    default: ""
  },
  borderColor: {
    type: String,
    default: ""
  },
  borderWidth: {
    type: [String, Number],
    default: 1
  },
  linear: {
    type: Array,
    default: () => {
      return [];
    }
  },
  shadow: {
    type: [String, Number, Array],
    default: ""
  },
  closeIcon: {
    type: String,
    default: "x"
  },
  customStyle: {
    type: String,
    default: ""
  }
}, emits: ["click", "close"], setup(__props, _a) {
  var __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  const bgColor = common_vendor.computed(() => {
    return props.bgColor;
  });
  const closeClicking = common_vendor.ref(false);
  const contentText = common_vendor.computed(() => {
    return String(props.text);
  });
  const normalizedType = common_vendor.computed(() => {
    if (props.type == "danger")
      return "error";
    if (props.type == "warn")
      return "warning";
    return props.type;
  });
  const normalizedSkin = common_vendor.computed(() => {
    if (props.plain)
      return "outlined";
    if (props.skin == "outline")
      return "outlined";
    if (props.skin == "light")
      return "thin";
    if (props.skin == "plain")
      return "outlined";
    return props.skin;
  });
  const themeColor = common_vendor.computed(() => {
    if (props.color.length > 0)
      return props.color;
    if (normalizedType.value == "primary")
      return "#3c9cff";
    if (normalizedType.value == "success")
      return "#5ac725";
    if (normalizedType.value == "warning")
      return "#f9ae3d";
    if (normalizedType.value == "error")
      return "#f56c6c";
    if (normalizedType.value == "info")
      return "#909399";
    return "#303133";
  });
  const computedTextColor = common_vendor.computed(() => {
    if (props.fontColor.length > 0)
      return props.fontColor;
    if (props.color.length > 0 && normalizedSkin.value == "normal")
      return "#ffffff";
    if (normalizedSkin.value == "normal" && bgColor.value.length == 0 && props.linear.length == 0) {
      return "#ffffff";
    }
    return themeColor.value;
  });
  const computedIconSize = common_vendor.computed(() => {
    if (String(props.iconSize).length > 0)
      return props.iconSize;
    if (String(props.fontSize).length > 0)
      return props.fontSize;
    if (props.size == "xs" || props.size == "mini")
      return 11;
    if (props.size == "s" || props.size == "small")
      return 12;
    if (props.size == "g" || props.size == "large")
      return 15;
    return 13;
  });
  const closeText = common_vendor.computed(() => {
    if (props.closeIcon == "close" || props.closeIcon == "close-line")
      return "x";
    return props.closeIcon;
  });
  const tagClass = common_vendor.computed(() => {
    const classes = [
      "i-tag",
      "i-tag--" + normalizedType.value,
      "i-tag--" + normalizedSize.value,
      "i-tag--" + normalizedSkin.value
    ];
    classes.push("i-tag--" + normalizedSkin.value + "-" + normalizedType.value);
    if (isRound.value)
      classes.push("i-tag--round");
    if (props.disabled)
      classes.push("i-tag--disabled");
    return classes.join(" ");
  });
  const textClass = common_vendor.computed(() => {
    const classes = ["i-tag__text"];
    if (normalizedSize.value == "xs")
      classes.push("i-tag__text--xs");
    if (normalizedSize.value == "large")
      classes.push("i-tag__text--large");
    return classes.join(" ");
  });
  const closeClass = common_vendor.computed(() => {
    const classes = ["i-tag__close"];
    if (normalizedSize.value == "xs")
      classes.push("i-tag__close--xs");
    return classes.join(" ");
  });
  const tagStyle = common_vendor.computed(() => {
    let style = "";
    if (String(props.width).length > 0)
      style = style + "width:" + formatSize(props.width) + ";";
    if (String(props.height).length > 0)
      style = style + "height:" + formatSize(props.height) + ";";
    if (props.borderWidth != 1)
      style = style + "border-width:" + formatSize(props.borderWidth) + ";";
    if (isCustomRound.value)
      style = style + "border-radius:" + formatSize(props.round) + ";";
    if (props.linear.length >= 3) {
      style = style + "background:linear-gradient(" + String(props.linear[0]) + "," + String(props.linear[1]) + "," + String(props.linear[2]) + ");border-color:transparent;";
    } else if (bgColor.value.length > 0) {
      style = style + "background-color:" + bgColor.value + ";";
      if (normalizedSkin.value == "normal" && props.borderColor.length == 0) {
        style = style + "border-color:" + bgColor.value + ";";
      }
    }
    if (props.borderColor.length > 0)
      style = style + "border-color:" + props.borderColor + ";";
    if (shadowStyle.value.length > 0)
      style = style + shadowStyle.value;
    if (props.customStyle.length > 0)
      style = style + props.customStyle;
    return style;
  });
  const textStyle = common_vendor.computed(() => {
    let style = "color:" + computedTextColor.value + ";";
    if (String(props.fontSize).length > 0) {
      style = style + "font-size:" + formatSize(props.fontSize) + ";";
    }
    return style;
  });
  const closeStyle = common_vendor.computed(() => {
    return "color:" + computedTextColor.value + ";";
  });
  const normalizedSize = common_vendor.computed(() => {
    if (props.size == "xs" || props.size == "mini")
      return "xs";
    if (props.size == "s" || props.size == "small")
      return "small";
    if (props.size == "m" || props.size == "normal" || props.size == "n")
      return "normal";
    if (props.size == "g" || props.size == "large")
      return "large";
    return props.size;
  });
  const isCustomRound = common_vendor.computed(() => {
    if (typeof props.round == "boolean")
      return false;
    return String(props.round).length > 0;
  });
  const isRound = common_vendor.computed(() => {
    if (typeof props.round == "boolean")
      return props.round;
    return String(props.round).length > 0;
  });
  const shadowStyle = common_vendor.computed(() => {
    const value = props.shadow;
    const text = String(value);
    if (text.length == 0 || text == "none")
      return "";
    if (Array.isArray(value) && value.length >= 4) {
      return "box-shadow:" + formatSize(value[0]) + " " + formatSize(value[1]) + " " + formatSize(value[2]) + " " + String(value[3]) + ";";
    }
    return "box-shadow:0 " + formatSize(value) + " " + formatSize(Number(value) * 2) + " rgba(0,0,0,0.12);";
  });
  function handleClick() {
    if (closeClicking.value) {
      closeClicking.value = false;
      return null;
    }
    if (props.disabled)
      return null;
    emit("click", contentText.value);
  }
  function handleClose() {
    if (props.disabled)
      return null;
    closeClicking.value = true;
    emit("close", contentText.value);
    setTimeout(() => {
      closeClicking.value = false;
    }, 0);
  }
  function formatSize(value = null) {
    const text = String(value);
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("rem") >= 0 || text.indexOf("%") >= 0) {
      return text;
    }
    return text + "px";
  }
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: __props.icon.length > 0
    }, __props.icon.length > 0 ? {
      b: common_vendor.p({
        name: __props.icon,
        fontSize: computedIconSize.value,
        color: computedTextColor.value,
        class: "i-tag__icon"
      })
    } : {}, {
      c: contentText.value.length > 0
    }, contentText.value.length > 0 ? {
      d: common_vendor.t(contentText.value),
      e: common_vendor.n(textClass.value),
      f: common_vendor.s(textStyle.value)
    } : {
      g: common_vendor.n(textClass.value),
      h: common_vendor.s(textStyle.value)
    }, {
      i: __props.closable
    }, __props.closable ? {
      j: common_vendor.t(closeText.value),
      k: common_vendor.n(closeClass.value),
      l: common_vendor.s(closeStyle.value),
      m: common_vendor.o(handleClose, "43")
    } : {}, {
      n: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      o: common_vendor.n(tagClass.value),
      p: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass),
      q: common_vendor.s(tagStyle.value),
      r: common_vendor.s({
        "--status-bar-height": `${_ctx.u_s_b_h}px`,
        "--uni-safe-area-inset-bottom": `${_ctx.u_s_a_i_b}px`
      }),
      s: common_vendor.o(handleClick, "12")
    });
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
