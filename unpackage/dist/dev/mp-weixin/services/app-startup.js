"use strict";
const common_vendor = require("../common/vendor.js");
require("./push.js");
const services_pushBinding = require("./push-binding.js");
const POST_LOGIN_INITIALIZATION_DELAY = 1200;
let pushServicesInitialized = false;
let pushServicesInitializationScheduled = false;
function startupLog(message) {
  common_vendor.index.__f__("log", "at services/app-startup.uts:16", "[AppStartup] " + message);
}
function hasLoginToken() {
  const token = common_vendor.index.getStorageSync("token");
  return token != null && token.toString() != "";
}
function initializePushServices() {
  pushServicesInitializationScheduled = false;
  if (!hasLoginToken()) {
    startupLog("当前未登录，跳过推送初始化");
    return null;
  }
  if (pushServicesInitialized) {
    return null;
  }
  pushServicesInitialized = true;
  startupLog("开始登录后的推送初始化");
  services_pushBinding.initPushBinding();
  startupLog("登录后的推送初始化已触发");
}
function schedulePostLoginInitialization() {
  if (!hasLoginToken())
    return null;
  if (pushServicesInitialized) {
    return null;
  }
  if (pushServicesInitializationScheduled)
    return null;
  pushServicesInitializationScheduled = true;
  startupLog("已安排登录后的推送初始化");
  setTimeout(() => {
    initializePushServices();
  }, POST_LOGIN_INITIALIZATION_DELAY);
}
exports.schedulePostLoginInitialization = schedulePostLoginInitialization;
//# sourceMappingURL=../../.sourcemap/mp-weixin/services/app-startup.js.map
