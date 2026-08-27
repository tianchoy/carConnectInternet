"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_request = require("../../api/request.js");
const utils_toast = require("../../utils/toast.js");
const utils_modal = require("../../utils/modal.js");
const api_http = require("../../api/http.js");
const services_appStartup = require("../../services/app-startup.js");
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
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "personal-password-login",
  setup(__props) {
    const form = common_vendor.ref(new PersonalLoginForm({
      username: "",
      password: ""
    }));
    const agreementAccepted = common_vendor.ref(false);
    const submitting = common_vendor.ref(false);
    const isLoginReady = common_vendor.computed(() => {
      return form.value.username != "" && form.value.password != "";
    });
    const rules = [
      new common_vendor.UTSJSONObject({ name: "username", required: true, message: "请输入账号" }),
      new common_vendor.UTSJSONObject({ name: "password", required: true, message: "请输入密码" })
    ];
    const toggleAgreement = () => {
      agreementAccepted.value = !agreementAccepted.value;
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
      if (!agreementAccepted.value) {
        utils_toast.showAppToast({ title: "请先阅读并同意用户协议", icon: "none" });
        return false;
      }
      return true;
    };
    const completeLogin = (token) => {
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
    const submitLogin = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (submitting.value || !validateForm())
          return Promise.resolve(null);
        try {
          submitting.value = true;
          const response = yield api_request.personalPasswordLogin(new api_request.PersonalPasswordLoginRequest({
            clientId: null,
            tenantId: null,
            username: form.value.username,
            password: form.value.password
          }));
          const token = response.data != null ? response.data.getString("access_token", "") : "";
          if (response.code == 200 && token != "") {
            completeLogin(token);
            return Promise.resolve(null);
          }
          utils_toast.showAppToast({ title: response.msg || "登录失败，请检查账号和密码", icon: "none" });
        } catch (error) {
          utils_toast.showAppToast({ title: "登录失败，请检查网络后重试", icon: "none" });
        } finally {
          submitting.value = false;
        }
      });
    };
    const goRegister = () => {
      common_vendor.index.navigateTo({ url: "/pages/login/register" });
    };
    const backToLogin = () => {
      common_vendor.index.navigateBack(new common_vendor.UTSJSONObject({
        fail: () => {
          common_vendor.index.reLaunch({ url: "/pages/login/login" });
        }
      }));
    };
    const gotoAgreement = () => {
      utils_modal.showAppModal(new common_vendor.UTSJSONObject({ title: "用户协议", content: utils_legal.userAgreement, showCancel: false }));
    };
    const gotoPrivacy = () => {
      utils_modal.showAppModal(new common_vendor.UTSJSONObject({ title: "隐私政策", content: utils_legal.privacyPolicy, showCancel: false }));
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
        a: common_vendor.p({
          title: "个人账号登录",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false,
          class: "data-v-30c39099"
        }),
        b: common_assets._imports_0,
        c: common_vendor.o(($event) => {
          return form.value.username = $event;
        }, "42"),
        d: common_vendor.p({
          placeholder: "请输入账号",
          clearable: true,
          modelValue: form.value.username,
          class: "data-v-30c39099"
        }),
        e: common_vendor.p({
          name: "username",
          label: "",
          required: true,
          labelDirection: "horizontal",
          labelWidth: "0",
          class: "data-v-30c39099"
        }),
        f: common_vendor.o(($event) => {
          return form.value.password = $event;
        }, "61"),
        g: common_vendor.p({
          placeholder: "请输入密码",
          type: "password",
          password: true,
          modelValue: form.value.password,
          class: "data-v-30c39099"
        }),
        h: common_vendor.p({
          name: "password",
          label: "",
          required: true,
          labelDirection: "horizontal",
          labelWidth: "0",
          class: "data-v-30c39099"
        }),
        i: common_vendor.o(submitLogin, "7d"),
        j: common_vendor.p({
          type: "primary",
          loading: submitting.value,
          disabled: !isLoginReady.value || submitting.value,
          class: "data-v-30c39099"
        }),
        k: common_vendor.p({
          modelValue: form.value,
          rules,
          labelDirection: "horizontal",
          watchValidStatus: true,
          class: "data-v-30c39099"
        }),
        l: common_vendor.o(toggleAgreement, "28"),
        m: common_vendor.p({
          checked: agreementAccepted.value,
          class: "data-v-30c39099"
        }),
        n: common_vendor.o(gotoAgreement, "49"),
        o: common_vendor.o(gotoPrivacy, "ad"),
        p: common_vendor.o(goRegister, "29"),
        q: common_vendor.o(backToLogin, "0b"),
        r: `${_ctx.u_s_b_h}px`,
        s: `${_ctx.u_s_a_i_b}px`,
        t: common_vendor.p({
          class: "data-v-30c39099"
        }),
        v: common_vendor.p({
          class: "data-v-30c39099"
        })
      };
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-30c39099"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/personal-password-login.js.map
