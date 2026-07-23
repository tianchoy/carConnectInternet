"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/message/message.js";
  "./pages/userCenter/userCenter.js";
  "./pages/login/login.js";
  "./pages/carInfoDetail/carInfoDetail.js";
  "./pages/addCar/addCar.js";
  "./pages/playBack/playBack.js";
  "./uni_modules/lime-action-sheet/pages/index.js";
  "./pages/vehicleTracking/vehicleTracking.js";
  "./pages/mileageRecord/mileageRecord.js";
  "./pages/stopRecord/stopRecord.js";
  "./pages/userCenter/userInfo/userInfo.js";
  "./pages/userCenter/editPassword/editPassword.js";
  "./pages/userCenter/carList/carList.js";
  "./pages/userCenter/carDetail/carDetail.js";
  "./pages/geofencing/geofencing.js";
  "./pages/scancode/scancode.js";
  "./pages/userCenter/payDeviceList/payDeviceList.js";
  "./pages/cmd/cmd.js";
  "./pages/webview/webview.js";
  "./pages/deviceList/deviceList.js";
}
let updateManager = null;
function checkForUpdates() {
  if (common_vendor.index.canIUse("getUpdateManager")) {
    updateManager = common_vendor.index.getUpdateManager();
    if (updateManager) {
      updateManager.onCheckForUpdate((res = null) => {
        common_vendor.index.__f__("log", "at App.uvue:16", "检查更新结果:", res);
        if (res.hasUpdate) {
          common_vendor.index.__f__("log", "at App.uvue:19", "发现新版本，正在后台下载...");
          common_vendor.index.showLoading(new common_vendor.UTSJSONObject({
            title: "下载新版本中"
          }));
        }
      });
      updateManager.onUpdateReady(() => {
        common_vendor.index.__f__("log", "at App.uvue:28", "新版本下载完成");
        common_vendor.index.hideLoading();
        common_vendor.index.showModal(new common_vendor.UTSJSONObject({
          title: "更新提示",
          content: "新版本已经准备好，是否重启应用？",
          confirmText: "立即重启",
          cancelText: "稍后再说",
          success: (res = null) => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        }));
      });
      updateManager.onUpdateFailed(() => {
        common_vendor.index.__f__("error", "at App.uvue:48", "新版本下载失败");
        common_vendor.index.hideLoading();
        common_vendor.index.showModal(new common_vendor.UTSJSONObject({
          title: "更新失败",
          content: "新版本下载失败，请检查网络设置或稍后再试",
          showCancel: false,
          confirmText: "知道了"
        }));
      });
    }
  } else {
    common_vendor.index.showModal(new common_vendor.UTSJSONObject({
      title: "提示",
      content: "当前微信版本过低，无法使用自动更新功能，请升级到最新微信版本后重试。",
      showCancel: false
    }));
  }
}
const _sfc_main = common_vendor.defineComponent({
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.uvue:73", "App onLaunch");
    checkForUpdates();
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.uvue:77", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.uvue:80", "App Hide");
  },
  onExit: function() {
    common_vendor.index.__f__("log", "at App.uvue:101", "App Exit");
  }
});
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
