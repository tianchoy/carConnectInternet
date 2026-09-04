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
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "i-action-sheet" }, { __name: "i-action-sheet", props: {
  show: { type: Boolean, default: false },
  title: { type: String, default: "" },
  titleStyle: { type: [String, Object], default: "" },
  closeable: { type: Boolean, default: false },
  description: { type: String, default: "" },
  actions: {
    type: Array,
    default() {
      return [];
    }
  },
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
}, emits: [
  "select",
  "close",
  "getuserinfo",
  "contact",
  "getphonenumber",
  "chooseavatar",
  "error",
  "launchapp",
  "opensetting",
  "update:show"
], setup(__props, _a) {
  var __expose = _a.expose, __emit = _a.emit;
  const props = __props;
  const emit = __emit;
  const innerShow = common_vendor.ref(props.show);
  function formatSize(value = null) {
    const text = value.toString();
    if (text.length == 0)
      return "0px";
    if (text.indexOf("vh") > -1 || text.indexOf("vw") > -1) {
      const numberValue = parseFloat(text.replace("vh", "").replace("vw", ""));
      return (isNaN(numberValue) ? 0 : numberValue) + "px";
    }
    if (text.indexOf("px") > -1 || text.indexOf("rpx") > -1 || text.indexOf("%") > -1) {
      return text;
    }
    return text + "px";
  }
  const titleStyleText = common_vendor.computed(() => {
    if (typeof props.titleStyle == "string")
      return props.titleStyle;
    return "";
  });
  const panelStyle = common_vendor.computed(() => {
    let style = "";
    style += "border-top-left-radius:" + formatSize(props.round) + ";";
    style += "border-top-right-radius:" + formatSize(props.round) + ";";
    if (props.height.toString().length > 0) {
      style += "height:" + formatSize(props.height) + ";";
    }
    if (typeof props.customStyle == "string") {
      style += props.customStyle;
    }
    return style;
  });
  common_vendor.watch(() => {
    return props.show;
  }, (value) => {
    innerShow.value = value;
  });
  function itemValue(item = null, keyName) {
    if (item == null)
      return "";
    if (typeof item == "object") {
      const object = item;
      const value = object[keyName];
      if (value == null)
        return "";
      return value.toString();
    }
    if (keyName == "name" || keyName == "value")
      return item.toString();
    return "";
  }
  function getActionText(item = null) {
    return itemValue(item, "name");
  }
  function getActionValue(item = null) {
    const value = itemValue(item, "value");
    if (value.length > 0)
      return value;
    return getActionText(item);
  }
  function getSubname(item = null) {
    return itemValue(item, "subname");
  }
  function getActionIcon(item = null) {
    return itemValue(item, "icon");
  }
  function getActionColor(item = null) {
    const color = itemValue(item, "color");
    if (color.length > 0)
      return color;
    return "#303133";
  }
  function isDisabled(item = null) {
    if (item == null)
      return false;
    if (typeof item == "object") {
      const object = item;
      return object["disabled"] == true;
    }
    return false;
  }
  function isLoading(item = null) {
    if (item == null)
      return false;
    if (typeof item == "object") {
      const object = item;
      return object["loading"] == true;
    }
    return false;
  }
  function getItemColor(item = null) {
    if (isDisabled(item))
      return "#b8b8b8";
    return getActionColor(item);
  }
  function getActionOpenType(item = null) {
    const itemOpenType = itemValue(item, "openType");
    if (itemOpenType.length > 0)
      return itemOpenType;
    return props.openType;
  }
  function getItemClass(item = null) {
    if (isDisabled(item)) {
      return "i-action-sheet__item i-action-sheet__item--disabled";
    }
    if (isLoading(item)) {
      return "i-action-sheet__item i-action-sheet__item--loading";
    }
    return "i-action-sheet__item";
  }
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
    if (!props.closeOnMask)
      return null;
    closeByUser();
  }
  function buildPayload(item = null, index) {
    return new common_vendor.UTSJSONObject({
      index,
      item,
      name: getActionText(item),
      value: getActionValue(item)
    });
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
  __expose({ open, close: closeByUser });
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: common_vendor.o(open, "e6"),
      b: innerShow.value
    }, innerShow.value ? {
      c: common_vendor.o(handleOverlayClick, "6b")
    } : {}, {
      d: innerShow.value
    }, innerShow.value ? common_vendor.e({
      e: __props.closeable
    }, __props.closeable ? {
      f: common_vendor.o(closeByUser, "33")
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
      m: common_vendor.f(__props.actions, (item, index, i0) => {
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
      x: common_vendor.o(closeByUser, "89")
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
