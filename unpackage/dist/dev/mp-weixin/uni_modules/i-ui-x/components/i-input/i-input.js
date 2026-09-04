"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-input" }, { __name: "i-input", props: {
  modelValue: {
    type: [String, Number],
    default: ""
  },
  value: {
    type: [String, Number],
    default: ""
  },
  type: {
    type: String,
    default: "text"
  },
  height: {
    type: [String, Number],
    default: "40px"
  },
  disabled: {
    type: Boolean,
    default: false
  },
  disabledColor: {
    type: String,
    default: "#f5f7fa"
  },
  clearable: {
    type: Boolean,
    default: false
  },
  password: {
    type: Boolean,
    default: false
  },
  showPasswordToggle: {
    type: Boolean,
    default: true
  },
  maxlength: {
    type: [String, Number],
    default: -1
  },
  placeholder: {
    type: String,
    default: ""
  },
  placeholderClass: {
    type: String,
    default: "input-placeholder"
  },
  placeholderStyle: {
    type: String,
    default: ""
  },
  showWordLimit: {
    type: Boolean,
    default: false
  },
  confirmType: {
    type: String,
    default: "done"
  },
  confirmHold: {
    type: Boolean,
    default: false
  },
  focus: {
    type: Boolean,
    default: false
  },
  cursor: {
    type: [String, Number],
    default: -1
  },
  cursorSpacing: {
    type: [String, Number],
    default: 30
  },
  selectionStart: {
    type: [String, Number],
    default: -1
  },
  selectionEnd: {
    type: [String, Number],
    default: -1
  },
  adjustPosition: {
    type: Boolean,
    default: true
  },
  inputAlign: {
    type: String,
    default: "left"
  },
  fontSize: {
    type: [String, Number],
    default: "15px"
  },
  color: {
    type: String,
    default: "#303133"
  },
  prefiicon: {
    type: String,
    default: ""
  },
  prefixIcon: {
    type: String,
    default: ""
  },
  prefiiconStyle: {
    type: String,
    default: ""
  },
  suffiicon: {
    type: String,
    default: ""
  },
  suffiiconStyle: {
    type: String,
    default: ""
  },
  border: {
    type: String,
    default: "surround"
  },
  readonly: {
    type: Boolean,
    default: false
  },
  shape: {
    type: String,
    default: "square"
  },
  customStyle: {
    type: String,
    default: ""
  },
  round: {
    type: String,
    default: "4px"
  },
  borderColor: {
    type: String,
    default: "#e5e5e5"
  },
  bgColor: {
    type: String,
    default: "#ffffff"
  },
  inputmode: {
    type: String,
    default: "text"
  },
  prefix: {
    type: String,
    default: ""
  }
}, emits: ["update:modelValue", "update:value", "input", "change", "focus", "blur", "confirm", "keyboardheightchange", "clear"], setup(__props, _a) {
  var __expose = _a.expose, __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  function initialValue() {
    const modelValue = props.modelValue.toString();
    if (modelValue.length > 0)
      return modelValue;
    return props.value.toString();
  }
  function formatSize(value = null) {
    const text = value.toString();
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
      return text;
    }
    return text + "px";
  }
  function emitValue(value) {
    emit("update:modelValue", value);
    emit("update:value", value);
    emit("input", value);
    emit("change", value);
  }
  const inputBgColor = common_vendor.computed(() => {
    return props.bgColor;
  });
  const current = common_vendor.ref(initialValue());
  const focused = common_vendor.ref(false);
  const passwordVisible = common_vendor.ref(props.password);
  const wrapClass = common_vendor.computed(() => {
    const classes = ["i-input"];
    if (props.disabled)
      classes.push("i-input--disabled");
    if (focused.value && !props.disabled)
      classes.push("i-input--focus");
    if (props.shape == "circle")
      classes.push("i-input--circle");
    return classes.join(" ");
  });
  const wrapStyle = common_vendor.computed(() => {
    let style = "min-height:" + formatSize(props.height) + ";background-color:" + (props.disabled ? props.disabledColor : inputBgColor.value) + ";border-radius:" + (props.shape == "circle" ? formatSize(props.height) : props.round) + ";";
    if (props.border == "surround") {
      style += "border-width:1px;border-style:solid;border-color:" + props.borderColor + ";";
    }
    if (props.border == "bottom") {
      style += "border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:" + props.borderColor + ";";
    }
    return style + props.customStyle;
  });
  const fieldStyle = common_vendor.computed(() => {
    return "height:" + formatSize(props.height) + ";color:" + props.color + ";font-size:" + formatSize(props.fontSize) + ";text-align:" + props.inputAlign + ";";
  });
  const placeholderStyleText = common_vendor.computed(() => {
    if (props.placeholderStyle.length > 0)
      return props.placeholderStyle;
    return "color:#c0c4cc;";
  });
  common_vendor.watch(() => {
    return props.modelValue;
  }, () => {
    current.value = initialValue();
  });
  common_vendor.watch(() => {
    return props.value;
  }, () => {
    current.value = initialValue();
  });
  function handleInput(event) {
    const nextValue = event.detail.value.toString();
    if (props.readonly) {
      current.value = initialValue();
      return null;
    }
    current.value = nextValue;
    emitValue(nextValue);
  }
  function handleFocus(event = null) {
    focused.value = true;
    emit("focus", event);
  }
  function handleBlur(event = null) {
    focused.value = false;
    emit("blur", event);
  }
  function handleConfirm(event = null) {
    if (event == null || typeof event != "object")
      return null;
    const eventObject = event;
    const detail = eventObject["detail"];
    if (detail == null || typeof detail != "object")
      return null;
    const value = detail["value"];
    emit("confirm", value == null ? "" : value.toString());
  }
  function handleKeyboardHeightChange(event = null) {
    emit("keyboardheightchange", event);
  }
  function clear() {
    current.value = "";
    emitValue("");
    emit("clear");
  }
  function togglePassword() {
    passwordVisible.value = !passwordVisible.value;
  }
  __expose({
    setFormatter() {
    }
  });
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: __props.prefiicon.length > 0 || __props.prefixIcon.length > 0 || __props.prefix.length > 0
    }, __props.prefiicon.length > 0 || __props.prefixIcon.length > 0 || __props.prefix.length > 0 ? {
      b: common_vendor.t(__props.prefix.length > 0 ? __props.prefix : __props.prefixIcon.length > 0 ? __props.prefixIcon : __props.prefiicon),
      c: common_vendor.s(__props.prefiiconStyle)
    } : {}, {
      d: common_vendor.s(fieldStyle.value),
      e: __props.type,
      f: current.value,
      g: __props.placeholder,
      h: __props.placeholderClass,
      i: placeholderStyleText.value,
      j: passwordVisible.value,
      k: __props.disabled,
      l: parseFloat(__props.maxlength.toString()),
      m: __props.confirmType,
      n: __props.confirmHold,
      o: __props.inputmode,
      p: __props.focus,
      q: parseFloat(__props.cursor.toString()),
      r: parseFloat(__props.cursorSpacing.toString()),
      s: parseFloat(__props.selectionStart.toString()),
      t: parseFloat(__props.selectionEnd.toString()),
      v: __props.adjustPosition,
      w: common_vendor.o(handleInput, "ba"),
      x: common_vendor.o(handleFocus, "da"),
      y: common_vendor.o(handleBlur, "d7"),
      z: common_vendor.o(handleConfirm, "97"),
      A: common_vendor.o(handleKeyboardHeightChange, "90"),
      B: __props.showWordLimit
    }, __props.showWordLimit ? {
      C: common_vendor.t(current.value.length),
      D: common_vendor.t(__props.maxlength)
    } : {}, {
      E: __props.clearable && current.value.length > 0 && !__props.disabled && !__props.readonly
    }, __props.clearable && current.value.length > 0 && !__props.disabled && !__props.readonly ? {
      F: common_vendor.o(clear, "44")
    } : {}, {
      G: __props.password && __props.showPasswordToggle
    }, __props.password && __props.showPasswordToggle ? {
      H: common_vendor.t(passwordVisible.value ? "show" : "hide"),
      I: common_vendor.o(togglePassword, "fc")
    } : {}, {
      J: __props.suffiicon.length > 0
    }, __props.suffiicon.length > 0 ? {
      K: common_vendor.t(__props.suffiicon),
      L: common_vendor.s(__props.suffiiconStyle)
    } : {}, {
      M: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      N: common_vendor.n(wrapClass.value),
      O: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass),
      P: common_vendor.s(wrapStyle.value),
      Q: common_vendor.s({
        "--status-bar-height": `${_ctx.u_s_b_h}px`,
        "--uni-safe-area-inset-bottom": `${_ctx.u_s_a_i_b}px`
      })
    });
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/i-ui-x/components/i-input/i-input.js.map
