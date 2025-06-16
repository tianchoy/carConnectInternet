"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvSwitch_components_uvSwitch_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-switch",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvSwitch_components_uvSwitch_props.props],
  data() {
    return {
      bgColor: "#ffffff",
      innerValue: false
    };
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(newVal = null) {
        if (newVal !== this.inactiveValue && newVal !== this.activeValue) {
          return this.$uv.error("v-model绑定的值必须为inactiveValue、activeValue二者之一");
        }
        this.innerValue = newVal;
      }
    }
  },
  created() {
    this.innerValue = this.value || this.modelValue;
  },
  computed: {
    isActive() {
      return this.innerValue === this.activeValue;
    },
    switchStyle() {
      let style = new UTSJSONObject(
        {}
        // 这里需要加2，是为了腾出边框的距离，否则圆点node会和外边框紧贴在一起
      );
      style.width = this.$uv.addUnit(this.$uv.getPx(this.size) * 2 + 2);
      style.height = this.$uv.addUnit(this.$uv.getPx(this.size) + 2);
      if (this.customInactiveColor) {
        style.borderColor = "rgba(0, 0, 0, 0)";
      }
      style.backgroundColor = this.isActive ? this.activeColor : this.inactiveColor;
      return style;
    },
    nodeStyle() {
      let style = new UTSJSONObject(
        {}
        // 如果自定义非激活颜色，将node圆点的尺寸减少两个像素，让其与外边框距离更大一点
      );
      style.width = this.$uv.addUnit(this.$uv.getPx(this.size) - this.space);
      style.height = this.$uv.addUnit(this.$uv.getPx(this.size) - this.space);
      const translateX = this.isActive ? this.$uv.addUnit(this.space) : this.$uv.addUnit(this.$uv.getPx(this.size));
      style.transform = `translateX(-${translateX})`;
      return style;
    },
    bgStyle() {
      let style = new UTSJSONObject(
        {}
        // 这里配置一个多余的元素在HTML中，是为了让switch切换时，有更良好的背景色扩充体验(见实际效果)
      );
      style.width = this.$uv.addUnit(this.$uv.getPx(this.size) * 2 - this.$uv.getPx(this.size) / 2);
      style.height = this.$uv.addUnit(this.$uv.getPx(this.size));
      style.backgroundColor = this.inactiveColor;
      style.transform = `scale(${this.isActive ? 0 : 1})`;
      return style;
    },
    customInactiveColor() {
      return this.inactiveColor !== "#fff" && this.inactiveColor !== "#ffffff";
    }
  },
  methods: {
    clickHandler() {
      if (!this.disabled && !this.loading) {
        const oldValue = this.isActive ? this.inactiveValue : this.activeValue;
        if (!this.asyncChange) {
          this.$emit("input", oldValue);
          this.$emit("update:modelValue", oldValue);
        }
        this.$nextTick(() => {
          this.$emit("change", oldValue);
        });
      }
    }
  }
});
if (!Array) {
  const _easycom_uv_loading_icon2 = common_vendor.resolveComponent("uv-loading-icon");
  _easycom_uv_loading_icon2();
}
const _easycom_uv_loading_icon = () => "../../../uv-loading-icon/components/uv-loading-icon/uv-loading-icon.js";
if (!Math) {
  _easycom_uv_loading_icon();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.s($options.bgStyle),
    b: common_vendor.p({
      show: _ctx.loading,
      mode: "circle",
      timingFunction: "linear",
      color: $data.innerValue ? _ctx.activeColor : "#AAABAD",
      size: _ctx.size * 0.6
    }),
    c: common_vendor.sei("r0-c713e4c9", "view", "uv-switch__node"),
    d: common_vendor.n($data.innerValue && "uv-switch__node--on"),
    e: common_vendor.s($options.nodeStyle),
    f: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    g: common_vendor.n(_ctx.disabled && "uv-switch--disabled"),
    h: common_vendor.s($options.switchStyle),
    i: common_vendor.s(_ctx.$uv.addStyle(_ctx.customStyle)),
    j: common_vendor.o((...args) => $options.clickHandler && $options.clickHandler(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c713e4c9"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uv-switch/components/uv-switch/uv-switch.js.map
