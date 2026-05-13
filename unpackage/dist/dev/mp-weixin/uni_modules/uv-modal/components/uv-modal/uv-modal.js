"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvModal_components_uvModal_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-modal",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvModal_components_uvModal_props.props],
  data() {
    return {
      loading: false
    };
  },
  computed: {
    nvueStyle() {
      const style = new common_vendor.UTSJSONObject({});
      return style;
    }
  },
  methods: {
    open() {
      this.$refs.modalPopup.open();
      if (this.loading)
        this.loading = false;
    },
    close() {
      this.$refs.modalPopup.close();
    },
    popupChange(e = null) {
      if (!e.show)
        this.$emit("close");
    },
    // 点击确定按钮
    confirmHandler() {
      if (!this.loading) {
        this.$emit("confirm");
      }
      if (this.asyncClose) {
        this.loading = true;
      } else {
        this.close();
      }
    },
    // 点击取消按钮
    cancelHandler() {
      this.$emit("cancel");
      this.close();
    },
    closeLoading() {
      this.$nextTick(() => {
        this.loading = false;
      });
    }
  }
});
if (!Array) {
  const _easycom_uv_line2 = common_vendor.resolveComponent("uv-line");
  const _easycom_uv_loading_icon2 = common_vendor.resolveComponent("uv-loading-icon");
  const _easycom_uv_popup2 = common_vendor.resolveComponent("uv-popup");
  (_easycom_uv_line2 + _easycom_uv_loading_icon2 + _easycom_uv_popup2)();
}
const _easycom_uv_line = () => "../../../uv-line/components/uv-line/uv-line.js";
const _easycom_uv_loading_icon = () => "../../../uv-loading-icon/components/uv-loading-icon/uv-loading-icon.js";
const _easycom_uv_popup = () => "../../../uv-popup/components/uv-popup/uv-popup.js";
if (!Math) {
  (_easycom_uv_line + _easycom_uv_loading_icon + _easycom_uv_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: _ctx.title
  }, _ctx.title ? {
    b: common_vendor.t(_ctx.title)
  } : {}, {
    c: common_vendor.t(_ctx.content),
    d: common_vendor.s({
      textAlign: _ctx.align
    }),
    e: common_vendor.s($options.nvueStyle),
    f: common_vendor.s(_ctx.$uv.addStyle(_ctx.textStyle)),
    g: `${_ctx.title ? 12 : 25}px`,
    h: common_vendor.p({
      class: "data-v-4b4aa5ec"
    }),
    i: _ctx.showConfirmButton || _ctx.showCancelButton
  }, _ctx.showConfirmButton || _ctx.showCancelButton ? common_vendor.e({
    j: _ctx.showCancelButton
  }, _ctx.showCancelButton ? {
    k: common_vendor.t(_ctx.cancelText),
    l: _ctx.cancelColor,
    m: common_vendor.n(_ctx.showCancelButton && !_ctx.showConfirmButton && "uv-modal__button-group__wrapper--only-cancel"),
    n: common_vendor.o((...args) => $options.cancelHandler && $options.cancelHandler(...args), "b7")
  } : {}, {
    o: _ctx.showConfirmButton && _ctx.showCancelButton
  }, _ctx.showConfirmButton && _ctx.showCancelButton ? {
    p: common_vendor.p({
      direction: "column",
      class: "data-v-4b4aa5ec"
    })
  } : {}, {
    q: _ctx.showConfirmButton
  }, _ctx.showConfirmButton ? common_vendor.e({
    r: $data.loading
  }, $data.loading ? {
    s: common_vendor.p({
      class: "data-v-4b4aa5ec"
    })
  } : {
    t: common_vendor.t(_ctx.confirmText),
    v: _ctx.confirmColor
  }, {
    w: common_vendor.n(!_ctx.showCancelButton && _ctx.showConfirmButton && "uv-modal__button-group__wrapper--only-confirm"),
    x: common_vendor.o((...args) => $options.confirmHandler && $options.confirmHandler(...args), "04")
  }) : {}, {
    y: _ctx.buttonReverse ? "row-reverse" : "row"
  }) : {}, {
    z: _ctx.$uv.addUnit(_ctx.width),
    A: common_vendor.sr("modalPopup", "4b4aa5ec-0"),
    B: common_vendor.gei(_ctx, ""),
    C: common_vendor.o($options.popupChange, "5a"),
    D: common_vendor.p({
      mode: "center",
      zoom: _ctx.zoom,
      zIndex: _ctx.zIndex,
      customStyle: {
        borderRadius: "6px",
        overflow: "hidden",
        marginTop: `-${_ctx.$uv.addUnit(_ctx.negativeTop)}`
      },
      closeOnClickOverlay: _ctx.closeOnClickOverlay,
      safeAreaInsetBottom: false,
      duration: 400,
      id: common_vendor.gei(_ctx, ""),
      class: "r data-v-4b4aa5ec"
    }),
    E: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4b4aa5ec"]]);
wx.createComponent(Component);
