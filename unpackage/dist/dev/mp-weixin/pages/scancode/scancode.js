"use strict";
const common_vendor = require("../../common/vendor.js");
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
      common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:17", "扫码结果:", scanResult);
      common_vendor.index.setStorageSync("scanCodeResult", scanResult);
      common_vendor.index.$emit("scanCodeResult", new common_vendor.UTSJSONObject({ result: scanResult }));
      common_vendor.index.showToast({
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
          common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:35", "扫码成功res:", res);
          const result = res.result;
          if (result != null)
            handleScanResult(result);
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:40", "扫码失败:", err);
          common_vendor.index.showToast({ title: "扫码失败", icon: "none" });
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
        a: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        b: `${_ctx.u_s_b_h}px`,
        c: `${_ctx.u_s_a_i_b}px`,
        d: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/scancode/scancode.js.map
