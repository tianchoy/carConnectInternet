"use strict";
const common_vendor = require("../../common/vendor.js");
const api_response = require("../../api/response.js");
const utils_toast = require("../../utils/toast.js");
require("../../utils/modal.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar2 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_input2 = common_vendor.resolveComponent("i-input");
  const _easycom_i_form_item2 = common_vendor.resolveComponent("i-form-item");
  const _easycom_i_icon2 = common_vendor.resolveComponent("i-icon");
  const _easycom_i_form2 = common_vendor.resolveComponent("i-form");
  const _easycom_i_button2 = common_vendor.resolveComponent("i-button");
  const _easycom_app_toast2 = common_vendor.resolveComponent("app-toast");
  (_easycom_custom_navBar2 + _easycom_i_input2 + _easycom_i_form_item2 + _easycom_i_icon2 + _easycom_i_form2 + _easycom_i_button2 + _easycom_app_toast2)();
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
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "addCar",
  setup(__props) {
    const isRequestingCameraPermission = common_vendor.ref(false);
    const isNavigatingToScanner = common_vendor.ref(false);
    const carIconSelectorVisible = common_vendor.ref(false);
    const loading = common_vendor.ref(false);
    const formValid = common_vendor.ref(false);
    const carInfo = common_vendor.ref({
      deviceName: "",
      deviceNo: "",
      deviceType: "",
      deviceTypeValue: "",
      plateNo: "",
      carType: ""
    });
    common_vendor.ref([]);
    const rules = [
      { name: "deviceNo", required: true, message: "请输入设备编号" },
      { name: "deviceType", required: true, message: "请选择设备图标" }
    ];
    const handleModelValid = (value) => {
      formValid.value = !!value;
    };
    const openScanPage = () => {
      if (isNavigatingToScanner.value)
        return;
      isNavigatingToScanner.value = true;
      common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:118", "打开扫码页");
      common_vendor.index.navigateTo({
        url: "/pages/scancode/scancode?source=addCar",
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/addCar/addCar.uvue:122", "打开扫码页失败:", error);
          utils_toast.showAppToast({ title: "无法打开扫码页，请重试", icon: "none" });
        },
        complete: () => {
          isNavigatingToScanner.value = false;
        }
      });
    };
    const scanCode = () => {
      if (isRequestingCameraPermission.value || isNavigatingToScanner.value)
        return;
      openScanPage();
    };
    const normalizeDeviceNo = (value) => {
      const deviceNo = value.trim();
      if (deviceNo == "" || !new RegExp("^[0-9]+$").test(deviceNo))
        return "";
      if (deviceNo.length == 15)
        return "0" + deviceNo.slice(4, 15);
      if (deviceNo.length == 11)
        return "0" + deviceNo;
      return deviceNo;
    };
    const handleScanResult = (data) => {
      common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:178", "接收到扫码结果:", data.result);
      const normalizedDeviceNo = normalizeDeviceNo(data.result);
      if (normalizedDeviceNo == "") {
        utils_toast.showAppToast({
          title: "设备编号只能输入数字，请确认后提交",
          icon: "none"
        });
        return;
      }
      carInfo.value.deviceNo = normalizedDeviceNo;
    };
    const updateCarIconSelectorVisible = (visible) => {
      carIconSelectorVisible.value = visible;
    };
    const selectIcon = (item) => {
      const name = item.getString("name", "");
      const text = item.getString("text", "");
      common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:198", name);
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
      if (carInfo.value.deviceNo.length == 0) {
        utils_toast.showAppToast({
          title: "请输入设备编号",
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
    const submit = async () => {
      common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:235", "=== 开始提交设备 ===");
      try {
        if (!validateForm())
          return;
        common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:240", "✅ 表单验证通过");
        const normalizedDeviceNo = normalizeDeviceNo(carInfo.value.deviceNo);
        if (normalizedDeviceNo == "") {
          utils_toast.showAppToast({
            title: "设备编号只能输入数字，请确认后提交",
            icon: "none"
          });
          return;
        }
        carInfo.value.deviceNo = normalizedDeviceNo;
        loading.value = true;
        common_vendor.index.showLoading({
          title: "添加中...",
          mask: true
        });
        const submitData = {
          deviceName: carInfo.value.deviceName,
          deviceNo: normalizedDeviceNo,
          carType: carInfo.value.deviceType,
          plateNo: carInfo.value.plateNo
        };
        common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:265", "📤 提交数据:", submitData);
        const res = await api_request.addDevice(submitData);
        common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:268", "✅ 添加设备返回:", res);
        common_vendor.index.hideLoading();
        loading.value = false;
        if (api_response.isBusinessSuccessCode(res.code)) {
          utils_toast.showAppToast({
            title: res.msg || "添加成功",
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
        common_vendor.index.__f__("error", "at pages/addCar/addCar.uvue:295", "❌ 添加设备失败:", error);
        common_vendor.index.hideLoading();
        loading.value = false;
        utils_toast.showAppToast({
          title: "添加设备失败",
          icon: "none"
        });
      }
    };
    common_vendor.onLoad(() => {
    });
    common_vendor.onShow(() => {
      isNavigatingToScanner.value = false;
      const rawResult = common_vendor.index.getStorageSync("scanCodeResult");
      common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:313", "onShow:", rawResult);
      const scanCodeResultListener = common_vendor.index.$on("scanCodeResult", handleScanResult);
      common_vendor.index.__f__("log", "at pages/addCar/addCar.uvue:315", "scanCodeResultListener:", scanCodeResultListener);
      const result = rawResult != null ? rawResult.toString() : "";
      if (result.length > 0) {
        common_vendor.index.removeStorageSync("scanCodeResult");
        handleScanResult({ result });
      }
    });
    common_vendor.onUnload(() => {
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
        b: common_vendor.o(($event) => carInfo.value.deviceName = $event, "25"),
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
        e: common_vendor.o(scanCode, "18"),
        f: common_vendor.p({
          name: "/static/sancode.png",
          fontSize: "24",
          class: "data-v-6409e324"
        }),
        g: common_vendor.o(($event) => carInfo.value.deviceNo = $event, "83"),
        h: common_vendor.p({
          border: "none",
          placeholder: "请输入设备编号(必填)",
          modelValue: carInfo.value.deviceNo,
          class: "data-v-6409e324"
        }),
        i: common_vendor.p({
          label: "设备编号",
          name: "deviceNo",
          required: true,
          labelDirection: "horizontal",
          class: "data-v-6409e324"
        }),
        j: common_vendor.t(carInfo.value.deviceTypeValue || "请选择设备图标(必选)"),
        k: !carInfo.value.deviceTypeValue ? 1 : "",
        l: common_vendor.o(deviceTypeSelectFun, "ed"),
        m: common_vendor.p({
          label: "车标",
          name: "deviceType",
          required: true,
          labelDirection: "horizontal",
          class: "data-v-6409e324"
        }),
        n: common_vendor.o(($event) => carInfo.value.plateNo = $event, "3f"),
        o: common_vendor.p({
          border: "none",
          placeholder: "请输入车牌号",
          modelValue: carInfo.value.plateNo,
          class: "data-v-6409e324"
        }),
        p: common_vendor.p({
          label: "车牌号",
          name: "plateNo",
          labelDirection: "horizontal",
          class: "data-v-6409e324"
        }),
        q: common_vendor.o(updateCarIconSelectorVisible, "6e"),
        r: common_vendor.o(selectIcon, "1f"),
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
        w: common_vendor.o(submit, "91"),
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
