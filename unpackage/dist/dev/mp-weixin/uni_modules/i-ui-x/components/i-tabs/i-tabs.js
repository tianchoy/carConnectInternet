"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-tabs" }, { __name: "i-tabs", props: {
  value: { type: [String, Number], default: "" },
  current: { type: Number, default: -1 },
  list: {
    type: Array,
    default() {
      return [];
    }
  },
  items: {
    type: Array,
    default() {
      return ["关注", "推荐", "热榜", "本地"];
    }
  },
  scrollable: { type: Boolean, default: false },
  activeColor: { type: String, default: "#2979ff" },
  inactiveColor: { type: String, default: "#606266" },
  bgColor: { type: String, default: "#ffffff" },
  lineWidth: { type: [String, Number], default: "24" },
  lineHeight: { type: [String, Number], default: "3" },
  fontSize: { type: [String, Number], default: "14" },
  itemWidth: { type: [String, Number], default: "auto" },
  showBar: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false }
}, emits: ["click", "change", "select", "update:value", "update:current"], setup(__props, _a) {
  var __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  function formatSize(value = null) {
    const text = value.toString();
    if (text == "auto" || text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0)
      return text;
    return text + "px";
  }
  function numericSize(value = null) {
    const text = value.toString();
    const numberValue = parseFloat(text.replace("px", "").replace("rpx", "").replace("%", "").toString());
    if (isNaN(numberValue))
      return 0;
    return numberValue;
  }
  const bgColor = common_vendor.computed(() => {
    return props.bgColor;
  });
  const list = common_vendor.computed(() => {
    const source = props.list;
    if (source != null && source.length > 0)
      return source;
    const items = props.items;
    if (items != null)
      return items;
    const empty = [];
    return empty;
  });
  function itemValue(item = null, keyName) {
    if (item == null)
      return "";
    if (typeof item == "object") {
      const value = item[keyName];
      if (value == null)
        return "";
      return value.toString();
    }
    if (keyName == "name" || keyName == "text" || keyName == "value")
      return item.toString();
    return "";
  }
  function getItemName(item = null) {
    const name = itemValue(item, "name");
    if (name.length > 0)
      return name;
    return itemValue(item, "text");
  }
  function getItemValue(item = null) {
    const value = itemValue(item, "value");
    if (value.length > 0)
      return value;
    return getItemName(item);
  }
  function resolveIndex() {
    if (props.current >= 0)
      return props.current;
    const expected = props.value.toString();
    for (let i = 0; i < list.value.length; i++) {
      const item = list.value[i];
      if (getItemValue(item) == expected || getItemName(item) == expected)
        return i;
    }
    return 0;
  }
  const currentIndex = common_vendor.ref(resolveIndex());
  const scrollIntoView = common_vendor.ref("i-tabs-item-" + currentIndex.value.toString());
  function resolveScrollableItemWidth() {
    const size = numericSize(props.itemWidth);
    if (size > 0)
      return size;
    return 92;
  }
  const navStyle = common_vendor.computed(() => {
    if (!props.scrollable)
      return "";
    return "width:" + (resolveScrollableItemWidth() * list.value.length).toString() + "px;";
  });
  function getItemStyle(index) {
    if (props.scrollable)
      return "width:" + resolveScrollableItemWidth().toString() + "px;";
    const width = formatSize(props.itemWidth);
    if (width == "auto")
      return "";
    return "width:" + width + ";";
  }
  const barStyle = common_vendor.computed(() => {
    return "width:" + formatSize(props.lineWidth) + ";height:" + formatSize(props.lineHeight) + ";background-color:" + props.activeColor + ";";
  });
  common_vendor.watch(() => {
    return props.value;
  }, () => {
    currentIndex.value = resolveIndex();
    scrollIntoView.value = "i-tabs-item-" + currentIndex.value.toString();
  });
  common_vendor.watch(() => {
    return props.current;
  }, () => {
    currentIndex.value = resolveIndex();
    scrollIntoView.value = "i-tabs-item-" + currentIndex.value.toString();
  });
  function isItemDisabled(item = null) {
    if (item == null)
      return false;
    if (typeof item == "object")
      return item["disabled"] == true;
    return false;
  }
  function isItemDot(item = null) {
    if (item == null)
      return false;
    if (typeof item == "object")
      return item["dot"] == true;
    return false;
  }
  function getItemBadge(item = null) {
    return itemValue(item, "badge");
  }
  function buildPayload(item = null, index) {
    return new common_vendor.UTSJSONObject({
      index,
      name: getItemName(item),
      value: getItemValue(item),
      item
    });
  }
  function getItemClass(item = null, index) {
    let className = currentIndex.value == index ? "i-tabs__item i-tabs__item--active" : "i-tabs__item";
    if (isItemDisabled(item))
      className += " i-tabs__item--disabled";
    return className;
  }
  function getTextStyle(item = null, index) {
    const color = currentIndex.value == index ? props.activeColor : props.inactiveColor;
    const realColor = isItemDisabled(item) ? "#c8c9cc" : color;
    return "font-size:" + formatSize(props.fontSize) + ";color:" + realColor + ";";
  }
  function select(item = null, index) {
    if (props.disabled || isItemDisabled(item))
      return null;
    const payload = buildPayload(item, index);
    emit("click", payload);
    if (currentIndex.value == index)
      return null;
    currentIndex.value = index;
    scrollIntoView.value = "i-tabs-item-" + index.toString();
    emit("select", payload);
    emit("change", payload);
    emit("update:value", payload.value);
    emit("update:current", index);
  }
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = {
      a: common_vendor.f(list.value, (item, index, i0) => {
        return common_vendor.e({
          a: common_vendor.t(getItemName(item)),
          b: common_vendor.n(currentIndex.value == index ? "i-tabs__text i-tabs__text--active" : "i-tabs__text"),
          c: common_vendor.s(getTextStyle(item, index)),
          d: getItemBadge(item).length > 0
        }, getItemBadge(item).length > 0 ? {
          e: common_vendor.t(getItemBadge(item))
        } : {}, {
          f: isItemDot(item)
        }, isItemDot(item) ? {} : {}, {
          g: __props.showBar && currentIndex.value == index
        }, __props.showBar && currentIndex.value == index ? {
          h: common_vendor.s(barStyle.value)
        } : {}, {
          i: common_vendor.sei("i-tabs-item-" + index.toString(), "view"),
          j: index.toString() + "-" + getItemName(item),
          k: common_vendor.n(getItemClass(item, index)),
          l: common_vendor.s(getItemStyle()),
          m: common_vendor.o(($event) => {
            return select(item, index);
          }, index.toString() + "-" + getItemName(item))
        });
      }),
      b: common_vendor.s(navStyle.value),
      c: __props.scrollable,
      d: scrollIntoView.value,
      e: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      f: common_vendor.s("background-color:" + bgColor.value),
      g: common_vendor.s({
        "--status-bar-height": `${_ctx.u_s_b_h}px`,
        "--uni-safe-area-inset-bottom": `${_ctx.u_s_a_i_b}px`
      }),
      h: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
    };
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/i-ui-x/components/i-tabs/i-tabs.js.map
