"use strict";
var _a, _b;
const common_vendor = require("../../../../common/vendor.js");
const props = {
  props: {
    value: {
      type: [Number, String],
      default: 0
    },
    modelValue: {
      type: [Number, String],
      default: 0
    },
    // 最小可选值
    min: {
      type: [Number, String],
      default: 0
    },
    // 最大可选值
    max: {
      type: [Number, String],
      default: 100
    },
    // 步长，取值必须大于 0，并且可被(max - min)整除
    step: {
      type: [Number, String],
      default: 1
    },
    // 滑块右侧已选择部分的背景色
    activeColor: {
      type: String,
      default: "#2979ff"
    },
    // 滑块左侧未选择部分的背景色
    backgroundColor: {
      type: String,
      default: "#c0c4cc"
    },
    // 滑块的大小，取值范围为 12 - 28
    blockSize: {
      type: [Number, String],
      default: 18
    },
    // 滑块的颜色
    blockColor: {
      type: String,
      default: "#ffffff"
    },
    // 禁用状态
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否显示当前的选择值
    showValue: {
      type: Boolean,
      default: false
    },
    ...(_b = (_a = common_vendor.index.$uv) == null ? void 0 : _a.props) == null ? void 0 : _b.slider
  }
};
exports.props = props;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uv-slider/components/uv-slider/props.js.map
