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
    const carsnumber = common_vendor.ref(0);
    common_vendor.onShow(() => {
      loadData();
    });
    const loadData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a;
        let params = new UTSJSONObject({});
        const res = yield api_request.getUserInfo();
        userInfo.value = res.data;
        const resCars = yield api_request.getUserDeviceList(params);
        common_vendor.index.__f__("log", "at pages/userCenter/userCenter.uvue:49", "API响应数据:", resCars);
        if ((_a = resCars === null || resCars === void 0 ? null : resCars.data) === null || _a === void 0 ? null : _a.totalCount) {
          carsnumber.value = resCars.data.totalCount;
        }
      });
    };
    const userInfoDetail = () => {
      common_vendor.index.navigateTo({
        url: "/pages/userCenter/userInfo/userInfo?userInfo=" + encodeURIComponent(UTS.JSON.stringify(userInfo.value))
      });
    };
    const carList = () => {
      common_vendor.index.navigateTo({
        url: "/pages/userCenter/carList/carList"
      });
    };
    const platformRenewal = () => {
      common_vendor.index.showToast({
        title: "功能开发中…",
        icon: "none"
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
          size: "20"
        }),
        e: common_vendor.o(userInfoDetail),
        f: common_vendor.p({
          numberType: "overflow",
          type: "error",
          max: "99",
          value: common_vendor.unref(carsnumber)
        }),
        g: common_vendor.p({
          name: "arrow-right",
          size: "20"
        }),
        h: common_vendor.o(carList),
        i: common_vendor.o(platformRenewal),
        j: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/userCenter/userCenter.js.map
