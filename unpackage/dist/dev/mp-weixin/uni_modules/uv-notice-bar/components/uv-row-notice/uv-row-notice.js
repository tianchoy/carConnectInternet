"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvNoticeBar_components_uvRowNotice_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-row-notice",
  emits: ["click", "close"],
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvNoticeBar_components_uvRowNotice_props.props],
  data() {
    return {
      animationDuration: "0",
      animationPlayState: "paused",
      // nvue下，内容发生变化，导致滚动宽度也变化，需要标志为是否需要重新计算宽度
      // 不能在内容变化时直接重新计算，因为nvue的animation模块上一次的滚动不是刚好结束，会有影响
      nvueInit: true,
      show: true
    };
  },
  watch: {
    text: {
      immediate: true,
      handler(newValue = null, oldValue = null) {
        this.vue();
        if (!this.$uv.test.string(newValue)) {
          this.$uv.error("noticebar组件direction为row时，要求text参数为字符串形式");
        }
      }
    },
    fontSize() {
      this.vue();
    },
    speed() {
      this.vue();
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
    animationStyle() {
      let style = new common_vendor.UTSJSONObject({});
      style.animationDuration = this.animationDuration;
      style.animationPlayState = this.animationPlayState;
      return style;
    },
    // 内部对用户传入的数据进一步分割，放到多个text标签循环，否则如果用户传入的字符串很长（100个字符以上）
    // 放在一个text标签中进行滚动，在低端安卓机上，动画可能会出现抖动现象，需要分割到多个text中可解决此问题
    innerText() {
      let result = [], len = 20;
      const textArr = this.text ? this.text.split("") : [];
      for (let i = 0; i < textArr.length; i += len) {
        result.push(textArr.slice(i, i + len).join(""));
      }
      return result;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.vue();
      if (!this.$uv.test.string(this.text)) {
        this.$uv.error("noticebar组件direction为row时，要求text参数为字符串形式");
      }
    },
    // vue版处理
    vue() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        let textWidth = 0;
        yield this.$uv.sleep();
        textWidth = (yield this.$uvGetRect(".uv-notice__content__text")).width;
        (yield this.$uvGetRect(".uv-notice__content")).width;
        this.animationDuration = `${textWidth / this.$uv.getPx(this.speed)}s`;
        this.animationPlayState = "paused";
        setTimeout(() => {
          this.animationPlayState = "running";
        }, 10);
      });
    },
    // nvue版处理
    nvue() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
      });
    },
    loopAnimation(textWidth = null, boxWidth = null) {
    },
    getNvueRect(el = null) {
    },
    // 点击通告栏
    clickHandler(index = null) {
      this.$emit("click");
    },
    // 点击右侧按钮，需要判断点击的是关闭图标还是箭头图标
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
      class: "data-v-8e15132c"
    })
  } : {}, {
    c: common_vendor.f($options.innerText, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    }),
    d: common_vendor.s($options.textStyle),
    e: common_vendor.sei("r0-8e15132c", "view", "uv-notice__content__text"),
    f: common_vendor.s($options.animationStyle),
    g: common_vendor.sei("r1-8e15132c", "view", "uv-notice__content"),
    h: ["link", "closable"].includes(_ctx.mode)
  }, ["link", "closable"].includes(_ctx.mode) ? common_vendor.e({
    i: _ctx.mode === "link"
  }, _ctx.mode === "link" ? {
    j: common_vendor.p({
      name: "arrow-right",
      size: 17,
      color: _ctx.color,
      class: "data-v-8e15132c"
    })
  } : {}, {
    k: _ctx.mode === "closable"
  }, _ctx.mode === "closable" ? {
    l: common_vendor.o($options.close, "f1"),
    m: common_vendor.p({
      name: "close",
      size: 16,
      color: _ctx.color,
      class: "data-v-8e15132c"
    })
  } : {}) : {}, {
    n: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    o: common_vendor.o((...args) => $options.clickHandler && $options.clickHandler(...args), "bf"),
    p: `${_ctx.u_s_b_h}px`,
    q: `${_ctx.u_s_a_i_b}px`,
    r: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8e15132c"]]);
wx.createComponent(Component);
