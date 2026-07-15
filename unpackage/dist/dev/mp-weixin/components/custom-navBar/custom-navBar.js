"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_i_icon_1 = common_vendor.resolveComponent("i-icon");
  _easycom_i_icon_1();
}
const _easycom_i_icon = () => "../../uni_modules/i-ui-x/components/i-icon/i-icon.js";
if (!Math) {
  _easycom_i_icon();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "custom-navBar",
  props: {
    title: String,
    showBack: { type: Boolean, default: true },
    backText: { type: String, default: "" },
    showCapsule: { type: Boolean, default: true },
    backgroundColor: { type: String, default: "#f1f1f1" },
    textColor: { type: String, default: "#000000" },
    isIcon: { type: Boolean, default: true },
    Icon: { type: String, default: "plus-circle" },
    rightText: { type: String, default: "" },
    isShowStyle: { type: Boolean, default: false },
    iconColor: { type: String, default: "#606266" }
  },
  emits: ["back", "capsuleClick"],
  setup(__props, _a) {
    var __emit = _a.emit;
    const emit = __emit;
    const statusBarHeight = common_vendor.ref(20);
    const navBarHeight = common_vendor.ref(44);
    const menuButtonInfo = common_vendor.ref(new common_vendor.UTSJSONObject({
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
          menuButtonInfo.value = menuRect;
          const gap = menuRect.top - statusBarHeight.value;
          navBarHeight.value = gap * 2 + menuRect.height + 4;
        }
      } catch (e) {
        console.warn("胶囊按钮信息获取失败", e);
      }
    };
    const handleBack = () => {
      const pages = getCurrentPages();
      if (pages.length > 1) {
        common_vendor.index.navigateBack();
      } else {
        common_vendor.index.switchTab({ url: "/pages/index/index" });
      }
      emit("back");
    };
    common_vendor.onMounted(initDimensions);
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.s(__props.isShowStyle ? {
          height: common_vendor.unref(statusBarHeight) + "px",
          "background-color": "#f1f1f1",
          position: "fixed",
          width: "100%",
          letf: 0,
          top: 0,
          "z-index": "100"
        } : {
          height: common_vendor.unref(statusBarHeight) + "px",
          "background-color": "#f1f1f1"
        }),
        b: common_vendor.s({
          "--status-bar-height": `${_ctx.u_s_b_h}px`,
          "--uni-safe-area-inset-bottom": `${_ctx.u_s_a_i_b}px`
        }),
        c: __props.showBack
      }, __props.showBack ? {
        d: common_assets._imports_0$3,
        e: common_vendor.o(handleBack, "67")
      } : {}, {
        f: common_vendor.t(__props.title),
        g: __props.textColor,
        h: common_vendor.unref(navBarHeight) + "px",
        i: __props.showCapsule
      }, __props.showCapsule ? common_vendor.e({
        j: __props.isIcon
      }, __props.isIcon ? {
        k: common_vendor.o(_ctx.toDeviceList, "b6"),
        l: common_vendor.p({
          name: __props.Icon,
          fontSize: "20",
          class: "data-v-11b89787"
        })
      } : {
        m: common_vendor.t(__props.rightText)
      }, {
        n: common_vendor.o(($event) => {
          return emit("capsuleClick", "menu");
        }, "c4")
      }) : {}, {
        o: "200rpx",
        p: common_vendor.s(__props.isShowStyle ? {
          height: common_vendor.unref(navBarHeight) + "px",
          background: __props.backgroundColor,
          position: "fixed",
          width: "100%",
          letf: "0",
          top: common_vendor.unref(statusBarHeight) + "px",
          "z-index": "100"
        } : {
          height: common_vendor.unref(navBarHeight) + "px",
          background: __props.backgroundColor
        }),
        q: common_vendor.s({
          "--status-bar-height": `${_ctx.u_s_b_h}px`,
          "--uni-safe-area-inset-bottom": `${_ctx.u_s_a_i_b}px`
        })
      });
      return __returned__;
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-11b89787"]]);
wx.createComponent(Component);
