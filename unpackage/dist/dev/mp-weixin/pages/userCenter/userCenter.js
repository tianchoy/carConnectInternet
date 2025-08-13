"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_avatar_1 = common_vendor.resolveComponent("uv-avatar");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_badge_1 = common_vendor.resolveComponent("uv-badge");
  (_easycom_custom_navBar_1 + _easycom_uv_avatar_1 + _easycom_uv_icon_1 + _easycom_uv_badge_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_avatar = () => "../../uni_modules/uv-avatar/components/uv-avatar/uv-avatar.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_badge = () => "../../uni_modules/uv-badge/components/uv-badge/uv-badge.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_avatar + _easycom_uv_icon + _easycom_uv_badge)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "userCenter",
  setup(__props) {
    const userInfo = common_vendor.ref(new UTSJSONObject({
      avatar: "/static/avatar.png",
      username: "123456789"
    }));
    const carsnumber = common_vendor.ref(3);
    common_vendor.onLoad(() => {
      loadData();
    });
    const loadData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const res = yield api_request.getUserInfo();
        userInfo.value = res.data;
        common_vendor.index.__f__("log", "at pages/userCenter/userCenter.uvue:43", userInfo.value);
      });
    };
    const userInfoDetail = () => {
      common_vendor.index.navigateTo({
        url: "/pages/userCenter/userInfo/userInfo?userInfo=" + encodeURIComponent(UTS.JSON.stringify(userInfo.value))
      });
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.p({
          title: "个人中心",
          ["show-back"]: false,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.p({
          src: common_vendor.unref(userInfo).avatar,
          shape: "circle"
        }),
        c: common_vendor.t(common_vendor.unref(userInfo).username),
        d: common_vendor.p({
          name: "arrow-right",
          size: "25"
        }),
        e: common_vendor.o(userInfoDetail),
        f: common_vendor.p({
          type: "error",
          value: common_vendor.unref(carsnumber)
        }),
        g: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/userCenter/userCenter.js.map
