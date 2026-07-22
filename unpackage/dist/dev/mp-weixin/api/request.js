"use strict";
const common_vendor = require("../common/vendor.js");
const api_http = require("./http.js");
const api_response = require("./response.js");
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
const deviceDetail = "/device/info/";
const logoutUrl = "/sys/logout";
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
class BasicResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: false }
        };
      },
      name: "BasicResponse"
    };
  }
  constructor(options, metadata = BasicResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    delete this.__props__;
  }
}
class JsonDataResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: false },
          data: { type: "Unknown", optional: false }
        };
      },
      name: "JsonDataResponse"
    };
  }
  constructor(options, metadata = JsonDataResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
class DevicePositionResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          message: { type: String, optional: false },
          data: { type: "Unknown", optional: false }
        };
      },
      name: "DevicePositionResponse"
    };
  }
  constructor(options, metadata = DevicePositionResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.message = this.__props__.message;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
class TrackPosResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: false },
          data: { type: "Unknown", optional: false }
        };
      },
      name: "TrackPosResponse"
    };
  }
  constructor(options, metadata = TrackPosResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
class UserInfoResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: false },
          data: { type: "Unknown", optional: false }
        };
      },
      name: "UserInfoResponse"
    };
  }
  constructor(options, metadata = UserInfoResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
class UserDeviceListData extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          list: { type: "Unknown", optional: false },
          totalPage: { type: Number, optional: false },
          totalCount: { type: Number, optional: false }
        };
      },
      name: "UserDeviceListData"
    };
  }
  constructor(options, metadata = UserDeviceListData.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.list = this.__props__.list;
    this.totalPage = this.__props__.totalPage;
    this.totalCount = this.__props__.totalCount;
    delete this.__props__;
  }
}
class UserDeviceListResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: false },
          data: { type: UserDeviceListData, optional: false }
        };
      },
      name: "UserDeviceListResponse"
    };
  }
  constructor(options, metadata = UserDeviceListResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
class DeviceDetailResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: false },
          data: { type: "Unknown", optional: false }
        };
      },
      name: "DeviceDetailResponse"
    };
  }
  constructor(options, metadata = DeviceDetailResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
class GeofenceResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: false },
          data: { type: "Unknown", optional: false }
        };
      },
      name: "GeofenceResponse"
    };
  }
  constructor(options, metadata = GeofenceResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
class DevicePageData extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          list: { type: "Unknown", optional: false },
          totalPage: { type: Number, optional: false },
          totalCount: { type: Number, optional: false }
        };
      },
      name: "DevicePageData"
    };
  }
  constructor(options, metadata = DevicePageData.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.list = this.__props__.list;
    this.totalPage = this.__props__.totalPage;
    this.totalCount = this.__props__.totalCount;
    delete this.__props__;
  }
}
class DevicePageResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: false },
          data: { type: DevicePageData, optional: false }
        };
      },
      name: "DevicePageResponse"
    };
  }
  constructor(options, metadata = DevicePageResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
class CommandListResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: false },
          data: { type: "Unknown", optional: false }
        };
      },
      name: "CommandListResponse"
    };
  }
  constructor(options, metadata = CommandListResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
class SendCmdResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: false },
          data: { type: String, optional: false }
        };
      },
      name: "SendCmdResponse"
    };
  }
  constructor(options, metadata = SendCmdResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
class ChangePasswordResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: false }
        };
      },
      name: "ChangePasswordResponse"
    };
  }
  constructor(options, metadata = ChangePasswordResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    delete this.__props__;
  }
}
class MessageResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: false },
          data: { type: UserDeviceListData, optional: false }
        };
      },
      name: "MessageResponse"
    };
  }
  constructor(options, metadata = MessageResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
function basicResponse(raw = null) {
  const response = api_response.asJSONObject(raw);
  return new BasicResponse({ code: api_response.getResponseCode(response), msg: api_response.getResponseMessage(response) });
}
function jsonDataResponse(raw = null) {
  const response = api_response.asJSONObject(raw);
  return new JsonDataResponse({
    code: api_response.getResponseCode(response),
    msg: api_response.getResponseMessage(response),
    data: api_response.getResponseDataObject(response)
  });
}
function devicePageResponse(raw = null) {
  const response = api_response.asJSONObject(raw);
  const data = api_response.getResponseDataObject(response);
  const list = data.getArray("list");
  return new DevicePageResponse({
    code: api_response.getResponseCode(response),
    msg: api_response.getResponseMessage(response),
    data: new DevicePageData({
      list: list != null ? list : [],
      totalPage: data.getNumber("totalPage", 0),
      totalCount: data.getNumber("totalCount", 0)
    })
  });
}
function userDevicePageResponse(raw = null) {
  const page = devicePageResponse(raw);
  return new UserDeviceListResponse({
    code: page.code,
    msg: page.msg,
    data: new UserDeviceListData({
      list: page.data.list,
      totalPage: page.data.totalPage,
      totalCount: page.data.totalCount
    })
  });
}
function messagePageResponse(raw = null) {
  const page = devicePageResponse(raw);
  return new MessageResponse({
    code: page.code,
    msg: page.msg,
    data: new UserDeviceListData({
      list: page.data.list,
      totalPage: page.data.totalPage,
      totalCount: page.data.totalCount
    })
  });
}
function userInfoResponse(raw = null) {
  const response = jsonDataResponse(raw);
  return new UserInfoResponse({ code: response.code, msg: response.msg, data: response.data });
}
function deviceDetailResponse(raw = null) {
  const response = jsonDataResponse(raw);
  return new DeviceDetailResponse({ code: response.code, msg: response.msg, data: response.data });
}
function changePasswordResponse(raw = null) {
  const response = basicResponse(raw);
  return new ChangePasswordResponse({ code: response.code, msg: response.msg });
}
const login = (data) => {
  return api_http.post(loginUrl, data).then((raw = null) => {
    return jsonDataResponse(raw);
  });
};
const logout = () => {
  return api_http.post(logoutUrl).then((raw = null) => {
    return basicResponse(raw);
  });
};
const sendCommand = (data) => {
  return api_http.post(sendcmd, data).then((raw = null) => {
    return basicResponse(raw);
  });
};
const getDevicePos = (data) => {
  return api_http.get(devicePos, data).then((raw = null) => {
    const response = api_response.asJSONObject(raw);
    return new DevicePositionResponse({
      code: api_response.getResponseCode(response),
      message: api_response.getResponseMessage(response),
      data: api_response.getResponseDataArray(response)
    });
  });
};
const getTrackPos = (data) => {
  return api_http.get(trackPos, data).then((raw = null) => {
    const response = api_response.asJSONObject(raw);
    return new TrackPosResponse({ code: api_response.getResponseCode(response), msg: api_response.getResponseMessage(response), data: api_response.getResponseDataObject(response) });
  });
};
const getUserInfo = () => {
  return api_http.get(userinfo).then((raw = null) => {
    return userInfoResponse(raw);
  });
};
const addDevice = (data) => {
  return api_http.post(addDeviceUrl, data).then((raw = null) => {
    return basicResponse(raw);
  });
};
const delDevice = (imei) => {
  return api_http.post(deleteDevice, new common_vendor.UTSJSONObject({ imei })).then((raw = null) => {
    return basicResponse(raw);
  });
};
const getUserDeviceList = (data) => {
  return api_http.post(userDeviceList, data).then((raw = null) => {
    return userDevicePageResponse(raw);
  });
};
const PostWechatlogin = (data) => {
  return api_http.post(wechatLogin, data).then((raw = null) => {
    return jsonDataResponse(raw);
  });
};
const changePassWord = (data) => {
  return api_http.put(changePSW, data).then((raw = null) => {
    return changePasswordResponse(raw);
  });
};
const getUserMsgList = (data = null) => {
  return (data != null ? api_http.get(userMsgList, data) : api_http.get(userMsgList)).then((raw = null) => {
    return messagePageResponse(raw);
  });
};
const setMsgState = (msgId) => {
  return api_http.get(`${msgState}${msgId}`).then((raw = null) => {
    return basicResponse(raw);
  });
};
const getDeviceDetail = (deviceId) => {
  return api_http.get(`${deviceDetail}${deviceId}`).then((raw = null) => {
    return deviceDetailResponse(raw);
  });
};
const getGeofenceList = () => {
  return api_http.get(getGeofence).then((raw = null) => {
    const response = api_response.asJSONObject(raw);
    return new GeofenceResponse({ code: api_response.getResponseCode(response), msg: api_response.getResponseMessage(response), data: api_response.getResponseDataArray(response) });
  });
};
const addGeofence = (data) => {
  return api_http.post(getGeofence, data).then((raw = null) => {
    return basicResponse(raw);
  });
};
const updateGeofence = (data) => {
  return api_http.put(getGeofence, data).then((raw = null) => {
    return basicResponse(raw);
  });
};
const deleteGeofence = (id) => {
  return api_http.remove(`${deleteGeo}${id}`).then((raw = null) => {
    return basicResponse(raw);
  });
};
const getUnboundDevices = (params) => {
  return api_http.get(unbindDeviceList, params).then((raw = null) => {
    return devicePageResponse(raw);
  });
};
const getBoundDevices = (params) => {
  return api_http.get(bindDeviceList, params).then((raw = null) => {
    return devicePageResponse(raw);
  });
};
const bindDevices = (data) => {
  return api_http.post(bindGeofence, data).then((raw = null) => {
    return basicResponse(raw);
  });
};
const unbindDevices = (data) => {
  return api_http.remove(unbindGeofence, data).then((raw = null) => {
    return basicResponse(raw);
  });
};
const getCmdAction = () => {
  return api_http.get(cmdActionUrl).then((raw = null) => {
    const response = api_response.asJSONObject(raw);
    return new CommandListResponse({ code: api_response.getResponseCode(response), msg: api_response.getResponseMessage(response), data: api_response.getResponseDataArray(response) });
  });
};
const getCmdByMid = (data) => {
  return api_http.get(cmdByMidUrl, data).then((raw = null) => {
    const response = api_response.asJSONObject(raw);
    return new CommandListResponse({ code: api_response.getResponseCode(response), msg: api_response.getResponseMessage(response), data: api_response.getResponseDataArray(response) });
  });
};
const sendCmd = (data) => {
  return api_http.post(cmdSendUrl, data).then((raw = null) => {
    const response = api_response.asJSONObject(raw);
    return new SendCmdResponse({ code: api_response.getResponseCode(response), msg: api_response.getResponseMessage(response), data: response.getString("data", "") });
  });
};
exports.PostWechatlogin = PostWechatlogin;
exports.addDevice = addDevice;
exports.addGeofence = addGeofence;
exports.bindDevices = bindDevices;
exports.changePassWord = changePassWord;
exports.delDevice = delDevice;
exports.deleteGeofence = deleteGeofence;
exports.getBoundDevices = getBoundDevices;
exports.getCmdAction = getCmdAction;
exports.getCmdByMid = getCmdByMid;
exports.getDeviceDetail = getDeviceDetail;
exports.getDevicePos = getDevicePos;
exports.getGeofenceList = getGeofenceList;
exports.getTrackPos = getTrackPos;
exports.getUnboundDevices = getUnboundDevices;
exports.getUserDeviceList = getUserDeviceList;
exports.getUserInfo = getUserInfo;
exports.getUserMsgList = getUserMsgList;
exports.login = login;
exports.logout = logout;
exports.sendCmd = sendCmd;
exports.sendCommand = sendCommand;
exports.setMsgState = setMsgState;
exports.unbindDevices = unbindDevices;
exports.updateGeofence = updateGeofence;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/request.js.map
