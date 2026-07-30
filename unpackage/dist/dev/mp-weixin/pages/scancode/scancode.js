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
    const cameraVisible = common_vendor.ref(true);
    const hasFinished = common_vendor.ref(false);
    const pendingBack = common_vendor.ref(false);
    let backTimer = null;
    const clearBackTimer = () => {
      const timer = backTimer;
      if (timer != null) {
        clearTimeout(timer);
        backTimer = null;
      }
    };
    const releaseCamera = () => {
      cameraVisible.value = false;
    };
    const completeBack = () => {
      if (!pendingBack.value)
        return null;
      pendingBack.value = false;
      clearBackTimer();
      common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:48", "扫码页已释放相机，返回添加设备页");
      common_vendor.index.navigateBack(new common_vendor.UTSJSONObject({ delta: 1 }));
    };
    const requestBack = () => {
      if (pendingBack.value)
        return null;
      pendingBack.value = true;
      releaseCamera();
      backTimer = setTimeout(() => {
        completeBack();
      }, 1200);
    };
    const handleCameraInitDone = () => {
      common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:62", "扫码摄像头初始化完成");
    };
    const handleScan = (e) => {
      if (hasFinished.value || !scanFunctionIsUseable.value)
        return null;
      const scanResult = e.detail.result;
      if (scanResult == null)
        return null;
      const result = scanResult;
      if (result.length == 0)
        return null;
      hasFinished.value = true;
      scanFunctionIsUseable.value = false;
      common_vendor.index.vibrateLong(new common_vendor.UTSJSONObject({}));
      common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:75", "扫码结果:", result);
      common_vendor.index.setStorageSync("scanCodeResult", result);
      utils_toast.showAppToast({
        title: "扫码成功",
        icon: "success",
        duration: 500
      });
      requestBack();
    };
    const handleCameraStop = () => {
      common_vendor.index.__f__("warn", "at pages/scancode/scancode.uvue:86", "扫码摄像头已停止");
      if (pendingBack.value) {
        common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:88", "等待相机资源释放完成后返回添加设备页");
        return null;
      }
      common_vendor.index.__f__("warn", "at pages/scancode/scancode.uvue:91", "摄像头停止但扫码页仍保持打开，等待用户返回或重试");
    };
    const handleCameraError = (e) => {
      if (hasFinished.value)
        return null;
      hasFinished.value = true;
      common_vendor.index.__f__("error", "at pages/scancode/scancode.uvue:97", "摄像头初始化失败:", e.detail);
      utils_toast.showAppToast({
        title: "摄像头初始化失败，请检查相机权限",
        icon: "none",
        duration: 500
      });
      requestBack();
    };
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:107", "扫码页隐藏");
      releaseCamera();
    });
    common_vendor.onUnload(() => {
      common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:112", "扫码页卸载");
      clearBackTimer();
      releaseCamera();
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: cameraVisible.value
      }, cameraVisible.value ? {
        b: common_vendor.o(handleCameraInitDone, "f5"),
        c: common_vendor.o(handleScan, "81"),
        d: common_vendor.o(handleCameraStop, "c6"),
        e: common_vendor.o(handleCameraError, "a4")
      } : {}, {
        f: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        g: `${_ctx.u_s_b_h}px`,
        h: `${_ctx.u_s_a_i_b}px`,
        i: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/scancode/scancode.js.map
