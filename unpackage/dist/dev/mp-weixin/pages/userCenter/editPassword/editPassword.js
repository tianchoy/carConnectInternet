"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_request = require("../../../api/request.js");
const services_push = require("../../../services/push.js");
const utils_toast = require("../../../utils/toast.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_input_1 = common_vendor.resolveComponent("i-input");
  const _easycom_i_button_1 = common_vendor.resolveComponent("i-button");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  (_easycom_custom_navBar_1 + _easycom_i_input_1 + _easycom_i_button_1 + _easycom_app_toast_1)();
}
const _easycom_custom_navBar = () => "../../../components/custom-navBar/custom-navBar.js";
const _easycom_i_input = () => "../../../uni_modules/i-ui-x/components/i-input/i-input.js";
const _easycom_i_button = () => "../../../uni_modules/i-ui-x/components/i-button/i-button.js";
const _easycom_app_toast = () => "../../../components/app-toast/app-toast.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_input + _easycom_i_button + _easycom_app_toast)();
}
class PasswordForm extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          oldPassword: { type: String, optional: false },
          newPassword: { type: String, optional: false },
          confirmPassword: { type: String, optional: false }
        };
      },
      name: "PasswordForm"
    };
  }
  constructor(options, metadata = PasswordForm.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.oldPassword = this.__props__.oldPassword;
    this.newPassword = this.__props__.newPassword;
    this.confirmPassword = this.__props__.confirmPassword;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "editPassword",
  setup(__props) {
    const form = common_vendor.ref(new PasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    }));
    const submitting = common_vendor.ref(false);
    const sessionEnding = common_vendor.ref(false);
    const isPasswordUpdateReady = common_vendor.computed(() => {
      const newPassword = form.value.newPassword;
      let categoryCount = 0;
      if (/[0-9]/.test(newPassword))
        categoryCount += 1;
      if (/[A-Za-z]/.test(newPassword))
        categoryCount += 1;
      if (/[^A-Za-z0-9]/.test(newPassword))
        categoryCount += 1;
      return form.value.oldPassword != "" && newPassword.length >= 8 && newPassword.length <= 16 && categoryCount >= 2 && form.value.oldPassword != newPassword && form.value.confirmPassword != "" && newPassword == form.value.confirmPassword && !submitting.value;
    });
    const isValidPassword = (password) => {
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
      if (form.value.oldPassword == "") {
        utils_toast.showAppToast({ title: "请输入当前密码", icon: "none" });
        return false;
      }
      if (form.value.newPassword == "") {
        utils_toast.showAppToast({ title: "请输入新密码", icon: "none" });
        return false;
      }
      if (!isValidPassword(form.value.newPassword))
        return false;
      if (form.value.oldPassword == form.value.newPassword) {
        utils_toast.showAppToast({ title: "新密码不能与当前密码相同", icon: "none" });
        return false;
      }
      if (form.value.confirmPassword == "") {
        utils_toast.showAppToast({ title: "请再次输入新密码", icon: "none" });
        return false;
      }
      if (form.value.newPassword != form.value.confirmPassword) {
        utils_toast.showAppToast({ title: "两次输入的密码不一致", icon: "none" });
        return false;
      }
      return true;
    };
    const returnToLogin = () => {
      sessionEnding.value = true;
      common_vendor.index.removeStorageSync("token");
      services_push.clearPushSessionState();
      form.value = { oldPassword: "", newPassword: "", confirmPassword: "" };
      setTimeout(() => {
        common_vendor.index.reLaunch({ url: "/pages/login/login" });
      }, 1500);
    };
    const goForgotPassword = () => {
      common_vendor.index.navigateTo({ url: "/pages/login/forgot-password" });
    };
    const submitPasswordUpdate = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (submitting.value || !validateForm())
          return Promise.resolve(null);
        try {
          submitting.value = true;
          const response = yield api_request.updatePassword(new api_request.ChangePasswordRequest({
            oldPassword: form.value.oldPassword,
            newPassword: form.value.newPassword,
            confirmPassword: form.value.confirmPassword
          }));
          if (response.code != 200) {
            utils_toast.showAppToast({ title: response.msg || "密码修改失败，请稍后重试", icon: "none" });
            return Promise.resolve(null);
          }
          utils_toast.showAppToast({ title: "密码修改成功，请重新登录", icon: "success" });
          returnToLogin();
        } catch (error) {
          if (!sessionEnding.value) {
            utils_toast.showAppToast({ title: "密码修改失败，请检查网络后重试", icon: "none" });
          }
        } finally {
          if (!sessionEnding.value)
            submitting.value = false;
        }
      });
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
        a: common_vendor.p({
          title: "",
          ["show-back"]: true,
          backgroundColor: "#fbfcfe",
          textColor: "#333333",
          showCapsule: false,
          class: "data-v-80f098ac"
        }),
        b: common_vendor.o(($event) => {
          return form.value.oldPassword = $event;
        }, "e5"),
        c: common_vendor.p({
          placeholder: "请输入当前密码",
          password: true,
          height: "110rpx",
          round: "25rpx",
          borderColor: "#d7e3ef",
          placeholderStyle: "color:#a8b8ca;font-size:28rpx;",
          fontSize: "28rpx",
          color: "#333333",
          modelValue: form.value.oldPassword,
          class: "password-input data-v-80f098ac"
        }),
        d: common_vendor.o(($event) => {
          return form.value.newPassword = $event;
        }, "cf"),
        e: common_vendor.p({
          placeholder: "请输入新密码",
          password: true,
          height: "110rpx",
          round: "25rpx",
          borderColor: "#d7e3ef",
          placeholderStyle: "color:#a8b8ca;font-size:28rpx;",
          fontSize: "28rpx",
          color: "#333333",
          modelValue: form.value.newPassword,
          class: "password-input new-password-input data-v-80f098ac"
        }),
        f: common_vendor.o(($event) => {
          return form.value.confirmPassword = $event;
        }, "fa"),
        g: common_vendor.p({
          placeholder: "请再次输入新密码",
          password: true,
          height: "110rpx",
          round: "25rpx",
          borderColor: "#d7e3ef",
          placeholderStyle: "color:#a8b8ca;font-size:28rpx;",
          fontSize: "28rpx",
          color: "#333333",
          modelValue: form.value.confirmPassword,
          class: "password-input confirm-password-input data-v-80f098ac"
        }),
        h: common_vendor.o(submitPasswordUpdate, "f2"),
        i: common_vendor.p({
          type: "primary",
          block: true,
          round: "25rpx",
          color: "#3485df",
          customStyle: "height:104rpx;",
          loading: submitting.value,
          disabled: !isPasswordUpdateReady.value,
          class: "submit-button data-v-80f098ac"
        }),
        j: common_vendor.o(goForgotPassword, "0c"),
        k: `${_ctx.u_s_b_h}px`,
        l: `${_ctx.u_s_a_i_b}px`,
        m: common_vendor.p({
          class: "data-v-80f098ac"
        })
      };
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-80f098ac"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/userCenter/editPassword/editPassword.js.map
