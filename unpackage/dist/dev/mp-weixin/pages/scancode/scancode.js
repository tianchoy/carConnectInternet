"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_toast = require("../../utils/toast.js");
if (!Array) {
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  _easycom_app_toast_1();
}
const _easycom_app_toast = () => "../../components/app-toast/app-toast.js";
if (!Math) {
  _easycom_app_toast();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "scancode",
  setup(__props) {
    const scanFunctionIsUseable = common_vendor.ref(true);
    const goBack = () => {
      common_vendor.index.navigateBack(new common_vendor.UTSJSONObject({ delta: 1 }));
    };
    const handleScanResult = (scanResult) => {
      if (!scanFunctionIsUseable.value || scanResult.length == 0)
        return null;
      scanFunctionIsUseable.value = false;
      common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:19", "扫码结果:", scanResult);
      common_vendor.index.setStorageSync("scanCodeResult", scanResult);
      common_vendor.index.$emit("scanCodeResult", new common_vendor.UTSJSONObject({ result: scanResult }));
      utils_toast.showAppToast({
        title: "扫码成功",
        icon: "success",
        duration: 1e3
      });
      setTimeout(() => {
        common_vendor.index.navigateBack(new common_vendor.UTSJSONObject({ delta: 1 }));
      }, 1e3);
    };
    const startScan = () => {
      if (!scanFunctionIsUseable.value)
        return null;
      common_vendor.index.scanCode(new common_vendor.UTSJSONObject({
        onlyFromCamera: true,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:37", "扫码成功res:", res);
          const result = res.result;
          if (result != null)
            handleScanResult(result);
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:42", "扫码失败:", err);
          utils_toast.showAppToast({ title: "扫码失败", icon: "none" });
          goBack();
        }
      }));
    };
    common_vendor.onLoad(() => {
      startScan();
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
        a: `${_ctx.u_s_b_h}px`,
        b: `${_ctx.u_s_a_i_b}px`
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/scancode/scancode.js.map
