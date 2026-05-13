"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvGrid_components_uvGrid_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-grid",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvGrid_components_uvGrid_props.props],
  emits: ["click"],
  data() {
    return {
      index: 0,
      width: 0
    };
  },
  watch: {
    // 当父组件需要子组件需要共享的参数发生了变化，手动通知子组件
    parentData() {
      if (this.children.length) {
        this.children.map((child = null) => {
          typeof child.updateParentData == "function" && child.updateParentData();
        });
      }
    }
  },
  created() {
    this.children = [];
  },
  computed: {
    // 计算父组件的值是否发生变化
    parentData() {
      return [this.hoverClass, this.col, this.size, this.border];
    },
    // 宫格对齐方式
    gridStyle() {
      let style = new common_vendor.UTSJSONObject({});
      switch (this.align) {
        case "left":
          style.justifyContent = "flex-start";
          break;
        case "center":
          style.justifyContent = "center";
          break;
        case "right":
          style.justifyContent = "flex-end";
          break;
        default:
          style.justifyContent = "flex-start";
      }
      return this.$uv.deepMerge(style, this.$uv.addStyle(this.customStyle));
    }
  },
  methods: {
    // 此方法由uv-grid-item触发，用于在uv-grid发出事件
    childClick(name = null) {
      this.$emit("click", name);
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return {
    a: common_vendor.sei(common_vendor.gei(_ctx, "", "r0-fb64a415"), "view", "uv-grid"),
    b: common_vendor.s($options.gridStyle),
    c: common_vendor.s({
      "--status-bar-height": `${_ctx.u_s_b_h}px`,
      "--uni-safe-area-inset-bottom": `${_ctx.u_s_a_i_b}px`
    }),
    d: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fb64a415"]]);
wx.createComponent(Component);
