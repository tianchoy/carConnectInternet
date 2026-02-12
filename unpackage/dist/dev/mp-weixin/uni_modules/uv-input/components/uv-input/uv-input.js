"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uvUiTools_libs_mixin_mpMixin = require("../../../uv-ui-tools/libs/mixin/mpMixin.js");
const uni_modules_uvUiTools_libs_mixin_mixin = require("../../../uv-ui-tools/libs/mixin/mixin.js");
const uni_modules_uvInput_components_uvInput_props = require("./props.js");
const _sfc_main = common_vendor.defineComponent({
  name: "uv-input",
  mixins: [uni_modules_uvUiTools_libs_mixin_mpMixin.mpMixin, uni_modules_uvUiTools_libs_mixin_mixin.mixin, uni_modules_uvInput_components_uvInput_props.props],
  data() {
    return {
      // 输入框的值
      innerValue: "",
      // 是否处于获得焦点状态
      focused: false,
      // 过滤处理方法
      innerFormatter: (value = null) => {
        return value;
      }
    };
  },
  created() {
    this.innerValue = this.modelValue;
  },
  watch: {
    value(newVal = null) {
      this.innerValue = newVal;
    },
    modelValue(newVal = null) {
      this.innerValue = newVal;
    }
  },
  computed: {
    // 是否显示清除控件
    isShowClear() {
      const _a = this, clearable = _a.clearable, readonly = _a.readonly, focused = _a.focused, innerValue = _a.innerValue;
      return !!clearable && !readonly && !!focused && innerValue !== "";
    },
    // 组件的类名
    inputClass() {
      let classes = [], _a = this, border = _a.border;
      _a.disabled;
      let shape = _a.shape;
      border === "surround" && (classes = classes.concat(["uv-border", "uv-input--radius"]));
      classes.push(`uv-input--${shape}`);
      border === "bottom" && (classes = classes.concat([
        "uv-border-bottom",
        "uv-input--no-radius"
      ]));
      return classes.join(" ");
    },
    // 组件的样式
    wrapperStyle() {
      const style = new common_vendor.UTSJSONObject({});
      if (this.disabled) {
        style.backgroundColor = this.disabledColor;
      }
      if (this.border === "none") {
        style.padding = "0";
      } else {
        style.paddingTop = "6px";
        style.paddingBottom = "6px";
        style.paddingLeft = "9px";
        style.paddingRight = "9px";
      }
      return this.$uv.deepMerge(style, this.$uv.addStyle(this.customStyle));
    },
    // 输入框的样式
    inputStyle() {
      const style = new common_vendor.UTSJSONObject({
        color: this.color,
        fontSize: this.$uv.addUnit(this.fontSize),
        textAlign: this.inputAlign
      });
      if (this.disabled || this.readonly) {
        style["pointer-events"] = "none";
      }
      return style;
    }
  },
  methods: {
    // 在微信小程序中，不支持将函数当做props参数，故只能通过ref形式调用
    setFormatter(e = null) {
      this.innerFormatter = e;
    },
    // 当键盘输入时，触发input事件
    onInput(e = null) {
      let _a = (e.detail || new common_vendor.UTSJSONObject({})).value, value = _a == void 0 ? "" : _a;
      const formatter = this.formatter || this.innerFormatter;
      const formatValue = formatter(value);
      this.innerValue = value;
      this.$nextTick(() => {
        this.innerValue = formatValue;
        this.valueChange();
      });
    },
    // 输入框失去焦点时触发
    onBlur(event = null) {
      this.$emit("blur", event.detail.value);
      this.$uv.sleep(100).then(() => {
        this.focused = false;
      });
      this.$uv.formValidate(this, "blur");
    },
    // 输入框聚焦时触发
    onFocus(event = null) {
      this.focused = true;
      this.$emit("focus");
    },
    // 点击完成按钮时触发
    onConfirm(event = null) {
      this.$emit("confirm", this.innerValue);
    },
    // 键盘高度发生变化的时候触发此事件
    // 兼容性：微信小程序2.7.0+、App 3.1.0+
    onkeyboardheightchange(e = null) {
      this.$emit("keyboardheightchange", e);
    },
    // 内容发生变化，进行处理
    valueChange() {
      if (this.isClear)
        this.innerValue = "";
      const value = this.innerValue;
      this.$nextTick(() => {
        this.$emit("input", value);
        this.$emit("update:modelValue", value);
        this.$emit("change", value);
        this.$uv.formValidate(this, "change");
      });
    },
    // 点击清除控件
    onClear() {
      this.innerValue = "";
      this.isClear = true;
      this.$uv.sleep(200).then((res = null) => {
        this.isClear = false;
      });
      this.$nextTick(() => {
        this.$emit("clear");
        this.valueChange();
      });
    },
    /**
     * 在安卓nvue上，事件无法冒泡
     * 在某些时间，我们希望监听uv-from-item的点击事件，此时会导致点击uv-form-item内的uv-input后
     * 无法触发uv-form-item的点击事件，这里通过手动调用uv-form-item的方法进行触发
     */
    clickHandler() {
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
    a: _ctx.prefixIcon
  }, _ctx.prefixIcon ? {
    b: common_vendor.p({
      name: _ctx.prefixIcon,
      size: "18",
      customStyle: _ctx.prefixIconStyle,
      class: "data-v-651602aa"
    })
  } : {}, {
    c: common_vendor.s($options.inputStyle),
    d: _ctx.type,
    e: _ctx.focus,
    f: _ctx.cursor,
    g: $data.innerValue,
    h: _ctx.autoBlur,
    i: _ctx.disabled || _ctx.readonly,
    j: _ctx.maxlength,
    k: _ctx.placeholder,
    l: _ctx.placeholderStyle,
    m: _ctx.placeholderClass,
    n: _ctx.confirmType,
    o: _ctx.confirmHold,
    p: _ctx.holdKeyboard,
    q: _ctx.cursorSpacing,
    r: _ctx.adjustPosition,
    s: _ctx.selectionEnd,
    t: _ctx.selectionStart,
    v: _ctx.password || _ctx.type === "password" || void 0,
    w: _ctx.ignoreCompositionEvent,
    x: common_vendor.o((...args) => $options.onInput && $options.onInput(...args), "38"),
    y: common_vendor.o((...args) => $options.onBlur && $options.onBlur(...args), "79"),
    z: common_vendor.o((...args) => $options.onFocus && $options.onFocus(...args), "fa"),
    A: common_vendor.o((...args) => $options.onConfirm && $options.onConfirm(...args), "a5"),
    B: common_vendor.o((...args) => $options.onkeyboardheightchange && $options.onkeyboardheightchange(...args), "86"),
    C: common_vendor.o((...args) => $options.clickHandler && $options.clickHandler(...args), "b7"),
    D: $options.isShowClear
  }, $options.isShowClear ? {
    E: common_vendor.p({
      name: "close",
      size: "11",
      color: "#ffffff",
      customStyle: "line-height: 12px",
      class: "data-v-651602aa"
    }),
    F: common_vendor.o((...args) => $options.onClear && $options.onClear(...args), "5c")
  } : {}, {
    G: _ctx.suffixIcon
  }, _ctx.suffixIcon ? {
    H: common_vendor.p({
      name: _ctx.suffixIcon,
      size: "18",
      customStyle: _ctx.suffixIconStyle,
      class: "data-v-651602aa"
    })
  } : {}, {
    I: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
    J: common_vendor.n($options.inputClass),
    K: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass),
    L: common_vendor.s($options.wrapperStyle),
    M: common_vendor.s({
      "--status-bar-height": `${_ctx.u_s_b_h}px`
    })
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-651602aa"]]);
wx.createComponent(Component);
