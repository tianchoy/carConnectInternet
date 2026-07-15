"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_input_1 = common_vendor.resolveComponent("i-input");
  const _easycom_i_form_item_1 = common_vendor.resolveComponent("i-form-item");
  const _easycom_i_icon_1 = common_vendor.resolveComponent("i-icon");
  const _easycom_i_form_1 = common_vendor.resolveComponent("i-form");
  const _easycom_i_button_1 = common_vendor.resolveComponent("i-button");
  (_easycom_custom_navBar_1 + _easycom_i_input_1 + _easycom_i_form_item_1 + _easycom_i_icon_1 + _easycom_i_form_1 + _easycom_i_button_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_i_input = () => "../../uni_modules/i-ui-x/components/i-input/i-input.js";
const _easycom_i_form_item = () => "../../uni_modules/i-ui-x/components/i-form-item/i-form-item.js";
const _easycom_i_icon = () => "../../uni_modules/i-ui-x/components/i-icon/i-icon.js";
const _easycom_i_form = () => "../../uni_modules/i-ui-x/components/i-form/i-form.js";
const _easycom_i_button = () => "../../uni_modules/i-ui-x/components/i-button/i-button.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_input + _easycom_i_form_item + _easycom_i_icon + common_vendor.unref(carIcons) + _easycom_i_form + _easycom_i_button)();
}
const carIcons = () => "../../components/car-icons/car-icons.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "addCar",
  setup(__props) {
    const formRef = common_vendor.ref(null);
    const deviceTypeSelect = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const formValid = common_vendor.ref(false);
    const carInfo = common_vendor.ref({
      deviceName: "",
      imei: "",
      deviceType: "",
      deviceTypeValue: "",
      plateNo: "",
      carType: ""
    });
    common_vendor.ref([]);
    const rules = new common_vendor.UTSJSONObject(
      {
        imei: [
          new common_vendor.UTSJSONObject({
            required: true,
            message: "请输入设备ID",
            trigger: ["blur", "change"]
          }),
          new common_vendor.UTSJSONObject({
            min: 8,
            max: 18,
            message: "ID长度应在8-18位之间",
            trigger: ["blur", "change"]
          })
        ],
        deviceType: [
          new common_vendor.UTSJSONObject({
            required: true,
            message: "请选择设备图标",
            trigger: ["blur", "change"]
          })
        ]
      }
      // ===== 核心功能函数 =====
      // 扫码功能
    );
    const scanCode = () => {
      common_vendor.index.navigateTo({
        url: "/pages/scancode/scancode"
      });
    };
    const handleScanResult = (data) => {
      console.log("接收到扫码结果:", data.result);
      if (data.result.length === 15) {
        carInfo.value.imei = "0" + data.result.slice(4, 15);
      } else if (data.result.length === 11) {
        carInfo.value.imei = "0" + data.result;
      } else {
        common_vendor.index.showToast({
          title: "请输入正确的设备ID",
          icon: "none"
        });
      }
    };
    const selectIcon = (item = null) => {
      var _a;
      console.log(item.name);
      carInfo.value.deviceType = item.name;
      carInfo.value.deviceTypeValue = item.text;
      (_a = deviceTypeSelect.value) === null || _a === void 0 ? null : _a.close();
    };
    const deviceTypeSelectFun = () => {
      var _a;
      (_a = deviceTypeSelect.value) === null || _a === void 0 ? null : _a.open();
    };
    const refreshDeviceList = () => {
      common_vendor.index.$emit("refreshDeviceList");
    };
    const validateForm = () => {
      return new Promise((resolve, reject) => {
        console.log("开始验证表单, formRef.value:", formRef.value);
        if (!formRef.value) {
          console.error("表单实例为空");
          reject(new Error("表单实例不存在"));
          return null;
        }
        if (typeof formRef.value.validate !== "function") {
          console.error("validate 方法不存在");
          reject(new Error("表单验证方法不存在"));
          return null;
        }
        try {
          const result = formRef.value.validate();
          console.log("validate 返回:", result);
          if (result && typeof result.then === "function") {
            result.then((valid) => {
              console.log("validate Promise 结果:", valid);
              if (valid) {
                resolve(true);
              } else {
                reject(new Error("表单验证失败"));
              }
            }).catch((err = null) => {
              console.error("validate Promise 错误:", err);
              reject(err);
            });
            return null;
          }
          if (typeof result === "boolean") {
            if (result) {
              resolve(true);
            } else {
              reject(new Error("表单验证失败"));
            }
            return null;
          }
          formRef.value.validate((valid, errors = null) => {
            console.log("validate 回调结果:", valid, errors);
            if (valid) {
              resolve(true);
            } else {
              reject(errors || new Error("表单验证失败"));
            }
          });
        } catch (error) {
          console.error("验证执行异常:", error);
          reject(error);
        }
      });
    };
    const submit = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        console.log("=== 开始提交设备 ===");
        try {
          yield validateForm();
          console.log("✅ 表单验证通过");
          loading.value = true;
          common_vendor.index.showLoading(new common_vendor.UTSJSONObject({
            title: "添加中...",
            mask: true
          }));
          const submitData = new common_vendor.UTSJSONObject({
            deviceName: carInfo.value.deviceName,
            imei: carInfo.value.imei,
            carType: carInfo.value.deviceType
            // plateNo: carInfo.value.plateNo
          });
          console.log("📤 提交数据:", submitData);
          const res = yield api_request.addDevice(submitData);
          console.log("✅ 添加设备返回:", res);
          common_vendor.index.hideLoading();
          loading.value = false;
          if (res.code == 0) {
            common_vendor.index.showToast({
              title: "添加成功",
              icon: "success"
            });
            common_vendor.index.setStorageSync("needRefreshHome", true);
            refreshDeviceList();
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1500);
          } else {
            common_vendor.index.showToast({
              title: res.msg || "添加失败",
              icon: "none",
              duration: 2e3
            });
          }
        } catch (error) {
          console.error("❌ 添加设备失败:", error);
          common_vendor.index.hideLoading();
          loading.value = false;
          if (error && error.message) {
            common_vendor.index.showToast({
              title: error.message || "请检查表单",
              icon: "none"
            });
          } else {
            common_vendor.index.showToast({
              title: "请求失败，请稍后重试",
              icon: "none"
            });
          }
        }
      });
    };
    common_vendor.onLoad(() => {
      common_vendor.index.$on("scanCodeResult", handleScanResult);
      console.log("formRef 初始值:", formRef.value);
    });
    common_vendor.onUnload(() => {
      common_vendor.index.$off("scanCodeResult", handleScanResult);
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
        a: common_vendor.p({
          title: "添加设备",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false,
          class: "data-v-6409e324"
        }),
        b: common_vendor.o(($event) => {
          return carInfo.value.deviceName = $event;
        }, "78"),
        c: common_vendor.p({
          border: "none",
          placeholder: "请输入设备名称",
          modelValue: carInfo.value.deviceName,
          class: "data-v-6409e324"
        }),
        d: common_vendor.p({
          label: "设备名称",
          name: "deviceName",
          labelDirection: "horizontal",
          class: "data-v-6409e324"
        }),
        e: common_vendor.o(scanCode, "64"),
        f: common_vendor.p({
          name: "/static/sancode.png",
          fontSize: "20",
          class: "data-v-6409e324"
        }),
        g: common_vendor.o(($event) => {
          return carInfo.value.imei = $event;
        }, "be"),
        h: common_vendor.p({
          border: "none",
          placeholder: "请输入设备ID(必填)",
          modelValue: carInfo.value.imei,
          class: "data-v-6409e324"
        }),
        i: common_vendor.p({
          label: "*设备ID",
          name: "imei",
          labelDirection: "horizontal",
          class: "data-v-6409e324"
        }),
        j: common_vendor.t(carInfo.value.deviceTypeValue || "请选择设备图标(必选)"),
        k: !carInfo.value.deviceTypeValue ? 1 : "",
        l: common_vendor.o(deviceTypeSelectFun, "f0"),
        m: common_vendor.p({
          label: "车标",
          name: "deviceType",
          labelDirection: "horizontal",
          class: "data-v-6409e324"
        }),
        n: common_vendor.sr(deviceTypeSelect, "6409e324-8,6409e324-1", {
          "k": "deviceTypeSelect"
        }),
        o: common_vendor.o(selectIcon, "4a"),
        p: common_vendor.p({
          class: "r data-v-6409e324"
        }),
        q: common_vendor.sr(formRef, "6409e324-1", {
          "k": "formRef"
        }),
        r: common_vendor.o(($event) => {
          return formValid.value = $event;
        }, "fe"),
        s: common_vendor.p({
          labelPosition: "left",
          modelValue: carInfo.value,
          rules,
          labelDirection: "horizontal",
          watchValidStatus: true,
          class: "r data-v-6409e324"
        }),
        t: common_vendor.o(submit, "d7"),
        v: common_vendor.p({
          type: "primary",
          loading: loading.value,
          class: "data-v-6409e324"
        }),
        w: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        x: `${_ctx.u_s_b_h}px`,
        y: `${_ctx.u_s_a_i_b}px`,
        z: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      };
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6409e324"]]);
wx.createPage(MiniProgramPage);
