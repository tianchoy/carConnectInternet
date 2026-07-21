"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_icon_1 = common_vendor.resolveComponent("i-icon");
  const _easycom_i_badge_1 = common_vendor.resolveComponent("i-badge");
  (_easycom_custom_navBar_1 + _easycom_i_icon_1 + _easycom_i_badge_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_i_icon = () => "../../uni_modules/i-ui-x/components/i-icon/i-icon.js";
const _easycom_i_badge = () => "../../uni_modules/i-ui-x/components/i-badge/i-badge.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_icon + _easycom_i_badge)();
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
      const accountInfo = common_vendor.wx$1.getAccountInfoSync();
      const appVersion = accountInfo.miniProgram.version;
      version.value = appVersion;
    });
    const contactCustomerService = () => {
      common_vendor.index.openCustomerServiceChat(new common_vendor.UTSJSONObject({
        extInfo: new common_vendor.UTSJSONObject({ url: "https://work.weixin.qq.com/kfid/kfc030824eb947a0c9a" }),
        corpId: "ww686122ec6a4db85a",
        success(res = null) {
          common_vendor.index.__f__("log", "at pages/userCenter/userCenter.uvue:112", res);
        }
      }));
    };
    const onMoveChange = (e) => {
      const detail = e.getJSON("detail");
      const x = detail != null ? detail.getNumber("x", 0) : 0;
      const y = detail != null ? detail.getNumber("y", 0) : 0;
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
          name: "/static/avatar.png",
          fontSize: "40"
        }),
        c: common_vendor.unref(Login)
      }, common_vendor.unref(Login) ? {
        d: common_vendor.t(common_vendor.unref(userInfo).mobile)
      } : {}, {
        e: common_vendor.p({
          name: "/static/arrow-right.png",
          fontSize: "15"
        }),
        f: common_vendor.o(userInfoDetail, "0c"),
        g: common_vendor.unref(Login)
      }, common_vendor.unref(Login) ? {
        h: common_vendor.p({
          type: "danger",
          maxCount: "99",
          count: common_vendor.unref(carsnumber)
        }),
        i: common_vendor.p({
          name: "/static/arrow-right.png",
          fontSize: "15"
        }),
        j: common_vendor.o(carList, "66"),
        k: common_vendor.o(platformRenewal, "57")
      } : {}, {
        l: common_vendor.unref(version)
      }, common_vendor.unref(version) ? {
        m: common_vendor.t(common_vendor.unref(version))
      } : {}, {
        n: common_vendor.p({
          name: "/static/server-man.png",
          fontSize: "20"
        }),
        o: common_vendor.o(contactCustomerService, "f1"),
        p: common_vendor.unref(moveX),
        q: common_vendor.unref(moveY),
        r: common_vendor.o(onMoveChange, "ee"),
        s: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        t: `${_ctx.u_s_b_h}px`,
        v: `${_ctx.u_s_a_i_b}px`,
        w: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/userCenter/userCenter.js.map
