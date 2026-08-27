"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
const utils_toast = require("../../utils/toast.js");
const utils_modal = require("../../utils/modal.js");
const utils_legal = require("../../utils/legal.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_input_1 = common_vendor.resolveComponent("i-input");
  const _easycom_i_form_item_1 = common_vendor.resolveComponent("i-form-item");
  const _easycom_i_button_1 = common_vendor.resolveComponent("i-button");
  const _easycom_i_form_1 = common_vendor.resolveComponent("i-form");
  const _easycom_i_checkbox_1 = common_vendor.resolveComponent("i-checkbox");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  const _easycom_app_modal_1 = common_vendor.resolveComponent("app-modal");
  (_easycom_custom_navBar_1 + _easycom_i_input_1 + _easycom_i_form_item_1 + _easycom_i_button_1 + _easycom_i_form_1 + _easycom_i_checkbox_1 + _easycom_app_toast_1 + _easycom_app_modal_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_i_input = () => "../../uni_modules/i-ui-x/components/i-input/i-input.js";
const _easycom_i_form_item = () => "../../uni_modules/i-ui-x/components/i-form-item/i-form-item.js";
const _easycom_i_button = () => "../../uni_modules/i-ui-x/components/i-button/i-button.js";
const _easycom_i_form = () => "../../uni_modules/i-ui-x/components/i-form/i-form.js";
const _easycom_i_checkbox = () => "../../uni_modules/i-ui-x/components/i-checkbox/i-checkbox.js";
const _easycom_app_toast = () => "../../components/app-toast/app-toast.js";
const _easycom_app_modal = () => "../../components/app-modal/app-modal.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_input + _easycom_i_form_item + _easycom_i_button + _easycom_i_form + _easycom_i_checkbox + _easycom_app_toast + _easycom_app_modal)();
}
class RegisterForm extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          username: { type: String, optional: false },
          password: { type: String, optional: false },
          confirmPassword: { type: String, optional: false },
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
    this.username = this.__props__.username;
    this.password = this.__props__.password;
    this.confirmPassword = this.__props__.confirmPassword;
    this.mobile = this.__props__.mobile;
    this.smsCode = this.__props__.smsCode;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "register",
  setup(__props) {
    const form = common_vendor.ref(new RegisterForm({
      username: "",
      password: "",
      confirmPassword: "",
      mobile: "",
      smsCode: ""
    }));
    const agreementAccepted = common_vendor.ref(false);
    const smsCooldown = common_vendor.ref(0);
    const smsSending = common_vendor.ref(false);
    const submitting = common_vendor.ref(false);
    let smsCooldownTimer = null;
    const hasPasswordMismatch = common_vendor.computed(() => {
      return form.value.password != "" && form.value.confirmPassword != "" && form.value.password != form.value.confirmPassword;
    });
    const isRegisterReady = common_vendor.computed(() => {
      return form.value.username != "" && form.value.password != "" && form.value.confirmPassword != "" && form.value.mobile != "" && form.value.smsCode != "";
    });
    const rules = [
      new common_vendor.UTSJSONObject({ name: "username", required: true, message: "请输入账号" }),
      new common_vendor.UTSJSONObject({ name: "password", required: true, message: "请输入密码" }),
      new common_vendor.UTSJSONObject({ name: "confirmPassword", required: true, message: "请再次输入密码" }),
      new common_vendor.UTSJSONObject({ name: "mobile", required: true, message: "请输入手机号" }),
      new common_vendor.UTSJSONObject({ name: "smsCode", required: true, message: "请输入验证码" })
    ];
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
      if (!/^\d{4}$/.test(form.value.smsCode)) {
        utils_toast.showAppToast({ title: "请输入4位验证码", icon: "none" });
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
        if (form.value.mobile.length == 0) {
          utils_toast.showAppToast({ title: "请输入手机号", icon: "none" });
          return Promise.resolve(null);
        }
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
      if (form.value.username.length == 0) {
        utils_toast.showAppToast({ title: "请输入账号", icon: "none" });
        return false;
      }
      if (form.value.password.length == 0) {
        utils_toast.showAppToast({ title: "请输入密码", icon: "none" });
        return false;
      }
      if (form.value.confirmPassword.length == 0) {
        utils_toast.showAppToast({ title: "请再次输入密码", icon: "none" });
        return false;
      }
      if (form.value.password != form.value.confirmPassword) {
        utils_toast.showAppToast({ title: "两次输入的密码不一致", icon: "none" });
        return false;
      }
      if (form.value.mobile.length == 0) {
        utils_toast.showAppToast({ title: "请输入手机号", icon: "none" });
        return false;
      }
      if (!isValidMobile())
        return false;
      if (form.value.smsCode.length == 0) {
        utils_toast.showAppToast({ title: "请输入验证码", icon: "none" });
        return false;
      }
      if (!isValidSmsCode())
        return false;
      if (!agreementAccepted.value) {
        utils_toast.showAppToast({ title: "请先阅读并同意用户协议", icon: "none" });
        return false;
      }
      return true;
    };
    const submitRegister = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (submitting.value || !validateForm())
          return Promise.resolve(null);
        try {
          submitting.value = true;
          const response = yield api_request.registerPersonalUser(new api_request.RegisterRequest({
            clientId: null,
            tenantId: null,
            username: form.value.username,
            password: form.value.password,
            confirmPassword: form.value.confirmPassword,
            phonenumber: form.value.mobile,
            smsCode: form.value.smsCode
          }));
          if (response.code != 200) {
            utils_toast.showAppToast({ title: response.msg || "注册失败，请稍后重试", icon: "none" });
            return Promise.resolve(null);
          }
          utils_toast.showAppToast({ title: response.msg || "注册成功，请登录", icon: "success" });
          setTimeout(() => {
            common_vendor.index.navigateBack(new common_vendor.UTSJSONObject({
              fail: () => {
                common_vendor.index.reLaunch({ url: "/pages/login/personal-password-login" });
              }
            }));
          }, 500);
        } catch (error) {
          utils_toast.showAppToast({ title: "注册失败，请检查网络后重试", icon: "none" });
        } finally {
          submitting.value = false;
        }
      });
    };
    const backToPersonalLogin = () => {
      common_vendor.index.navigateBack(new common_vendor.UTSJSONObject({
        fail: () => {
          common_vendor.index.reLaunch({ url: "/pages/login/personal-password-login" });
        }
      }));
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
      const __returned__ = common_vendor.e({
        a: common_vendor.p({
          title: "个人用户注册",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false,
          class: "data-v-3038f9e3"
        }),
        b: common_vendor.o(($event) => {
          return form.value.username = $event;
        }, "1b"),
        c: common_vendor.p({
          placeholder: "请输入账号",
          clearable: true,
          modelValue: form.value.username,
          class: "data-v-3038f9e3"
        }),
        d: common_vendor.p({
          name: "username",
          label: "",
          required: true,
          labelDirection: "horizontal",
          labelWidth: "0",
          class: "data-v-3038f9e3"
        }),
        e: common_vendor.o(($event) => {
          return form.value.password = $event;
        }, "21"),
        f: common_vendor.p({
          placeholder: "请输入密码",
          type: "password",
          password: true,
          modelValue: form.value.password,
          class: "data-v-3038f9e3"
        }),
        g: common_vendor.p({
          name: "password",
          label: "",
          required: true,
          labelDirection: "horizontal",
          labelWidth: "0",
          class: "data-v-3038f9e3"
        }),
        h: common_vendor.o(($event) => {
          return form.value.confirmPassword = $event;
        }, "8e"),
        i: common_vendor.p({
          placeholder: "请再次输入密码",
          type: "password",
          password: true,
          modelValue: form.value.confirmPassword,
          class: "data-v-3038f9e3"
        }),
        j: hasPasswordMismatch.value
      }, hasPasswordMismatch.value ? {} : {}, {
        k: common_vendor.p({
          name: "confirmPassword",
          label: "",
          required: true,
          labelDirection: "horizontal",
          labelWidth: "0",
          class: "data-v-3038f9e3"
        }),
        l: common_vendor.o(($event) => {
          return form.value.mobile = $event;
        }, "3a"),
        m: common_vendor.p({
          placeholder: "请输入手机号",
          type: "number",
          maxlength: 11,
          clearable: true,
          modelValue: form.value.mobile,
          class: "data-v-3038f9e3"
        }),
        n: common_vendor.p({
          name: "mobile",
          label: "",
          required: true,
          labelDirection: "horizontal",
          labelWidth: "0",
          class: "data-v-3038f9e3"
        }),
        o: common_vendor.t(smsCooldown.value > 0 ? smsCooldown.value + "秒后重试" : "获取验证码"),
        p: smsCooldown.value > 0 || smsSending.value ? 1 : "",
        q: common_vendor.o(requestSmsCode, "65"),
        r: common_vendor.o(($event) => {
          return form.value.smsCode = $event;
        }, "43"),
        s: common_vendor.p({
          placeholder: "请输入4位验证码",
          type: "number",
          maxlength: 4,
          clearable: true,
          modelValue: form.value.smsCode,
          class: "sms-code-input data-v-3038f9e3"
        }),
        t: common_vendor.p({
          name: "smsCode",
          label: "",
          required: true,
          labelDirection: "horizontal",
          labelWidth: "0",
          class: "data-v-3038f9e3"
        }),
        v: common_vendor.o(submitRegister, "52"),
        w: common_vendor.p({
          type: "primary",
          loading: submitting.value,
          disabled: !isRegisterReady.value || submitting.value,
          class: "data-v-3038f9e3"
        }),
        x: common_vendor.p({
          modelValue: form.value,
          rules,
          labelDirection: "horizontal",
          watchValidStatus: true,
          class: "data-v-3038f9e3"
        }),
        y: common_vendor.o(toggleAgreement, "55"),
        z: common_vendor.p({
          checked: agreementAccepted.value,
          class: "data-v-3038f9e3"
        }),
        A: common_vendor.o(gotoAgreement, "de"),
        B: common_vendor.o(gotoPrivacy, "f4"),
        C: common_vendor.o(backToPersonalLogin, "81"),
        D: `${_ctx.u_s_b_h}px`,
        E: `${_ctx.u_s_a_i_b}px`,
        F: common_vendor.p({
          class: "data-v-3038f9e3"
        }),
        G: common_vendor.p({
          class: "data-v-3038f9e3"
        })
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3038f9e3"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/register.js.map
