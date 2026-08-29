"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
const utils_toast = require("../../utils/toast.js");
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
class ForgotPasswordForm extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          mobile: { type: String, optional: false },
          smsCode: { type: String, optional: false },
          password: { type: String, optional: false },
          confirmPassword: { type: String, optional: false }
        };
      },
      name: "ForgotPasswordForm"
    };
  }
  constructor(options, metadata = ForgotPasswordForm.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.mobile = this.__props__.mobile;
    this.smsCode = this.__props__.smsCode;
    this.password = this.__props__.password;
    this.confirmPassword = this.__props__.confirmPassword;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "forgot-password",
  setup(__props) {
    const currentStep = common_vendor.ref(1);
    const stepItems = ["验证身份", "设置密码", "完成"];
    const form = common_vendor.ref(new ForgotPasswordForm({
      mobile: "",
      smsCode: "",
      password: "",
      confirmPassword: ""
    }));
    const smsCooldown = common_vendor.ref(0);
    const smsSending = common_vendor.ref(false);
    const resetSubmitting = common_vendor.ref(false);
    let smsCooldownTimer = null;
    const isIdentityVerificationReady = common_vendor.computed(() => {
      return /^1[3-9]\d{9}$/.test(form.value.mobile) && /^\d{6}$/.test(form.value.smsCode);
    });
    const isPasswordResetReady = common_vendor.computed(() => {
      const password = form.value.password;
      let categoryCount = 0;
      if (/[0-9]/.test(password))
        categoryCount += 1;
      if (/[A-Za-z]/.test(password))
        categoryCount += 1;
      if (/[^A-Za-z0-9]/.test(password))
        categoryCount += 1;
      return password.length >= 8 && password.length <= 16 && categoryCount >= 2 && form.value.confirmPassword != "" && password == form.value.confirmPassword && !resetSubmitting.value;
    });
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
        if (smsCooldown.value > 0 || smsSending.value || !isValidMobile())
          return Promise.resolve(null);
        try {
          smsSending.value = true;
          const response = yield api_request.sendSmsForgotPasswordCode(new api_request.SendSmsCodeRequest({
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
    const goToPasswordStep = () => {
      if (!isValidMobile() || !isValidSmsCode())
        return null;
      currentStep.value = 2;
    };
    const completePasswordReset = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (resetSubmitting.value)
          return Promise.resolve(null);
        if (form.value.password == "") {
          utils_toast.showAppToast({ title: "请输入新密码", icon: "none" });
          return Promise.resolve(null);
        }
        if (!isValidPassword())
          return Promise.resolve(null);
        if (form.value.confirmPassword == "") {
          utils_toast.showAppToast({ title: "请再次输入新密码", icon: "none" });
          return Promise.resolve(null);
        }
        if (form.value.password != form.value.confirmPassword) {
          utils_toast.showAppToast({ title: "两次输入的密码不一致", icon: "none" });
          return Promise.resolve(null);
        }
        try {
          resetSubmitting.value = true;
          const response = yield api_request.resetForgotPassword(new api_request.ForgotPasswordResetRequest({
            tenantId: null,
            phonenumber: form.value.mobile,
            smsCode: form.value.smsCode,
            newPassword: form.value.password,
            confirmPassword: form.value.confirmPassword
          }));
          if (response.code != 200) {
            utils_toast.showAppToast({ title: response.msg || "密码重置失败，请稍后重试", icon: "none" });
            return Promise.resolve(null);
          }
          currentStep.value = 3;
        } catch (error) {
          utils_toast.showAppToast({ title: "密码重置失败，请检查网络后重试", icon: "none" });
        } finally {
          resetSubmitting.value = false;
        }
      });
    };
    const returnToLogin = () => {
      stopSmsCooldown();
      form.value = { mobile: "", smsCode: "", password: "", confirmPassword: "" };
      common_vendor.index.reLaunch({ url: "/pages/login/login" });
    };
    common_vendor.onUnmounted(() => {
      stopSmsCooldown();
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.p({
          title: "找回密码",
          ["show-back"]: true,
          backgroundColor: "#fbfcfe",
          textColor: "#333333",
          showCapsule: false,
          class: "data-v-9b840811"
        }),
        b: currentStep.value > 1 ? 1 : "",
        c: currentStep.value > 1 ? 1 : "",
        d: currentStep.value > 2 ? 1 : "",
        e: currentStep.value > 2 ? 1 : "",
        f: common_vendor.f(stepItems, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: common_vendor.n("forgot-password-steps__title--" + index),
            d: common_vendor.n({
              "forgot-password-steps__title--active": index < currentStep.value
            })
          };
        }),
        g: currentStep.value == 1
      }, currentStep.value == 1 ? {
        h: common_vendor.o(($event) => {
          return form.value.mobile = $event;
        }, "df"),
        i: common_vendor.p({
          placeholder: "请输入绑定的手机号",
          type: "number",
          maxlength: 11,
          clearable: true,
          height: "110rpx",
          round: "25rpx",
          borderColor: "#d7e3ef",
          placeholderStyle: "color:#a8b8ca;font-size:28rpx;",
          fontSize: "28rpx",
          color: "#333333",
          modelValue: form.value.mobile,
          class: "form-input data-v-9b840811"
        }),
        j: common_vendor.t(smsCooldown.value > 0 ? smsCooldown.value + "秒后重试" : "获取验证码"),
        k: smsCooldown.value > 0 || smsSending.value ? 1 : "",
        l: common_vendor.o(requestSmsCode, "30"),
        m: common_vendor.o(($event) => {
          return form.value.smsCode = $event;
        }, "c7"),
        n: common_vendor.p({
          placeholder: "请输入6位验证码",
          type: "number",
          maxlength: 6,
          clearable: true,
          height: "110rpx",
          round: "25rpx",
          borderColor: "#d7e3ef",
          placeholderStyle: "color:#a8b8ca;font-size:28rpx;",
          fontSize: "28rpx",
          color: "#333333",
          modelValue: form.value.smsCode,
          class: "form-input sms-code-input data-v-9b840811"
        }),
        o: common_vendor.o(goToPasswordStep, "8b"),
        p: common_vendor.p({
          type: "primary",
          block: true,
          round: "25rpx",
          color: "#3485df",
          customStyle: "height:104rpx;",
          disabled: !isIdentityVerificationReady.value,
          class: "submit-button data-v-9b840811"
        })
      } : currentStep.value == 2 ? {
        r: common_vendor.o(($event) => {
          return form.value.password = $event;
        }, "a6"),
        s: common_vendor.p({
          placeholder: "请输入新密码",
          password: true,
          height: "110rpx",
          round: "25rpx",
          borderColor: "#d7e3ef",
          placeholderStyle: "color:#a8b8ca;font-size:28rpx;",
          fontSize: "28rpx",
          color: "#333333",
          modelValue: form.value.password,
          class: "form-input data-v-9b840811"
        }),
        t: common_vendor.o(($event) => {
          return form.value.confirmPassword = $event;
        }, "77"),
        v: common_vendor.p({
          placeholder: "请再次输入新密码",
          password: true,
          height: "110rpx",
          round: "25rpx",
          borderColor: "#d7e3ef",
          placeholderStyle: "color:#a8b8ca;font-size:28rpx;",
          fontSize: "28rpx",
          color: "#333333",
          modelValue: form.value.confirmPassword,
          class: "form-input confirm-password-input data-v-9b840811"
        }),
        w: common_vendor.o(completePasswordReset, "95"),
        x: common_vendor.p({
          type: "primary",
          block: true,
          round: "25rpx",
          color: "#3485df",
          customStyle: "height:104rpx;",
          loading: resetSubmitting.value,
          disabled: !isPasswordResetReady.value,
          class: "submit-button password-submit-button data-v-9b840811"
        })
      } : {
        y: common_vendor.o(returnToLogin, "e5"),
        z: common_vendor.p({
          type: "primary",
          block: true,
          round: "25rpx",
          color: "#3485df",
          customStyle: "height:104rpx;",
          class: "submit-button success-button data-v-9b840811"
        })
      }, {
        q: currentStep.value == 2,
        A: `${_ctx.u_s_b_h}px`,
        B: `${_ctx.u_s_a_i_b}px`,
        C: common_vendor.p({
          class: "data-v-9b840811"
        })
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9b840811"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/forgot-password.js.map
