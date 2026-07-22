"use strict";
const common_vendor = require("../../../common/vendor.js");
const api_request = require("../../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_input_1 = common_vendor.resolveComponent("i-input");
  const _easycom_i_form_item_1 = common_vendor.resolveComponent("i-form-item");
  const _easycom_i_form_1 = common_vendor.resolveComponent("i-form");
  const _easycom_i_button_1 = common_vendor.resolveComponent("i-button");
  (_easycom_custom_navBar_1 + _easycom_i_input_1 + _easycom_i_form_item_1 + _easycom_i_form_1 + _easycom_i_button_1)();
}
const _easycom_custom_navBar = () => "../../../components/custom-navBar/custom-navBar.js";
const _easycom_i_input = () => "../../../uni_modules/i-ui-x/components/i-input/i-input.js";
const _easycom_i_form_item = () => "../../../uni_modules/i-ui-x/components/i-form-item/i-form-item.js";
const _easycom_i_form = () => "../../../uni_modules/i-ui-x/components/i-form/i-form.js";
const _easycom_i_button = () => "../../../uni_modules/i-ui-x/components/i-button/i-button.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_input + _easycom_i_form_item + _easycom_i_form + _easycom_i_button)();
}
class UserInfo extends common_vendor.UTS.UTSType {
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
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.id = this.__props__.id;
    this.mobile = this.__props__.mobile;
    delete this.__props__;
  }
}
class FormInstance extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          validate: { type: "Unknown", optional: false }
        };
      },
      name: "FormInstance"
    };
  }
  constructor(options, metadata = FormInstance.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.validate = this.__props__.validate;
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
    const formData = common_vendor.ref(new common_vendor.UTSJSONObject({
      password: "",
      newPassword: "",
      confirmPassword: ""
    }));
    const formRef = common_vendor.ref(null);
    const rules = [
      new common_vendor.UTSJSONObject({ name: "password", required: true, message: "请输入原密码" }),
      new common_vendor.UTSJSONObject({ name: "newPassword", required: true, message: "请输入新密码" }),
      new common_vendor.UTSJSONObject({ name: "confirmPassword", required: true, message: "请确认新密码" })
    ];
    const handleSubmit = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const form = formRef.value;
          if (form == null || !form.validate()) {
            throw new Error("表单验证失败");
          }
          common_vendor.index.showLoading(new common_vendor.UTSJSONObject({ title: "提交中...", mask: true }));
          const submitData = new common_vendor.UTSJSONObject({
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
          common_vendor.index.showToast({
            title: "表单验证失败",
            icon: "none",
            duration: 2e3
          });
        }
      });
    };
    common_vendor.onLoad((options) => {
      if (options.userInfo != null) {
        try {
          const parsedInfo = common_vendor.UTS.JSON.parse(decodeURIComponent(options.userInfo));
          common_vendor.index.__f__("log", "at pages/userCenter/editPassword/editPassword.uvue:118", parsedInfo);
          const userId = parsedInfo.getString("userId");
          const mobile = parsedInfo.getString("mobile");
          userInfo.value = {
            id: userId != null ? userId : "",
            mobile: mobile != null ? mobile : ""
          };
          common_vendor.index.__f__("log", "at pages/userCenter/editPassword/editPassword.uvue:125", "用户信息:", userInfo.value);
        } catch (e) {
          common_vendor.index.__f__("error", "at pages/userCenter/editPassword/editPassword.uvue:127", "解析用户信息失败:", e);
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
        }, "1d"),
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
          labelDirection: "horizontal",
          labelWidth: "80",
          name: "password",
          borderBottom: true
        }),
        e: common_vendor.o(($event) => {
          return common_vendor.unref(formData).newPassword = $event;
        }, "05"),
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
          labelDirection: "horizontal",
          labelWidth: "80",
          name: "newPassword",
          borderBottom: true
        }),
        h: common_vendor.o(($event) => {
          return common_vendor.unref(formData).confirmPassword = $event;
        }, "5f"),
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
          labelDirection: "horizontal",
          labelWidth: "80",
          name: "confirmPassword"
        }),
        k: common_vendor.sr(formRef, "be57f4b4-1", {
          "k": "formRef"
        }),
        l: common_vendor.p({
          modelValue: common_vendor.unref(formData),
          rules,
          class: "r"
        }),
        m: common_vendor.o(handleSubmit, "19"),
        n: common_vendor.p({
          type: "primary",
          text: "提交修改"
        }),
        o: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        p: `${_ctx.u_s_b_h}px`,
        q: `${_ctx.u_s_a_i_b}px`,
        r: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/userCenter/editPassword/editPassword.js.map
