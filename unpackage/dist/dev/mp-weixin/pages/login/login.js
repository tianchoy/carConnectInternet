"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_input_1 = common_vendor.resolveComponent("uv-input");
  const _easycom_uv_form_item_1 = common_vendor.resolveComponent("uv-form-item");
  const _easycom_uv_icon_1 = common_vendor.resolveComponent("uv-icon");
  const _easycom_uv_form_1 = common_vendor.resolveComponent("uv-form");
  const _easycom_uv_button_1 = common_vendor.resolveComponent("uv-button");
  const _easycom_uv_checkbox_1 = common_vendor.resolveComponent("uv-checkbox");
  const _easycom_uv_checkbox_group_1 = common_vendor.resolveComponent("uv-checkbox-group");
  (_easycom_custom_navBar_1 + _easycom_uv_input_1 + _easycom_uv_form_item_1 + _easycom_uv_icon_1 + _easycom_uv_form_1 + _easycom_uv_button_1 + _easycom_uv_checkbox_1 + _easycom_uv_checkbox_group_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_input = () => "../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_uv_form_item = () => "../../uni_modules/uv-form/components/uv-form-item/uv-form-item.js";
const _easycom_uv_icon = () => "../../uni_modules/uv-icon/components/uv-icon/uv-icon.js";
const _easycom_uv_form = () => "../../uni_modules/uv-form/components/uv-form/uv-form.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
const _easycom_uv_checkbox = () => "../../uni_modules/uv-checkbox/components/uv-checkbox/uv-checkbox.js";
const _easycom_uv_checkbox_group = () => "../../uni_modules/uv-checkbox/components/uv-checkbox-group/uv-checkbox-group.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_input + _easycom_uv_form_item + _easycom_uv_icon + _easycom_uv_form + _easycom_uv_button + _easycom_uv_checkbox + _easycom_uv_checkbox_group)();
}
class FormData extends UTS.UTSType {
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
    this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.username = this.__props__.username;
    this.password = this.__props__.password;
    delete this.__props__;
  }
}
class smsFormData extends UTS.UTSType {
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
    this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.phone = this.__props__.phone;
    this.code = this.__props__.code;
    delete this.__props__;
  }
}
class UvFormInstance extends UTS.UTSType {
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
    this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
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
    const isPswLogin = () => {
      pswLogin.value = !pswLogin.value;
    };
    const filterNonLatin = (e = null) => {
      form.value.password = e.replace(/[^\x00-\x7F]/g, "");
    };
    const pswrules = new UTSJSONObject({
      username: [
        new UTSJSONObject({
          required: true,
          message: "请输入账号",
          trigger: ["blur", "change"]
        })
      ],
      password: [
        new UTSJSONObject({
          required: true,
          message: "请输入密码",
          trigger: ["blur", "change"]
        })
      ]
    });
    const smsrules = new UTSJSONObject({
      phone: [
        new UTSJSONObject({
          required: true,
          message: "请输入手机号",
          trigger: ["blur", "change"]
        }),
        new UTSJSONObject({
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
        new UTSJSONObject({
          required: true,
          message: "请输入验证码",
          trigger: ["blur", "change"]
        }),
        new UTSJSONObject({
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
      common_vendor.index.__f__("log", "at pages/login/login.uvue:227", "docState.value:", docState.value);
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
          common_vendor.index.showLoading({ title: "登录中..." });
          const loginRes = yield new Promise((resolve, reject) => {
            common_vendor.index.login(new UTSJSONObject({
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
          common_vendor.index.__f__("log", "at pages/login/login.uvue:307", "res", res);
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
          common_vendor.index.__f__("error", "at pages/login/login.uvue:329", "微信登录失败:", error);
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
      common_vendor.index.__f__("log", "at pages/login/login.uvue:340", docState.value);
      if (!docState.value) {
        common_vendor.index.showToast({
          title: "请先阅读并同意用户协议",
          icon: "error"
        });
        return null;
      }
      if (loginType.value) {
        (_a = formRef.value) === null || _a === void 0 ? null : _a.validate().then((res) => {
          const newFormData = new UTSJSONObject(Object.assign(Object.assign({}, form.value), { from: deviceModel.value, type: "USER" }));
          api_request.login(newFormData).then((res2 = null) => {
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
          new UTSJSONObject(
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
          showCapsule: false
        }),
        b: common_assets._imports_0,
        c: pswLogin.value
      }, pswLogin.value ? {
        d: common_vendor.o(($event) => {
          return form.value.username = $event;
        }),
        e: common_vendor.p({
          prefixIcon: "account-fill",
          type: _ctx.text,
          placeholder: "请输入账号",
          modelValue: form.value.username
        }),
        f: common_vendor.p({
          label: "",
          prop: "username",
          labelWidth: "0"
        }),
        g: common_vendor.o(showpwfun),
        h: common_vendor.p({
          name: showpw.value ? "eye-off-outline" : "eye",
          size: "20"
        }),
        i: common_vendor.o(filterNonLatin),
        j: common_vendor.o(($event) => {
          return form.value.password = $event;
        }),
        k: common_vendor.p({
          prefixIcon: "lock-fill",
          type: showpw.value ? "password" : "text",
          placeholder: "请输入密码",
          password: showpw.value,
          customStyle: "border:1rpx solid red;height:80rpx",
          modelValue: form.value.password
        }),
        l: common_vendor.p({
          label: "",
          prop: "password",
          labelWidth: "0"
        }),
        m: common_vendor.sr(formRef, "27a30816-1", {
          "k": "formRef"
        }),
        n: common_vendor.p({
          model: form.value,
          rules: pswrules
        })
      } : {}, {
        o: pswLogin.value
      }, pswLogin.value ? {
        p: common_vendor.o(submit),
        q: common_vendor.p({
          type: "primary"
        })
      } : common_vendor.e({
        r: !docState.value
      }, !docState.value ? {
        s: common_vendor.o(loginBt)
      } : {}, {
        t: docState.value
      }, docState.value ? {
        v: common_vendor.o(handleGetPhoneNumber)
      } : {}), {
        w: common_vendor.o(isDocState),
        x: common_vendor.p({
          checked: docState.value
        }),
        y: common_vendor.o(isDocState),
        z: common_vendor.t(pswLogin.value ? "个人用户登录" : "企业用户登录"),
        A: common_vendor.o(isPswLogin),
        B: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-27a30816"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
