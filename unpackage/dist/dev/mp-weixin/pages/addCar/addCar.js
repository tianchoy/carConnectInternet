"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_toast = require("../../utils/toast.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_input_1 = common_vendor.resolveComponent("i-input");
  const _easycom_i_form_item_1 = common_vendor.resolveComponent("i-form-item");
  const _easycom_i_icon_1 = common_vendor.resolveComponent("i-icon");
  const _easycom_i_form_1 = common_vendor.resolveComponent("i-form");
  const _easycom_i_button_1 = common_vendor.resolveComponent("i-button");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  (_easycom_custom_navBar_1 + _easycom_i_input_1 + _easycom_i_form_item_1 + _easycom_i_icon_1 + _easycom_i_form_1 + _easycom_i_button_1 + _easycom_app_toast_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_i_input = () => "../../uni_modules/i-ui-x/components/i-input/i-input.js";
const _easycom_i_form_item = () => "../../uni_modules/i-ui-x/components/i-form-item/i-form-item.js";
const _easycom_i_icon = () => "../../uni_modules/i-ui-x/components/i-icon/i-icon.js";
const _easycom_i_form = () => "../../uni_modules/i-ui-x/components/i-form/i-form.js";
const _easycom_i_button = () => "../../uni_modules/i-ui-x/components/i-button/i-button.js";
const _easycom_app_toast = () => "../../components/app-toast/app-toast.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_input + _easycom_i_form_item + _easycom_i_icon + common_vendor.unref(carIcons) + _easycom_i_form + _easycom_i_button + _easycom_app_toast)();
}
const carIcons = () => "../../components/car-icons/car-icons.js";
class CarFormData extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          deviceName: { type: String, optional: false },
          imei: { type: String, optional: false },
          deviceType: { type: String, optional: false },
          deviceTypeValue: { type: String, optional: false },
          plateNo: { type: String, optional: false },
          carType: { type: String, optional: false }
        };
      },
      name: "CarFormData"
    };
  }
  constructor(options, metadata = CarFormData.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.deviceName = this.__props__.deviceName;
    this.imei = this.__props__.imei;
    this.deviceType = this.__props__.deviceType;
    this.deviceTypeValue = this.__props__.deviceTypeValue;
    this.plateNo = this.__props__.plateNo;
    this.carType = this.__props__.carType;
    delete this.__props__;
  }
}
class ScanResultData extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          result: { type: String, optional: false }
        };
      },
      name: "ScanResultData"
    };
  }
  constructor(options, metadata = ScanResultData.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.result = this.__props__.result;
    delete this.__props__;
  }
}
class AddDeviceResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: false },
          data: { type: CarFormData, optional: false }
        };
      },
      name: "AddDeviceResponse"
    };
  }
  constructor(options, metadata = AddDeviceResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "addCar",
  setup(__props) {
    const carIconSelectorVisible = common_vendor.ref(false);
    const loading = common_vendor.ref(false);
    const formValid = common_vendor.ref(false);
    const carInfo = common_vendor.ref(new CarFormData({
      deviceName: "",
      imei: "",
      deviceType: "",
      deviceTypeValue: "",
      plateNo: "",
      carType: ""
    }));
    common_vendor.ref([]);
    const rules = [
      new common_vendor.UTSJSONObject({ name: "imei", required: true, message: "请输入设备ID" }),
      new common_vendor.UTSJSONObject({ name: "deviceType", required: true, message: "请选择设备图标" })
    ];
    const handleModelValid = (value = null) => {
      formValid.value = !!value;
    };
    const scanCode = () => {
      common_vendor.index.navigateTo({
        url: "/pages/scancode/scancode?source=addCar"
      });
    };
    const handleScanResult = (data) => {
      common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:117", "接收到扫码结果:", data.result);
      if (data.result.length == 15) {
        carInfo.value.imei = "0" + data.result.slice(4, 15);
      } else if (data.result.length == 11) {
        carInfo.value.imei = "0" + data.result;
      } else {
        utils_toast.showAppToast({
          title: "请输入正确的设备ID",
          icon: "none"
        });
      }
    };
    const updateCarIconSelectorVisible = (visible) => {
      carIconSelectorVisible.value = visible;
    };
    const selectIcon = (item) => {
      const name = item.getString("name", "");
      const text = item.getString("text", "");
      common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:139", name);
      carInfo.value.deviceType = name;
      carInfo.value.deviceTypeValue = text;
      carIconSelectorVisible.value = false;
    };
    const deviceTypeSelectFun = () => {
      carIconSelectorVisible.value = true;
    };
    const refreshDeviceList = () => {
      common_vendor.index.$emit("refreshDeviceList");
    };
    const validateForm = () => {
      if (carInfo.value.imei.length == 0) {
        utils_toast.showAppToast({
          title: "请输入设备ID",
          icon: "none"
        });
        return false;
      }
      if (carInfo.value.deviceType.length == 0) {
        utils_toast.showAppToast({
          title: "请选择设备图标",
          icon: "none"
        });
        return false;
      }
      return true;
    };
    const submit = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:176", "=== 开始提交设备 ===");
        try {
          if (!validateForm())
            return Promise.resolve(null);
          common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:181", "✅ 表单验证通过");
          loading.value = true;
          common_vendor.index.showLoading(new common_vendor.UTSJSONObject({
            title: "添加中...",
            mask: true
          }));
          const submitData = new common_vendor.UTSJSONObject({
            deviceName: carInfo.value.deviceName,
            imei: carInfo.value.imei,
            carType: carInfo.value.deviceType,
            plateNo: carInfo.value.plateNo
          });
          common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:196", "📤 提交数据:", submitData);
          const res = yield api_request.addDevice(submitData);
          common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:199", "✅ 添加设备返回:", res);
          common_vendor.index.hideLoading();
          loading.value = false;
          if (res.code == 0) {
            utils_toast.showAppToast({
              title: "添加成功",
              icon: "success"
            });
            common_vendor.index.setStorageSync("needRefreshHome", true);
            refreshDeviceList();
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1500);
          } else {
            utils_toast.showAppToast({
              title: res.msg || "添加失败",
              icon: "none",
              duration: 2e3
            });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/addCar/addCar.uvue:226", "❌ 添加设备失败:", error);
          common_vendor.index.hideLoading();
          loading.value = false;
          utils_toast.showAppToast({
            title: "添加设备失败",
            icon: "none"
          });
        }
      });
    };
    common_vendor.onLoad(() => {
      common_vendor.index.$on("scanCodeResult", handleScanResult);
    });
    common_vendor.onShow(() => {
      const rawResult = common_vendor.index.getStorageSync("scanCodeResult");
      const result = rawResult != null ? rawResult.toString() : "";
      if (result.length > 0) {
        common_vendor.index.removeStorageSync("scanCodeResult");
        handleScanResult(new ScanResultData({ result }));
      }
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
        }, "64"),
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
        e: common_vendor.o(scanCode, "bf"),
        f: common_vendor.p({
          name: "/static/sancode.png",
          fontSize: "20",
          class: "data-v-6409e324"
        }),
        g: common_vendor.o(($event) => {
          return carInfo.value.imei = $event;
        }, "62"),
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
        l: common_vendor.o(deviceTypeSelectFun, "82"),
        m: common_vendor.p({
          label: "车标",
          name: "deviceType",
          labelDirection: "horizontal",
          class: "data-v-6409e324"
        }),
        n: common_vendor.o(($event) => {
          return carInfo.value.plateNo = $event;
        }, "29"),
        o: common_vendor.p({
          border: "none",
          placeholder: "请输入车牌名",
          modelValue: carInfo.value.plateNo,
          class: "data-v-6409e324"
        }),
        p: common_vendor.p({
          label: "车牌名",
          name: "plateNo",
          labelDirection: "horizontal",
          class: "data-v-6409e324"
        }),
        q: common_vendor.o(updateCarIconSelectorVisible, "2f"),
        r: common_vendor.o(selectIcon, "02"),
        s: common_vendor.p({
          show: carIconSelectorVisible.value,
          class: "data-v-6409e324"
        }),
        t: common_vendor.o(handleModelValid, "fd"),
        v: common_vendor.p({
          labelPosition: "left",
          modelValue: carInfo.value,
          rules,
          labelDirection: "horizontal",
          watchValidStatus: true,
          class: "data-v-6409e324"
        }),
        w: common_vendor.o(submit, "53"),
        x: common_vendor.p({
          type: "primary",
          loading: loading.value,
          class: "data-v-6409e324"
        }),
        y: `${_ctx.u_s_b_h}px`,
        z: `${_ctx.u_s_a_i_b}px`,
        A: common_vendor.p({
          class: "data-v-6409e324"
        })
      };
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6409e324"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/addCar/addCar.js.map
