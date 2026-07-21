"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-checkbox" }, { __name: "i-checkbox", props: {
  name: {
    type: [String, Number],
    default: ""
  },
  modelValue: {
    type: [Array, Boolean, String, Number],
    default: false
  },
  value: {
    type: [Array, Boolean, String, Number],
    default: false
  },
  checked: {
    type: Boolean,
    default: false
  },
  shape: {
    type: String,
    default: "square"
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
  labelSize: {
    type: [String, Number],
    default: 14
  },
  labelColor: {
    type: String,
    default: "#303133"
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
  iconPlacement: {
    type: String,
    default: "left"
  },
  borderBottom: {
    type: Boolean,
    default: false
  },
  activeLabelColor: {
    type: String,
    default: ""
  },
  plain: {
    type: Boolean,
    default: true
  }
}, emits: ["change", "update:modelValue", "update:value", "update:checked"], setup(__props, _a) {
  var __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  function formatSize(value) {
    const text = value.toString();
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
      return text;
    }
    return text + "px";
  }
  function valueText(value = null) {
    if (typeof value == "string")
      return value;
    if (typeof value == "number" || typeof value == "boolean")
      return value.toString();
    return "";
  }
  function isChecked() {
    if (props.checked)
      return true;
    const modelValue = props.modelValue;
    const value = valueText(modelValue).length > 0 ? modelValue : props.value;
    if (Array.isArray(value)) {
      const names = value;
      for (let i = 0; i < names.length; i++) {
        if (valueText(names[i]) == valueText(props.name))
          return true;
      }
      return false;
    }
    if (typeof value == "boolean")
      return value;
    return valueText(value) == valueText(props.name);
  }
  const internalChecked = common_vendor.ref(isChecked());
  const checked = common_vendor.computed(() => {
    return internalChecked.value;
  });
  const wrapClass = common_vendor.computed(() => {
    const classes = ["i-checkbox"];
    if (props.placement == "column")
      classes.push("i-checkbox--column");
    if (props.iconPlacement == "right")
      classes.push("i-checkbox--right");
    if (props.shape == "button")
      classes.push("i-checkbox--button");
    if (props.plain && props.shape == "button")
      classes.push("i-checkbox--plain");
    if (checked.value)
      classes.push("i-checkbox--checked");
    if (props.shape == "button" && checked.value)
      classes.push("i-checkbox--button-checked");
    if (props.shape == "button" && props.plain && checked.value) {
      classes.push("i-checkbox--button-plain-checked");
    }
    if (props.disabled)
      classes.push("i-checkbox--disabled");
    if (props.borderBottom)
      classes.push("i-checkbox--border");
    return classes.join(" ");
  });
  const labelClass = common_vendor.computed(() => {
    const classes = ["i-checkbox__label"];
    if (props.shape == "button")
      classes.push("i-checkbox__label--button");
    return classes.join(" ");
  });
  const boxStyle = common_vendor.computed(() => {
    return "width:" + formatSize(props.size) + ";height:" + formatSize(props.size) + ";border-radius:" + (props.shape == "circle" ? formatSize(props.size) : "4px") + ";border-color:" + (checked.value ? props.activeColor : props.inactiveColor) + ";background-color:" + (checked.value && props.shape != "check" ? props.activeColor : "transparent") + ";";
  });
  const markStyle = common_vendor.computed(() => {
    return "color:" + props.iconColor + ";font-size:" + formatSize(props.iconSize) + ";";
  });
  const labelStyle = common_vendor.computed(() => {
    let color = props.labelColor;
    if (checked.value && props.activeLabelColor.length > 0)
      color = props.activeLabelColor;
    return "color:" + color + ";font-size:" + formatSize(props.labelSize) + ";";
  });
  common_vendor.watch(() => {
    return props.modelValue;
  }, () => {
    internalChecked.value = isChecked();
  });
  common_vendor.watch(() => {
    return props.value;
  }, () => {
    internalChecked.value = isChecked();
  });
  common_vendor.watch(() => {
    return props.checked;
  }, () => {
    internalChecked.value = isChecked();
  });
  function buildValue(nextChecked, previousChecked) {
    const modelValue = props.modelValue;
    const value = valueText(modelValue).length > 0 ? modelValue : props.value;
    if (Array.isArray(value)) {
      const list = value;
      const nextList = list.slice(0);
      const exists = previousChecked;
      if (nextChecked && !exists)
        nextList.push(props.name);
      if (!nextChecked && exists) {
        const filtered = [];
        for (let i = 0; i < nextList.length; i++) {
          if (valueText(nextList[i]) != valueText(props.name))
            filtered.push(nextList[i]);
        }
        return filtered;
      }
      return nextList;
    }
    return nextChecked;
  }
  function updateChecked(nextChecked) {
    const previousChecked = checked.value;
    internalChecked.value = nextChecked;
    const nextValue = buildValue(nextChecked, previousChecked);
    emit("update:checked", nextChecked);
    emit("update:modelValue", nextValue);
    emit("update:value", nextValue);
    emit("change", nextValue);
  }
  function toggle() {
    if (props.disabled)
      return null;
    updateChecked(!checked.value);
  }
  function toggleByLabel() {
    if (props.labelDisabled)
      return null;
    toggle();
  }
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: __props.shape != "button"
    }, __props.shape != "button" ? common_vendor.e({
      b: checked.value
    }, checked.value ? {
      c: common_vendor.s(markStyle.value)
    } : {}, {
      d: common_vendor.s(boxStyle.value)
    }) : {}, {
      e: common_vendor.r("icon", {
        checked: checked.value
      }),
      f: common_vendor.t(__props.label),
      g: common_vendor.n(labelClass.value),
      h: common_vendor.s(labelStyle.value),
      i: common_vendor.o(toggleByLabel, "84"),
      j: common_vendor.r("d", {
        checked: checked.value
      }),
      k: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      l: common_vendor.n(wrapClass.value),
      m: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass),
      n: common_vendor.o(toggle, "4b"),
      o: `${_ctx.u_s_b_h}px`,
      p: `${_ctx.u_s_a_i_b}px`
    });
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/i-ui-x/components/i-checkbox/i-checkbox.js.map
