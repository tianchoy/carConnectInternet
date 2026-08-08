"use strict";
const common_vendor = require("../common/vendor.js");
function ensureCameraPermission(callback) {
  callback("granted");
}
function openCameraPermissionSettings() {
  common_vendor.index.__f__("log", "at utils/cameraPermission.uts:129", "非 Android 平台无需打开相机权限设置");
}
exports.ensureCameraPermission = ensureCameraPermission;
exports.openCameraPermissionSettings = openCameraPermissionSettings;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/cameraPermission.js.map
