"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_uv_avatar_1 = common_vendor.resolveComponent("uv-avatar");
  const _easycom_uv_badge_1 = common_vendor.resolveComponent("uv-badge");
  (_easycom_uv_avatar_1 + _easycom_uv_badge_1)();
}
const _easycom_uv_avatar = () => "../../uni_modules/uv-avatar/components/uv-avatar/uv-avatar.js";
const _easycom_uv_badge = () => "../../uni_modules/uv-badge/components/uv-badge/uv-badge.js";
if (!Math) {
  (_easycom_uv_avatar + _easycom_uv_badge)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "userCenter",
  setup(__props) {
    common_vendor.onLoad(() => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const res = yield api_request.getUserInfo();
        common_vendor.index.__f__("log", "at pages/userCenter/userCenter.uvue:26", res);
      });
    });
    const userInfo = new UTSJSONObject({
      avatar: "/static/avatar.png",
      nickname: "123456789"
    });
    const carsnumber = common_vendor.ref(3);
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.p({
          src: userInfo.avatar,
          shape: "circle"
        }),
        b: common_vendor.t(userInfo.nickname),
        c: common_vendor.p({
          type: "error",
          value: common_vendor.unref(carsnumber)
        }),
        d: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/userCenter/userCenter.js.map
