"use strict";
var _a, _b;
const common_vendor = require("../../../../common/vendor.js");
const props = {
  props: {
    // 倒计时总秒数
    seconds: {
      type: [String, Number],
      default: 60
    },
    // 尚未开始时提示
    startText: {
      type: String,
      default: "获取验证码"
    },
    // 正在倒计时中的提示
    changeText: {
      type: String,
      default: "X秒重新获取"
    },
    // 倒计时结束时的提示
    endText: {
      type: String,
      default: "重新获取"
    },
    // 是否在H5刷新或各端返回再进入时继续倒计时
    keepRunning: {
      type: Boolean,
      default: false
    },
    // 为了区分多个页面，或者一个页面多个倒计时组件本地存储的继续倒计时变了
    uniqueKey: {
      type: String,
      default: ""
    },
    ...(_b = (_a = common_vendor.index.$uv) == null ? void 0 : _a.props) == null ? void 0 : _b.code
  }
};
exports.props = props;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uv-code/components/uv-code/props.js.map
