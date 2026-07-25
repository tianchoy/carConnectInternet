"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_modal = require("../../utils/modal.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(Object.assign({ name: "app-modal" }, { __name: "app-modal", setup(__props) {
  const visible = common_vendor.ref(false);
  const contentNeedsScroll = common_vendor.ref(false);
  const scrollTop = common_vendor.ref(0);
  const options = common_vendor.reactive(new common_vendor.UTSJSONObject({
    title: "",
    content: "",
    showCancel: true,
    confirmText: "确定",
    cancelText: "取消"
  }));
  const show = (value) => {
    var _a, _b, _c, _d, _f;
    options.title = (_a = value.title) !== null && _a !== void 0 ? _a : "";
    options.content = (_b = value.content) !== null && _b !== void 0 ? _b : "";
    options.showCancel = (_c = value.showCancel) !== null && _c !== void 0 ? _c : true;
    options.confirmText = (_d = value.confirmText) !== null && _d !== void 0 ? _d : "确定";
    options.cancelText = (_f = value.cancelText) !== null && _f !== void 0 ? _f : "取消";
    options.success = value.success;
    contentNeedsScroll.value = options.content.length > 260;
    scrollTop.value = 0;
    visible.value = true;
  };
  const close = (confirm) => {
    const success = options.success;
    visible.value = false;
    options.success = null;
    if (success != null) {
      const result = new utils_modal.AppModalSuccess();
      result.confirm = confirm;
      result.cancel = !confirm;
      success(result);
    }
  };
  utils_modal.registerAppModalHandler(show);
  common_vendor.onUnmounted(() => {
    utils_modal.unregisterAppModalHandler(show);
  });
  return (_ctx, _cache) => {
    "raw js";
    const __returned__ = common_vendor.e({
      a: visible.value
    }, visible.value ? common_vendor.e({
      b: options.title
    }, options.title ? {
      c: common_vendor.t(options.title)
    } : {}, {
      d: contentNeedsScroll.value
    }, contentNeedsScroll.value ? {
      e: common_vendor.t(options.content),
      f: scrollTop.value
    } : {
      g: common_vendor.t(options.content)
    }, {
      h: options.showCancel
    }, options.showCancel ? {
      i: common_vendor.t(options.cancelText),
      j: common_vendor.o(($event) => {
        return close(false);
      }, "28")
    } : {}, {
      k: common_vendor.t(options.confirmText),
      l: common_vendor.o(($event) => {
        return close(true);
      }, "4d"),
      m: common_vendor.o(() => {
      }, "cd"),
      n: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
      o: `${_ctx.u_s_b_h}px`,
      p: `${_ctx.u_s_a_i_b}px`,
      q: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
    }) : {});
    return __returned__;
  };
} }));
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3ff1a49c"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/app-modal/app-modal.js.map
