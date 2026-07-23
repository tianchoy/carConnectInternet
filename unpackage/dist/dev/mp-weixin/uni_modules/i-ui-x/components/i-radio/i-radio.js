"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-radio" }, { __name: "i-radio", props: {
  name: {
    type: [String, Number, Boolean],
    default: ""
  },
  modelValue: {
    type: [String, Number, Boolean],
    default: ""
  },
  value: {
    type: [String, Number, Boolean],
    default: ""
  },
  checked: {
    type: Boolean,
    default: false
  },
  shape: {
    type: String,
    default: "circle"
  },
  disabled: {
    type: Boolean,
    default: false
  },
  activeColor: {
    type: String,
    default: "#2979ff"
  },
  inactiveColor: {
    type: String,
    default: "#dcdfe6"
  },
  size: {
    type: [String, Number],
    default: 20
  },
  placement: {
    type: String,
    default: "row"
  },
  label: {
    type: String,
    default: ""
  },
  labelColor: {
    type: String,
    default: "#303133"
  },
  labelSize: {
    type: [String, Number],
    default: 14
  },
  labelDisabled: {
    type: Boolean,
    default: false
  },
  iconColor: {
    type: String,
    default: "#ffffff"
  },
  iconSize: {
    type: [String, Number],
    default: 14
  },
  borderBottom: {
    type: Boolean,
    default: false
  },
  iconPlacement: {
    type: String,
    default: "left"
  },
  activeLabelColor: {
    type: String,
    default: ""
  }
}, emits: ["change", "update:modelValue", "update:value", "update:checked"], setup(__props, _a) {
  var __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  function formatSize(value = null) {
    const text = value.toString();
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
      return text;
    }
    return text + "px";
  }
  const checked = common_vendor.computed(() => {
    if (props.checked)
      return true;
    const modelValueText = props.modelValue.toString();
    const value = modelValueText.length > 0 ? props.modelValue : props.value;
    return value.toString() == props.name.toString();
  });
  const wrapClass = common_vendor.computed(() => {
    const classes = ["i-radio"];
    if (props.placement == "column")
      classes.push("i-radio--column");
    if (props.iconPlacement == "right")
      classes.push("i-radio--right");
    if (props.shape == "button")
      classes.push("i-radio--button");
    if (checked.value)
      classes.push("i-radio--checked");
    if (props.shape == "button" && checked.value)
      classes.push("i-radio--button-checked");
    if (props.disabled)
      classes.push("i-radio--disabled");
    if (props.borderBottom)
      classes.push("i-radio--border");
    return classes.join(" ");
  });
  const labelClass = common_vendor.computed(() => {
    const classes = ["i-radio__label"];
    if (props.placement == "column")
      classes.push("i-radio__label--column");
    if (props.shape == "button")
      classes.push("i-radio__label--button");
    return classes.join(" ");
  });
  const boxStyle = common_vendor.computed(() => {
    const circle = props.shape == "circle" || props.shape == "dot";
    return "width:" + formatSize(props.size) + ";height:" + formatSize(props.size) + ";border-radius:" + (circle ? formatSize(props.size) : "4px") + ";border-color:" + (checked.value ? props.activeColor : props.inactiveColor) + ";background-color:" + (checked.value && props.shape == "check" ? props.activeColor : "transparent") + ";";
  });
  const dotStyle = common_vendor.computed(() => {
    return "background-color:" + props.activeColor + ";";
  });
  const checkStyle = common_vendor.computed(() => {
    return "background-color:" + props.activeColor + ";color:" + props.iconColor + ";font-size:" + formatSize(parseFloat(props.iconSize.toString()) + 2) + ";";
  });
  const labelStyle = common_vendor.computed(() => {
    let color = props.labelColor;
    if (checked.value && props.activeLabelColor.length > 0)
      color = props.activeLabelColor;
    return "color:" + color + ";font-size:" + formatSize(props.labelSize) + ";";
  });
  function select() {
    if (props.disabled)
      return null;
    emit("change", props.name);
    emit("update:modelValue", props.name);
    emit("update:value", props.name);
    emit("update:checked", true);
  }
  function selectByLabel() {
    if (props.labelDisabled)
      return null;
    select();
  }
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: __props.shape != "button"
    }, __props.shape != "button" ? common_vendor.e({
      b: checked.value && __props.shape != "check"
    }, checked.value && __props.shape != "check" ? {
      c: common_vendor.s(dotStyle.value)
    } : {}, {
      d: checked.value && __props.shape == "check"
    }, checked.value && __props.shape == "check" ? {
      e: common_vendor.s(checkStyle.value)
    } : {}, {
      f: common_vendor.s(boxStyle.value)
    }) : {}, {
      g: common_vendor.r("icon", {
        checked: checked.value
      }),
      h: common_vendor.t(__props.label),
      i: common_vendor.n(labelClass.value),
      j: common_vendor.s(labelStyle.value),
      k: common_vendor.o(selectByLabel, "d6"),
      l: common_vendor.r("d", {
        checked: checked.value
      }),
      m: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      n: common_vendor.n(wrapClass.value),
      o: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass),
      p: common_vendor.o(select, "a8"),
      q: `${_ctx.u_s_b_h}px`,
      r: `${_ctx.u_s_a_i_b}px`
    });
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/i-ui-x/components/i-radio/i-radio.js.map
