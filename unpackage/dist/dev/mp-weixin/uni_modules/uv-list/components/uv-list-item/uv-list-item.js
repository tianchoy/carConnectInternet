"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-list-item",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin],
  emits: ["click", "switchChange"],
  props: {
    direction: {
      type: String,
      default: "row"
    },
    title: {
      type: String,
      default: ""
    },
    note: {
      type: String,
      default: ""
    },
    ellipsis: {
      type: [Number, String],
      default: 0
    },
    disabled: {
      type: [Boolean, String],
      default: false
    },
    clickable: {
      type: Boolean,
      default: false
    },
    showArrow: {
      type: [Boolean, String],
      default: false
    },
    link: {
      type: [Boolean, String],
      default: false
    },
    to: {
      type: String,
      default: ""
    },
    showSwitch: {
      type: [Boolean, String],
      default: false
    },
    switchChecked: {
      type: [Boolean, String],
      default: false
    },
    showBadge: {
      type: [Boolean, String],
      default: false
    },
    badge: {
      type: Object,
      default() {
        return new common_vendor.UTSJSONObject({});
      }
    },
    rightText: {
      type: String,
      default: ""
    },
    thumb: {
      type: String,
      default: ""
    },
    thumbSize: {
      type: String,
      default: "base"
    },
    showExtraIcon: {
      type: [Boolean, String],
      default: false
    },
    extraIcon: {
      type: Object,
      default() {
        return new common_vendor.UTSJSONObject({
          name: "",
          color: "#000000",
          size: 20,
          customPrefix: ""
        });
      }
    },
    border: {
      type: Boolean,
      default: false
    },
    customStyle: {
      type: Object,
      default() {
        return new common_vendor.UTSJSONObject({
          padding: "",
          backgroundColor: "#FFFFFF"
        });
      }
    },
    keepScrollPosition: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    directionData() {
      return this.direction ? this.direction : this.parentData.direction ? this.parentData.direction : "row";
    }
  },
  watch: {
    "customStyle.padding": {
      handler(padding = null) {
        if (padding)
          this.setPadding(padding);
      },
      immediate: true
    }
  },
  data() {
    return {
      isFirstChild: false,
      padding: new common_vendor.UTSJSONObject({
        top: "",
        right: "",
        bottom: "",
        left: ""
      }),
      parentData: new common_vendor.UTSJSONObject({
        direction: "row",
        padding: 0
      })
    };
  },
  created() {
    this.updateParentData();
  },
  mounted() {
    this.init();
    this.list = this.getForm();
    if (this.list) {
      if (!this.list.firstChildAppend) {
        this.list.firstChildAppend = true;
        this.isFirstChild = true;
      }
    }
  },
  methods: {
    init() {
      if (!this.parent) {
        this.$uv.error("uv-list-item必须搭配uv-list组件使用");
      }
      this.$nextTick(() => {
        if (!(this.padding.top || this.padding.right || this.padding.bottom || this.padding.left)) {
          this.setPadding(this.parentData.padding);
        }
      });
    },
    updateParentData() {
      this.getParentData("uv-list");
    },
    setPadding(padding = null) {
      if (typeof padding == "number") {
        padding += "";
      }
      let paddingArr = padding.split(" ");
      if (paddingArr.length === 1) {
        const allPadding = paddingArr[0];
        this.padding = {
          "top": allPadding,
          "right": allPadding,
          "bottom": allPadding,
          "left": allPadding
        };
      } else if (paddingArr.length === 2) {
        const _a = common_vendor.__read(paddingArr, 2), verticalPadding = _a[0], horizontalPadding = _a[1];
        this.padding = {
          "top": verticalPadding,
          "right": horizontalPadding,
          "bottom": verticalPadding,
          "left": horizontalPadding
        };
      } else if (paddingArr.length === 4) {
        const _b = common_vendor.__read(paddingArr, 4), topPadding = _b[0], rightPadding = _b[1], bottomPadding = _b[2], leftPadding = _b[3];
        this.padding = {
          "top": topPadding,
          "right": rightPadding,
          "bottom": bottomPadding,
          "left": leftPadding
        };
      }
    },
    /**
     * 获取父元素实例
     */
    getForm(name = "uniList") {
      let parent = this.$parent;
      let parentName = parent.$options.name;
      while (parentName !== name) {
        parent = parent.$parent;
        if (!parent)
          return false;
        parentName = parent.$options.name;
      }
      return parent;
    },
    onClick() {
      if (this.to !== "") {
        this.openPage();
        return null;
      }
      if (this.clickable || this.link) {
        this.$emit("click", new common_vendor.UTSJSONObject({
          data: new common_vendor.UTSJSONObject({})
        }));
      }
    },
    onSwitchChange(e = null) {
      this.$emit("switchChange", e);
    },
    openPage() {
      if (["navigateTo", "redirectTo", "reLaunch", "switchTab"].indexOf(this.link) !== -1) {
        this.pageApi(this.link);
      } else {
        this.pageApi("navigateTo");
      }
    },
    pageApi(api = null) {
      let callback = new common_vendor.UTSJSONObject({
        url: this.to,
        success: (res = null) => {
          this.$emit("click", new common_vendor.UTSJSONObject({
            data: res
          }));
        },
        fail: (err = null) => {
          this.$emit("click", new common_vendor.UTSJSONObject({
            data: err
          }));
        }
      });
      switch (api) {
        case "navigateTo":
          common_vendor.index.navigateTo(callback);
          break;
        case "redirectTo":
          common_vendor.index.redirectTo(callback);
          break;
        case "reLaunch":
          common_vendor.index.reLaunch(callback);
          break;
        case "switchTab":
          common_vendor.index.switchTab(callback);
          break;
        default:
          common_vendor.index.navigateTo(callback);
      }
    }
  }
});
if (!Array) {
  const _easycom_uv_icon2 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_badge2 = common_vendor.resolveComponent("uv-badge");
  const _easycom_uv_switch2 = common_vendor.resolveComponent("uv-switch");
  (_easycom_uv_icon2 + _easycom_uv_badge2 + _easycom_uv_switch2)();
}
const _easycom_uv_icon = () => "../../../uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_badge = () => "../../../uv-badge/components/uv-badge/uv-badge.js";
const _easycom_uv_switch = () => "../../../uv-switch/components/uv-switch/uv-switch.js";
if (!Math) {
  (_easycom_uv_icon + _easycom_uv_badge + _easycom_uv_switch)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: !$data.isFirstChild
  }, !$data.isFirstChild ? {
    b: $props.border ? 1 : ""
  } : {}, {
    c: $props.thumb
  }, $props.thumb ? {
    d: $props.thumb,
    e: common_vendor.n("uv-list--" + $props.thumbSize)
  } : $props.showExtraIcon ? {
    g: common_vendor.p({
      name: $props.extraIcon.icon,
      customPrefix: $props.extraIcon.customPrefix,
      color: $props.extraIcon.color,
      size: $props.extraIcon.size,
      class: "data-v-d568ce32"
    })
  } : {}, {
    f: $props.showExtraIcon,
    h: $props.title
  }, $props.title ? {
    i: common_vendor.t($props.title),
    j: common_vendor.n($props.ellipsis && `uv-line-${$props.ellipsis}`)
  } : {}, {
    k: $props.note
  }, $props.note ? {
    l: common_vendor.t($props.note)
  } : {}, {
    m: $props.thumb || $props.showExtraIcon || $props.showBadge || $props.showSwitch ? 1 : "",
    n: $props.rightText || $props.showBadge || $props.showSwitch
  }, $props.rightText || $props.showBadge || $props.showSwitch ? common_vendor.e({
    o: $props.rightText
  }, $props.rightText ? {
    p: common_vendor.t($props.rightText)
  } : {}, {
    q: $props.showBadge
  }, $props.showBadge ? {
    r: common_vendor.p({
      show: !!($props.badge.show || $props.badge.isDot || $props.badge.value),
      isDot: $props.badge.isDot,
      value: $props.badge.value,
      max: $props.badge.max,
      type: $props.badge.type,
      showZero: $props.badge.showZero,
      bgColor: $props.badge.bgColor,
      color: $props.badge.color,
      shape: $props.badge.shape,
      numberType: $props.badge.numberType,
      inverted: $props.badge.inverted,
      customStyle: "margin-left: 4px;",
      class: "data-v-d568ce32"
    })
  } : {}, {
    s: $props.showSwitch
  }, $props.showSwitch ? {
    t: common_vendor.o($options.onSwitchChange, "7d"),
    v: common_vendor.p({
      value: $props.switchChecked,
      disabled: $props.disabled,
      class: "data-v-d568ce32"
    })
  } : {}, {
    w: $options.directionData === "column" ? 1 : ""
  }) : {}, {
    x: $props.showArrow || $props.link ? 1 : "",
    y: $options.directionData === "column" ? 1 : "",
    z: $data.padding.top,
    A: $data.padding.left,
    B: $data.padding.right,
    C: $data.padding.bottom,
    D: $props.showArrow || $props.link
  }, $props.showArrow || $props.link ? {
    E: common_vendor.p({
      size: "34rpx",
      color: "#bbb",
      name: "arrow-right",
      class: "uv-icon-wrapper data-v-d568ce32"
    })
  } : {}, {
    F: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    G: $props.disabled ? 1 : "",
    H: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass),
    I: common_vendor.s(_ctx.$uv.addStyle($props.customStyle)),
    J: common_vendor.s({
      "background-color": $props.customStyle.backgroundColor ? $props.customStyle.backgroundColor : "#fff"
    }),
    K: common_vendor.s({
      "--status-bar-height": `${_ctx.u_s_b_h}px`,
      "--uni-safe-area-inset-bottom": `${_ctx.u_s_a_i_b}px`
    }),
    L: !$props.clickable && !$props.link || $props.disabled || $props.showSwitch ? "" : "uv-list-item--hover",
    M: common_vendor.o((...args) => $options.onClick && $options.onClick(...args), "60")
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d568ce32"]]);
wx.createComponent(Component);
