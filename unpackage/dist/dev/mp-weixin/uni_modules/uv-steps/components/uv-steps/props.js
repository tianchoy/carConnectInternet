"use strict";
var _a, _b;
const common_vendor = require("../../../../common/vendor.js");
const props = {
  props: {
    // 排列方向
    direction: {
      type: String,
      default: "row"
    },
    // 设置第几个步骤
    current: {
      type: [String, Number],
      default: 0
    },
    // 激活状态颜色
    activeColor: {
      type: String,
      default: "#3c9cff"
    },
    // 未激活状态颜色
    inactiveColor: {
      type: String,
      default: "#969799"
    },
    // 激活状态的图标
    activeIcon: {
      type: String,
      default: ""
    },
    // 未激活状态图标
    inactiveIcon: {
      type: String,
      default: ""
    },
    // 是否显示点类型
    dot: {
      type: Boolean,
      default: false
    },
    ...(_b = (_a = common_vendor.index.$uv) == null ? void 0 : _a.props) == null ? void 0 : _b.steps
  }
};
exports.props = props;
