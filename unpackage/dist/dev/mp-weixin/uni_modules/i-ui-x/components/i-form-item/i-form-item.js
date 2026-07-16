"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-form-item" }, { __name: "i-form-item", props: {
  name: {
    type: String,
    default: ""
  },
  label: {
    type: String,
    default: ""
  },
  hint: {
    type: String,
    default: ""
  },
  error: {
    type: String,
    default: ""
  },
  required: {
    type: Boolean,
    default: false
  },
  scrollId: {
    type: String,
    default: ""
  },
  scrollIdPrefix: {
    type: String,
    default: "i-form-item-"
  },
  labelWidth: {
    type: [String, Number],
    default: "100px"
  },
  labelDirection: {
    type: String,
    default: "vertical"
  },
  labelFontColor: {
    type: String,
    default: "#303133"
  },
  labelFontSize: {
    type: [String, Number],
    default: "14px"
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  errorAlign: {
    type: String,
    default: "left"
  }
}, emits: [], setup(__props, _a) {
  _a.emit;
  const props = __props;
  const itemId = common_vendor.computed(() => {
    if (props.scrollId.length > 0)
      return props.scrollId;
    if (props.name.length == 0)
      return "";
    return props.scrollIdPrefix + normalizeIdName(props.name);
  });
  const itemClass = common_vendor.computed(() => {
    const classes = ["i-form-item"];
    if (props.labelDirection == "horizontal")
      classes.push("i-form-item--horizontal");
    return classes.join(" ");
  });
  const headerClass = common_vendor.computed(() => {
    const classes = ["i-form-item__header"];
    if (props.labelDirection == "horizontal")
      classes.push("i-form-item__header--horizontal");
    return classes.join(" ");
  });
  const contentClass = common_vendor.computed(() => {
    const classes = ["i-form-item__content"];
    if (props.labelDirection == "horizontal")
      classes.push("i-form-item__content--horizontal");
    return classes.join(" ");
  });
  const headerStyle = common_vendor.computed(() => {
    if (props.labelDirection != "horizontal")
      return "";
    return "width:" + formatSize(props.labelWidth) + ";";
  });
  const labelStyle = common_vendor.computed(() => {
    return "color:" + props.labelFontColor + ";font-size:" + formatSize(props.labelFontSize) + ";";
  });
  const footerStyle = common_vendor.computed(() => {
    return "text-align:" + props.errorAlign + ";";
  });
  function formatSize(value = null) {
    const text = String(value);
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0) {
      return text;
    }
    return text + "px";
  }
  function normalizeIdName(name = null) {
    const text = String(name);
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      const char = text.charAt(i);
      const isNumber = code >= 48 && code <= 57;
      const isUpper = code >= 65 && code <= 90;
      const isLower = code >= 97 && code <= 122;
      if (isNumber || isUpper || isLower || char == "-" || char == "_") {
        result = result + char;
      } else {
        result = result + "-";
      }
    }
    return result;
  }
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: __props.showLabel
    }, __props.showLabel ? common_vendor.e({
      b: __props.required
    }, __props.required ? {} : {}, {
      c: common_vendor.t(__props.label),
      d: common_vendor.s(labelStyle.value),
      e: common_vendor.n(headerClass.value),
      f: common_vendor.s(headerStyle.value)
    }) : {}, {
      g: common_vendor.n(contentClass.value),
      h: __props.error.length > 0
    }, __props.error.length > 0 ? {
      i: common_vendor.t(__props.error),
      j: common_vendor.s(footerStyle.value)
    } : __props.hint.length > 0 ? {
      l: common_vendor.t(__props.hint),
      m: common_vendor.s(footerStyle.value)
    } : {}, {
      k: __props.hint.length > 0,
      n: common_vendor.sei(common_vendor.gei(_ctx, itemId.value), "view"),
      o: common_vendor.n(itemClass.value),
      p: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass),
      q: `${_ctx.u_s_b_h}px`,
      r: `${_ctx.u_s_a_i_b}px`
    });
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/i-ui-x/components/i-form-item/i-form-item.js.map
