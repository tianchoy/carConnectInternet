"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Array) {
  const _easycom_i_icon_1 = common_vendor.resolveComponent("i-icon");
  _easycom_i_icon_1();
}
const _easycom_i_icon = () => "../i-icon/i-icon.js";
if (!Math) {
  _easycom_i_icon();
}
class ActionPayload extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          index: { type: Number, optional: false },
          item: { type: "Any", optional: false },
          name: { type: String, optional: false },
          value: { type: String, optional: false }
        };
      },
      name: "ActionPayload"
    };
  }
  constructor(options, metadata = ActionPayload.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.index = this.__props__.index;
    this.item = this.__props__.item;
    this.name = this.__props__.name;
    this.value = this.__props__.value;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-action-sheet" }, { __name: "i-action-sheet", props: {
  show: { type: Boolean, default: false },
  title: { type: String, default: "" },
  titleStyle: { type: [String, Object], default: "" },
  closeable: { type: Boolean, default: false },
  description: { type: String, default: "" },
  actions: { type: Array, default() {
    return [];
  } },
  cancelText: { type: String, default: "" },
  closeOnClickAction: { type: Boolean, default: true },
  safeBottom: { type: Boolean, default: true },
  openType: { type: String, default: "" },
  closeOnMask: { type: Boolean, default: true },
  height: { type: [String, Number], default: "" },
  round: { type: [String, Number], default: 10 },
  lang: { type: String, default: "en" },
  sessionFrom: { type: String, default: "" },
  sendMessageTitle: { type: String, default: "" },
  sendMessagePath: { type: String, default: "" },
  sendMessageImg: { type: String, default: "" },
  showMessageCard: { type: Boolean, default: false },
  appParameter: { type: String, default: "" },
  customStyle: { type: [String, Object], default: "" }
}, emits: ["select", "close", "getuserinfo", "contact", "getphonenumber", "chooseavatar", "error", "launchapp", "opensetting", "update:show"], setup(__props, _a) {
  var __expose = _a.expose, __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  function formatSize(value) {
    const text = value.toString();
    if (text.length == 0)
      return "0px";
    if (text.indexOf("vh") >= 0 || text.indexOf("vw") >= 0) {
      const parsed = parseFloat(text.replace("vh", "").replace("vw", ""));
      return (isNaN(parsed) ? 0 : Number.from(parsed)).toString() + "px";
    }
    if (text.indexOf("px") >= 0 || text.indexOf("rpx") >= 0 || text.indexOf("%") >= 0)
      return text;
    return text + "px";
  }
  function itemValue(item = null, keyName) {
    if (item == null)
      return "";
    if (typeof item == "object") {
      const value = item[keyName];
      return value == null ? "" : value.toString();
    }
    if (keyName == "name" || keyName == "value")
      return item.toString();
    return "";
  }
  function itemBoolean(item = null, keyName) {
    if (item == null || typeof item != "object")
      return false;
    const value = item[keyName];
    return value === true || value === 1 || value === "1" || value === "true";
  }
  function getActionText(item = null) {
    return itemValue(item, "name");
  }
  function getActionValue(item = null) {
    const value = itemValue(item, "value");
    return value.length > 0 ? value : getActionText(item);
  }
  function getSubname(item = null) {
    return itemValue(item, "subname");
  }
  function getActionIcon(item = null) {
    return itemValue(item, "icon");
  }
  function getActionColor(item = null) {
    const color = itemValue(item, "color");
    return color.length > 0 ? color : "#303133";
  }
  function isDisabled(item = null) {
    return itemBoolean(item, "disabled");
  }
  function isLoading(item = null) {
    return itemBoolean(item, "loading");
  }
  function getItemColor(item = null) {
    return isDisabled(item) ? "#b8b8b8" : getActionColor(item);
  }
  function getActionOpenType(item = null) {
    const itemOpenType = itemValue(item, "openType");
    return itemOpenType.length > 0 ? itemOpenType : props.openType;
  }
  function getItemClass(item = null) {
    if (isDisabled(item))
      return "i-action-sheet__item i-action-sheet__item--disabled";
    return isLoading(item) ? "i-action-sheet__item i-action-sheet__item--loading" : "i-action-sheet__item";
  }
  function buildPayload(item = null, index) {
    return new ActionPayload({ index, item, name: getActionText(item), value: getActionValue(item) });
  }
  const actionItems = common_vendor.computed(() => {
    const actions = props.actions;
    if (actions == null)
      return [];
    return actions;
  });
  const innerShow = common_vendor.ref(props.show);
  function open() {
    if (innerShow.value)
      return null;
    innerShow.value = true;
    emit("update:show", true);
  }
  function closeSilently() {
    if (!innerShow.value)
      return null;
    innerShow.value = false;
    emit("update:show", false);
  }
  function closeByUser() {
    if (!innerShow.value)
      return null;
    innerShow.value = false;
    emit("close");
    emit("update:show", false);
  }
  function handleOverlayClick() {
    if (props.closeOnMask)
      closeByUser();
  }
  function handleSelect(item = null, index) {
    if (isDisabled(item) || isLoading(item))
      return null;
    emit("select", buildPayload(item, index));
    if (props.closeOnClickAction)
      closeSilently();
  }
  function handleOpenEvent(name, event = null) {
    emit(name, event);
  }
  const titleStyleText = common_vendor.computed(() => {
    return typeof props.titleStyle == "string" ? props.titleStyle : "";
  });
  const panelStyle = common_vendor.computed(() => {
    let style = "border-top-left-radius:" + formatSize(props.round) + ";border-top-right-radius:" + formatSize(props.round) + ";";
    if (props.height.toString().length > 0)
      style += "height:" + formatSize(props.height) + ";";
    if (typeof props.customStyle == "string")
      style += props.customStyle;
    return style;
  });
  common_vendor.watch(() => {
    return props.show;
  }, (value) => {
    innerShow.value = value;
  });
  __expose({ open, close: closeByUser });
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: common_vendor.o(open, "e6"),
      b: innerShow.value
    }, innerShow.value ? {
      c: common_vendor.o(handleOverlayClick, "11")
    } : {}, {
      d: innerShow.value
    }, innerShow.value ? common_vendor.e({
      e: __props.closeable
    }, __props.closeable ? {
      f: common_vendor.o(closeByUser, "a4")
    } : {}, {
      g: __props.title.length > 0 || __props.description.length > 0
    }, __props.title.length > 0 || __props.description.length > 0 ? common_vendor.e({
      h: __props.title.length > 0
    }, __props.title.length > 0 ? {
      i: common_vendor.t(__props.title),
      j: common_vendor.s(titleStyleText.value)
    } : {}, {
      k: __props.description.length > 0
    }, __props.description.length > 0 ? {
      l: common_vendor.t(__props.description)
    } : {}) : {}, {
      m: common_vendor.f(actionItems.value, (item, index, i0) => {
        return common_vendor.e({
          a: getActionIcon(item).length > 0
        }, getActionIcon(item).length > 0 ? {
          b: "4c8f4bbc-0-" + i0,
          c: common_vendor.p({
            name: getActionIcon(item),
            fontSize: "17",
            color: getItemColor(item),
            class: "i-action-sheet__icon"
          })
        } : {}, {
          d: common_vendor.t(getActionText(item)),
          e: common_vendor.s("color:" + getItemColor(item)),
          f: getSubname(item).length > 0
        }, getSubname(item).length > 0 ? {
          g: common_vendor.t(getSubname(item))
        } : {}, {
          h: isLoading(item)
        }, isLoading(item) ? {} : {}, {
          i: index.toString() + "-" + getActionText(item),
          j: common_vendor.n(getItemClass(item)),
          k: isDisabled(item) || isLoading(item),
          l: getActionOpenType(item),
          m: common_vendor.o(($event) => {
            return handleSelect(item, index);
          }, index.toString() + "-" + getActionText(item)),
          n: common_vendor.o(($event) => {
            return handleOpenEvent("getuserinfo", $event);
          }, index.toString() + "-" + getActionText(item)),
          o: common_vendor.o(($event) => {
            return handleOpenEvent("contact", $event);
          }, index.toString() + "-" + getActionText(item)),
          p: common_vendor.o(($event) => {
            return handleOpenEvent("getphonenumber", $event);
          }, index.toString() + "-" + getActionText(item)),
          q: common_vendor.o(($event) => {
            return handleOpenEvent("chooseavatar", $event);
          }, index.toString() + "-" + getActionText(item)),
          r: common_vendor.o(($event) => {
            return handleOpenEvent("error", $event);
          }, index.toString() + "-" + getActionText(item)),
          s: common_vendor.o(($event) => {
            return handleOpenEvent("launchapp", $event);
          }, index.toString() + "-" + getActionText(item)),
          t: common_vendor.o(($event) => {
            return handleOpenEvent("opensetting", $event);
          }, index.toString() + "-" + getActionText(item))
        });
      }),
      n: __props.appParameter,
      o: __props.lang,
      p: __props.sessionFrom,
      q: __props.sendMessageTitle,
      r: __props.sendMessagePath,
      s: __props.sendMessageImg,
      t: __props.showMessageCard,
      v: __props.cancelText.length > 0
    }, __props.cancelText.length > 0 ? {
      w: common_vendor.t(__props.cancelText),
      x: common_vendor.o(closeByUser, "50")
    } : {}, {
      y: props.safeBottom
    }, props.safeBottom ? {} : {}, {
      z: common_vendor.s(panelStyle.value)
    }) : {}, {
      A: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      B: `${_ctx.u_s_b_h}px`,
      C: `${_ctx.u_s_a_i_b}px`,
      D: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
    });
    return __returned__;
  };
} }));
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/i-ui-x/components/i-action-sheet/i-action-sheet.js.map
