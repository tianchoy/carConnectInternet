"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {};
if (!Array) {
  const _easycom_uv_avatar2 = common_vendor.resolveComponent("uv-avatar");
  const _easycom_uv_badge2 = common_vendor.resolveComponent("uv-badge");
  (_easycom_uv_avatar2 + _easycom_uv_badge2)();
}
const _easycom_uv_avatar = () => "../../uni_modules/uv-avatar/components/uv-avatar/uv-avatar.js";
const _easycom_uv_badge = () => "../../uni_modules/uv-badge/components/uv-badge/uv-badge.js";
if (!Math) {
  (_easycom_uv_avatar + _easycom_uv_badge)();
}
function _sfc_render(_ctx, _cache) {
  return {
    a: common_vendor.p({
      src: "/static/avatar.png",
      shape: "circle"
    }),
    b: common_vendor.p({
      type: "error",
      value: 3
    }),
    c: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/userCenter/userCenter.js.map
