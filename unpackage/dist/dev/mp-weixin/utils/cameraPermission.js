"use strict";
const common_vendor = require("../common/vendor.js");
function ensureCameraPermission(callback) {
  common_vendor.index.__f__("log", "at utils/cameraPermission.uts:10", "📷 [ensureCameraPermission] 开始检查相机权限");
  common_vendor.index.__f__("log", "at utils/cameraPermission.uts:94", "📷 [ensureCameraPermission] 非Android平台，默认授予权限");
  callback("granted");
}
function openCameraPermissionSettings() {
  common_vendor.index.__f__("log", "at utils/cameraPermission.uts:103", "📷 [openCameraPermissionSettings] 打开系统权限设置");
  common_vendor.index.__f__("log", "at utils/cameraPermission.uts:125", "📷 [openCameraPermissionSettings] 非Android平台，无需打开设置");
}
exports.ensureCameraPermission = ensureCameraPermission;
exports.openCameraPermissionSettings = openCameraPermissionSettings;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/cameraPermission.js.map
