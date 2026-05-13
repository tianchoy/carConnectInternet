"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvLineProgress_components_uvLineProgress_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-line-progress",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvLineProgress_components_uvLineProgress_props.props],
  data() {
    return {
      lineWidth: 0
    };
  },
  watch: {
    percentage(n = null) {
      this.resizeProgressWidth();
    }
  },
  computed: {
    progressStyle() {
      let style = new common_vendor.UTSJSONObject({});
      style.width = this.lineWidth;
      style.backgroundColor = this.activeColor;
      style.height = this.$uv.addUnit(this.$uv.getPx(this.height));
      return style;
    },
    innserPercentage() {
      return this.$uv.range(0, 100, this.percentage);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$uv.sleep(20).then(() => {
        this.resizeProgressWidth();
      });
    },
    getProgressWidth() {
      return this.$uvGetRect(".uv-line-progress__background");
    },
    resizeProgressWidth() {
      this.getProgressWidth().then((size = null) => {
        const width = size.width;
        this.lineWidth = width * this.innserPercentage / 100 + "px";
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: common_vendor.sei("r0-435a5d4d", "view", "uv-line-progress__background"),
    b: common_vendor.s({
      backgroundColor: _ctx.inactiveColor,
      height: _ctx.$uv.addUnit(_ctx.$uv.getPx(_ctx.height))
    }),
    c: _ctx.showText && _ctx.percentage >= 10
  }, _ctx.showText && _ctx.percentage >= 10 ? {
    d: common_vendor.t($options.innserPercentage + "%")
  } : {}, {
    e: common_vendor.s($options.progressStyle),
    f: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    g: common_vendor.s(_ctx.$uv.addStyle(_ctx.customStyle)),
    h: common_vendor.s({
      "--status-bar-height": `${_ctx.u_s_b_h}px`,
      "--uni-safe-area-inset-bottom": `${_ctx.u_s_a_i_b}px`
    }),
    i: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-435a5d4d"]]);
wx.createComponent(Component);
