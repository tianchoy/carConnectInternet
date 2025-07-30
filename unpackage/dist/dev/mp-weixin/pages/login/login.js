"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_input_1 = common_vendor.resolveComponent("uv-input");
  const _easycom_uv_form_item_1 = common_vendor.resolveComponent("uv-form-item");
  const _easycom_uv_form_1 = common_vendor.resolveComponent("uv-form");
  const _easycom_uv_button_1 = common_vendor.resolveComponent("uv-button");
  (_easycom_custom_navBar_1 + _easycom_uv_input_1 + _easycom_uv_form_item_1 + _easycom_uv_form_1 + _easycom_uv_button_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_input = () => "../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_uv_form_item = () => "../../uni_modules/uv-form/components/uv-form-item/uv-form-item.js";
const _easycom_uv_form = () => "../../uni_modules/uv-form/components/uv-form/uv-form.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_input + _easycom_uv_form_item + _easycom_uv_form + _easycom_uv_button)();
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
    const form = common_vendor.ref(new FormData({
      username: "",
      password: ""
    }));
    const formRef = common_vendor.ref(null);
    const deviceModel = common_vendor.ref("");
    const rules = new UTSJSONObject(
      {
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
      }
      //获取系统信息
    );
    const getSystemInfo = () => {
      const res = common_vendor.index.getSystemInfoSync();
      common_vendor.index.__f__("log", "at pages/login/login.uvue:64", res);
      deviceModel.value = res.deviceModel;
    };
    const toSignUp = () => {
      common_vendor.index.reLaunch({
        url: "/pages/signUp/signUp"
      });
    };
    common_vendor.onMounted(() => {
      getSystemInfo();
      if (formRef.value) {
        formRef.value.setRules(rules);
      }
      const getToken = common_vendor.index.getStorageSync("token");
      if (getToken) {
        common_vendor.index.reLaunch({
          url: "/pages/index/index"
        });
      }
    });
    const submit = () => {
      var _a;
      (_a = formRef.value) === null || _a === void 0 ? null : _a.validate().then((res) => {
        const newFormData = new UTSJSONObject(Object.assign(Object.assign({}, form.value), { from: deviceModel.value, type: "USER" }));
        api_request.login("POST", newFormData).then((res2 = null) => {
          common_vendor.index.__f__("log", "at pages/login/login.uvue:98", "1111:", res2.data.token);
          common_vendor.index.setStorageSync("token", res2.data.token);
          common_vendor.index.reLaunch({
            url: "/pages/index/index"
          });
        });
      }).catch((errors = null) => {
        common_vendor.index.showToast({
          icon: "error",
          title: "校验失败"
        });
      });
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.p({
          title: "登陆",
          ["show-back"]: false,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.o(($event = null) => {
          return form.value.username = $event;
        }),
        c: common_vendor.p({
          placeholder: "请输入账号",
          modelValue: form.value.username
        }),
        d: common_vendor.p({
          label: "账号",
          prop: "username"
        }),
        e: common_vendor.o(($event = null) => {
          return form.value.password = $event;
        }),
        f: common_vendor.p({
          type: "text",
          placeholder: "请输入密码",
          modelValue: form.value.password
        }),
        g: common_vendor.p({
          label: "密码",
          prop: "password"
        }),
        h: common_vendor.sr(formRef, "27a30816-1", {
          "k": "formRef"
        }),
        i: common_vendor.p({
          model: form.value,
          rules
        }),
        j: common_vendor.o(toSignUp),
        k: common_vendor.o(submit),
        l: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-27a30816"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
