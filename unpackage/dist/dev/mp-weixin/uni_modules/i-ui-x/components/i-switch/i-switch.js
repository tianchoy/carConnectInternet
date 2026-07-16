"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-switch" }, { __name: "i-switch", props: {
  modelValue: {
    type: [Boolean, String, Number],
    default: ""
  },
  value: {
    type: [Boolean, String, Number],
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  shape: {
    type: String,
    default: "round"
  },
  size: {
    type: [String, Number],
    default: "26px"
  },
  width: {
    type: [String, Number],
    default: 0
  },
  activeColor: {
    type: String,
    default: "#2979ff"
  },
  inactiveColor: {
    type: String,
    default: "#dcdfe6"
  },
  activeValue: {
    type: [Boolean, String, Number],
    default: true
  },
  inactiveValue: {
    type: [Boolean, String, Number],
    default: false
  },
  asyncChange: {
    type: Boolean,
    default: false
  },
  space: {
    type: [String, Number],
    default: "2px"
  },
  textSpace: {
    type: [String, Number],
    default: 8
  },
  activeText: {
    type: String,
    default: ""
  },
  inactiveText: {
    type: String,
    default: ""
  },
  loadingMode: {
    type: String,
    default: "spinner"
  },
  loadingSize: {
    type: [String, Number],
    default: 15
  },
  loadingIcon: {
    type: String,
    default: "loading"
  }
}, emits: ["update:modelValue", "update:value", "change"], setup(__props, _a) {
  var __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  const current = common_vendor.ref(initialValue());
  const checked = common_vendor.computed(() => {
    return String(current.value) == String(props.activeValue);
  });
  const switchClass = common_vendor.computed(() => {
    const classes = ["i-switch"];
    if (checked.value)
      classes.push("i-switch--checked");
    if (props.disabled || props.loading)
      classes.push("i-switch--disabled");
    if (props.shape == "square")
      classes.push("i-switch--square");
    return classes.join(" ");
  });
  const switchStyle = common_vendor.computed(() => {
    const height = numericSize(props.size, 26);
    const width = numericSize(props.width, 0) > 0 ? numericSize(props.width, 0) : height * 2;
    return "width:" + formatSize(width) + ";height:" + formatSize(height) + ";padding:" + formatSize(props.space) + ";border-radius:" + (props.shape == "square" ? "4px" : formatSize(height)) + ";background-color:" + (checked.value ? props.activeColor : props.inactiveColor) + ";margin-left:" + formatSize(props.textSpace) + ";margin-right:" + formatSize(props.textSpace) + ";";
  });
  const thumbStyle = common_vendor.computed(() => {
    const height = numericSize(props.size, 26);
    const space = numericSize(props.space, 2);
    const thumb = height - space * 2;
    const width = numericSize(props.width, 0) > 0 ? numericSize(props.width, 0) : height * 2;
    const offset = checked.value ? width - thumb - space * 2 : 0;
    return "width:" + formatSize(thumb) + ";height:" + formatSize(thumb) + ";border-radius:" + (props.shape == "square" ? "3px" : formatSize(thumb)) + ";margin-left:" + formatSize(offset) + ";";
  });
  const loadingStyle = common_vendor.computed(() => {
    return "font-size:" + formatSize(props.loadingSize) + ";";
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
  function initialValue() {
    if (String(props.modelValue).length > 0)
      return props.modelValue;
    return props.value;
  }
  function toggle() {
    if (props.disabled || props.loading)
      return null;
    const nextValue = checked.value ? props.inactiveValue : props.activeValue;
    if (!props.asyncChange)
      current.value = nextValue;
    emit("change", nextValue);
    emit("update:modelValue", nextValue);
    emit("update:value", nextValue);
  }
  function formatSize(value = null) {
    const text = String(value);
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
      return text;
    }
    return text + "px";
  }
  function numericSize(value = null, fallback = null) {
    const text = String(value).replace("px", "").replace("rpx", "").replace("%", "");
    const numberValue = Number(text);
    if (isNaN(numberValue))
      return fallback;
    return numberValue;
  }
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: __props.inactiveText.length > 0
    }, __props.inactiveText.length > 0 ? {
      b: common_vendor.t(__props.inactiveText)
    } : {}, {
      c: __props.loading
    }, __props.loading ? {
      d: common_vendor.t(__props.loadingMode == "spinner" ? "..." : __props.loadingIcon),
      e: common_vendor.s(loadingStyle.value)
    } : {}, {
      f: common_vendor.s(thumbStyle.value),
      g: common_vendor.n(switchClass.value),
      h: common_vendor.s(switchStyle.value),
      i: common_vendor.o(toggle, "ca"),
      j: __props.activeText.length > 0
    }, __props.activeText.length > 0 ? {
      k: common_vendor.t(__props.activeText)
    } : {}, {
      l: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      m: `${_ctx.u_s_b_h}px`,
      n: `${_ctx.u_s_a_i_b}px`,
      o: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
    });
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/i-ui-x/components/i-switch/i-switch.js.map
