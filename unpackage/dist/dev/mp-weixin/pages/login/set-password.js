"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
const api_http = require("../../api/http.js");
const services_appStartup = require("../../services/app-startup.js");
const utils_toast = require("../../utils/toast.js");
const services_auth_smsRegisterContext = require("../../services/auth/sms-register-context.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_input_1 = common_vendor.resolveComponent("i-input");
  const _easycom_i_button_1 = common_vendor.resolveComponent("i-button");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  (_easycom_custom_navBar_1 + _easycom_i_input_1 + _easycom_i_button_1 + _easycom_app_toast_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_i_input = () => "../../uni_modules/i-ui-x/components/i-input/i-input.js";
const _easycom_i_button = () => "../../uni_modules/i-ui-x/components/i-button/i-button.js";
const _easycom_app_toast = () => "../../components/app-toast/app-toast.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_input + _easycom_i_button + _easycom_app_toast)();
}
class PasswordForm extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          password: { type: String, optional: false },
          confirmPassword: { type: String, optional: false }
        };
      },
      name: "PasswordForm"
    };
  }
  constructor(options, metadata = PasswordForm.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.password = this.__props__.password;
    this.confirmPassword = this.__props__.confirmPassword;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "set-password",
  setup(__props) {
    const form = common_vendor.ref(new PasswordForm({
      password: "",
      confirmPassword: ""
    }));
    const submitting = common_vendor.ref(false);
    let registerContext = null;
    const returnToLogin = () => {
      services_auth_smsRegisterContext.clearSmsRegisterContext();
      common_vendor.index.reLaunch({ url: "/pages/login/login" });
    };
    const completeLogin = (token) => {
      if (token == "") {
        utils_toast.showAppToast({ title: "注册失败，请重试", icon: "none" });
        return null;
      }
      common_vendor.index.setStorageSync("token", token);
      api_http.resetTokenExpiredState();
      services_auth_smsRegisterContext.clearSmsRegisterContext();
      utils_toast.showAppToast({ title: "注册成功", icon: "success" });
      setTimeout(() => {
        common_vendor.index.reLaunch({
          url: "/pages/index/index",
          success: () => {
            services_appStartup.schedulePostLoginInitialization();
          }
        });
      }, 500);
    };
    const isValidPassword = () => {
      const password = form.value.password;
      if (password.length < 8 || password.length > 16) {
        utils_toast.showAppToast({ title: "密码长度应为8至16位", icon: "none" });
        return false;
      }
      let categoryCount = 0;
      if (/[0-9]/.test(password))
        categoryCount += 1;
      if (/[A-Za-z]/.test(password))
        categoryCount += 1;
      if (/[^A-Za-z0-9]/.test(password))
        categoryCount += 1;
      if (categoryCount < 2) {
        utils_toast.showAppToast({ title: "密码需包含至少两种字符类型", icon: "none" });
        return false;
      }
      return true;
    };
    const validateForm = () => {
      if (form.value.password == "") {
        utils_toast.showAppToast({ title: "请设置登录密码", icon: "none" });
        return false;
      }
      if (!isValidPassword())
        return false;
      if (form.value.confirmPassword == "") {
        utils_toast.showAppToast({ title: "请再次输入登录密码", icon: "none" });
        return false;
      }
      if (form.value.password != form.value.confirmPassword) {
        utils_toast.showAppToast({ title: "两次输入的密码不一致", icon: "none" });
        return false;
      }
      return true;
    };
    const submitRegister = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const context = registerContext;
        if (submitting.value || !validateForm())
          return Promise.resolve(null);
        if (context == null) {
          utils_toast.showAppToast({ title: "注册信息已失效，请重新获取验证码", icon: "none" });
          returnToLogin();
          return Promise.resolve(null);
        }
        try {
          submitting.value = true;
          const response = yield api_request.registerPersonalUser(new api_request.RegisterRequest({
            username: null,
            clientId: null,
            tenantId: null,
            password: form.value.password,
            confirmPassword: form.value.confirmPassword,
            phonenumber: context.phonenumber,
            smsCode: context.smsCode
          }));
          const token = response.data != null ? response.data.getString("access_token", "") : "";
          if (response.code == 200 && token != "") {
            completeLogin(token);
            return Promise.resolve(null);
          }
          utils_toast.showAppToast({ title: response.msg || "注册失败，请稍后重试", icon: "none" });
        } catch (error) {
          utils_toast.showAppToast({ title: "注册失败，请检查网络后重试", icon: "none" });
        } finally {
          submitting.value = false;
        }
      });
    };
    common_vendor.onMounted(() => {
      registerContext = services_auth_smsRegisterContext.getSmsRegisterContext();
      if (registerContext == null) {
        utils_toast.showAppToast({ title: "注册信息已失效，请重新获取验证码", icon: "none" });
        setTimeout(() => {
          returnToLogin();
        }, 300);
      }
    });
    common_vendor.onUnmounted(() => {
      if (!submitting.value && registerContext != null)
        services_auth_smsRegisterContext.clearSmsRegisterContext();
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
        a: common_vendor.p({
          title: "",
          ["show-back"]: true,
          backgroundColor: "#fbfcfe",
          textColor: "#333333",
          showCapsule: false,
          class: "data-v-6fabe61f"
        }),
        b: common_vendor.o(($event) => {
          return form.value.password = $event;
        }, "be"),
        c: common_vendor.p({
          placeholder: "请设置登录密码",
          password: true,
          height: "110rpx",
          round: "25rpx",
          borderColor: "#d7e3ef",
          placeholderStyle: "color:#a8b8ca;font-size:34rpx;",
          fontSize: "34rpx",
          color: "#333333",
          modelValue: form.value.password,
          class: "password-input data-v-6fabe61f"
        }),
        d: common_vendor.o(($event) => {
          return form.value.confirmPassword = $event;
        }, "57"),
        e: common_vendor.p({
          placeholder: "请再次输入登录密码",
          password: true,
          height: "110rpx",
          round: "25rpx",
          borderColor: "#d7e3ef",
          placeholderStyle: "color:#a8b8ca;font-size:34rpx;",
          fontSize: "34rpx",
          color: "#333333",
          modelValue: form.value.confirmPassword,
          class: "password-input confirm-password-input data-v-6fabe61f"
        }),
        f: common_vendor.o(submitRegister, "05"),
        g: common_vendor.p({
          type: "primary",
          block: true,
          round: "25rpx",
          color: "#3485df",
          customStyle: "height:104rpx;",
          loading: submitting.value,
          class: "submit-button data-v-6fabe61f"
        }),
        h: `${_ctx.u_s_b_h}px`,
        i: `${_ctx.u_s_a_i_b}px`,
        j: common_vendor.p({
          class: "data-v-6fabe61f"
        })
      };
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6fabe61f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/set-password.js.map
