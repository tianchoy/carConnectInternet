"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-badge" }, { __name: "i-badge", props: {
  label: {
    type: String,
    default: ""
  },
  count: {
    type: Number,
    default: 0
  },
  value: {
    type: [String, Number],
    default: ""
  },
  type: {
    type: String,
    default: "danger"
  },
  dot: {
    type: Boolean,
    default: true
  },
  maxCount: {
    type: Number,
    default: 99
  },
  max: {
    type: Number,
    default: 99
  },
  position: {
    type: String,
    default: "right"
  },
  offset: {
    type: Array,
    default() {
      return [0, 0];
    }
  },
  fontSize: {
    type: [String, Number],
    default: "9"
  },
  showZero: {
    type: Boolean,
    default: false
  },
  hidden: {
    type: Boolean,
    default: false
  },
  bgColor: {
    type: String,
    default: "error"
  },
  fontColor: {
    type: String,
    default: "white"
  },
  color: {
    type: String,
    default: ""
  }
}, emits: ["click"], setup(__props, _a) {
  var __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  const bgColor = common_vendor.computed(() => {
    return props.bgColor;
  });
  const showBadge = common_vendor.computed(() => {
    if (props.hidden)
      return false;
    if (props.label.length > 0)
      return true;
    if (hasNumberValue()) {
      if (effectiveCount() == 0 && !props.showZero)
        return props.dot;
      return true;
    }
    return props.dot;
  });
  const displayValue = common_vendor.computed(() => {
    if (props.label.length > 0)
      return props.label;
    const value = effectiveCount();
    const max = getMaxCount();
    if (value > max)
      return max + "+";
    return String(value);
  });
  const dot = common_vendor.computed(() => {
    if (props.label.length > 0)
      return false;
    if (hasNumberValue()) {
      if (effectiveCount() == 0 && !props.showZero)
        return props.dot;
      return false;
    }
    return props.dot;
  });
  const rootClass = common_vendor.computed(() => {
    const classes = ["i-badge"];
    const position = normalizePosition(props.position);
    classes.push("i-badge--" + position);
    if (dot.value)
      classes.push("i-badge--dot");
    if (position == "left" || position == "bottomLeft")
      classes.push("i-badge--left-space");
    if (dot.value && (position == "left" || position == "bottomLeft")) {
      classes.push("i-badge--dot-left-space");
    }
    if (dot.value && (position == "bottomLeft" || position == "bottomRight" || position == "bottom")) {
      classes.push("i-badge--dot-bottom");
    }
    if (dot.value && position == "top")
      classes.push("i-badge--dot-top");
    return classes.join(" ");
  });
  const badgeClass = common_vendor.computed(() => {
    const classes = ["i-badge__mark", "i-badge__mark--" + normalizeTheme(effectiveBgColor())];
    if (dot.value)
      classes.push("i-badge__mark--dot");
    classes.push("i-badge__mark--" + normalizePosition(props.position));
    return classes.join(" ");
  });
  const badgeStyle = common_vendor.computed(() => {
    let style = positionStyle();
    const bgColor2 = parseColor(effectiveBgColor());
    if (bgColor2.length > 0)
      style = style + "background-color:" + bgColor2 + ";";
    return style;
  });
  const badgeTextStyle = common_vendor.computed(() => {
    return "color:" + parseColor(effectiveFontColor()) + ";font-size:" + formatSize(props.fontSize) + ";";
  });
  function handleClick() {
    emit("click", new common_vendor.UTSJSONObject({
      label: props.label,
      count: effectiveCount(),
      value: displayValue.value,
      dot: dot.value,
      position: props.position
    }));
  }
  function hasNumberValue() {
    return String(props.value).length > 0 || props.count > 0 || props.showZero;
  }
  function effectiveCount() {
    if (String(props.value).length > 0)
      return Number(props.value);
    return props.count;
  }
  function getMaxCount() {
    if (props.maxCount != 99)
      return props.maxCount;
    return props.max;
  }
  function effectiveBgColor() {
    if (bgColor.value.length > 0)
      return bgColor.value;
    return props.type;
  }
  function effectiveFontColor() {
    if (props.color.length > 0)
      return props.color;
    return props.fontColor;
  }
  function normalizeTheme(value) {
    const text = String(value);
    if (text == "danger")
      return "error";
    if (text == "error" || text == "primary" || text == "success" || text == "warning" || text == "info")
      return text;
    return "custom";
  }
  function parseColor(value) {
    const text = String(value);
    if (text == "white")
      return "#ffffff";
    if (text == "black")
      return "#000000";
    if (text == "danger" || text == "error")
      return "#f56c6c";
    if (text == "primary")
      return "#3c9cff";
    if (text == "success")
      return "#5ac725";
    if (text == "warning")
      return "#f9ae3d";
    if (text == "info")
      return "#909399";
    return text;
  }
  function normalizePosition(value) {
    const text = String(value);
    if (text == "rightTop")
      return "right";
    if (text == "leftTop")
      return "left";
    if (text == "rightBottom")
      return "bottomRight";
    if (text == "leftBottom")
      return "bottomLeft";
    if (text == "left" || text == "right" || text == "bottomLeft" || text == "bottomRight" || text == "top" || text == "bottom")
      return text;
    return "right";
  }
  function positionStyle() {
    const x = getOffset(0);
    const y = getOffset(1);
    const position = normalizePosition(props.position);
    const edge = 0;
    if (position == "left")
      return "left:" + (edge + x) + "px;top:" + (edge + y) + "px;";
    if (position == "bottomLeft")
      return "left:" + (edge + x) + "px;bottom:" + (edge - y) + "px;";
    if (position == "bottomRight")
      return "right:" + (edge - x) + "px;bottom:" + (edge - y) + "px;";
    if (position == "top")
      return "left:50%;top:" + (edge + y) + "px;transform:translateX(-50%);margin-left:" + x + "px;";
    if (position == "bottom")
      return "left:50%;bottom:" + (edge - y) + "px;transform:translateX(-50%);margin-left:" + x + "px;";
    return "right:" + (edge - x) + "px;top:" + (edge + y) + "px;";
  }
  function getOffset(index) {
    if (props.offset.length <= index)
      return 0;
    return Number(props.offset[index]);
  }
  function formatSize(value) {
    const text = String(value);
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0)
      return text;
    return text + "px";
  }
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: showBadge.value && dot.value
    }, showBadge.value && dot.value ? {
      b: common_vendor.n(badgeClass.value),
      c: common_vendor.s(badgeStyle.value),
      d: common_vendor.o(handleClick, "af")
    } : showBadge.value ? {
      f: common_vendor.t(displayValue.value),
      g: common_vendor.s(badgeTextStyle.value),
      h: common_vendor.n(badgeClass.value),
      i: common_vendor.s(badgeStyle.value),
      j: common_vendor.o(handleClick, "4c")
    } : {}, {
      e: showBadge.value,
      k: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      l: common_vendor.n(rootClass.value),
      m: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass),
      n: `${_ctx.u_s_b_h}px`,
      o: `${_ctx.u_s_a_i_b}px`
    });
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/i-ui-x/components/i-badge/i-badge.js.map
