"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_function_test = require("../../../uv-ui-tools/libs/function/test.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvSteps_components_uvSteps_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-steps",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvSteps_components_uvSteps_props.props],
  data() {
    return {};
  },
  watch: {
    children() {
      this.updateChildData();
    },
    parentData() {
      this.updateChildData();
    }
  },
  computed: {
    // 监听参数的变化，通过watch中，手动去更新子组件的数据，否则子组件不会自动变化
    parentData() {
      return [this.current, this.direction, this.activeColor, this.inactiveColor, this.activeIcon, this.inactiveIcon, this.dot];
    }
  },
  methods: {
    // 更新子组件的数据
    updateChildData() {
      this.children.map((child = null) => {
        uni_modules_uvUiTools_libs_function_test.func((child || new UTSJSONObject({})).updateFromParent()) && child.updateFromParent();
      });
    },
    // 接受子组件的通知，去修改其他子组件的数据
    updateFromChild() {
      this.updateChildData();
    }
  },
  created() {
    this.children = [];
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    b: common_vendor.n(`uv-steps--${_ctx.direction}`),
    c: common_vendor.s(_ctx.$uv.addStyle(_ctx.customStyle))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f7a17f77"]]);
wx.createComponent(Component);
