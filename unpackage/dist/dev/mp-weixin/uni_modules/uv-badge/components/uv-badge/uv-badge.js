"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvBadge_components_uvBadge_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-badge",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvBadge_components_uvBadge_props.props],
  computed: {
    // 是否将badge中心与父组件右上角重合
    boxStyle() {
      let style = new UTSJSONObject({});
      return style;
    },
    // 整个组件的样式
    badgeStyle() {
      const style = new UTSJSONObject({});
      if (this.color) {
        style.color = this.color;
      }
      if (this.bgColor && !this.inverted) {
        style.backgroundColor = this.bgColor;
      }
      if (this.absolute) {
        style.position = "absolute";
        if (this.offset.length) {
          const top_1 = this.offset[0];
          const right = this.offset[1] || top_1;
          style.top = this.$uv.addUnit(top_1);
          style.right = this.$uv.addUnit(right);
        }
      }
      return style;
    },
    showValue() {
      switch (this.numberType) {
        case "overflow":
          return Number(this.value) > Number(this.max) ? this.max + "+" : this.value;
        case "ellipsis":
          return Number(this.value) > Number(this.max) ? "..." : this.value;
        case "limit":
          return Number(this.value) > 999 ? Number(this.value) >= 9999 ? Math.floor(this.value / 1e4 * 100) / 100 + "w" : Math.floor(this.value / 1e3 * 100) / 100 + "k" : this.value;
        default:
          return Number(this.value);
      }
    },
    propsType() {
      return this.type || "error";
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.show && ((Number(_ctx.value) === 0 ? _ctx.showZero : true) || _ctx.isDot)
  }, _ctx.show && ((Number(_ctx.value) === 0 ? _ctx.showZero : true) || _ctx.isDot) ? {
    b: common_vendor.t(_ctx.isDot ? "" : $options.showValue),
    c: common_vendor.sei(common_vendor.gei(_ctx, ""), "text"),
    d: common_vendor.n(_ctx.isDot ? "uv-badge--dot" : "uv-badge--not-dot"),
    e: common_vendor.n(_ctx.inverted && "uv-badge--inverted"),
    f: common_vendor.n(_ctx.shape === "horn" && "uv-badge--horn"),
    g: common_vendor.n(`uv-badge--${$options.propsType}${_ctx.inverted ? "--inverted" : ""}`),
    h: common_vendor.s(_ctx.$uv.addStyle(_ctx.customStyle)),
    i: common_vendor.s($options.badgeStyle)
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-91e4945b"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uv-badge/components/uv-badge/uv-badge.js.map
