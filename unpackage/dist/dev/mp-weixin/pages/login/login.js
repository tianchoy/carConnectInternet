"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_request = require("../../api/request.js");
const utils_toast = require("../../utils/toast.js");
const utils_modal = require("../../utils/modal.js");
const utils_legal = require("../../utils/legal.js");
const services_appStartup = require("../../services/app-startup.js");
const api_http = require("../../api/http.js");
require("../../services/auth/sms-register-context.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_input_1 = common_vendor.resolveComponent("i-input");
  const _easycom_i_checkbox_1 = common_vendor.resolveComponent("i-checkbox");
  const _easycom_i_button_1 = common_vendor.resolveComponent("i-button");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  const _easycom_app_modal_1 = common_vendor.resolveComponent("app-modal");
  (_easycom_custom_navBar_1 + _easycom_i_input_1 + _easycom_i_checkbox_1 + _easycom_i_button_1 + _easycom_app_toast_1 + _easycom_app_modal_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_i_input = () => "../../uni_modules/i-ui-x/components/i-input/i-input.js";
const _easycom_i_checkbox = () => "../../uni_modules/i-ui-x/components/i-checkbox/i-checkbox.js";
const _easycom_i_button = () => "../../uni_modules/i-ui-x/components/i-button/i-button.js";
const _easycom_app_toast = () => "../../components/app-toast/app-toast.js";
const _easycom_app_modal = () => "../../components/app-modal/app-modal.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_input + _easycom_i_checkbox + _easycom_i_button + _easycom_app_toast + _easycom_app_modal)();
}
class PersonalLoginForm extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          username: { type: String, optional: false },
          password: { type: String, optional: false }
        };
      },
      name: "PersonalLoginForm"
    };
  }
  constructor(options, metadata = PersonalLoginForm.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.username = this.__props__.username;
    this.password = this.__props__.password;
    delete this.__props__;
  }
}
class EnterpriseLoginForm extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          username: { type: String, optional: false },
          password: { type: String, optional: false }
        };
      },
      name: "EnterpriseLoginForm"
    };
  }
  constructor(options, metadata = EnterpriseLoginForm.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.username = this.__props__.username;
    this.password = this.__props__.password;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "login",
  setup(__props) {
    const docState = common_vendor.ref(false);
    const pswLogin = common_vendor.ref(false);
    const enterpriseForm = common_vendor.ref(new EnterpriseLoginForm({
      username: "",
      password: ""
    }));
    const rememberPassword = common_vendor.ref(false);
    const enterpriseSubmitting = common_vendor.ref(false);
    const smsLoginMode = common_vendor.ref(false);
    const personalForm = common_vendor.ref(new PersonalLoginForm({
      username: "",
      password: ""
    }));
    const personalSubmitting = common_vendor.ref(false);
    const smsMobile = common_vendor.ref("");
    const smsCode = common_vendor.ref("");
    common_vendor.ref(0);
    common_vendor.ref(false);
    const smsSubmitting = common_vendor.ref(false);
    common_vendor.ref(false);
    const isPersonalPasswordLoginReady = common_vendor.computed(() => {
      return personalForm.value.username != "" && personalForm.value.password != "";
    });
    const isSmsLoginReady = common_vendor.computed(() => {
      return /^1[3-9]\d{9}$/.test(smsMobile.value) && /^\d{6}$/.test(smsCode.value);
    });
    common_vendor.computed(() => {
      const isFormReady = smsLoginMode.value ? isSmsLoginReady.value : isPersonalPasswordLoginReady.value;
      const isSubmitting = smsLoginMode.value ? smsSubmitting.value : personalSubmitting.value;
      return isFormReady && docState.value && !isSubmitting;
    });
    const isDocState = () => {
      docState.value = !docState.value;
    };
    const completeLogin = (token) => {
      if (token == "") {
        utils_toast.showAppToast({ title: "登录失败，请重试", icon: "none" });
        return null;
      }
      common_vendor.index.setStorageSync("token", token);
      api_http.resetTokenExpiredState();
      utils_toast.showAppToast({ title: "登录成功", icon: "success" });
      setTimeout(() => {
        common_vendor.index.reLaunch({
          url: "/pages/index/index",
          success: () => {
            services_appStartup.schedulePostLoginInitialization();
          }
        });
      }, 500);
    };
    const ensureAgreementAccepted = () => {
      if (docState.value)
        return true;
      utils_toast.showAppToast({ title: "请先阅读并同意用户协议", icon: "error" });
      return false;
    };
    const loginBt = () => {
      if (!docState.value) {
        utils_toast.showAppToast({ title: "请先阅读并同意用户协议", icon: "error" });
      }
    };
    const handleGetPhoneNumber = (e = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!docState.value) {
          utils_toast.showAppToast({ title: "请先阅读并同意用户协议", icon: "error" });
          return Promise.resolve(null);
        }
        if (e.detail.errMsg === "getPhoneNumber:fail user deny") {
          utils_toast.showAppToast({ title: "您拒绝了授权", icon: "none" });
          return Promise.resolve(null);
        }
        if (e.detail.errMsg !== "getPhoneNumber:ok") {
          utils_toast.showAppToast({ title: "获取手机号失败", icon: "none" });
          return Promise.resolve(null);
        }
        try {
          common_vendor.index.showLoading(new common_vendor.UTSJSONObject({ title: "登录中..." }));
          const loginRes = yield new Promise((resolve, reject) => {
            common_vendor.index.login(new common_vendor.UTSJSONObject({ provider: "weixin", success: resolve, fail: reject }));
          });
          const res = yield api_request.PostWechatlogin(new api_request.WechatLoginRequest({
            clientId: null,
            tenantId: null,
            code: loginRes.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          }));
          const loginData = res.data;
          if (res.code != 200 || loginData == null) {
            utils_toast.showAppToast({ title: res.msg || "登录失败", icon: "none" });
            return Promise.resolve(null);
          }
          const token = loginData.getString("token", "");
          if (token == "") {
            utils_toast.showAppToast({ title: "登录失败: 未获取到token", icon: "none" });
            return Promise.resolve(null);
          }
          completeLogin(token);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/login/login.uvue:483", "微信登录失败:", error);
          utils_toast.showAppToast({ title: "微信登录失败", icon: "none" });
        } finally {
          common_vendor.index.hideLoading();
        }
      });
    };
    const gotoIndex = () => {
      common_vendor.index.reLaunch({ url: "/pages/index/index" });
    };
    const loadSavedEnterpriseAccount = () => {
      try {
        const rawAccount = common_vendor.index.getStorageSync("savedEnterpriseAccount");
        if (rawAccount == null || rawAccount == "")
          return null;
        const account = typeof rawAccount == "string" ? common_vendor.UTS.JSON.parse(rawAccount) : rawAccount;
        enterpriseForm.value.username = account.getString("username", "");
        enterpriseForm.value.password = account.getString("password", "");
        rememberPassword.value = enterpriseForm.value.username != "" || enterpriseForm.value.password != "";
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/login/login.uvue:504", "加载保存的企业账号失败:", error);
      }
    };
    const toggleEnterpriseLogin = () => {
      pswLogin.value = !pswLogin.value;
      if (pswLogin.value)
        loadSavedEnterpriseAccount();
    };
    const toggleRememberPassword = () => {
      rememberPassword.value = !rememberPassword.value;
      if (!rememberPassword.value)
        common_vendor.index.removeStorageSync("savedEnterpriseAccount");
    };
    const saveEnterpriseAccount = () => {
      if (rememberPassword.value && enterpriseForm.value.username != "" && enterpriseForm.value.password != "") {
        common_vendor.index.setStorageSync("savedEnterpriseAccount", common_vendor.UTS.JSON.stringify(new common_vendor.UTSJSONObject({ username: enterpriseForm.value.username, password: enterpriseForm.value.password })));
      } else if (!rememberPassword.value) {
        common_vendor.index.removeStorageSync("savedEnterpriseAccount");
      }
    };
    const submitEnterpriseLogin = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (enterpriseSubmitting.value || !ensureAgreementAccepted())
          return Promise.resolve(null);
        if (enterpriseForm.value.username == "") {
          utils_toast.showAppToast({ title: "请输入账号", icon: "none" });
          return Promise.resolve(null);
        }
        if (enterpriseForm.value.password == "") {
          utils_toast.showAppToast({ title: "请输入登录密码", icon: "none" });
          return Promise.resolve(null);
        }
        try {
          enterpriseSubmitting.value = true;
          const response = yield api_request.login(new api_request.LegacyEnterpriseLoginRequest({
            clientId: null,
            tenantId: null,
            username: enterpriseForm.value.username,
            password: enterpriseForm.value.password
          }));
          const token = response.data != null ? response.data.getString("access_token", response.data.getString("token", "")) : "";
          if (response.code == 200 && token != "") {
            saveEnterpriseAccount();
            completeLogin(token);
            return Promise.resolve(null);
          }
          utils_toast.showAppToast({ title: response.msg || "登录失败，请检查账号和密码", icon: "none" });
        } catch (error) {
          utils_toast.showAppToast({ title: "登录失败，请检查网络后重试", icon: "none" });
        } finally {
          enterpriseSubmitting.value = false;
        }
      });
    };
    const gotoAgreement = () => {
      utils_modal.showAppModal(new common_vendor.UTSJSONObject({ title: "用户协议", content: utils_legal.userAgreement, showCancel: false }));
    };
    const gotoPrivacy = () => {
      utils_modal.showAppModal(new common_vendor.UTSJSONObject({ title: "隐私政策", content: utils_legal.privacyPolicy, showCancel: false }));
    };
    common_vendor.onMounted(() => {
    });
    common_vendor.onUnmounted(() => {
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.p({
          title: "",
          ["show-back"]: false,
          backgroundColor: "#ffffff",
          textColor: "#333333",
          showCapsule: false,
          class: "data-v-27a30816"
        }),
        b: common_assets._imports_0,
        c: pswLogin.value
      }, pswLogin.value ? {
        d: common_vendor.o(($event) => {
          return enterpriseForm.value.username = $event;
        }, "11"),
        e: common_vendor.p({
          placeholder: "请输入账号",
          clearable: true,
          height: "100rpx",
          round: "25rpx",
          borderColor: "#d9e5f2",
          placeholderStyle: "color:#a7b8cb;font-size:28rpx;",
          fontSize: "28rpx",
          color: "#333333",
          modelValue: enterpriseForm.value.username,
          class: "login-input data-v-27a30816"
        }),
        f: common_vendor.o(($event) => {
          return enterpriseForm.value.password = $event;
        }, "74"),
        g: common_vendor.p({
          placeholder: "请输入登录密码",
          password: true,
          height: "100rpx",
          round: "25rpx",
          borderColor: "#d9e5f2",
          placeholderStyle: "color:#a7b8cb;font-size:28rpx;",
          fontSize: "28rpx",
          color: "#333333",
          modelValue: enterpriseForm.value.password,
          class: "login-input password-input data-v-27a30816"
        }),
        h: common_vendor.o(toggleRememberPassword, "b8"),
        i: common_vendor.p({
          checked: rememberPassword.value,
          label: "记住密码",
          class: "data-v-27a30816"
        }),
        j: common_vendor.o(submitEnterpriseLogin, "ba"),
        k: common_vendor.p({
          type: "primary",
          block: true,
          round: "25rpx",
          color: "#3485df",
          customStyle: "height:104rpx;",
          loading: enterpriseSubmitting.value,
          class: "login-submit data-v-27a30816"
        })
      } : common_vendor.e({
        l: !docState.value
      }, !docState.value ? {
        m: common_vendor.o(loginBt, "3a")
      } : {
        n: common_vendor.o(handleGetPhoneNumber, "63")
      }), {
        o: common_vendor.o(isDocState, "63"),
        p: common_vendor.p({
          checked: docState.value,
          size: "40rpx",
          iconSize: "28rpx",
          activeColor: "#3485df",
          inactiveColor: "#a9bfd7",
          class: "data-v-27a30816"
        }),
        q: common_vendor.o(gotoAgreement, "24"),
        r: common_vendor.o(gotoPrivacy, "02"),
        s: common_vendor.o(gotoIndex, "5b"),
        t: common_vendor.t(pswLogin.value ? "个人用户登录" : "企业用户登录"),
        v: common_vendor.o(toggleEnterpriseLogin, "4c"),
        w: `${_ctx.u_s_b_h}px`,
        x: `${_ctx.u_s_a_i_b}px`,
        y: common_vendor.p({
          class: "data-v-27a30816"
        }),
        z: common_vendor.p({
          class: "data-v-27a30816"
        })
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-27a30816"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
