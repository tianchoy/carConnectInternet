"use strict";
const common_vendor = require("../common/vendor.js");
const api_request = require("../api/request.js");
require("../api/http.js");
const services_push = require("./push.js");
let initialized = false;
function pushBindingDebug(message) {
  common_vendor.index.__f__("log", "at services/push-binding.uts:18", "[PushBinding] " + message);
}
function pushBindingWarn(message) {
  common_vendor.index.__f__("warn", "at services/push-binding.uts:25", "[PushBinding] " + message);
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
function unbindPushDeviceOnLogout() {
  return common_vendor.__awaiter(this, void 0, void 0, function* () {
    const registrationId = services_push.getCachedPushRegistrationId();
    if (registrationId == "") {
      pushBindingDebug("退出登录时无缓存 RegistrationID，跳过推送设备解绑");
      return Promise.resolve(null);
    }
    try {
      pushBindingDebug("退出登录时解绑推送设备");
      const response = yield api_request.unbindPushDevice(registrationId);
      if (response.code == 200) {
        pushBindingDebug("推送设备解绑成功");
        return Promise.resolve(null);
      }
      pushBindingWarn("推送设备解绑失败，但仍继续退出登录。code=" + response.code + ", msg=" + response.msg);
    } catch (error) {
      pushBindingWarn("推送设备解绑请求失败，但仍继续退出登录。");
    }
  });
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
exports.unbindPushDeviceOnLogout = unbindPushDeviceOnLogout;
//# sourceMappingURL=../../.sourcemap/mp-weixin/services/push-binding.js.map
