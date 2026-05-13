"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvRadio_components_uvRadioGroup_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-radio-group",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvRadio_components_uvRadioGroup_props.props],
  computed: {
    // 这里computed的变量，都是子组件uv-radio需要用到的，由于头条小程序的兼容性差异，子组件无法实时监听父组件参数的变化
    // 所以需要手动通知子组件，这里返回一个parentData变量，供watch监听，在其中去通知每一个子组件重新从父组件(uv-radio-group)
    // 拉取父组件新的变化后的参数
    parentData() {
      const value = this.value || this.modelValue;
      return [
        value,
        this.disabled,
        this.inactiveColor,
        this.activeColor,
        this.size,
        this.labelDisabled,
        this.shape,
        this.iconSize,
        this.borderBottom,
        this.placement
      ];
    },
    bemClass() {
      return this.bem("radio-group", ["placement"]);
    }
  },
  watch: {
    // 当父组件需要子组件需要共享的参数发生了变化，手动通知子组件
    parentData() {
      if (this.children.length) {
        this.children.map((child = null) => {
          typeof child.init === "function" && child.init();
        });
      }
    }
  },
  data() {
    return {};
  },
  created() {
    this.children = [];
  },
  methods: {
    // 将其他的radio设置为未选中的状态
    unCheckedOther(childInstance = null) {
      this.children.map((child = null) => {
        if (childInstance !== child) {
          child.checked = false;
        }
      });
      const name = childInstance.name;
      this.$emit("update:modelValue", name);
      this.$emit("change", name);
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    b: common_vendor.n($options.bemClass),
    c: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass),
    d: common_vendor.s(_ctx.$uv.addStyle(this.customStyle)),
    e: common_vendor.s({
      "--status-bar-height": `${_ctx.u_s_b_h}px`,
      "--uni-safe-area-inset-bottom": `${_ctx.u_s_a_i_b}px`
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0d20093d"]]);
wx.createComponent(Component);
