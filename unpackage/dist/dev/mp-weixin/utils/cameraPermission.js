"use strict";
const CAMERA_PERMISSION = "android.permission.CAMERA";
const COARSE_LOCATION_PERMISSION = "android.permission.ACCESS_COARSE_LOCATION";
const FINE_LOCATION_PERMISSION = "android.permission.ACCESS_FINE_LOCATION";
function requestAndroidPermission(permissions, name, callback, acceptGranted) {
  callback("granted");
}
function ensureCameraPermission(callback) {
  requestAndroidPermission([CAMERA_PERMISSION], "ensureCameraPermission", callback);
}
function ensureLocationPermission(callback) {
  requestAndroidPermission([COARSE_LOCATION_PERMISSION, FINE_LOCATION_PERMISSION], "ensureLocationPermission", callback);
}
exports.ensureCameraPermission = ensureCameraPermission;
exports.ensureLocationPermission = ensureLocationPermission;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/cameraPermission.js.map
