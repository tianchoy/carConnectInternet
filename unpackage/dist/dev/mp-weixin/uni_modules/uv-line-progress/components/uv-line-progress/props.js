"use strict";
var _a, _b;
const common_vendor = require("../../../../common/vendor.js");
const props = {
  props: {
    // 激活部分的颜色
    activeColor: {
      type: String,
      default: "#19be6b"
    },
    inactiveColor: {
      type: String,
      default: "#ececec"
    },
    // 进度百分比，数值
    percentage: {
      type: [String, Number],
      default: 0
    },
    // 是否在进度条内部显示百分比的值
    showText: {
      type: Boolean,
      default: true
    },
    // 进度条的高度，单位px
    height: {
      type: [String, Number],
      default: 12
    },
    ...(_b = (_a = common_vendor.index.$uv) == null ? void 0 : _a.props) == null ? void 0 : _b.lineProgress
  }
};
exports.props = props;
