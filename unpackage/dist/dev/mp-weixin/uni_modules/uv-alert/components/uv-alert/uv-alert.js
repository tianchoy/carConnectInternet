"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvAlert_components_uvAlert_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-alert",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvAlert_components_uvAlert_props.props],
  emits: ["click"],
  data() {
    return {
      show: true
    };
  },
  computed: {
    iconColor() {
      return this.effect === "light" ? this.type : "#fff";
    },
    // 不同主题对应不同的图标
    iconName() {
      switch (this.type) {
        case "success":
          return "checkmark-circle-fill";
        case "error":
          return "close-circle-fill";
        case "warning":
          return "error-circle-fill";
        case "info":
          return "info-circle-fill";
        case "primary":
          return "more-circle-fill";
        default:
          return "error-circle-fill";
      }
    }
  },
  methods: {
    // 点击内容
    clickHandler() {
      this.$emit("click");
    },
    // 点击关闭按钮
    closeHandler() {
      this.show = false;
    }
  }
});
if (!Array) {
  const _easycom_uv_icon2 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_transition2 = common_vendor.resolveComponent("uv-transition");
  (_easycom_uv_icon2 + _easycom_uv_transition2)();
}
const _easycom_uv_icon = () => "../../../uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_transition = () => "../../../uv-transition/components/uv-transition/uv-transition.js";
if (!Math) {
  (_easycom_uv_icon + _easycom_uv_transition)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: _ctx.showIcon
  }, _ctx.showIcon ? {
    b: common_vendor.p({
      name: $options.iconName,
      size: "18",
      color: $options.iconColor
    })
  } : {}, {
    c: _ctx.title
  }, _ctx.title ? {
    d: common_vendor.t(_ctx.title),
    e: common_vendor.s({
      fontSize: _ctx.$uv.addUnit(_ctx.fontSize),
      textAlign: _ctx.center ? "center" : "left"
    }),
    f: common_vendor.n(_ctx.effect === "dark" ? "uv-alert__text--dark" : `uv-alert__text--${_ctx.type}--light`)
  } : {}, {
    g: _ctx.description
  }, _ctx.description ? {
    h: common_vendor.t(_ctx.description),
    i: common_vendor.s({
      fontSize: _ctx.$uv.addUnit(_ctx.fontSize),
      textAlign: _ctx.center ? "center" : "left"
    }),
    j: common_vendor.n(_ctx.effect === "dark" ? "uv-alert__text--dark" : `uv-alert__text--${_ctx.type}--light`)
  } : {}, {
    k: common_vendor.s({
      paddingRight: _ctx.closable ? "20px" : 0
    }),
    l: _ctx.closable
  }, _ctx.closable ? {
    m: common_vendor.p({
      name: "close",
      color: $options.iconColor,
      size: "15"
    }),
    n: common_vendor.o((...args) => $options.closeHandler && $options.closeHandler(...args))
  } : {}, {
    o: common_vendor.n(`uv-alert--${_ctx.type}--${_ctx.effect}`),
    p: common_vendor.o((...args) => $options.clickHandler && $options.clickHandler(...args)),
    q: common_vendor.s(_ctx.$uv.addStyle(_ctx.customStyle)),
    r: common_vendor.gei(_ctx, ""),
    s: common_vendor.p({
      mode: "fade",
      show: $data.show,
      id: common_vendor.gei(_ctx, "")
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-af294ec0"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uv-alert/components/uv-alert/uv-alert.js.map
