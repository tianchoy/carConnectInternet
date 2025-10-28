"use strict";
var _a, _b;
const common_vendor = require("../../../../common/vendor.js");
const props = {
  props: {
    // 标题
    title: {
      type: [String, Number],
      default: ""
    },
    // 描述文本
    desc: {
      type: [String, Number],
      default: ""
    },
    // 图标大小
    iconSize: {
      type: [String, Number],
      default: 17
    },
    // 当前步骤是否处于失败状态
    error: {
      type: Boolean,
      default: false
    },
    ...(_b = (_a = common_vendor.index.$uv) == null ? void 0 : _a.props) == null ? void 0 : _b.stepsItem
  }
};
exports.props = props;
