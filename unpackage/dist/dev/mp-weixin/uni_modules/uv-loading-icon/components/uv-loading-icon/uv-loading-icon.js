"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_function_colorGradient = require("../../../uv-ui-tools/libs/function/colorGradient.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvLoadingIcon_components_uvLoadingIcon_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-loading-icon",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvLoadingIcon_components_uvLoadingIcon_props.props],
  data() {
    return {
      // Array.form可以通过一个伪数组对象创建指定长度的数组
      // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/from
      array12: Array.from({
        length: 12
      }),
      // 这里需要设置默认值为360，否则在安卓nvue上，会延迟一个duration周期后才执行
      // 在iOS nvue上，则会一开始默认执行两个周期的动画
      aniAngel: 360,
      webviewHide: false,
      loading: false
      // 是否运行中，针对nvue使用
    };
  },
  computed: {
    // 当为circle类型时，给其另外三边设置一个更轻一些的颜色
    // 之所以需要这么做的原因是，比如父组件传了color为红色，那么需要另外的三个边为浅红色
    // 而不能是固定的某一个其他颜色(因为这个固定的颜色可能浅蓝，导致效果没有那么细腻良好)
    otherBorderColor() {
      const lightColor = uni_modules_uvUiTools_libs_function_colorGradient.colorGradient(this.color, "#ffffff", 100)[80];
      if (this.mode === "circle") {
        return this.inactiveColor ? this.inactiveColor : lightColor;
      } else {
        return "transparent";
      }
    }
  },
  watch: {
    show(n = null) {
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      setTimeout(() => {
      }, 20);
    },
    // 监听webview的显示与隐藏
    addEventListenerToWebview() {
      const pages = getCurrentPages();
      const page = pages[pages.length - 1];
      const currentWebview = page.$getAppWebview();
      currentWebview.addEventListener("hide", () => {
        this.webviewHide = true;
      });
      currentWebview.addEventListener("show", () => {
        this.webviewHide = false;
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: _ctx.show
  }, _ctx.show ? common_vendor.e({
    b: !$data.webviewHide
  }, !$data.webviewHide ? common_vendor.e({
    c: _ctx.mode === "spinner"
  }, _ctx.mode === "spinner" ? {
    d: common_vendor.f($data.array12, (item, index, i0) => {
      return {
        a: index
      };
    })
  } : {}, {
    e: common_vendor.sei("r0-29b619ea", "view", "ani"),
    f: common_vendor.n(`uv-loading-icon__spinner--${_ctx.mode}`),
    g: _ctx.color,
    h: _ctx.$uv.addUnit(_ctx.size),
    i: _ctx.$uv.addUnit(_ctx.size),
    j: _ctx.color,
    k: $options.otherBorderColor,
    l: $options.otherBorderColor,
    m: $options.otherBorderColor,
    n: `${_ctx.duration}ms`,
    o: _ctx.mode === "semicircle" || _ctx.mode === "circle" ? _ctx.timingFunction : ""
  }) : {}, {
    p: _ctx.text
  }, _ctx.text ? {
    q: common_vendor.t(_ctx.text),
    r: common_vendor.s({
      fontSize: _ctx.$uv.addUnit(_ctx.textSize),
      color: _ctx.textColor
    }),
    s: common_vendor.s(_ctx.$uv.addStyle(_ctx.textStyle))
  } : {}, {
    t: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    v: common_vendor.s(_ctx.$uv.addStyle(_ctx.customStyle)),
    w: common_vendor.n(_ctx.vertical && "uv-loading-icon--vertical")
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-29b619ea"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uv-loading-icon/components/uv-loading-icon/uv-loading-icon.js.map
