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
const buttonWidth = 120;
const buttonHeight = 200;
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "userCenter",
  setup(__props) {
    const userInfo = common_vendor.ref(new common_vendor.UTSJSONObject({
      avatar: "/static/avatar.png",
      nickname: ""
    }));
    const carsnumber = common_vendor.ref(0);
    const Login = common_vendor.ref(false);
    const version = common_vendor.ref("");
    const moveX = common_vendor.ref(0);
    const moveY = common_vendor.ref(0);
    const windowWidth = common_vendor.ref(0);
    const windowHeight = common_vendor.ref(0);
    common_vendor.onShow(() => {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      windowWidth.value = systemInfo.windowWidth;
      windowHeight.value = systemInfo.windowHeight;
      moveX.value = windowWidth.value - buttonWidth - 20;
      moveY.value = windowHeight.value - buttonHeight - 20;
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        Login.value = true;
        loadData();
      } else {
        Login.value = false;
      }
      try {
        const accountInfo = common_vendor.wx$1.getAccountInfoSync();
        const appVersion = accountInfo.miniProgram.version;
        version.value = appVersion;
      } catch (error) {
        console.error("获取版本号失败:", error);
      }
    });
    const loadData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a;
        let params = new common_vendor.UTSJSONObject({});
        const res = yield api_request.getUserInfo();
        userInfo.value = res.data;
        const resCars = yield api_request.getUserDeviceList(params);
        if ((_a = resCars === null || resCars === void 0 ? null : resCars.data) === null || _a === void 0 ? null : _a.totalCount) {
          carsnumber.value = resCars.data.totalCount;
        }
      });
    };
    const onMoveChange = (e = null) => {
      const _a = e.detail, x = _a.x, y = _a.y;
      const maxX = windowWidth.value - buttonWidth;
      const maxY = windowHeight.value - buttonHeight;
      if (x < 0 || x > maxX || y < 0 || y > maxY) {
        moveX.value = Math.max(0, Math.min(maxX, x));
        moveY.value = Math.max(0, Math.min(maxY, y));
      }
    };
    const userInfoDetail = () => {
      if (Login.value) {
        common_vendor.index.navigateTo({
          url: "/pages/userCenter/userInfo/userInfo?userInfo=" + encodeURIComponent(common_vendor.UTS.JSON.stringify(userInfo.value))
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
      }
    };
    const carList = () => {
      if (Login.value) {
        common_vendor.index.navigateTo({
          url: "/pages/userCenter/carList/carList"
        });
      } else {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
      }
    };
    const platformRenewal = () => {
      if (Login.value) {
        common_vendor.index.navigateTo({
          url: "/pages/userCenter/payDeviceList/payDeviceList"
        });
      } else {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
      }
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.p({
          title: "个人中心",
          ["show-back"]: false,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.p({
          src: "/static/avatar.png",
          shape: "circle"
        }),
        c: common_vendor.unref(Login)
      }, common_vendor.unref(Login) ? {
        d: common_vendor.t(common_vendor.unref(userInfo).mobile)
      } : {}, {
        e: common_vendor.p({
          name: "arrow-right",
          size: "16"
        }),
        f: common_vendor.o(userInfoDetail, "0c"),
        g: common_vendor.unref(Login)
      }, common_vendor.unref(Login) ? {
        h: common_vendor.p({
          numberType: "overflow",
          type: "error",
          max: "99",
          value: common_vendor.unref(carsnumber)
        }),
        i: common_vendor.p({
          name: "arrow-right",
          size: "16"
        }),
        j: common_vendor.o(carList, "0b"),
        k: common_vendor.o(platformRenewal, "7f")
      } : {}, {
        l: common_vendor.unref(version)
      }, common_vendor.unref(version) ? {
        m: common_vendor.t(common_vendor.unref(version))
      } : {}, {
        n: common_vendor.p({
          name: "server-man",
          size: "50",
          color: "primary"
        }),
        o: common_vendor.unref(moveX),
        p: common_vendor.unref(moveY),
        q: common_vendor.o(onMoveChange, "ba"),
        r: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        s: `${_ctx.u_s_b_h}px`,
        t: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
