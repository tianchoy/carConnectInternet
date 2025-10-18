"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvTooltip_components_uvTooltip_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-tooltip",
  emits: ["click"],
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvTooltip_components_uvTooltip_props.props],
  data() {
    return {
      // 是否展示气泡
      showTooltip: true,
      // 生成唯一id，防止一个页面多个组件，造成干扰
      textId: "",
      tooltipId: "",
      // 初始时甚至为很大的值，让其移到屏幕外面，为了计算元素的尺寸
      tooltipTop: -1e4,
      // 气泡的位置信息
      tooltipInfo: new UTSJSONObject({
        width: 0,
        left: 0
      }),
      // 文本的位置信息
      textInfo: new UTSJSONObject({
        width: 0,
        left: 0
      }),
      // 三角形指示器的样式
      indicatorStyle: new UTSJSONObject({}),
      // 气泡在可能超出屏幕边沿范围时，重新定位后，距离屏幕边沿的距离
      screenGap: 12,
      // 三角形指示器的宽高，由于对元素进行了角度旋转，精确计算指示器位置时，需要用到其尺寸信息
      indicatorWidth: 14,
      timeout: 0
    };
  },
  watch: {
    propsChange() {
      this.getElRect();
    },
    showTooltip(newVal = null) {
      if (!newVal)
        this.timeout = 0;
    }
  },
  computed: {
    isShow() {
      var _a;
      const isPC = ((_a = this.$uv.sys()) === null || _a === void 0 ? null : _a.model) == "PC";
      if (isPC) {
        return true;
      }
      return false;
    },
    // 特别处理H5的复制，因为H5浏览器是自带系统复制功能的，在H5环境
    // 当一些依赖参数变化时，需要重新计算气泡和指示器的位置信息
    propsChange() {
      return [this.text, this.buttons];
    },
    // 计算气泡和指示器的位置信息
    tooltipStyle() {
      const style = new UTSJSONObject({});
      if (this.tooltipInfo.width / 2 > this.textInfo.left + this.textInfo.width / 2 - this.screenGap) {
        this.indicatorStyle = new UTSJSONObject({});
        style.left = `-${this.$uv.addUnit(this.textInfo.left - this.screenGap)}`;
        this.indicatorStyle.left = this.$uv.addUnit(this.textInfo.width / 2 - this.$uv.getPx(style.left) - this.indicatorWidth / 2);
      } else if (this.tooltipInfo.width / 2 > this.$uv.sys().windowWidth - this.textInfo.right + this.textInfo.width / 2 - this.screenGap) {
        this.indicatorStyle = new UTSJSONObject({});
        style.right = `-${this.$uv.addUnit(this.$uv.sys().windowWidth - this.textInfo.right - this.screenGap)}`;
        this.indicatorStyle.right = this.$uv.addUnit(this.textInfo.width / 2 - this.$uv.getPx(style.right) - this.indicatorWidth / 2);
      } else {
        const left = Math.abs(this.textInfo.width / 2 - this.tooltipInfo.width / 2);
        style.left = this.textInfo.width > this.tooltipInfo.width ? this.$uv.addUnit(left) : -this.$uv.addUnit(left);
        this.indicatorStyle = new UTSJSONObject({});
      }
      if (this.direction === "top") {
        style.marginTop = `-${10 + this.tooltipInfo.height}px`;
        this.indicatorStyle.bottom = "-4px";
      } else {
        style.marginTop = `${this.tooltipInfo.height - 10}px`;
        this.indicatorStyle.top = "-4px";
      }
      return style;
    }
  },
  created() {
    this.textId = this.$uv.guid();
    this.tooltipId = this.$uv.guid();
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getElRect();
    },
    // 长按触发事件
    longpressHandler(e = null) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        this.tooltipTop = 0;
        this.showTooltip = true;
        setTimeout(() => {
          this.timeout = 1;
        }, 300);
      });
    },
    // 点击透明遮罩
    overlayClickHandler() {
      this.showTooltip = false;
    },
    // 点击弹出按钮
    btnClickHandler(index = null) {
      this.showTooltip = false;
      this.$emit("click", this.showCopy ? index + 1 : index);
    },
    // 查询内容高度
    queryRect(ref = null) {
      return new Promise((resolve) => {
        this.$uvGetRect(`#${ref}`).then((size = null) => {
          resolve(size);
        });
      });
    },
    // 元素尺寸
    getElRect() {
      this.showTooltip = true;
      this.tooltipTop = -1e4;
      this.$uv.sleep(500).then(() => {
        this.queryRect(this.tooltipId).then((size = null) => {
          this.tooltipInfo = size;
          this.showTooltip = false;
        });
        this.queryRect(this.textId).then((size = null) => {
          this.textInfo = size;
        });
      });
    },
    // 复制文本到粘贴板
    setClipboardData() {
      this.showTooltip = false;
      this.$emit("click", 0);
      common_vendor.index.setClipboardData({
        // 优先使用copyText字段，如果没有，则默认使用text字段当做复制的内容
        data: this.copyText || this.text,
        success: () => {
          this.showToast && this.$uv.toast("复制成功");
        },
        fail: () => {
          this.showToast && this.$uv.toast("复制失败");
        },
        complete: () => {
          this.showTooltip = false;
        }
      });
    }
  }
});
if (!Array) {
  const _easycom_uv_overlay2 = common_vendor.resolveComponent("uv-overlay");
  const _easycom_uv_line2 = common_vendor.resolveComponent("uv-line");
  const _easycom_uv_transition2 = common_vendor.resolveComponent("uv-transition");
  (_easycom_uv_overlay2 + _easycom_uv_line2 + _easycom_uv_transition2)();
}
const _easycom_uv_overlay = () => "../../../uv-overlay/components/uv-overlay/uv-overlay.js";
const _easycom_uv_line = () => "../../../uv-line/components/uv-line/uv-line.js";
const _easycom_uv_transition = () => "../../../uv-transition/components/uv-transition/uv-transition.js";
if (!Math) {
  (_easycom_uv_overlay + _easycom_uv_line + _easycom_uv_transition)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  "raw js";
  return common_vendor.e({
    a: common_vendor.o($options.overlayClickHandler),
    b: common_vendor.p({
      show: $data.showTooltip && $data.tooltipTop !== -1e4 && _ctx.overlay && $data.timeout > 0,
      customStyle: "backgroundColor: rgba(0, 0, 0, 0)"
    }),
    c: $options.isShow
  }, $options.isShow ? {
    d: common_vendor.t(_ctx.text),
    e: common_vendor.sei($data.textId !== "" ? $data.textId : "r0-bae07d08", "text", $data.textId),
    f: $data.textId,
    g: common_vendor.o((...args) => $options.longpressHandler && $options.longpressHandler(...args)),
    h: _ctx.color,
    i: _ctx.bgColor && $data.showTooltip && $data.tooltipTop !== -1e4 ? _ctx.bgColor : "transparent"
  } : {
    j: common_vendor.t(_ctx.text),
    k: common_vendor.sei($data.textId !== "" ? $data.textId : "r1-bae07d08", "text", $data.textId),
    l: $data.textId,
    m: common_vendor.o((...args) => $options.longpressHandler && $options.longpressHandler(...args)),
    n: _ctx.color,
    o: _ctx.bgColor && $data.showTooltip && $data.tooltipTop !== -1e4 ? _ctx.bgColor : "transparent"
  }, {
    p: _ctx.showCopy || _ctx.buttons.length
  }, _ctx.showCopy || _ctx.buttons.length ? {
    q: common_vendor.s($data.indicatorStyle),
    r: common_vendor.s({
      width: _ctx.$uv.addUnit($data.indicatorWidth),
      height: _ctx.$uv.addUnit($data.indicatorWidth)
    })
  } : {}, {
    s: _ctx.showCopy
  }, _ctx.showCopy ? {
    t: common_vendor.o((...args) => $options.setClipboardData && $options.setClipboardData(...args))
  } : {}, {
    v: _ctx.showCopy && _ctx.buttons.length > 0
  }, _ctx.showCopy && _ctx.buttons.length > 0 ? {
    w: common_vendor.p({
      direction: "column",
      color: "#8d8e90",
      length: "18"
    })
  } : {}, {
    x: common_vendor.f(_ctx.buttons, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item),
        b: common_vendor.o(($event) => $options.btnClickHandler(index), index),
        c: index < _ctx.buttons.length - 1
      }, index < _ctx.buttons.length - 1 ? {
        d: "bae07d08-3-" + i0 + ",bae07d08-1",
        e: common_vendor.p({
          direction: "column",
          color: "#8d8e90",
          length: "18"
        })
      } : {}, {
        f: index
      });
    }),
    y: common_vendor.sei($data.tooltipId !== "" ? $data.tooltipId : "r2-bae07d08", "view", $data.tooltipId),
    z: $data.tooltipId,
    A: common_vendor.p({
      mode: "fade",
      show: $data.showTooltip,
      duration: 300,
      customStyle: {
        position: "absolute",
        top: _ctx.$uv.addUnit($data.tooltipTop),
        zIndex: _ctx.zIndex,
        ...$options.tooltipStyle
      }
    }),
    B: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    C: common_vendor.s(_ctx.$uv.addStyle(_ctx.customStyle))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bae07d08"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uv-tooltip/components/uv-tooltip/uv-tooltip.js.map
