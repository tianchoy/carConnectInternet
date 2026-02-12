"use strict";
const common_vendor = require("../../common/vendor.js");
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
class FormData extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          mobile: { type: String, optional: false },
          password: { type: String, optional: false }
        };
      },
      name: "FormData"
    };
  }
  constructor(options, metadata = FormData.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.mobile = this.__props__.mobile;
    this.password = this.__props__.password;
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
  __name: "signUp",
  setup(__props) {
    const form = common_vendor.ref(new FormData({
      mobile: "",
      password: ""
    }));
    const formRef = common_vendor.ref(null);
    const deviceModel = common_vendor.ref("");
    const rules = new common_vendor.UTSJSONObject(
      {
        mobile: [
          new common_vendor.UTSJSONObject({
            required: true,
            message: "请输入手机号码",
            trigger: ["blur", "change"]
          }),
          new common_vendor.UTSJSONObject({
            validator: (rule = null, value, callback) => {
              if (!/^1[3-9]\d{9}$/.test(value)) {
                callback(new Error("手机号码格式不正确"));
              } else {
                callback();
              }
            },
            trigger: ["blur"]
          })
        ],
        password: [
          new common_vendor.UTSJSONObject({
            required: true,
            message: "请输入密码",
            trigger: ["blur", "change"]
          }),
          new common_vendor.UTSJSONObject({
            min: 8,
            max: 20,
            message: "密码长度在8-20个字符之间",
            trigger: ["blur"]
          }),
          new common_vendor.UTSJSONObject({
            validator: (rule = null, value, callback) => {
              if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                callback(new Error("密码需包含大小写字母和数字"));
              } else {
                callback();
              }
            },
            trigger: ["blur"]
          })
        ]
      }
      //获取系统信息
    );
    const getSystemInfo = () => {
      const res = common_vendor.index.getSystemInfoSync();
      console.log(res);
      deviceModel.value = res.deviceModel;
    };
    const toLogin = () => {
      common_vendor.index.reLaunch({
        url: "/pages/login/login"
      });
    };
    common_vendor.onMounted(() => {
      getSystemInfo();
      if (formRef.value) {
        formRef.value.setRules(rules);
      }
    });
    const submit = () => {
      var _a;
      (_a = formRef.value) === null || _a === void 0 ? null : _a.validate().then((res) => {
        common_vendor.index.showToast({
          icon: "success",
          title: "校验通过"
        });
        const newFormData = new common_vendor.UTSJSONObject(Object.assign(Object.assign({}, form.value), { deviceModel: deviceModel.value }));
        console.log("表单数据:", newFormData);
      }).catch((errors = null) => {
        common_vendor.index.showToast({
          icon: "error",
          title: "校验失败"
        });
        console.error("验证错误:", errors);
      });
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
        a: common_vendor.p({
          title: "注册",
          ["show-back"]: false,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false,
          class: "data-v-43462111"
        }),
        b: common_vendor.o(($event) => {
          return form.value.mobile = $event;
        }, "cd"),
        c: common_vendor.p({
          placeholder: "请输入账号",
          modelValue: form.value.mobile,
          class: "data-v-43462111"
        }),
        d: common_vendor.p({
          label: "账号",
          prop: "mobile",
          class: "data-v-43462111"
        }),
        e: common_vendor.o(($event) => {
          return form.value.password = $event;
        }, "06"),
        f: common_vendor.p({
          type: "password",
          placeholder: "请输入密码",
          password: true,
          modelValue: form.value.password,
          class: "data-v-43462111"
        }),
        g: common_vendor.p({
          label: "密码",
          prop: "password",
          class: "data-v-43462111"
        }),
        h: common_vendor.sr(formRef, "43462111-1", {
          "k": "formRef"
        }),
        i: common_vendor.p({
          model: form.value,
          rules,
          class: "r data-v-43462111"
        }),
        j: common_vendor.o(toLogin, "b9"),
        k: common_vendor.o(submit, "11"),
        l: common_vendor.p({
          class: "data-v-43462111"
        }),
        m: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        n: `${_ctx.u_s_b_h}px`,
        o: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      };
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-43462111"]]);
wx.createPage(MiniProgramPage);
