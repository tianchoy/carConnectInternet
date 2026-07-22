"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_input_1 = common_vendor.resolveComponent("i-input");
  const _easycom_i_form_item_1 = common_vendor.resolveComponent("i-form-item");
  const _easycom_i_checkbox_1 = common_vendor.resolveComponent("i-checkbox");
  const _easycom_i_button_1 = common_vendor.resolveComponent("i-button");
  const _easycom_i_form_1 = common_vendor.resolveComponent("i-form");
  (_easycom_custom_navBar_1 + _easycom_i_input_1 + _easycom_i_form_item_1 + _easycom_i_checkbox_1 + _easycom_i_button_1 + _easycom_i_form_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_i_input = () => "../../uni_modules/i-ui-x/components/i-input/i-input.js";
const _easycom_i_form_item = () => "../../uni_modules/i-ui-x/components/i-form-item/i-form-item.js";
const _easycom_i_checkbox = () => "../../uni_modules/i-ui-x/components/i-checkbox/i-checkbox.js";
const _easycom_i_button = () => "../../uni_modules/i-ui-x/components/i-button/i-button.js";
const _easycom_i_form = () => "../../uni_modules/i-ui-x/components/i-form/i-form.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_input + _easycom_i_form_item + _easycom_i_checkbox + _easycom_i_button + _easycom_i_form)();
}
class FormData extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          username: { type: String, optional: false },
          password: { type: String, optional: false }
        };
      },
      name: "FormData"
    };
  }
  constructor(options, metadata = FormData.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.username = this.__props__.username;
    this.password = this.__props__.password;
    delete this.__props__;
  }
}
class SavedAccount extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          username: { type: String, optional: false },
          password: { type: String, optional: false }
        };
      },
      name: "SavedAccount"
    };
  }
  constructor(options, metadata = SavedAccount.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.username = this.__props__.username;
    this.password = this.__props__.password;
    delete this.__props__;
  }
}
const userAgreement = `
欢迎使用车联网平台！

一、服务条款的确认和接纳
本协议是您与车联网平台之间关于使用平台服务的协议。您使用平台服务即表示您已阅读并同意本协议的全部条款。

二、服务内容
1. 车联网平台提供车辆管理、远程控制、数据分析等服务。
2. 平台保留随时变更、中断或终止部分或全部网络服务的权利。

三、用户账号
用户应对其账号的全部行为负责，不得将账号转让或出借给他人使用。

四、用户隐私保护
保护用户隐私是平台的一项基本政策，详情请参阅《隐私政策》。

五、免责声明
1. 平台不保证服务一定能满足用户的要求，也不保证服务不会中断。
2. 对于因不可抗力造成的服务中断，平台不承担责任。

六、法律适用
本协议的订立、执行和解释及争议的解决均适用中华人民共和国法律。

如有任何疑问，请联系我们。`;
const privacyPolicy = `
车联网平台非常重视您的隐私保护！

一、信息收集
1. 我们可能收集的信息包括：手机号码、车辆信息、位置信息、设备信息等。
2. 我们会在您注册、使用服务时收集必要的信息。

二、信息使用
1. 我们使用收集的信息来提供、维护和改进服务。
2. 我们不会向第三方出售或分享您的个人信息。

三、信息保护
1. 我们采用行业标准的安全措施保护您的信息。
2. 我们会定期评估安全措施的有效性。

四、未成年人保护
我们重视未成年人的隐私保护，如您是未成年人，请在监护人指导下使用服务。

五、政策更新
我们可能会更新隐私政策，更新后的政策将在平台公布。

如有任何隐私问题，请联系我们。`;
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "login",
  setup(__props) {
    const docState = common_vendor.ref(false);
    const pswLogin = common_vendor.ref(false);
    const rememberPassword = common_vendor.ref(false);
    const formValid = common_vendor.ref(false);
    const loading = common_vendor.ref(false);
    const form = common_vendor.ref(new FormData({
      username: "",
      password: ""
    }));
    const deviceModel = common_vendor.ref("");
    const pswrules = [
      new common_vendor.UTSJSONObject({ name: "username", required: true, message: "请输入账号" }),
      new common_vendor.UTSJSONObject({ name: "password", required: true, message: "请输入密码" })
    ];
    const updateFormValid = (valid) => {
      formValid.value = valid;
    };
    function loadSavedAccount() {
      try {
        const rawAccount = common_vendor.index.getStorageSync("savedEnterpriseAccount");
        if (rawAccount == null || rawAccount == "")
          return null;
        const account = typeof rawAccount == "string" ? common_vendor.UTS.JSON.parse(rawAccount) : rawAccount;
        form.value.username = account.getString("username", "");
        form.value.password = account.getString("password", "");
        rememberPassword.value = form.value.username != "" || form.value.password != "";
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.uvue:127", "加载保存的账号密码失败:", error);
      }
    }
    const isPswLogin = () => {
      pswLogin.value = !pswLogin.value;
      if (pswLogin.value) {
        setTimeout(() => {
          loadSavedAccount();
        }, 100);
      }
    };
    const toggleRememberPassword = () => {
      rememberPassword.value = !rememberPassword.value;
      if (!rememberPassword.value) {
        common_vendor.index.removeStorageSync("savedEnterpriseAccount");
      }
    };
    const saveAccountPassword = () => {
      if (rememberPassword.value && form.value.username != "" && form.value.password != "") {
        const accountInfo = new SavedAccount({
          username: form.value.username,
          password: form.value.password
        });
        common_vendor.index.setStorageSync("savedEnterpriseAccount", common_vendor.UTS.JSON.stringify(accountInfo));
      } else if (!rememberPassword.value) {
        common_vendor.index.removeStorageSync("savedEnterpriseAccount");
      }
    };
    const filterNonLatin = (value) => {
      form.value.password = value.replace(/[^\x00-\x7F]/g, "");
    };
    const isDocState = () => {
      docState.value = !docState.value;
    };
    const getSystemInfo = () => {
      const res = common_vendor.index.getSystemInfoSync();
      deviceModel.value = res.deviceModel;
      common_vendor.index.__f__("log", "at pages/login/login.uvue:170", "设备型号:", deviceModel.value);
    };
    const validateForm = () => {
      if (form.value.username.length == 0) {
        common_vendor.index.showToast({ title: "请输入账号", icon: "none" });
        return false;
      }
      if (form.value.password.length == 0) {
        common_vendor.index.showToast({ title: "请输入密码", icon: "none" });
        return false;
      }
      return true;
    };
    const loginBt = () => {
      if (!docState.value) {
        common_vendor.index.showToast({
          title: "请先阅读并同意用户协议",
          icon: "error"
        });
        return null;
      }
    };
    const handleGetPhoneNumber = (e = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!docState.value) {
          common_vendor.index.showToast({
            title: "请先阅读并同意用户协议",
            icon: "error"
          });
          return Promise.resolve(null);
        }
        if (e.detail.errMsg === "getPhoneNumber:fail user deny") {
          common_vendor.index.showToast({
            title: "您拒绝了授权",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        if (e.detail.errMsg !== "getPhoneNumber:ok") {
          common_vendor.index.showToast({
            title: "获取手机号失败",
            icon: "none"
          });
          return Promise.resolve(null);
        }
        try {
          common_vendor.index.showLoading(new common_vendor.UTSJSONObject({ title: "登录中..." }));
          const loginRes = yield new Promise((resolve, reject) => {
            common_vendor.index.login(new common_vendor.UTSJSONObject({
              provider: "weixin",
              success: resolve,
              fail: reject
            }));
          });
          const res = yield api_request.PostWechatlogin(new common_vendor.UTSJSONObject({
            code: loginRes.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          }));
          const loginData = res.data;
          if (loginData == null) {
            common_vendor.index.showToast({
              title: res.msg || "登录失败",
              icon: "none"
            });
            return Promise.resolve(null);
          }
          const token = loginData.getString("token", "");
          if (token == "") {
            common_vendor.index.showToast({
              title: "登录失败: 未获取到token",
              icon: "none"
            });
            return Promise.resolve(null);
          }
          common_vendor.index.setStorageSync("token", token);
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/pages/index/index"
            });
          }, 500);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/login/login.uvue:273", "微信登录失败:", error);
          common_vendor.index.showToast({
            title: "微信登录失败",
            icon: "none"
          });
        } finally {
          common_vendor.index.hideLoading();
        }
      });
    };
    const submit = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!docState.value) {
          common_vendor.index.showToast({
            title: "请先阅读并同意用户协议",
            icon: "error"
          });
          return Promise.resolve(null);
        }
        try {
          common_vendor.index.__f__("log", "at pages/login/login.uvue:298", "准备验证表单...");
          if (!validateForm())
            return Promise.resolve(null);
          common_vendor.index.__f__("log", "at pages/login/login.uvue:300", "✅ 表单验证通过");
          const newFormData = new common_vendor.UTSJSONObject({
            username: form.value.username,
            password: form.value.password,
            from: deviceModel.value,
            type: "USER"
          });
          common_vendor.index.__f__("log", "at pages/login/login.uvue:309", "📤 请求参数:", newFormData);
          loading.value = true;
          common_vendor.index.showLoading(new common_vendor.UTSJSONObject({
            title: "登录中...",
            mask: true
          }));
          common_vendor.index.__f__("log", "at pages/login/login.uvue:319", "🚀 开始调用 login 接口...");
          const res = yield api_request.login(newFormData);
          common_vendor.index.__f__("log", "at pages/login/login.uvue:321", "✅ 登录接口返回:", res);
          loading.value = false;
          common_vendor.index.hideLoading();
          const loginData = res.data;
          const token = loginData != null ? loginData.getString("token", "") : "";
          if (token != "") {
            saveAccountPassword();
            common_vendor.index.setStorageSync("token", token);
            common_vendor.index.showToast({
              title: "登录成功",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.reLaunch({
                url: "/pages/index/index"
              });
            }, 500);
          } else {
            common_vendor.index.showToast({
              title: "登录失败，请重试",
              icon: "error"
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/login/login.uvue:350", "❌ 登录失败:", error);
          loading.value = false;
          common_vendor.index.hideLoading();
          if (error && error.message) {
            common_vendor.index.showToast({
              icon: "error",
              title: "登录失败，请检查账号、密码或网络"
            });
          } else {
            common_vendor.index.showToast({
              icon: "error",
              title: "登录失败，请检查网络后重试"
            });
          }
        }
      });
    };
    const gotoIndex = () => {
      common_vendor.index.reLaunch({
        url: "/pages/index/index"
      });
    };
    const gotoAgreement = () => {
      common_vendor.index.showModal(new common_vendor.UTSJSONObject({
        title: "用户协议",
        content: userAgreement,
        showCancel: false
      }));
    };
    const gotoPrivacy = () => {
      common_vendor.index.showModal(new common_vendor.UTSJSONObject({
        title: "隐私政策",
        content: privacyPolicy,
        showCancel: false
      }));
    };
    common_vendor.onMounted(() => {
      getSystemInfo();
      loadSavedAccount();
      common_vendor.index.__f__("log", "at pages/login/login.uvue:446", "pswLogin 初始值:", pswLogin.value);
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.p({
          title: "登陆",
          ["show-back"]: false,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false,
          class: "data-v-27a30816"
        }),
        b: common_assets._imports_0,
        c: pswLogin.value
      }, pswLogin.value ? {
        d: common_vendor.o(($event) => {
          return form.value.username = $event;
        }, "ae"),
        e: common_vendor.p({
          placeholder: "请输入账号",
          clearable: true,
          prefixIcon: "account-fill",
          modelValue: form.value.username,
          class: "data-v-27a30816"
        }),
        f: common_vendor.p({
          name: "username",
          label: "",
          required: true,
          labelDirection: "horizontal",
          labelWidth: "0",
          class: "data-v-27a30816"
        }),
        g: common_vendor.o(filterNonLatin, "ec"),
        h: common_vendor.o(($event) => {
          return form.value.password = $event;
        }, "11"),
        i: common_vendor.p({
          placeholder: "请输入密码",
          password: true,
          modelValue: form.value.password,
          class: "data-v-27a30816"
        }),
        j: common_vendor.p({
          name: "password",
          label: "",
          required: true,
          labelDirection: "horizontal",
          labelWidth: "0",
          class: "data-v-27a30816"
        }),
        k: common_vendor.o(toggleRememberPassword, "b6"),
        l: common_vendor.p({
          checked: rememberPassword.value,
          label: "记住密码",
          class: "data-v-27a30816"
        }),
        m: common_vendor.o(submit, "b1"),
        n: common_vendor.p({
          type: "primary",
          loading: loading.value,
          class: "data-v-27a30816"
        }),
        o: common_vendor.o(updateFormValid, "e5"),
        p: common_vendor.p({
          modelValue: form.value,
          rules: pswrules,
          labelDirection: "horizontal",
          watchValidStatus: true,
          class: "data-v-27a30816"
        })
      } : common_vendor.e({
        q: !docState.value
      }, !docState.value ? {
        r: common_vendor.o(loginBt, "33")
      } : {}, {
        s: docState.value
      }, docState.value ? {
        t: common_vendor.o(handleGetPhoneNumber, "11")
      } : {}), {
        v: common_vendor.o(isDocState, "fe"),
        w: common_vendor.p({
          checked: docState.value,
          class: "data-v-27a30816"
        }),
        x: common_vendor.o(gotoAgreement, "67"),
        y: common_vendor.o(gotoPrivacy, "74"),
        z: common_vendor.o(gotoIndex, "d9"),
        A: common_vendor.t(pswLogin.value ? "个人用户登录" : "企业用户登录"),
        B: common_vendor.o(isPswLogin, "38"),
        C: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        D: `${_ctx.u_s_b_h}px`,
        E: `${_ctx.u_s_a_i_b}px`,
        F: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-27a30816"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
