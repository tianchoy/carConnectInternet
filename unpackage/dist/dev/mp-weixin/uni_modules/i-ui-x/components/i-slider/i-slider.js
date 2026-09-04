"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-slider" }, { __name: "i-slider", props: {
  modelValue: {
    type: [Number, String, Array],
    default: 0
  },
  value: {
    type: [Number, String, Array],
    default: 0
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  },
  range: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  noCross: {
    type: Boolean,
    default: false
  },
  vertical: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: "24px"
  },
  railColor: {
    type: String,
    default: "rgba(0, 0, 0, 0.1)"
  },
  railRadius: {
    type: String,
    default: "2px"
  },
  railSize: {
    type: String,
    default: "4px"
  },
  trackColor: {
    type: String,
    default: "#1677ff"
  },
  thumbSize: {
    type: String,
    default: "20px"
  },
  thumbColor: {
    type: String,
    default: "#ffffff"
  },
  thumbBorder: {
    type: String,
    default: "3px solid #1677ff"
  },
  thumbRadius: {
    type: String,
    default: "50%"
  },
  showValue: {
    type: Boolean,
    default: false
  }
}, emits: ["update:modelValue", "update:value", "change", "changing", "dragStart", "dragEnd"], setup(__props, _a) {
  var __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  function initialValue() {
    if (props.modelValue.toString().length > 0)
      return props.modelValue;
    return props.value;
  }
  function normalizeSingle(value = null) {
    let nextValue = parseFloat(value.toString());
    if (isNaN(nextValue))
      nextValue = props.min;
    if (nextValue < props.min)
      nextValue = props.min;
    if (nextValue > props.max)
      nextValue = props.max;
    return nextValue;
  }
  function normalizeRange(value = null) {
    let start = props.min;
    let end = props.max;
    if (Array.isArray(value)) {
      const list = value;
      if (list.length > 1) {
        const first = list[0];
        const second = list[1];
        if (first != null)
          start = parseFloat(first.toString());
        if (second != null)
          end = parseFloat(second.toString());
      }
    } else {
      const text = value.toString();
      if (text.indexOf(",") >= 0) {
        start = parseFloat(text.split(",")[0].toString());
        end = parseFloat(text.split(",")[1].toString());
      }
    }
    start = normalizeSingle(start);
    end = normalizeSingle(end);
    if (props.noCross && start > end)
      start = end;
    return [start, end];
  }
  function formatSize(value = null) {
    const text = value.toString();
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0)
      return text;
    return text + "px";
  }
  function numericSize(value = null, fallback) {
    const text = value.toString();
    const numberValue = parseFloat(text.replace("px", "").replace("rpx", "").replace("%", "").toString());
    if (isNaN(numberValue))
      return fallback;
    return numberValue;
  }
  function valuePercent(value = null) {
    const distance = props.max - props.min;
    if (distance <= 0)
      return 0;
    const percent = (parseFloat(value.toString()) - props.min) / distance * 100;
    if (percent < 0)
      return 0;
    if (percent > 100)
      return 100;
    return percent;
  }
  function thumbStyle(value = null) {
    const size = numericSize(props.thumbSize, 20);
    return "left:" + valuePercent(value).toString() + "%;width:" + formatSize(props.thumbSize) + ";height:" + formatSize(props.thumbSize) + ";margin-left:" + formatSize(0 - size / 2) + ";border:" + props.thumbBorder + ";border-radius:" + props.thumbRadius + ";background-color:" + props.thumbColor + ";";
  }
  const singleValue = common_vendor.ref(normalizeSingle(initialValue()));
  const rangeStart = common_vendor.ref(normalizeRange(initialValue())[0]);
  const rangeEnd = common_vendor.ref(normalizeRange(initialValue())[1]);
  const dragging = common_vendor.ref(false);
  const rangeId = "i-slider-range-" + Math.floor(Math.random() * 1e6).toString();
  const rangeRectLeft = common_vendor.ref(0);
  const rangeRectWidth = common_vendor.ref(0);
  const activeRangeThumb = common_vendor.ref("");
  function syncFromProps() {
    singleValue.value = normalizeSingle(initialValue());
    const values = normalizeRange(initialValue());
    rangeStart.value = values[0];
    rangeEnd.value = values[1];
  }
  function startDrag() {
    if (dragging.value)
      return null;
    dragging.value = true;
    emit("dragStart");
  }
  function endDrag() {
    dragging.value = false;
    emit("dragEnd");
  }
  function emitValue(value = null) {
    emit("update:modelValue", value);
    emit("update:value", value);
    emit("change", value);
  }
  function normalizeStart(value = null) {
    let nextValue = normalizeSingle(value);
    if (props.noCross && nextValue > rangeEnd.value)
      nextValue = rangeEnd.value;
    return nextValue;
  }
  function normalizeEnd(value = null) {
    let nextValue = normalizeSingle(value);
    if (props.noCross && nextValue < rangeStart.value)
      nextValue = rangeStart.value;
    return nextValue;
  }
  const wrapClass = common_vendor.computed(() => {
    const classes = ["i-slider"];
    if (props.vertical)
      classes.push("i-slider--vertical");
    if (props.disabled)
      classes.push("i-slider--disabled");
    return classes.join(" ");
  });
  const displayValue = common_vendor.computed(() => {
    if (props.range)
      return rangeStart.value.toString() + " - " + rangeEnd.value.toString();
    return singleValue.value.toString();
  });
  const rangeRailStyle = common_vendor.computed(() => {
    return "height:" + formatSize(props.railSize) + ";border-radius:" + formatSize(props.railRadius) + ";background-color:" + props.railColor + ";";
  });
  const rangeTrackStyle = common_vendor.computed(() => {
    const startPercent = valuePercent(rangeStart.value);
    const endPercent = valuePercent(rangeEnd.value);
    return "left:" + startPercent.toString() + "%;width:" + (endPercent - startPercent).toString() + "%;height:" + formatSize(props.railSize) + ";border-radius:" + formatSize(props.railRadius) + ";background-color:" + props.trackColor + ";";
  });
  const startThumbStyle = common_vendor.computed(() => {
    return thumbStyle(rangeStart.value);
  });
  const endThumbStyle = common_vendor.computed(() => {
    return thumbStyle(rangeEnd.value);
  });
  common_vendor.watch(() => {
    return props.modelValue;
  }, () => {
    syncFromProps();
  });
  common_vendor.watch(() => {
    return props.value;
  }, () => {
    syncFromProps();
  });
  function handleSingleChanging(event) {
    startDrag();
    singleValue.value = normalizeSingle(event.detail.value);
    emit("changing", singleValue.value);
  }
  function handleSingleChange(event) {
    singleValue.value = normalizeSingle(event.detail.value);
    emitValue(singleValue.value);
    endDrag();
  }
  function normalizeStep(value) {
    const stepValue = props.step <= 0 ? 1 : props.step;
    const nextValue = props.min + Math.round((value - props.min) / stepValue) * stepValue;
    return normalizeSingle(parseFloat(nextValue.toFixed(6).toString()));
  }
  function valueFromPoint(x) {
    let percent = (x - rangeRectLeft.value) / rangeRectWidth.value;
    if (percent < 0)
      percent = 0;
    if (percent > 1)
      percent = 1;
    const rawValue = props.min + (props.max - props.min) * percent;
    return normalizeStep(rawValue);
  }
  function pickRangeThumb(value) {
    const startDistance = Math.abs(value - rangeStart.value);
    const endDistance = Math.abs(value - rangeEnd.value);
    activeRangeThumb.value = startDistance <= endDistance ? "start" : "end";
  }
  function readTouchX(event) {
    let point = null;
    if (event.touches.length > 0)
      point = event.touches[0];
    else if (event.changedTouches.length > 0)
      point = event.changedTouches[0];
    if (point == null)
      return NaN;
    const object = point;
    const clientX = object["clientX"];
    if (clientX != null) {
      const value = parseFloat(clientX.toString());
      if (!isNaN(value))
        return value;
    }
    const pageX = object["pageX"];
    if (pageX != null) {
      const value = parseFloat(pageX.toString());
      if (!isNaN(value))
        return value;
    }
    const x = object["x"];
    return x == null ? NaN : parseFloat(x.toString());
  }
  function setRangeRect(rect = null) {
    if (rect == null || typeof rect != "object")
      return null;
    const object = rect;
    const left = object["left"];
    const x = object["x"];
    const leftValue = left == null ? NaN : parseFloat(left.toString());
    const xValue = x == null ? 0 : parseFloat(x.toString());
    rangeRectLeft.value = isNaN(leftValue) ? xValue : leftValue;
    const width = object["width"];
    rangeRectWidth.value = width == null ? 0 : parseFloat(width.toString());
  }
  function updateRangeByTouch(event, shouldPickThumb) {
    const x = readTouchX(event);
    if (isNaN(x) || rangeRectWidth.value <= 0)
      return null;
    const nextValue = valueFromPoint(x);
    if (shouldPickThumb)
      pickRangeThumb(nextValue);
    if (activeRangeThumb.value == "start")
      rangeStart.value = normalizeStart(nextValue);
    else
      rangeEnd.value = normalizeEnd(nextValue);
    emit("changing", [rangeStart.value, rangeEnd.value]);
  }
  function refreshRangeRect(event, shouldPickThumb) {
    common_vendor.index.createSelectorQuery().select("#" + rangeId).boundingClientRect((rect = null) => {
      setRangeRect(rect);
      updateRangeByTouch(event, shouldPickThumb);
    }).exec();
  }
  function handleRangeTouchStart(event) {
    if (props.disabled || props.readonly)
      return null;
    startDrag();
    refreshRangeRect(event, true);
  }
  function handleRangeTouchMove(event) {
    if (props.disabled || props.readonly || activeRangeThumb.value.length == 0)
      return null;
    updateRangeByTouch(event, false);
  }
  function handleRangeTouchEnd() {
    if (activeRangeThumb.value.length == 0)
      return null;
    emitValue([rangeStart.value, rangeEnd.value]);
    activeRangeThumb.value = "";
    endDrag();
  }
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: !__props.range
    }, !__props.range ? {
      b: singleValue.value,
      c: __props.min,
      d: __props.max,
      e: __props.step,
      f: __props.disabled || __props.readonly,
      g: __props.trackColor,
      h: __props.railColor,
      i: common_vendor.o(handleSingleChanging, "2f"),
      j: common_vendor.o(handleSingleChange, "f5")
    } : {
      k: common_vendor.s(rangeRailStyle.value),
      l: common_vendor.s(rangeTrackStyle.value),
      m: common_vendor.s(startThumbStyle.value),
      n: common_vendor.s(endThumbStyle.value),
      o: common_vendor.sei(rangeId, "view"),
      p: common_vendor.o(handleRangeTouchStart, "75"),
      q: common_vendor.o(handleRangeTouchMove, "f3"),
      r: common_vendor.o(handleRangeTouchEnd, "88"),
      s: common_vendor.o(handleRangeTouchEnd, "7d")
    }, {
      t: __props.showValue
    }, __props.showValue ? {
      v: common_vendor.t(displayValue.value)
    } : {}, {
      w: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      x: common_vendor.n(wrapClass.value),
      y: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass),
      z: `${_ctx.u_s_b_h}px`,
      A: `${_ctx.u_s_a_i_b}px`
    });
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/i-ui-x/components/i-slider/i-slider.js.map
