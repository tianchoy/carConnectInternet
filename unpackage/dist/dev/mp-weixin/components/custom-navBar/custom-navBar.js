"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "custom-navBar",
  props: {
    title: String,
    showBack: new UTSJSONObject({ type: Boolean, default: true }),
    backText: new UTSJSONObject({ type: String, default: "" }),
    showCapsule: new UTSJSONObject({ type: Boolean, default: true }),
    backgroundColor: new UTSJSONObject({ type: String, default: "#ffffff" }),
    textColor: new UTSJSONObject({ type: String, default: "#000000" })
  },
  emits: ["back", "capsuleClick"],
  setup(__props, _a) {
    var __emit = _a.emit;
    const emit = __emit;
    const statusBarHeight = common_vendor.ref(20);
    const navBarHeight = common_vendor.ref(44);
    const menuButtonInfo = common_vendor.ref(new UTSJSONObject({
      top: 4,
      right: 10,
      width: 87,
      height: 32
    }));
    const initDimensions = () => {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = systemInfo.statusBarHeight || 20;
      try {
        const menuRect = common_vendor.index.getMenuButtonBoundingClientRect();
        if (menuRect) {
          common_vendor.index.__f__("log", "at components/custom-navBar/custom-navBar.uvue:53", menuRect);
          menuButtonInfo.value = menuRect;
          const gap = menuRect.top - statusBarHeight.value;
          navBarHeight.value = gap * 2 + menuRect.height + 4;
        }
      } catch (e) {
        common_vendor.index.__f__("warn", "at components/custom-navBar/custom-navBar.uvue:60", "胶囊按钮信息获取失败", e);
      }
    };
    const handleBack = () => {
      const pages = getCurrentPages();
      common_vendor.index.__f__("log", "at components/custom-navBar/custom-navBar.uvue:67", "back", pages.length);
      if (pages.length > 1) {
        common_vendor.index.navigateBack();
      } else {
        common_vendor.index.switchTab({ url: "/pages/index/index" });
      }
      emit("back");
    };
    common_vendor.onMounted(initDimensions);
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: common_vendor.unref(statusBarHeight) + "px",
        b: __props.showBack
      }), __props.showBack ? new UTSJSONObject({
        c: common_assets._imports_0$1,
        d: common_vendor.o(handleBack)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        e: common_vendor.t(__props.title),
        f: __props.textColor,
        g: common_vendor.unref(navBarHeight) + "px",
        h: __props.showCapsule
      }), __props.showCapsule ? new UTSJSONObject({
        i: common_assets._imports_1,
        j: common_vendor.o(($event = null) => {
          return emit("capsuleClick", "menu");
        }),
        k: "170rpx"
      }) : new UTSJSONObject({}), new UTSJSONObject({
        l: common_vendor.unref(navBarHeight) + "px",
        m: __props.backgroundColor
      }));
      return __returned__;
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-11b89787"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/custom-navBar/custom-navBar.js.map
