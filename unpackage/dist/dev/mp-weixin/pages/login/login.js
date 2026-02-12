"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_input_1 = common_vendor.resolveComponent("uv-input");
  const _easycom_uv_form_item_1 = common_vendor.resolveComponent("uv-form-item");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_checkbox_1 = common_vendor.resolveComponent("uv-checkbox");
  const _easycom_uv_checkbox_group_1 = common_vendor.resolveComponent("uv-checkbox-group");
  const _easycom_uv_form_1 = common_vendor.resolveComponent("uv-form");
  const _easycom_uv_button_1 = common_vendor.resolveComponent("uv-button");
  (_easycom_custom_navBar_1 + _easycom_uv_input_1 + _easycom_uv_form_item_1 + _easycom_uv_icon_1 + _easycom_uv_checkbox_1 + _easycom_uv_checkbox_group_1 + _easycom_uv_form_1 + _easycom_uv_button_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_input = () => "../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_uv_form_item = () => "../../uni_modules/uv-form/components/uv-form-item/uv-form-item.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_checkbox = () => "../../uni_modules/uv-checkbox/components/uv-checkbox/uv-checkbox.js";
const _easycom_uv_checkbox_group = () => "../../uni_modules/uv-checkbox/components/uv-checkbox-group/uv-checkbox-group.js";
const _easycom_uv_form = () => "../../uni_modules/uv-form/components/uv-form/uv-form.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_input + _easycom_uv_form_item + _easycom_uv_icon + _easycom_uv_checkbox + _easycom_uv_checkbox_group + _easycom_uv_form + _easycom_uv_button)();
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
class smsFormData extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          phone: { type: String, optional: false },
          code: { type: String, optional: false }
        };
      },
      name: "smsFormData"
    };
  }
  constructor(options, metadata = smsFormData.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.phone = this.__props__.phone;
    this.code = this.__props__.code;
    delete this.__props__;
  }
}
class UvFormInstance extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          setRules: { type: "Unknown", optional: false },
          validate: { type: "Unknown", optional: false }
        };
      },
      name: "UvFormInstance"
    };
  }
  constructor(options, metadata = UvFormInstance.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.setRules = this.__props__.setRules;
    this.validate = this.__props__.validate;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "login",
  setup(__props) {
    const showpw = common_vendor.ref(true);
    const docState = common_vendor.ref(false);
    const loginType = common_vendor.ref(true);
    common_vendor.ref("");
    common_vendor.ref(null);
    const pswLogin = common_vendor.ref(false);
    const rememberPassword = common_vendor.ref(false);
    const form = common_vendor.ref(new FormData({
      username: "",
      password: ""
    }));
    const smsform = common_vendor.ref(new smsFormData({
      phone: "",
      code: ""
    }));
    const formRef = common_vendor.ref(null);
    const smsformRef = common_vendor.ref(null);
    const deviceModel = common_vendor.ref("");
    const saveAccountPassword = () => {
      if (rememberPassword.value && form.value.username && form.value.password) {
        const accountInfo = new common_vendor.UTSJSONObject({
          username: form.value.username,
          password: form.value.password
        });
        common_vendor.index.setStorageSync("savedEnterpriseAccount", accountInfo);
      } else if (!rememberPassword.value) {
        common_vendor.index.removeStorageSync("savedEnterpriseAccount");
      }
    };
    const loadSavedAccount = () => {
      try {
        const savedAccount = common_vendor.index.getStorageSync("savedEnterpriseAccount");
        if (savedAccount) {
          form.value.username = savedAccount.username || "";
          form.value.password = savedAccount.password || "";
          rememberPassword.value = true;
        }
      } catch (error) {
        console.error("加载保存的账号密码失败:", error);
      }
    };
    const toggleRememberPassword = () => {
      rememberPassword.value = !rememberPassword.value;
      if (!rememberPassword.value) {
        common_vendor.index.removeStorageSync("savedEnterpriseAccount");
      }
    };
    const isPswLogin = () => {
      pswLogin.value = !pswLogin.value;
      if (pswLogin.value) {
        setTimeout(() => {
          loadSavedAccount();
        }, 100);
      }
    };
    const filterNonLatin = (e = null) => {
      form.value.password = e.replace(/[^\x00-\x7F]/g, "");
    };
    const pswrules = new common_vendor.UTSJSONObject({
      username: [
        new common_vendor.UTSJSONObject({
          required: true,
          message: "请输入账号",
          trigger: ["blur", "change"]
        })
      ],
      password: [
        new common_vendor.UTSJSONObject({
          required: true,
          message: "请输入密码",
          trigger: ["blur", "change"]
        })
      ]
    });
    const smsrules = new common_vendor.UTSJSONObject({
      phone: [
        new common_vendor.UTSJSONObject({
          required: true,
          message: "请输入手机号",
          trigger: ["blur", "change"]
        }),
        new common_vendor.UTSJSONObject({
          validator: (rule = null, value = null, callback = null) => {
            const phoneReg = /^1[3-9]\d{9}$/;
            if (!phoneReg.test(value)) {
              callback(new Error("请输入正确的手机号"));
            } else {
              callback();
            }
          },
          trigger: ["blur", "change"]
        })
      ],
      code: [
        new common_vendor.UTSJSONObject({
          required: true,
          message: "请输入验证码",
          trigger: ["blur", "change"]
        }),
        new common_vendor.UTSJSONObject({
          len: 6,
          message: "验证码长度为6位",
          trigger: ["blur", "change"]
        })
      ]
    });
    const showpwfun = () => {
      showpw.value = !showpw.value;
    };
    const isDocState = () => {
      console.log("docState.value:", docState.value);
      docState.value = !docState.value;
    };
    const getSystemInfo = () => {
      const res = common_vendor.index.getSystemInfoSync();
      deviceModel.value = res.deviceModel;
    };
    common_vendor.onMounted(() => {
      getSystemInfo();
      if (formRef.value) {
        formRef.value.setRules(pswrules);
      }
      if (smsformRef.value) {
        smsformRef.value.setRules(smsrules);
      }
      loadSavedAccount();
    });
    const loginBt = () => {
      if (!docState.value) {
        common_vendor.index.showToast({
          title: "请先阅读并同意用户协议",
          icon: "error"
        });
        return null;
      }
    };
    const gotoIndex = () => {
      common_vendor.index.reLaunch({
        url: "/pages/index/index"
      });
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
          const res = yield api_request.PostWechatlogin({
            code: loginRes.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          });
          if (!res) {
            throw new Error("接口返回数据为空");
          }
          if (!res.data) {
            throw new Error("接口返回数据: data为null");
          }
          if (!res.data.token) {
            throw new Error("登录失败: 未获取到token");
          }
          common_vendor.index.setStorageSync("token", res.data.token);
          common_vendor.index.reLaunch({
            url: "/pages/index/index"
          });
        } catch (error) {
          console.error("微信登录失败:", error);
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
      var _a, _b;
      console.log(docState.value);
      if (!docState.value) {
        common_vendor.index.showToast({
          title: "请先阅读并同意用户协议",
          icon: "error"
        });
        return null;
      }
      if (loginType.value) {
        (_a = formRef.value) === null || _a === void 0 ? null : _a.validate().then((res) => {
          const newFormData = new common_vendor.UTSJSONObject(Object.assign(Object.assign({}, form.value), { from: deviceModel.value, type: "USER" }));
          api_request.login(newFormData).then((res2 = null) => {
            saveAccountPassword();
            common_vendor.index.setStorageSync("token", res2.data.token);
            common_vendor.index.reLaunch({
              url: "/pages/index/index"
            });
          }).catch((err = null) => {
            common_vendor.index.showToast({
              title: err.msg || "登录失败",
              icon: "error"
            });
          });
        }).catch((errors = null) => {
          common_vendor.index.showToast({
            icon: "error",
            title: "请填写正确的账号密码"
          });
        });
      } else {
        (_b = smsformRef.value) === null || _b === void 0 ? null : _b.validate().then((res) => {
          new common_vendor.UTSJSONObject(
            {
              phone: smsform.value.phone,
              code: smsform.value.code,
              from: deviceModel.value,
              type: "SMS"
            }
            // 请求短信登录接口
            // apiSmsLogin(params).then(res => {
            // 	uni.setStorageSync('token', res.data.token)
            // 	uni.reLaunch({
            // 		url: '/pages/index/index'
            // 	})
            // }).catch(err => {
            // 	uni.showToast({
            // 		title: err.message || '登录失败',
            // 		icon: 'error'
            // 	})
            // })
          );
        }).catch((errors = null) => {
          common_vendor.index.showToast({
            icon: "error",
            title: "请填写正确的手机号和验证码"
          });
        });
      }
    };
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
      }, pswLogin.value ? common_vendor.e({
        d: common_vendor.o(($event) => {
          return form.value.username = $event;
        }, "6f"),
        e: common_vendor.p({
          prefixIcon: "account-fill",
          type: _ctx.text,
          placeholder: "请输入账号",
          modelValue: form.value.username,
          class: "data-v-27a30816"
        }),
        f: common_vendor.p({
          label: "",
          prop: "username",
          labelWidth: "0",
          class: "data-v-27a30816"
        }),
        g: common_vendor.o(showpwfun, "a9"),
        h: common_vendor.p({
          name: showpw.value ? "eye-off-outline" : "eye",
          size: "20",
          class: "data-v-27a30816"
        }),
        i: common_vendor.o(filterNonLatin, "4c"),
        j: common_vendor.o(($event) => {
          return form.value.password = $event;
        }, "17"),
        k: common_vendor.p({
          prefixIcon: "lock-fill",
          type: showpw.value ? "password" : "text",
          placeholder: "请输入密码",
          password: showpw.value,
          customStyle: "border:1rpx solid red;height:80rpx",
          modelValue: form.value.password,
          class: "data-v-27a30816"
        }),
        l: common_vendor.p({
          label: "",
          prop: "password",
          labelWidth: "0",
          class: "data-v-27a30816"
        }),
        m: pswLogin.value
      }, pswLogin.value ? {
        n: common_vendor.o(toggleRememberPassword, "74"),
        o: common_vendor.p({
          checked: rememberPassword.value,
          class: "data-v-27a30816"
        }),
        p: common_vendor.p({
          class: "data-v-27a30816"
        })
      } : {}, {
        q: common_vendor.sr(formRef, "27a30816-1", {
          "k": "formRef"
        }),
        r: common_vendor.p({
          model: form.value,
          rules: pswrules,
          class: "r data-v-27a30816"
        })
      }) : {}, {
        s: pswLogin.value
      }, pswLogin.value ? {
        t: common_vendor.o(submit, "68"),
        v: common_vendor.p({
          type: "primary",
          class: "data-v-27a30816"
        })
      } : common_vendor.e({
        w: !docState.value
      }, !docState.value ? {
        x: common_vendor.o(loginBt, "31")
      } : {}, {
        y: docState.value
      }, docState.value ? {
        z: common_vendor.o(handleGetPhoneNumber, "3e")
      } : {}), {
        A: common_vendor.o(isDocState, "e6"),
        B: common_vendor.p({
          checked: docState.value,
          class: "data-v-27a30816"
        }),
        C: common_vendor.p({
          class: "data-v-27a30816"
        }),
        D: common_vendor.o(isDocState, "20"),
        E: common_vendor.o(gotoIndex, "8a"),
        F: common_vendor.t(pswLogin.value ? "个人用户登录" : "企业用户登录"),
        G: common_vendor.o(isPswLogin, "81"),
        H: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        I: `${_ctx.u_s_b_h}px`,
        J: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-27a30816"]]);
wx.createPage(MiniProgramPage);
