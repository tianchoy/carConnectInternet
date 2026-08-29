"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
const utils_toast = require("../../utils/toast.js");
const utils_modal = require("../../utils/modal.js");
const api_http = require("../../api/http.js");
const services_appStartup = require("../../services/app-startup.js");
const utils_legal = require("../../utils/legal.js");
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
class RegisterForm extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          password: { type: String, optional: false },
          mobile: { type: String, optional: false },
          smsCode: { type: String, optional: false }
        };
      },
      name: "RegisterForm"
    };
  }
  constructor(options, metadata = RegisterForm.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.password = this.__props__.password;
    this.mobile = this.__props__.mobile;
    this.smsCode = this.__props__.smsCode;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "register",
  setup(__props) {
    const form = common_vendor.ref(new RegisterForm({
      password: "",
      mobile: "",
      smsCode: ""
    }));
    const agreementAccepted = common_vendor.ref(false);
    const smsCooldown = common_vendor.ref(0);
    const smsSending = common_vendor.ref(false);
    const submitting = common_vendor.ref(false);
    let smsCooldownTimer = null;
    const isRegisterSubmitReady = common_vendor.computed(() => {
      const password = form.value.password;
      let categoryCount = 0;
      if (/[0-9]/.test(password))
        categoryCount += 1;
      if (/[A-Za-z]/.test(password))
        categoryCount += 1;
      if (/[^A-Za-z0-9]/.test(password))
        categoryCount += 1;
      return /^1[3-9]\d{9}$/.test(form.value.mobile) && /^\d{6}$/.test(form.value.smsCode) && password.length >= 8 && password.length <= 16 && categoryCount >= 2 && agreementAccepted.value && !submitting.value;
    });
    const toggleAgreement = () => {
      agreementAccepted.value = !agreementAccepted.value;
    };
    const isValidMobile = () => {
      if (!/^1[3-9]\d{9}$/.test(form.value.mobile)) {
        utils_toast.showAppToast({ title: "请输入正确的手机号", icon: "none" });
        return false;
      }
      return true;
    };
    const isValidSmsCode = () => {
      if (!/^\d{6}$/.test(form.value.smsCode)) {
        utils_toast.showAppToast({ title: "请输入6位短信验证码", icon: "none" });
        return false;
      }
      return true;
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
    const stopSmsCooldown = () => {
      const timer = smsCooldownTimer;
      if (timer != null) {
        clearInterval(timer);
        smsCooldownTimer = null;
      }
    };
    const startSmsCooldown = () => {
      stopSmsCooldown();
      smsCooldown.value = 60;
      smsCooldownTimer = setInterval(() => {
        smsCooldown.value -= 1;
        if (smsCooldown.value <= 0) {
          smsCooldown.value = 0;
          stopSmsCooldown();
        }
      }, 1e3);
    };
    const requestSmsCode = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (smsCooldown.value > 0 || smsSending.value)
          return Promise.resolve(null);
        if (!isValidMobile())
          return Promise.resolve(null);
        try {
          smsSending.value = true;
          const response = yield api_request.sendSmsRegisterCode(new api_request.SendSmsCodeRequest({
            tenantId: null,
            phonenumber: form.value.mobile
          }));
          if (response.code != 200) {
            utils_toast.showAppToast({ title: response.msg || "验证码发送失败", icon: "none" });
            return Promise.resolve(null);
          }
          startSmsCooldown();
          utils_toast.showAppToast({ title: "验证码已发送", icon: "success" });
        } catch (error) {
          utils_toast.showAppToast({ title: "验证码发送失败，请检查网络", icon: "none" });
        } finally {
          smsSending.value = false;
        }
      });
    };
    const validateForm = () => {
      if (!isValidMobile())
        return false;
      if (!isValidSmsCode())
        return false;
      if (form.value.password == "") {
        utils_toast.showAppToast({ title: "请设置登录密码", icon: "none" });
        return false;
      }
      if (!isValidPassword())
        return false;
      if (!agreementAccepted.value) {
        utils_toast.showAppToast({ title: "请先阅读并同意用户协议", icon: "none" });
        return false;
      }
      return true;
    };
    const completeLogin = (token) => {
      if (token == "") {
        utils_toast.showAppToast({ title: "注册失败，请重试", icon: "none" });
        return null;
      }
      common_vendor.index.setStorageSync("token", token);
      api_http.resetTokenExpiredState();
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
    const submitRegister = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (submitting.value || !validateForm())
          return Promise.resolve(null);
        try {
          submitting.value = true;
          const response = yield api_request.registerPersonalUser(new api_request.RegisterRequest({
            username: null,
            clientId: null,
            tenantId: null,
            password: form.value.password,
            confirmPassword: form.value.password,
            phonenumber: form.value.mobile,
            smsCode: form.value.smsCode
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
    const backToLogin = () => {
      common_vendor.index.reLaunch({ url: "/pages/login/login" });
    };
    const gotoAgreement = () => {
      utils_modal.showAppModal(new common_vendor.UTSJSONObject({ title: "用户协议", content: utils_legal.userAgreement, showCancel: false }));
    };
    const gotoPrivacy = () => {
      utils_modal.showAppModal(new common_vendor.UTSJSONObject({ title: "隐私政策", content: utils_legal.privacyPolicy, showCancel: false }));
    };
    common_vendor.onUnmounted(() => {
      stopSmsCooldown();
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
          class: "data-v-3038f9e3"
        }),
        b: common_vendor.o(($event) => {
          return form.value.mobile = $event;
        }, "24"),
        c: common_vendor.p({
          placeholder: "请输入手机号",
          type: "number",
          maxlength: 11,
          round: "25rpx",
          clearable: true,
          height: "110rpx",
          borderColor: "#d7e3ef",
          placeholderStyle: "color:#a8b8ca;font-size:28rpx;",
          fontSize: "28rpx",
          color: "#333333",
          modelValue: form.value.mobile,
          class: "register-input data-v-3038f9e3"
        }),
        d: common_vendor.t(smsCooldown.value > 0 ? smsCooldown.value + "秒后重试" : "获取验证码"),
        e: smsCooldown.value > 0 || smsSending.value ? 1 : "",
        f: common_vendor.o(requestSmsCode, "67"),
        g: common_vendor.o(($event) => {
          return form.value.smsCode = $event;
        }, "c9"),
        h: common_vendor.p({
          placeholder: "请输入6位短信验证码",
          type: "number",
          maxlength: 6,
          round: "25rpx",
          clearable: true,
          height: "110rpx",
          borderColor: "#d7e3ef",
          placeholderStyle: "color:#a8b8ca;font-size:28rpx;",
          fontSize: "28rpx",
          color: "#333333",
          modelValue: form.value.smsCode,
          class: "register-input sms-code-input data-v-3038f9e3"
        }),
        i: common_vendor.o(($event) => {
          return form.value.password = $event;
        }, "23"),
        j: common_vendor.p({
          placeholder: "请设置登录密码",
          password: true,
          round: "25rpx",
          height: "110rpx",
          borderColor: "#d7e3ef",
          placeholderStyle: "color:#a8b8ca;font-size:28rpx;",
          fontSize: "28rpx",
          color: "#333333",
          modelValue: form.value.password,
          class: "register-input password-input data-v-3038f9e3"
        }),
        k: common_vendor.o(toggleAgreement, "f6"),
        l: common_vendor.p({
          checked: agreementAccepted.value,
          size: "40rpx",
          round: "25rpx",
          iconSize: "28rpx",
          activeColor: "#3485df",
          inactiveColor: "#a9bfd7",
          class: "data-v-3038f9e3"
        }),
        m: common_vendor.o(gotoAgreement, "7b"),
        n: common_vendor.o(gotoPrivacy, "a0"),
        o: common_vendor.o(submitRegister, "21"),
        p: common_vendor.p({
          type: "primary",
          block: true,
          round: "25rpx",
          color: "#3485df",
          customStyle: "height:104rpx;",
          loading: submitting.value,
          disabled: !isRegisterSubmitReady.value,
          class: "submit-button data-v-3038f9e3"
        }),
        q: common_vendor.o(backToLogin, "a5"),
        r: `${_ctx.u_s_b_h}px`,
        s: `${_ctx.u_s_a_i_b}px`,
        t: common_vendor.p({
          class: "data-v-3038f9e3"
        }),
        v: common_vendor.p({
          class: "data-v-3038f9e3"
        })
      };
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3038f9e3"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/register.js.map
