"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-list",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin],
  "mp-weixin": {
    options: new UTSJSONObject({
      multipleSlots: false
    })
  },
  props: {
    border: {
      type: Boolean,
      default: false
    },
    borderColor: {
      type: String,
      default: "#dadbde"
    },
    // 排版方向，默认row，列表里面使用其他组件  最好设置成column
    direction: {
      type: String,
      default: "row"
    },
    // 内边距
    padding: {
      type: [String, Number],
      default: "20rpx 30rpx"
    }
  },
  created() {
    this.firstChildAppend = false;
  },
  computed: {
    parentData() {
      return [this.direction, this.padding];
    }
  },
  methods: {
    loadMore(e = null) {
      this.$emit("scrolltolower");
    },
    scroll(e = null) {
      this.$emit("scroll", e);
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.border
  }, $props.border ? {
    b: common_vendor.s({
      "background-color": $props.borderColor
    })
  } : {}, {
    c: $props.border
  }, $props.border ? {
    d: common_vendor.s({
      "background-color": $props.borderColor
    })
  } : {}, {
    e: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    f: common_vendor.s(_ctx.$uv.addStyle(_ctx.customStyle))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-53ea9bef"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uv-list/components/uv-list/uv-list.js.map
