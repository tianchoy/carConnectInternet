"use strict";
const api_http = require("./http.js");
const loginUrl = "/sys/login";
const customDeviceList = "/group/listByDeptWithDevice?deptId=";
const devicePos = "/gps/lastPosition?deptId=";
const userinfo = "/sys/user/info";
const addDeviceUrl = "/userDevice/add";
const login = (data) => {
  return api_http.http.post(loginUrl, data);
};
const getCustomDeviceList = (deptId) => {
  return api_http.http.get(customDeviceList, new UTSJSONObject({ deptId }));
};
const getDevicePos = (deptId) => {
  return api_http.http.get(devicePos, new UTSJSONObject({ deptId }));
};
const getUserInfo = () => {
  return api_http.http.get(userinfo);
};
const addDevice = (data) => {
  return api_http.http.post(addDeviceUrl, data);
};
exports.addDevice = addDevice;
exports.getCustomDeviceList = getCustomDeviceList;
exports.getDevicePos = getDevicePos;
exports.getUserInfo = getUserInfo;
exports.login = login;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/request.js.map
