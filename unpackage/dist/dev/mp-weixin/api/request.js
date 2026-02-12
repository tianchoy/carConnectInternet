"use strict";
const common_vendor = require("../common/vendor.js");
const api_http = require("./http.js");
const loginUrl = "/sys/login";
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
const logoutUrl = "/sys/logout";
const groupList = "/group/userGroupList";
const sendcmd = "/command/sendCmd";
const getGeofence = "/geofence";
const deleteGeo = "/geofence/";
const unbindDeviceList = "/device/unbindGeofenceList";
const bindDeviceList = "/device/bindGeofenceList";
const bindGeofence = "/geofence/bind";
const unbindGeofence = "/geofence/unbind";
const deleteDevice = "/userDevice/del";
const cmdActionUrl = "/command/cmdAction";
const cmdByMidUrl = "/command/cmdByMid";
const cmdSendUrl = "/command/sendCmd";
const cmdRecordByIdUrl = "/command/recordById?id=";
const login = (data) => {
  return api_http.http.post(loginUrl, data);
};
const logout = () => {
  return api_http.http.post(logoutUrl);
};
const getUserGroupList = () => {
  return api_http.http.get(groupList);
};
const sendCommand = (data) => {
  return api_http.http.post(sendcmd, data);
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
const delDevice = (imei) => {
  return api_http.http.post(deleteDevice, new common_vendor.UTSJSONObject({ imei }));
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
const getGeofenceList = () => {
  return api_http.http.get(getGeofence);
};
const addGeofence = (data) => {
  return api_http.http.post(getGeofence, data);
};
const updateGeofence = (data) => {
  return api_http.http.put(getGeofence, data);
};
const deleteGeofence = (id) => {
  return api_http.http.delete(`${deleteGeo}${id}`);
};
const getUnboundDevices = (params) => {
  return api_http.http.get(unbindDeviceList, params);
};
const getBoundDevices = (params) => {
  return api_http.http.get(bindDeviceList, params);
};
const bindDevices = (data) => {
  return api_http.http.post(bindGeofence, data);
};
const unbindDevices = (data) => {
  return api_http.http.delete(unbindGeofence, data);
};
const getCmdAction = () => {
  return api_http.http.get(cmdActionUrl);
};
const getCmdByMid = (data) => {
  return api_http.http.get(cmdByMidUrl, data);
};
const sendCmd = (data) => {
  return api_http.http.post(cmdSendUrl, data);
};
const getCmdRecordById = (id) => {
  return api_http.http.get(`${cmdRecordByIdUrl}${id}`);
};
exports.PostWechatlogin = PostWechatlogin;
exports.addDevice = addDevice;
exports.addGeofence = addGeofence;
exports.bindDevices = bindDevices;
exports.changePassWord = changePassWord;
exports.delDevice = delDevice;
exports.deleteGeofence = deleteGeofence;
exports.editDeviceInfo = editDeviceInfo;
exports.getBoundDevices = getBoundDevices;
exports.getCmdAction = getCmdAction;
exports.getCmdByMid = getCmdByMid;
exports.getCmdRecordById = getCmdRecordById;
exports.getDeviceDetail = getDeviceDetail;
exports.getDevicePos = getDevicePos;
exports.getGeofenceList = getGeofenceList;
exports.getTrackPos = getTrackPos;
exports.getUnboundDevices = getUnboundDevices;
exports.getUserDeviceList = getUserDeviceList;
exports.getUserGroupList = getUserGroupList;
exports.getUserInfo = getUserInfo;
exports.getUserMsgList = getUserMsgList;
exports.login = login;
exports.logout = logout;
exports.sendCmd = sendCmd;
exports.sendCommand = sendCommand;
exports.setMsgState = setMsgState;
exports.unbindDevices = unbindDevices;
exports.updateGeofence = updateGeofence;
