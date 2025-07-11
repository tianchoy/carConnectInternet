"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvGrid_components_uvGridItem_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-grid-item",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvGrid_components_uvGridItem_props.props],
  emits: ["$uvGridItem", "click"],
  data() {
    return {
      parentData: new UTSJSONObject({
        col: 3,
        border: true
        // 是否显示边框，根据父组件决定
      }),
      classes: []
      // 类名集合，用于判断是否显示右边和下边框
    };
  },
  created() {
    this.updateParentData();
  },
  mounted() {
    this.init();
  },
  computed: {
    // vue下放到computed中，否则会因为延时造成闪烁
    width() {
      return 100 / Number(this.parentData.col) + "%";
    },
    itemStyle() {
      const style = new UTSJSONObject({
        background: this.bgColor,
        width: this.width
      });
      return this.$uv.deepMerge(style, this.$uv.addStyle(this.customStyle));
    }
  },
  methods: {
    init() {
      common_vendor.index.$on("$uvGridItem", () => {
        this.gridItemClasses();
      });
      common_vendor.index.$emit("$uvGridItem");
      this.gridItemClasses();
    },
    // 获取父组件的参数
    updateParentData() {
      this.getParentData("uv-grid");
    },
    clickHandler() {
      var _a;
      let name = this.name;
      const children = (_a = this.parent) === null || _a === void 0 ? null : _a.children;
      if (children && this.name === null) {
        name = children.findIndex((child = null) => {
          return child === this;
        });
      }
      this.parent && this.parent.childClick(name);
      this.$emit("click", name);
    },
    getItemWidth() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        let width = 0;
        if (this.parent) {
          const parentWidth = yield this.getParentWidth();
          width = parentWidth / Number(this.parentData.col) + "px";
        }
        this.width = width;
      });
    },
    // 获取父元素的尺寸
    getParentWidth() {
    },
    gridItemClasses() {
      if (this.parentData.border) {
        let classes = [];
        this.parent.children.map((child = null, index = null) => {
          if (this === child) {
            const len = this.parent.children.length;
            if ((index + 1) % this.parentData.col !== 0 && index + 1 !== len) {
              classes.push("uv-border-right");
            }
            const lessNum = len % this.parentData.col === 0 ? this.parentData.col : len % this.parentData.col;
            if (index < len - lessNum) {
              classes.push("uv-border-bottom");
            }
          }
        });
        this.classes = classes;
      }
    }
  },
  unmounted() {
    common_vendor.index.$off("$uvGridItem");
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    b: common_vendor.o((...args) => $options.clickHandler && $options.clickHandler(...args)),
    c: common_vendor.n($data.classes),
    d: common_vendor.s($options.itemStyle)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0657340f"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uv-grid/components/uv-grid-item/uv-grid-item.js.map
