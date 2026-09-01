"use strict";
const common_vendor = require("../../../../common/vendor.js");
class TabPayload extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          index: { type: Number, optional: false },
          name: { type: String, optional: false },
          value: { type: String, optional: false },
          item: { type: "Any", optional: false }
        };
      },
      name: "TabPayload"
    };
  }
  constructor(options, metadata = TabPayload.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.index = this.__props__.index;
    this.name = this.__props__.name;
    this.value = this.__props__.value;
    this.item = this.__props__.item;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-tabs" }, { __name: "i-tabs", props: {
  value: { type: [String, Number], default: "" },
  current: { type: Number, default: -1 },
  list: { type: Array, default() {
    return [];
  } },
  items: { type: Array, default() {
    return ["关注", "推荐", "热榜", "本地"];
  } },
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
  function formatSize(value) {
    const text = value.toString();
    if (text == "auto" || text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0)
      return text;
    return text + "px";
  }
  function numericSize(value) {
    const text = value.toString().replace("px", "").replace("rpx", "").replace("%", "");
    const parsed = parseFloat(text);
    return isNaN(parsed) ? 0 : Number.from(parsed);
  }
  function configuredList() {
    const configured = props.list;
    if (configured != null && configured.length > 0)
      return configured;
    const fallback = props.items;
    return fallback != null ? fallback : [];
  }
  function itemValue(item = null, keyName) {
    if (item == null)
      return "";
    if (typeof item == "object") {
      const value = item[keyName];
      return value == null ? "" : value.toString();
    }
    if (keyName == "name" || keyName == "text" || keyName == "value")
      return item.toString();
    return "";
  }
  function itemBoolean(item = null, keyName) {
    if (item == null || typeof item != "object")
      return false;
    const value = item[keyName];
    return value === true || value === 1 || value === "1" || value === "true";
  }
  function getItemName(item = null) {
    const name = itemValue(item, "name");
    return name.length > 0 ? name : itemValue(item, "text");
  }
  function getItemValue(item = null) {
    const value = itemValue(item, "value");
    return value.length > 0 ? value : getItemName(item);
  }
  function isItemDisabled(item = null) {
    return itemBoolean(item, "disabled");
  }
  function isItemDot(item = null) {
    return itemBoolean(item, "dot");
  }
  function getItemBadge(item = null) {
    return itemValue(item, "badge");
  }
  function resolveScrollableItemWidth() {
    const size = numericSize(props.itemWidth);
    return size > 0 ? size : 92;
  }
  function resolveIndex() {
    if (props.current >= 0)
      return props.current;
    const expected = props.value.toString();
    const items = configuredList();
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      if (getItemValue(item) == expected || getItemName(item) == expected)
        return index;
    }
    return 0;
  }
  function getItemStyle(index) {
    if (props.scrollable)
      return "width:" + resolveScrollableItemWidth().toString() + "px;";
    const width = formatSize(props.itemWidth);
    return width == "auto" ? "" : "width:" + width + ";";
  }
  function buildPayload(item = null, index) {
    return new TabPayload({ index, name: getItemName(item), value: getItemValue(item), item });
  }
  const bgColor = common_vendor.computed(() => {
    return props.bgColor;
  });
  const list = common_vendor.computed(() => {
    return configuredList();
  });
  const currentIndex = common_vendor.ref(resolveIndex());
  const scrollIntoView = common_vendor.ref("i-tabs-item-" + currentIndex.value.toString());
  function getItemClass(item = null, index) {
    let className = currentIndex.value == index ? "i-tabs__item i-tabs__item--active" : "i-tabs__item";
    if (isItemDisabled(item))
      className += " i-tabs__item--disabled";
    return className;
  }
  function getTextStyle(item = null, index) {
    const color = currentIndex.value == index ? props.activeColor : props.inactiveColor;
    return "font-size:" + formatSize(props.fontSize) + ";color:" + (isItemDisabled(item) ? "#c8c9cc" : color) + ";";
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
  const navStyle = common_vendor.computed(() => {
    return props.scrollable ? "width:" + (resolveScrollableItemWidth() * list.value.length).toString() + "px;" : "";
  });
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
