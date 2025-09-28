"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  _easycom_custom_navBar_1();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
if (!Math) {
  _easycom_custom_navBar();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "scancode",
  setup(__props) {
    const scanFunctionIsUseable = common_vendor.ref(true);
    const handleScan = (e = null) => {
      if (scanFunctionIsUseable.value && e.detail.result) {
        common_vendor.index.vibrateLong();
        scanFunctionIsUseable.value = false;
        const scanResult = e.detail.result;
        common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:23", "扫码结果:", scanResult);
        const pages = getCurrentPages();
        if (pages.length >= 2) {
          const prevPage = pages[pages.length - 2];
          if (prevPage && prevPage.carInfo) {
            prevPage.carInfo.imei = scanResult;
            common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:33", "已设置上一页面IMEI:", scanResult);
          } else {
            common_vendor.index.$emit("scanCodeResult", new UTSJSONObject({ result: scanResult }));
          }
        }
        common_vendor.index.showToast({
          title: "扫码成功",
          icon: "success",
          duration: 1e3
        });
        setTimeout(() => {
          common_vendor.index.navigateBack(new UTSJSONObject({
            delta: 1
          }));
        }, 1e3);
      }
    };
    const error = (e = null) => {
      common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:56", "摄像头错误:", e);
      common_vendor.index.showToast({
        title: "摄像头初始化失败",
        icon: "none"
      });
    };
    const requestCameraPermission = () => {
      common_vendor.index.getSetting(new UTSJSONObject({
        success: (res = null) => {
          if (res.authSetting["scope.camera"]) {
            common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:67", "已有摄像头权限");
            return null;
          }
          common_vendor.index.authorize(new UTSJSONObject({
            scope: "scope.camera",
            success: () => {
              common_vendor.index.__f__("log", "at pages/scancode/scancode.uvue:74", "摄像头权限授权成功");
            },
            fail: () => {
              common_vendor.index.showModal(new UTSJSONObject({
                title: "权限提示",
                content: "需要摄像头权限才能扫码，是否去设置开启？",
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    common_vendor.index.openSetting();
                  } else {
                    common_vendor.index.navigateBack();
                  }
                }
              }));
            }
          }));
        }
      }));
    };
    common_vendor.onLoad(() => {
      requestCameraPermission();
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = {
        a: common_vendor.p({
          title: "扫码添加IMEI",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.o(handleScan),
        c: common_vendor.o(error),
        d: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/scancode/scancode.js.map
