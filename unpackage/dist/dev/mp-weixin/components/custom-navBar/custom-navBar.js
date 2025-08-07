"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  _easycom_uv_icon_1();
}
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
if (!Math) {
  _easycom_uv_icon();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "custom-navBar",
  props: {
    title: String,
    showBack: { type: Boolean, default: true },
    backText: { type: String, default: "" },
    showCapsule: { type: Boolean, default: true },
    backgroundColor: { type: String, default: "#ffffff" },
    textColor: { type: String, default: "#000000" },
    isIcon: { type: Boolean, default: true },
    rightText: { type: String, default: "" }
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
          common_vendor.index.__f__("log", "at components/custom-navBar/custom-navBar.uvue:59", "menuRect", menuRect);
          menuButtonInfo.value = menuRect;
          const gap = menuRect.top - statusBarHeight.value;
          navBarHeight.value = gap * 2 + menuRect.height + 4;
        }
      } catch (e) {
        common_vendor.index.__f__("warn", "at components/custom-navBar/custom-navBar.uvue:65", "胶囊按钮信息获取失败", e);
      }
    };
    const handleBack = () => {
      const pages = getCurrentPages();
      common_vendor.index.__f__("log", "at components/custom-navBar/custom-navBar.uvue:72", "back", pages.length);
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
        c: common_assets._imports_0$2,
        d: common_vendor.o(handleBack)
      }) : new UTSJSONObject({}), new UTSJSONObject({
        e: common_vendor.t(__props.title),
        f: __props.textColor,
        g: common_vendor.unref(navBarHeight) + "px",
        h: __props.showCapsule
      }), __props.showCapsule ? common_vendor.e(new UTSJSONObject({
        i: __props.isIcon
      }), __props.isIcon ? new UTSJSONObject({
        j: common_vendor.p(new UTSJSONObject({
          name: "grid",
          size: "28"
        }))
      }) : new UTSJSONObject({
        k: common_vendor.t(__props.rightText)
      }), new UTSJSONObject({
        l: common_vendor.o(($event = null) => {
          return emit("capsuleClick", "menu");
        })
      })) : new UTSJSONObject({}), new UTSJSONObject({
        m: "170rpx",
        n: common_vendor.unref(navBarHeight) + "px",
        o: __props.backgroundColor
      }));
      return __returned__;
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-11b89787"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/custom-navBar/custom-navBar.js.map
