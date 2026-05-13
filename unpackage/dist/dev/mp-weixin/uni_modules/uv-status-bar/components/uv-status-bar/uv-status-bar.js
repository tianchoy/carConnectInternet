"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvStatusBar_components_uvStatusBar_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-status-bar",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvStatusBar_components_uvStatusBar_props.props],
  data() {
    return {};
  },
  computed: {
    style() {
      const style = new common_vendor.UTSJSONObject(
        {}
        // 状态栏高度，由于某些安卓和微信开发工具无法识别css的顶部状态栏变量，所以使用js获取的方式
      );
      style.height = this.$uv.addUnit(this.$uv.sys().statusBarHeight, "px");
      if (this.bgColor) {
        if (this.bgColor.indexOf("gradient") > -1) {
          style.backgroundImage = this.bgColor;
        } else {
          style.background = this.bgColor;
        }
      }
      return this.$uv.deepMerge(style, this.$uv.addStyle(this.customStyle));
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    b: common_vendor.s($options.style),
    c: common_vendor.s({
      "--status-bar-height": `${_ctx.u_s_b_h}px`,
      "--uni-safe-area-inset-bottom": `${_ctx.u_s_a_i_b}px`
    }),
    d: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f5bd6f5a"]]);
wx.createComponent(Component);
