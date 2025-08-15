"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvReadMore_components_uvReadMore_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-read-more",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvReadMore_components_uvReadMore_props.props],
  data() {
    return {
      isLongContent: false,
      status: "close",
      elId: "",
      contentHeight: 100
      // 内容高度
    };
  },
  computed: {
    // 展开后无需阴影，收起时才需要阴影样式
    innerShadowStyle() {
      if (this.status === "open")
        return new UTSJSONObject({});
      else
        return this.shadowStyle;
    }
  },
  created() {
    this.elId = this.$uv.guid();
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        this.getContentHeight().then((height = null) => {
          this.contentHeight = height;
          if (height > this.$uv.getPx(this.showHeight)) {
            this.isLongContent = true;
            this.status = "close";
          }
        });
      });
    },
    // 获取内容的高度
    getContentHeight() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        yield this.$uv.sleep(30);
        return new Promise((resolve) => {
          this.$uvGetRect("." + this.elId).then((res = null) => {
            resolve(res.height);
          });
        });
      });
    },
    // 展开或者收起
    toggleReadMore() {
      this.status = this.status === "close" ? "open" : "close";
      if (this.toggle == false)
        this.isLongContent = false;
      this.$emit(this.status, this.name);
    }
  }
});
if (!Array) {
  const _easycom_uv_text2 = common_vendor.resolveComponent("uv-text");
  const _easycom_uv_icon2 = common_vendor.resolveComponent("uv-icon");
  (_easycom_uv_text2 + _easycom_uv_icon2)();
}
const _easycom_uv_text = () => "../../../uv-text/components/uv-text/uv-text.js";
const _easycom_uv_icon = () => "../../../uv-icon/components/uv-icon/uv-icon.js";
if (!Math) {
  (_easycom_uv_text + _easycom_uv_icon)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.sei("r0-d91f31a6", "view", "uv-read-more__content__inner"),
    b: common_vendor.n($data.elId),
    c: $data.isLongContent && $data.status === "close" ? _ctx.$uv.addUnit(_ctx.showHeight) : _ctx.$uv.addUnit($data.contentHeight, "px"),
    d: _ctx.textIndent,
    e: $data.isLongContent
  }, $data.isLongContent ? {
    f: common_vendor.p({
      text: $data.status === "close" ? _ctx.closeText : _ctx.openText,
      color: _ctx.color,
      size: _ctx.fontSize,
      lineHeight: _ctx.fontSize,
      margin: "0 5px 0 0"
    }),
    g: common_vendor.p({
      color: _ctx.color,
      size: _ctx.fontSize + 2,
      name: $data.status === "close" ? "arrow-down" : "arrow-up"
    }),
    h: common_vendor.o((...args) => $options.toggleReadMore && $options.toggleReadMore(...args)),
    i: common_vendor.s($options.innerShadowStyle)
  } : {}, {
    j: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d91f31a6"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uv-read-more/components/uv-read-more/uv-read-more.js.map
