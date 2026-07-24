"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_toast = require("../../../utils/toast.js");
const api_request = require("../../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_icon_1 = common_vendor.resolveComponent("i-icon");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  (_easycom_custom_navBar_1 + _easycom_i_icon_1 + _easycom_app_toast_1)();
}
const _easycom_custom_navBar = () => "../../../components/custom-navBar/custom-navBar.js";
const _easycom_i_icon = () => "../../../uni_modules/i-ui-x/components/i-icon/i-icon.js";
const _easycom_app_toast = () => "../../../components/app-toast/app-toast.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_icon + _easycom_app_toast)();
}
class UserInfo extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          id: { type: String, optional: false },
          mobile: { type: String, optional: false },
          type: { type: Number, optional: false },
          createTime: { type: String, optional: false }
        };
      },
      name: "UserInfo"
    };
  }
  constructor(options, metadata = UserInfo.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.id = this.__props__.id;
    this.mobile = this.__props__.mobile;
    this.type = this.__props__.type;
    this.createTime = this.__props__.createTime;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "userInfo",
  setup(__props) {
    const userInfo = common_vendor.ref(new UserInfo({
      id: "",
      mobile: "",
      type: 0,
      createTime: ""
    }));
    common_vendor.onLoad((options) => {
      if (options.userInfo != null) {
        try {
          const parsedInfo = common_vendor.UTS.JSON.parse(decodeURIComponent(options.userInfo));
          const userId = parsedInfo.getString("userId");
          const mobile = parsedInfo.getString("mobile");
          const type = parsedInfo.getNumber("type");
          const createTime = parsedInfo.getString("createTime");
          userInfo.value = {
            id: userId != null ? userId : "",
            mobile: mobile != null ? mobile : "",
            type: type != null ? type : 0,
            createTime: createTime != null ? createTime : ""
          };
          common_vendor.index.__f__("log", "at pages/userCenter/userInfo/userInfo.uvue:82", "用户信息:", userInfo.value);
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/userCenter/userInfo/userInfo.uvue:84", "解析用户信息失败:", e);
        }
      }
    });
    const editPassword = () => {
      common_vendor.index.navigateTo({
        url: "/pages/userCenter/editPassword/editPassword"
      });
    };
    const logoutBtn = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const res = yield api_request.logout();
        if (res.code == 0) {
          common_vendor.index.removeStorageSync("token");
          common_vendor.index.reLaunch({
            url: "/pages/login/login"
          });
        } else {
          utils_toast.showAppToast({
            title: "退出账户失败"
          });
        }
      });
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.p({
          title: "个人信息",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.t(common_vendor.unref(userInfo).id),
        c: common_vendor.t(common_vendor.unref(userInfo).mobile),
        d: common_vendor.t(common_vendor.unref(userInfo).type == 1 ? "公司用户" : "个人用户"),
        e: common_vendor.t(common_vendor.unref(userInfo).createTime),
        f: common_vendor.unref(userInfo).type == 1
      }, common_vendor.unref(userInfo).type == 1 ? {} : {}, {
        g: common_vendor.unref(userInfo).type == 1
      }, common_vendor.unref(userInfo).type == 1 ? {
        h: common_vendor.p({
          name: "/static/arrow-right.png",
          fontSize: "15"
        }),
        i: common_vendor.o(editPassword, "1b")
      } : {}, {
        j: common_vendor.o(logoutBtn, "4e"),
        k: `${_ctx.u_s_b_h}px`,
        l: `${_ctx.u_s_a_i_b}px`
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/userCenter/userInfo/userInfo.js.map
