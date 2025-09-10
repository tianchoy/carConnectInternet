"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_input_1 = common_vendor.resolveComponent("uv-input");
  const _easycom_uv_form_item_1 = common_vendor.resolveComponent("uv-form-item");
  const _easycom_car_number_input_1 = common_vendor.resolveComponent("car-number-input");
  const _easycom_uv_action_sheet_1 = common_vendor.resolveComponent("uv-action-sheet");
  const _easycom_uv_form_1 = common_vendor.resolveComponent("uv-form");
  const _easycom_uv_button_1 = common_vendor.resolveComponent("uv-button");
  (_easycom_custom_navBar_1 + _easycom_uv_input_1 + _easycom_uv_form_item_1 + _easycom_car_number_input_1 + _easycom_uv_action_sheet_1 + _easycom_uv_form_1 + _easycom_uv_button_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_input = () => "../../uni_modules/uv-input/components/uv-input/uv-input.js";
const _easycom_uv_form_item = () => "../../uni_modules/uv-form/components/uv-form-item/uv-form-item.js";
const _easycom_car_number_input = () => "../../uni_modules/car-number-input/components/car-number-input/car-number-input.js";
const _easycom_uv_action_sheet = () => "../../uni_modules/uv-action-sheet/components/uv-action-sheet/uv-action-sheet.js";
const _easycom_uv_form = () => "../../uni_modules/uv-form/components/uv-form/uv-form.js";
const _easycom_uv_button = () => "../../uni_modules/uv-button/components/uv-button/uv-button.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_input + _easycom_uv_form_item + _easycom_car_number_input + _easycom_uv_action_sheet + _easycom_uv_form + _easycom_uv_button)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "addCar",
  setup(__props) {
    const formRef = common_vendor.ref(null);
    const deviceTypeSelect = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const carInfo = common_vendor.ref({
      deviceName: "",
      imei: "",
      deviceType: "",
      deviceTypeValue: "",
      plateNo: ""
    });
    const actions = common_vendor.ref([]);
    const handlePlateNumberChange = (e) => {
      common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:60", e);
      carInfo.value.plateNo = e;
    };
    const rules = new UTSJSONObject({
      imei: [
        new UTSJSONObject({
          required: true,
          message: "请输入设备IMEI",
          trigger: ["blur", "change"]
        }),
        new UTSJSONObject({
          min: 8,
          max: 15,
          message: "IMEI长度应在8-15位之间",
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
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a;
        if (actions.value.length === 0) {
          common_vendor.index.showLoading({
            title: "加载中..."
          });
          try {
            yield loadCarTypeData();
          } finally {
            common_vendor.index.hideLoading();
          }
        }
        if (actions.value.length > 0) {
          (_a = deviceTypeSelect.value) === null || _a === void 0 ? null : _a.open();
        }
      });
    };
    const deviceTypeSelectsFun = (e = null) => {
      carInfo.value.deviceType = e.name;
      carInfo.value.deviceTypeValue = e.value;
    };
    const refreshDeviceList = () => {
      common_vendor.index.$emit("refreshDeviceList");
      common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:113", "已触发首页设备列表刷新");
    };
    const submit = () => {
      var _a;
      (_a = formRef.value) === null || _a === void 0 ? null : _a.validate().then(() => {
        return common_vendor.__awaiter(this, void 0, void 0, function* () {
          loading.value = true;
          try {
            const submitData = new UTSJSONObject({
              deviceName: carInfo.value.deviceName,
              imei: carInfo.value.imei,
              deviceType: carInfo.value.deviceTypeValue,
              plateNo: carInfo.value.plateNo
            });
            const res = yield api_request.addDevice(submitData);
            if (res.code == 0) {
              common_vendor.index.showToast({
                title: "添加成功",
                icon: "success"
              });
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
            common_vendor.index.__f__("error", "at pages/addCar/addCar.uvue:149", "添加设备错误:", error);
            common_vendor.index.showToast({
              title: "请求失败，请稍后重试",
              icon: "none"
            });
          } finally {
            loading.value = false;
          }
        });
      }).catch((errors = null) => {
        common_vendor.index.__f__("error", "at pages/addCar/addCar.uvue:158", "验证错误:", errors);
        common_vendor.index.showToast({
          title: "请检查表单",
          icon: "none"
        });
      });
    };
    common_vendor.onLoad(() => {
      loadCarTypeData();
    });
    const loadCarTypeData = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield api_request.getCarType();
          if (res.msg == "success") {
            actions.value = res.data.map((item = null) => {
              return new UTSJSONObject({
                name: item.typeName,
                value: item.id.toString()
                // 实际值
              });
            });
          } else {
            common_vendor.index.showToast({
              title: "获取车辆品牌失败",
              icon: "none"
            });
          }
        } catch (error) {
          common_vendor.index.showToast({
            title: "请求失败，请重试",
            icon: "none"
          });
        }
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
          return carInfo.value.imei = $event;
        }),
        f: common_vendor.p({
          border: "none",
          placeholder: "请输入设备IMEI(必填)",
          modelValue: carInfo.value.imei
        }),
        g: common_vendor.p({
          label: "*设备IMEI",
          labelWidth: "150rpx",
          prop: "imei",
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
        l: common_vendor.o(handlePlateNumberChange),
        m: common_vendor.p({
          defaultStr: "京A"
        }),
        n: common_vendor.p({
          label: "车牌号",
          labelWidth: "150rpx",
          prop: "plateNo",
          borderBottom: true
        }),
        o: common_vendor.sr(deviceTypeSelect, "6409e324-10,6409e324-1", {
          "k": "deviceTypeSelect"
        }),
        p: common_vendor.o(deviceTypeSelectsFun),
        q: common_vendor.p({
          actions: actions.value,
          title: "请选择设备类型",
          loading: actions.value.length === 0
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
          type: "primary",
          loading: loading.value
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
