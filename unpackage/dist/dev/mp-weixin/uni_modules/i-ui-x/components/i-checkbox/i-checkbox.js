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
  function formatSize(value = null) {
    if (value == null)
      return "0px";
    const text = value.toString();
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
      return text;
    }
    return text + "px";
  }
  function selectedValue() {
    const modelValue = props.modelValue;
    if (modelValue != null && modelValue.toString().length > 0)
      return modelValue;
    return props.value;
  }
  function nameText() {
    const name = props.name;
    return name == null ? "" : name.toString();
  }
  function isChecked() {
    if (props.checked)
      return true;
    const value = selectedValue();
    if (value == null)
      return false;
    if (Array.isArray(value)) {
      const list = value;
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (item != null && item.toString() == nameText())
          return true;
      }
      return false;
    }
    if (typeof value == "boolean")
      return value;
    return value.toString() == nameText();
  }
  function buildValue(nextChecked, previousChecked) {
    const value = selectedValue();
    if (value != null && Array.isArray(value)) {
      const list = value.slice(0);
      if (nextChecked && !previousChecked)
        list.push(props.name);
      if (!nextChecked && previousChecked) {
        const nextList = [];
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          if (item == null || item.toString() != nameText())
            nextList.push(item);
        }
        return nextList;
      }
      return list;
    }
    return nextChecked;
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
