"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {};
if (!Array) {
  const _easycom_custom_navBar2 = common_vendor.resolveComponent("custom-navBar");
  _easycom_custom_navBar2();
}
const _easycom_custom_navBar = () => "../../../components/custom-navBar/custom-navBar.js";
if (!Math) {
  _easycom_custom_navBar();
}
function _sfc_render(_ctx, _cache) {
  "raw js";
  return {
    a: common_vendor.p({
      title: "支付",
      ["show-back"]: true,
      backgroundColor: "#fff",
      textColor: "#333",
      showCapsule: false,
      isIcon: true,
      isShowStyle: true
    }),
    b: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/userCenter/renewal/renewal.js.map
