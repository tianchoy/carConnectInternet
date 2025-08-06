"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_input_1 = common_vendor.resolveComponent("uv-input");
  const _easycom_uv_form_item_1 = common_vendor.resolveComponent("uv-form-item");
  const _easycom_uv_action_sheet_1 = common_vendor.resolveComponent("uv-action-sheet");
  const _easycom_uv_form_1 = common_vendor.resolveComponent("uv-form");
  const _easycom_uv_button_1 = common_vendor.resolveComponent("uv-button");
  (_easycom_custom_navBar_1 + _easycom_uv_input_1 + _easycom_uv_form_item_1 + _easycom_uv_action_sheet_1 + _easycom_uv_form_1 + _easycom_uv_button_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_input = () => "../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_uv_form_item = () => "../../uni_modules/uv-form/components/uv-form-item/uv-form-item.js";
const _easycom_uv_action_sheet = () => "../../uni_modules/uv-action-sheet/components/uv-action-sheet/uv-action-sheet.js";
const _easycom_uv_form = () => "../../uni_modules/uv-form/components/uv-form/uv-form.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_input + _easycom_uv_form_item + _easycom_uv_action_sheet + _easycom_uv_form + _easycom_uv_button)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "addCar",
  setup(__props) {
    const formRef = common_vendor.ref(null);
    const deviceTypeSelect = common_vendor.ref(null);
    const carInfo = common_vendor.ref({
      deviceName: "",
      deviceImei: "",
      deviceType: "",
      carNumber: ""
    });
    const actions = common_vendor.ref([
      new UTSJSONObject({
        name: "智能车",
        value: "1"
      }),
      new UTSJSONObject({
        name: "智能车2",
        value: "2"
      })
    ]);
    const rules = new UTSJSONObject({
      deviceImei: [
        new UTSJSONObject({
          required: true,
          message: "请输入设备IMEI",
          trigger: ["blur", "change"]
        })
      ],
      deviceType: [
        new UTSJSONObject({
          required: true,
          message: "请选择设备类型",
          trigger: ["blur", "change"]
        })
      ]
    });
    const deviceTypeSelectFun = () => {
      var _a;
      (_a = deviceTypeSelect.value) === null || _a === void 0 ? null : _a.open();
    };
    const deviceTypeSelectsFun = (e) => {
      carInfo.value.deviceType = e.name;
    };
    const submit = () => {
      var _a;
      (_a = formRef.value) === null || _a === void 0 ? null : _a.validate().then(() => {
        common_vendor.index.showToast({
          icon: "success",
          title: "校验通过"
        });
        common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:93", "表单数据:", carInfo.value);
      }).catch((errors = null) => {
        common_vendor.index.showToast({
          icon: "error",
          title: "校验失败"
        });
        common_vendor.index.__f__("error", "at pages/addCar/addCar.uvue:99", "验证错误:", errors);
      });
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.p({
          title: "添加车辆",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.o(($event = null) => {
          return carInfo.value.deviceName = $event;
        }),
        c: common_vendor.p({
          border: "none",
          placeholder: "请输入设备名称",
          modelValue: carInfo.value.deviceName
        }),
        d: common_vendor.p({
          label: "设备名称",
          labelWidth: "150rpx",
          prop: "deviceName",
          borderBottom: true
        }),
        e: common_vendor.o(($event = null) => {
          return carInfo.value.deviceImei = $event;
        }),
        f: common_vendor.p({
          border: "none",
          placeholder: "请输入设备IMEI(必填)",
          modelValue: carInfo.value.deviceImei
        }),
        g: common_vendor.p({
          label: "*设备IMEI",
          labelWidth: "150rpx",
          prop: "deviceImei",
          borderBottom: true
        }),
        h: common_vendor.o(($event = null) => {
          return carInfo.value.deviceType = $event;
        }),
        i: common_vendor.p({
          border: "none",
          disabled: true,
          disabledColor: "#fff",
          placeholder: "请选择设备类型(必选)",
          suffixIcon: "arrow-down",
          modelValue: carInfo.value.deviceType
        }),
        j: common_vendor.o(deviceTypeSelectFun),
        k: common_vendor.p({
          label: "*设备类型",
          labelWidth: "150rpx",
          prop: "deviceType",
          borderBottom: true
        }),
        l: common_vendor.o(($event = null) => {
          return carInfo.value.carNumber = $event;
        }),
        m: common_vendor.p({
          border: "none",
          placeholder: "请输入车牌号",
          modelValue: carInfo.value.carNumber
        }),
        n: common_vendor.p({
          label: "车牌号",
          labelWidth: "150rpx",
          prop: "carNumber",
          borderBottom: true
        }),
        o: common_vendor.sr(deviceTypeSelect, "6409e324-10,6409e324-1", {
          "k": "deviceTypeSelect"
        }),
        p: common_vendor.o(deviceTypeSelectsFun),
        q: common_vendor.p({
          actions: actions.value,
          title: "请选择设备类型"
        }),
        r: common_vendor.sr(formRef, "6409e324-1", {
          "k": "formRef"
        }),
        s: common_vendor.p({
          labelPosition: "left",
          model: carInfo.value,
          rules
        }),
        t: common_vendor.o(submit),
        v: common_vendor.p({
          type: "primary"
        }),
        w: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6409e324"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/addCar/addCar.js.map
