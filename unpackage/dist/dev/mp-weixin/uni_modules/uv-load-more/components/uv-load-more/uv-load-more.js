"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvLoadMore_components_uvLoadMore_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-loadmore",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvLoadMore_components_uvLoadMore_props.props],
  data() {
    return {
      // 粗点
      dotText: "●"
    };
  },
  computed: {
    // 加载的文字显示的样式
    loadTextStyle() {
      return new common_vendor.UTSJSONObject({
        color: this.color,
        fontSize: this.$uv.addUnit(this.fontSize),
        lineHeight: this.$uv.addUnit(this.fontSize),
        backgroundColor: this.bgColor
      });
    },
    // 显示的提示文字
    showText() {
      let text = "";
      if (this.status == "loadmore")
        text = this.loadmoreText;
      else if (this.status == "loading")
        text = this.loadingText;
      else if (this.status == "nomore" && this.isDot)
        text = this.dotText;
      else
        text = this.nomoreText;
      return text;
    }
  },
  methods: {
    loadMore() {
      if (this.status == "loadmore")
        this.$emit("loadmore");
    }
  }
});
if (!Array) {
  const _easycom_uv_line2 = common_vendor.resolveComponent("uv-line");
  const _easycom_uv_loading_icon2 = common_vendor.resolveComponent("uv-loading-icon");
  (_easycom_uv_line2 + _easycom_uv_loading_icon2)();
}
const _easycom_uv_line = () => "../../../uv-line/components/uv-line/uv-line.js";
const _easycom_uv_loading_icon = () => "../../../uv-loading-icon/components/uv-loading-icon/uv-loading-icon.js";
if (!Math) {
  (_easycom_uv_line + _easycom_uv_loading_icon)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: _ctx.line
  }, _ctx.line ? {
    b: common_vendor.p({
      length: "140rpx",
      color: _ctx.lineColor,
      hairline: false,
      dashed: _ctx.dashed,
      class: "data-v-1078b33c"
    })
  } : {}, {
    c: _ctx.status === "loading" && _ctx.icon
  }, _ctx.status === "loading" && _ctx.icon ? {
    d: common_vendor.p({
      color: _ctx.iconColor,
      size: _ctx.iconSize,
      mode: _ctx.loadingIcon,
      class: "data-v-1078b33c"
    })
  } : {}, {
    e: common_vendor.t($options.showText),
    f: common_vendor.s($options.loadTextStyle),
    g: common_vendor.n(_ctx.status == "nomore" && _ctx.isDot == true ? "uv-loadmore__content__dot-text" : "uv-loadmore__content__text"),
    h: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args), "41"),
    i: common_vendor.n(_ctx.status == "loadmore" || _ctx.status == "nomore" ? "uv-more" : ""),
    j: _ctx.line
  }, _ctx.line ? {
    k: common_vendor.p({
      length: "140rpx",
      color: _ctx.lineColor,
      hairline: false,
      dashed: _ctx.dashed,
      class: "data-v-1078b33c"
    })
  } : {}, {
    l: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    m: common_vendor.s({
      backgroundColor: _ctx.bgColor,
      marginBottom: _ctx.$uv.addUnit(_ctx.marginBottom),
      marginTop: _ctx.$uv.addUnit(_ctx.marginTop),
      height: _ctx.$uv.addUnit(_ctx.height)
    }),
    n: common_vendor.s(_ctx.$uv.addStyle(_ctx.customStyle)),
    o: common_vendor.s({
      "--status-bar-height": `${_ctx.u_s_b_h}px`
    }),
    p: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1078b33c"]]);
wx.createComponent(Component);
