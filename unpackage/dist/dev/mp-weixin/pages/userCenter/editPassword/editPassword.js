"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_request = require("../../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_input_1 = common_vendor.resolveComponent("uv-input");
  const _easycom_uv_form_item_1 = common_vendor.resolveComponent("uv-form-item");
  const _easycom_uv_form_1 = common_vendor.resolveComponent("uv-form");
  const _easycom_uv_button_1 = common_vendor.resolveComponent("uv-button");
  (_easycom_custom_navBar_1 + _easycom_uv_input_1 + _easycom_uv_form_item_1 + _easycom_uv_form_1 + _easycom_uv_button_1)();
}
const _easycom_custom_navBar = () => "../../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_input = () => "../../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_uv_form_item = () => "../../../uni_modules/uv-form/components/uv-form-item/uv-form-item.js";
const _easycom_uv_form = () => "../../../uni_modules/uv-form/components/uv-form/uv-form.js";
const _easycom_uv_button = () => "../../../uni_modules/uv-button/components/uv-button/uv-button.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_input + _easycom_uv_form_item + _easycom_uv_form + _easycom_uv_button)();
}
class UserInfo extends UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          id: { type: String, optional: false },
          mobile: { type: String, optional: false }
        };
      },
      name: "UserInfo"
    };
  }
  constructor(options, metadata = UserInfo.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.id = this.__props__.id;
    this.mobile = this.__props__.mobile;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "editPassword",
  setup(__props) {
    const userInfo = common_vendor.ref(new UserInfo({
      id: "",
      mobile: ""
    }));
    const formData = common_vendor.ref(new UTSJSONObject({
      password: "",
      newPassword: "",
      confirmPassword: ""
    }));
    const formRef = common_vendor.ref(null);
    const validateConfirmPassword = (rule = null, value = null, callback = null) => {
      if (value !== formData.value.newPassword) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    const rules = new UTSJSONObject({
      password: [
        new UTSJSONObject({ required: true, message: "请输入原密码", trigger: "blur" }),
        new UTSJSONObject({ min: 6, max: 20, message: "密码长度在6到20个字符", trigger: "blur" })
      ],
      newPassword: [
        new UTSJSONObject({ required: true, message: "请输入新密码", trigger: "blur" }),
        new UTSJSONObject({ min: 6, max: 20, message: "密码长度在6到20个字符", trigger: "blur" }),
        new UTSJSONObject({
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,20}$/,
          message: "密码需包含大小写字母和数字",
          trigger: "blur"
        })
      ],
      confirmPassword: [
        new UTSJSONObject({ required: true, message: "请确认新密码", trigger: "blur" }),
        new UTSJSONObject({ validator: validateConfirmPassword, trigger: "blur" })
      ]
    });
    const handleSubmit = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          yield formRef.value.validate();
          common_vendor.index.showLoading({ title: "提交中...", mask: true });
          const submitData = new UTSJSONObject({
            password: formData.value.password,
            newPassword: formData.value.newPassword
          });
          const res = yield api_request.changePassWord(submitData);
          if (res.msg == "success") {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "密码修改成功",
              icon: "success",
              duration: 2e3
            });
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1500);
          } else {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "密码修改失败",
              icon: "error",
              duration: 2e3
            });
          }
        } catch (error) {
          common_vendor.index.hideLoading();
          if (error) {
            common_vendor.index.showToast({
              title: error[0].message || "表单验证失败",
              icon: "none",
              duration: 2e3
            });
          }
        }
      });
    };
    common_vendor.onLoad((options) => {
      if (options.userInfo) {
        try {
          const parsedInfo = UTS.JSON.parse(decodeURIComponent(options.userInfo));
          common_vendor.index.__f__("log", "at pages/userCenter/editPassword/editPassword.uvue:127", parsedInfo);
          userInfo.value = {
            id: parsedInfo.getString("userId") || "",
            mobile: parsedInfo.getString("mobile") || ""
          };
          common_vendor.index.__f__("log", "at pages/userCenter/editPassword/editPassword.uvue:132", "用户信息:", userInfo.value);
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/userCenter/editPassword/editPassword.uvue:134", "解析用户信息失败:", e);
        }
      }
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
        a: common_vendor.p({
          title: "修改密码",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.o(($event) => {
          return common_vendor.unref(formData).password = $event;
        }),
        c: common_vendor.p({
          placeholder: "请输入原密码",
          border: "none",
          type: "password",
          password: true,
          customStyle: "padding:20rpx",
          modelValue: common_vendor.unref(formData).password
        }),
        d: common_vendor.p({
          label: "原密码",
          labelWidth: "80",
          prop: "password",
          borderBottom: true
        }),
        e: common_vendor.o(($event) => {
          return common_vendor.unref(formData).newPassword = $event;
        }),
        f: common_vendor.p({
          placeholder: "请输入新密码",
          border: "none",
          type: "password",
          password: true,
          customStyle: "padding:20rpx",
          modelValue: common_vendor.unref(formData).newPassword
        }),
        g: common_vendor.p({
          label: "新密码",
          labelWidth: "80",
          prop: "newPassword",
          borderBottom: true
        }),
        h: common_vendor.o(($event) => {
          return common_vendor.unref(formData).confirmPassword = $event;
        }),
        i: common_vendor.p({
          placeholder: "请再次输入新密码",
          border: "none",
          type: "password",
          password: true,
          customStyle: "padding:20rpx",
          modelValue: common_vendor.unref(formData).confirmPassword
        }),
        j: common_vendor.p({
          label: "确认密码",
          labelWidth: "80",
          prop: "confirmPassword"
        }),
        k: common_vendor.sr(formRef, "be57f4b4-1", {
          "k": "formRef"
        }),
        l: common_vendor.p({
          labelPosition: "left",
          model: common_vendor.unref(formData),
          rules
        }),
        m: common_vendor.o(handleSubmit),
        n: common_vendor.p({
          type: "primary",
          text: "提交修改"
        }),
        o: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/userCenter/editPassword/editPassword.js.map
