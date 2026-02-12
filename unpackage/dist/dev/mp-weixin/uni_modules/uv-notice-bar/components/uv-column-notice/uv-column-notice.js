"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvNoticeBar_components_uvColumnNotice_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  emits: ["click", "close", "change"],
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvNoticeBar_components_uvColumnNotice_props.props],
  watch: {
    text: {
      immediate: true,
      handler(newValue = null, oldValue = null) {
        if (!this.$uv.test.array(newValue)) {
          this.$uv.error("noticebar组件direction为column时，要求text参数为数组形式");
        }
      }
    }
  },
  computed: {
    // 文字内容的样式
    textStyle() {
      let style = new common_vendor.UTSJSONObject({});
      style.color = this.color;
      style.fontSize = this.$uv.addUnit(this.fontSize);
      return style;
    },
    // 垂直或者水平滚动
    vertical() {
      if (this.mode == "horizontal")
        return false;
      else
        return true;
    },
    // NVUE中的swiper在css中样式不生效
    swiperStyle() {
      const style = new common_vendor.UTSJSONObject({});
      return style;
    }
  },
  data() {
    return {
      index: 0
    };
  },
  methods: {
    noticeChange(e = null) {
      this.index = e.detail.current;
      this.$emit("change", this.index);
    },
    // 点击通告栏
    clickHandler() {
      this.$emit("click", this.index);
    },
    // 点击关闭按钮
    close() {
      this.$emit("close");
    }
  }
});
if (!Array) {
  const _easycom_uv_icon2 = common_vendor.resolveComponent("uv-icon");
  _easycom_uv_icon2();
}
const _easycom_uv_icon = () => "../../../uv-icon/components/uv-icon/uv-icon.js";
if (!Math) {
  _easycom_uv_icon();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: _ctx.icon
  }, _ctx.icon ? {
    b: common_vendor.p({
      name: _ctx.icon,
      color: _ctx.color,
      size: "19",
      class: "data-v-243b8fd9"
    })
  } : {}, {
    c: common_vendor.f(_ctx.text, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    }),
    d: common_vendor.s($options.textStyle),
    e: _ctx.disableTouch,
    f: _ctx.step ? false : true,
    g: _ctx.duration,
    h: !_ctx.disableScroll,
    i: common_vendor.s($options.swiperStyle),
    j: common_vendor.o((...args) => $options.noticeChange && $options.noticeChange(...args), "41"),
    k: ["link", "closable"].includes(_ctx.mode)
  }, ["link", "closable"].includes(_ctx.mode) ? common_vendor.e({
    l: _ctx.mode === "link"
  }, _ctx.mode === "link" ? {
    m: common_vendor.p({
      name: "arrow-right",
      size: 17,
      color: _ctx.color,
      class: "data-v-243b8fd9"
    })
  } : {}, {
    n: _ctx.mode === "closable"
  }, _ctx.mode === "closable" ? {
    o: common_vendor.o($options.close, "8b"),
    p: common_vendor.p({
      name: "close",
      size: 16,
      color: _ctx.color,
      class: "data-v-243b8fd9"
    })
  } : {}) : {}, {
    q: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    r: common_vendor.o((...args) => $options.clickHandler && $options.clickHandler(...args), "bf"),
    s: `${_ctx.u_s_b_h}px`,
    t: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-243b8fd9"]]);
wx.createComponent(Component);
