"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvGap_components_uvGap_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-gap",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvGap_components_uvGap_props.props],
  computed: {
    gapStyle() {
      const style = new UTSJSONObject({
        backgroundColor: this.bgColor,
        height: this.$uv.addUnit(this.height),
        marginTop: this.$uv.addUnit(this.marginTop),
        marginBottom: this.$uv.addUnit(this.marginBottom)
      });
      return this.$uv.deepMerge(style, this.$uv.addStyle(this.customStyle));
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    b: common_vendor.s($options.gapStyle)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uv-gap/components/uv-gap/uv-gap.js.map
