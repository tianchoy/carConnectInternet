"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-grid" }, { __name: "i-grid", props: {
  items: {
    type: Array,
    default() {
      return ["首页", "分类", "购物车", "我的", "优惠券", "设置"];
    }
  },
  col: {
    type: Number,
    default: 3
  },
  itemHeight: {
    type: [String, Number],
    default: "70"
  },
  itemBgColor: {
    type: String,
    default: "#ffffff"
  },
  bgColor: {
    type: String,
    default: "transparent"
  },
  width: {
    type: String,
    default: "auto"
  },
  iconColor: {
    type: String,
    default: "#333333"
  },
  textColor: {
    type: String,
    default: "#888888"
  },
  fontSize: {
    type: [String, Number],
    default: "13"
  },
  iconSize: {
    type: [String, Number],
    default: "25"
  },
  imageSize: {
    type: [String, Number],
    default: "40"
  },
  showBorder: {
    type: Boolean,
    default: true
  },
  borderColor: {
    type: String,
    default: "#f5f5f5"
  },
  round: {
    type: [String, Number],
    default: "0"
  },
  isLink: {
    type: Boolean,
    default: true
  }
}, emits: ["select", "change", "click", "loadmore"], setup(__props, _a) {
  var __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  function valueText(value = null) {
    if (typeof value == "string")
      return value;
    if (typeof value == "number" || typeof value == "boolean")
      return value.toString();
    return "";
  }
  function formatSize(value) {
    const text = value.toString();
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0 || text == "auto") {
      return text;
    }
    return text + "px";
  }
  function itemValue(item = null, keyName) {
    if (item == null || typeof item != "object")
      return "";
    const values = item;
    const value = values[keyName];
    if (value == null)
      return "";
    return valueText(value);
  }
  function getItemText(item = null) {
    const text = itemValue(item, "text");
    if (text.length > 0)
      return text;
    return valueText(item);
  }
  function getItemIcon(item = null) {
    return itemValue(item, "icon");
  }
  function getItemImage(item = null) {
    return itemValue(item, "image");
  }
  function getItemName(item = null) {
    return itemValue(item, "name");
  }
  function getItemBgColor(item = null) {
    const color = itemValue(item, "bgColor");
    if (color.length > 0)
      return color;
    return props.itemBgColor;
  }
  function getItemIconColor(item = null) {
    const color = itemValue(item, "iconColor");
    if (color.length > 0)
      return color;
    return props.iconColor;
  }
  function getItemTextColor(item = null) {
    const color = itemValue(item, "textColor");
    if (color.length > 0)
      return color;
    return props.textColor;
  }
  function getItemUrl(item = null) {
    return itemValue(item, "url");
  }
  const bgColor = common_vendor.computed(() => {
    return props.bgColor;
  });
  const gridItems = common_vendor.computed(() => {
    const items = props.items;
    if (items == null)
      return [];
    return items;
  });
  const selected = common_vendor.ref(-1);
  const gridStyle = common_vendor.computed(() => {
    return "width:" + props.width + ";background-color:" + bgColor.value + ";border-radius:" + formatSize(props.round) + ";";
  });
  function getColumns() {
    if (props.col <= 1)
      return 1;
    if (props.col >= 6)
      return 6;
    return props.col;
  }
  function getRows() {
    const columns = getColumns();
    const items = props.items;
    if (items == null)
      return 0;
    return Math.ceil(items.length / columns);
  }
  function getItemWidth() {
    const columns = getColumns();
    if (columns == 1)
      return "100%";
    if (columns == 2)
      return "50%";
    if (columns == 3)
      return "33.3333%";
    if (columns == 4)
      return "25%";
    if (columns == 5)
      return "20%";
    return "16.6667%";
  }
  function getItemStyle(index, item = null) {
    const columns = getColumns();
    const row = Math.floor(index / columns);
    const colIndex = index % columns;
    let style = "width:" + getItemWidth() + ";height:" + formatSize(props.itemHeight) + ";background-color:" + getItemBgColor(item) + ";";
    if (props.showBorder) {
      if (colIndex < columns - 1) {
        style = style + "border-right-width:1px;border-right-style:solid;border-right-color:" + props.borderColor + ";";
      }
      if (row < getRows() - 1) {
        style = style + "border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:" + props.borderColor + ";";
      }
    }
    return style;
  }
  function getIconStyle(item = null) {
    return "color:" + getItemIconColor(item) + ";font-size:" + formatSize(props.iconSize) + ";line-height:" + formatSize(props.iconSize) + ";";
  }
  function getImageStyle(item = null) {
    const size = formatSize(props.imageSize);
    return "width:" + size + ";height:" + size + ";";
  }
  function getTextStyle(item = null) {
    return "color:" + getItemTextColor(item) + ";font-size:" + formatSize(props.fontSize) + ";";
  }
  function buildPayload(item = null, index) {
    return new common_vendor.UTSJSONObject({
      index,
      name: getItemName(item),
      text: getItemText(item),
      icon: getItemIcon(item),
      image: getItemImage(item),
      url: getItemUrl(item)
    });
  }
  function select(item = null, index) {
    selected.value = index;
    const payload = buildPayload(item, index);
    emit("select", payload);
    emit("change", payload);
    emit("click", payload);
  }
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = {
      a: common_vendor.f(gridItems.value, (item, index, i0) => {
        return common_vendor.e({
          a: getItemImage(item).length > 0
        }, getItemImage(item).length > 0 ? {
          b: getItemImage(item),
          c: common_vendor.s(getImageStyle(item))
        } : getItemIcon(item).length > 0 ? {
          e: common_vendor.t(getItemIcon(item)),
          f: common_vendor.s(getIconStyle(item))
        } : {}, {
          d: getItemIcon(item).length > 0,
          g: common_vendor.t(getItemText(item)),
          h: common_vendor.s(getTextStyle(item)),
          i: index.toString() + "-" + getItemText(item),
          j: common_vendor.n(selected.value == index ? "i-grid__item i-grid__item--active" : "i-grid__item"),
          k: common_vendor.s(getItemStyle(index, item)),
          l: common_vendor.o(($event) => {
            return select(item, index);
          }, index.toString() + "-" + getItemText(item))
        });
      }),
      b: __props.isLink ? "i-grid__item--hover" : "none",
      c: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      d: common_vendor.s(gridStyle.value),
      e: common_vendor.s({
        "--status-bar-height": `${_ctx.u_s_b_h}px`,
        "--uni-safe-area-inset-bottom": `${_ctx.u_s_a_i_b}px`
      }),
      f: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
    };
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/i-ui-x/components/i-grid/i-grid.js.map
