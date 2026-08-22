"use strict";
const common_vendor = require("../common/vendor.js");
require("../api/request.js");
const services_push = require("./push.js");
let initialized = false;
function pushBindingDebug(message) {
  common_vendor.index.__f__("log", "at services/push-binding.uts:17", "[PushBinding] " + message);
}
function getLoginToken() {
  const value = common_vendor.index.getStorageSync("token");
  return value == null ? "" : value.toString();
}
function bindRegistrationId(registrationId) {
  if (registrationId == "")
    return null;
  const token = getLoginToken();
  if (token == "") {
    pushBindingDebug("RegistrationID 已就绪，等待用户登录");
    return null;
  }
  return null;
}
function initPushBinding() {
  if (initialized)
    return null;
  initialized = true;
  services_push.onPushRegistrationIdReady((registrationId) => {
    bindRegistrationId(registrationId);
  });
  services_push.onPushSessionAuthenticated((registrationId) => {
    if (registrationId == "") {
      pushBindingDebug("用户已登录，但尚无缓存 RegistrationID");
      return null;
    }
    pushBindingDebug("用户已登录，使用缓存 RegistrationID 绑定推送设备");
    bindRegistrationId(registrationId);
  });
}
exports.initPushBinding = initPushBinding;
//# sourceMappingURL=../../.sourcemap/mp-weixin/services/push-binding.js.map
