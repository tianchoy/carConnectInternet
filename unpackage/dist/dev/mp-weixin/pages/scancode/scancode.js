"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_toast = require("../../utils/toast.js");
const utils_cameraPermission = require("../../utils/cameraPermission.js");
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
    const cameraVisible = common_vendor.ref(false);
    const cameraInstanceKey = common_vendor.ref(0);
    const hasFinished = common_vendor.ref(false);
    const pendingBack = common_vendor.ref(false);
    const pageVisible = common_vendor.ref(false);
    let backTimer = null;
    let restartTimer = null;
    let restartCount = 0;
    const clearTimers = () => {
      if (backTimer != null) {
        clearTimeout(backTimer);
        backTimer = null;
      }
      if (restartTimer != null) {
        clearTimeout(restartTimer);
        restartTimer = null;
      }
    };
    const releaseCamera = () => {
      cameraVisible.value = false;
    };
    const completeBack = () => {
      if (!pendingBack.value)
        return null;
      pendingBack.value = false;
      if (backTimer != null) {
        clearTimeout(backTimer);
        backTimer = null;
      }
      common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:59", "扫码页已释放相机，返回添加设备页");
      common_vendor.index.navigateBack(new common_vendor.UTSJSONObject({ delta: 1 }));
    };
    const requestBack = () => {
      if (pendingBack.value)
        return null;
      pendingBack.value = true;
      releaseCamera();
      backTimer = setTimeout(() => {
        return completeBack();
      }, 500);
    };
    const mountCamera = () => {
      if (!pageVisible.value || hasFinished.value || pendingBack.value)
        return null;
      cameraInstanceKey.value += 1;
      cameraVisible.value = true;
    };
    const startCamera = () => {
      utils_cameraPermission.ensureCameraPermission((status) => {
        if (!pageVisible.value || hasFinished.value || pendingBack.value)
          return null;
        if (status == "granted") {
          mountCamera();
          return null;
        }
        common_vendor.index.__f__("warn", "at pages/scancode/scancode.uvue:84", "扫码页未获得相机权限:", status);
        utils_toast.showAppToast({ title: "未获得相机权限，无法扫码", icon: "none" });
      });
    };
    const restartCameraOnce = () => {
      if (!pageVisible.value || hasFinished.value || pendingBack.value)
        return null;
      if (restartCount >= 1) {
        utils_toast.showAppToast({ title: "摄像头启动失败，请返回后重试", icon: "none" });
        return null;
      }
      restartCount += 1;
      releaseCamera();
      restartTimer = setTimeout(() => {
        restartTimer = null;
        startCamera();
      }, 300);
    };
    const handleCameraInitDone = () => {
      common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:104", "扫码摄像头初始化完成");
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
      common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:117", "扫码结果:", result);
      common_vendor.index.setStorageSync("scanCodeResult", result);
      utils_toast.showAppToast({ title: "扫码成功", icon: "success", duration: 500 });
      requestBack();
    };
    const handleCameraStop = () => {
      common_vendor.index.__f__("warn", "at pages/scancode/scancode.uvue:124", "扫码摄像头已停止");
      if (pendingBack.value) {
        completeBack();
        return null;
      }
      restartCameraOnce();
    };
    const handleCameraError = (e) => {
      if (hasFinished.value || pendingBack.value)
        return null;
      common_vendor.index.__f__("error", "at pages/scancode/scancode.uvue:134", "摄像头初始化失败:", e.detail);
      restartCameraOnce();
    };
    common_vendor.onShow(() => {
      pageVisible.value = true;
      hasFinished.value = false;
      scanFunctionIsUseable.value = true;
      startCamera();
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:146", "扫码页隐藏");
      pageVisible.value = false;
      if (!pendingBack.value)
        clearTimers();
      releaseCamera();
    });
    common_vendor.onUnload(() => {
      common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:153", "扫码页卸载");
      pageVisible.value = false;
      clearTimers();
      releaseCamera();
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: cameraVisible.value
      }, cameraVisible.value ? {
        b: cameraInstanceKey.value,
        c: common_vendor.o(handleCameraInitDone, "8e"),
        d: common_vendor.o(handleScan, "31"),
        e: common_vendor.o(handleCameraStop, "80"),
        f: common_vendor.o(handleCameraError, "3c")
      } : {}, {
        g: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        h: `${_ctx.u_s_b_h}px`,
        i: `${_ctx.u_s_a_i_b}px`,
        j: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/scancode/scancode.js.map
