"use strict";
const api_http = require("./http.js");
const loginUrl = "/sys/login";
const customDeviceList = "/group/listByDeptWithDevice?deptId=";
const devicePos = "/gps/lastPosition?deptId=";
const trackPos = "/gps/trackPos?";
const userinfo = "/sys/user/info";
const addDeviceUrl = "/userDevice/add";
const userDeviceList = "/userDevice/list";
const wechatLogin = "/authLogin";
const changePSW = "/sys/user/password";
const userMsgList = "/usermessage/listForUser";
const msgState = "/usermessage/detail/";
const updateDevice = "/device/update";
const deviceDetail = "/device/info/";
const carType = "/carType/listAll";
const login = (data) => {
  return api_http.http.post(loginUrl, data);
};
const getCustomDeviceList = (deptId) => {
  return api_http.http.get(customDeviceList, new UTSJSONObject({ deptId }));
};
const getDevicePos = (data) => {
  return api_http.http.get(devicePos, data);
};
const getTrackPos = (data) => {
  return api_http.http.get(trackPos, data);
};
const getUserInfo = () => {
  return api_http.http.get(userinfo);
};
const addDevice = (data) => {
  return api_http.http.post(addDeviceUrl, data);
};
const getUserDeviceList = (data) => {
  return api_http.http.post(userDeviceList, data);
};
const PostWechatlogin = (data) => {
  return api_http.http.post(wechatLogin, data);
};
const changePassWord = (data) => {
  return api_http.http.post(changePSW, data);
};
const getUserMsgList = () => {
  return api_http.http.get(userMsgList);
};
const setMsgState = (msgId) => {
  return api_http.http.get(`${msgState}${msgId}`);
};
const editDeviceInfo = (data) => {
  return api_http.http.put(updateDevice, data);
};
const getDeviceDetail = (deviceId) => {
  return api_http.http.get(`${deviceDetail}${deviceId}`);
};
const getCarType = () => {
  return api_http.http.get(carType);
};
exports.PostWechatlogin = PostWechatlogin;
exports.addDevice = addDevice;
exports.changePassWord = changePassWord;
exports.editDeviceInfo = editDeviceInfo;
exports.getCarType = getCarType;
exports.getCustomDeviceList = getCustomDeviceList;
exports.getDeviceDetail = getDeviceDetail;
exports.getDevicePos = getDevicePos;
exports.getTrackPos = getTrackPos;
exports.getUserDeviceList = getUserDeviceList;
exports.getUserInfo = getUserInfo;
exports.getUserMsgList = getUserMsgList;
exports.login = login;
exports.setMsgState = setMsgState;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/request.js.map
