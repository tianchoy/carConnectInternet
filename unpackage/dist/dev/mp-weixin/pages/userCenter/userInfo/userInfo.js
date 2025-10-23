"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_request = require("../../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  (_easycom_custom_navBar_1 + _easycom_uv_icon_1)();
}
const _easycom_custom_navBar = () => "../../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_icon = () => "../../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_icon)();
}
class UserInfo extends UTS.UTSType {
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
    this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
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
      if (options.userInfo) {
        try {
          const parsedInfo = UTS.JSON.parse(decodeURIComponent(options.userInfo));
          userInfo.value = {
            id: parsedInfo.getString("userId") || "",
            mobile: parsedInfo.getString("mobile") || "",
            type: parsedInfo.getNumber("type") || 0,
            createTime: parsedInfo.getString("createTime") || ""
          };
          common_vendor.index.__f__("log", "at pages/userCenter/userInfo/userInfo.uvue:78", "用户信息:", userInfo.value);
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/userCenter/userInfo/userInfo.uvue:80", "解析用户信息失败:", e);
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
          common_vendor.index.showToast({
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
          name: "arrow-right",
          size: "18"
        }),
        i: common_vendor.o(editPassword)
      } : {}, {
        j: common_vendor.o(logoutBtn),
        k: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/userCenter/userInfo/userInfo.js.map
