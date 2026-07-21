"use strict";
const common_vendor = require("../common/vendor.js");
const api_http = require("./http.js");
const loginUrl = "/sys/login";
const devicePos = "/gps/lastPosition?deptId=";
const trackPos = "/gps/trackPos?";
const userinfo = "/sys/user/info";
const addDeviceUrl = "/userDevice/add";
const userDeviceList = "/userDevice/list";
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
const login = (data) => {
  return api_http.post(loginUrl, data);
};
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
const logout = () => {
  return api_http.post(logoutUrl);
};
class SendCommandResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: false }
        };
      },
      name: "SendCommandResponse"
    };
  }
  constructor(options, metadata = SendCommandResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    delete this.__props__;
  }
}
const sendCommand = (data) => {
  return api_http.post(sendcmd, data);
};
class DevicePositionResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          message: { type: String, optional: false },
          data: { type: common_vendor.UTS.UTSType.withGenerics(Array, ["Unknown"]), optional: false }
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
const getDevicePos = (data) => {
  return api_http.get(devicePos, data);
};
const getTrackPos = (data) => {
  return api_http.get(trackPos, data);
};
class UserInfoResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          data: { type: "Unknown", optional: false }
        };
      },
      name: "UserInfoResponse"
    };
  }
  constructor(options, metadata = UserInfoResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
const getUserInfo = () => {
  return api_http.get(userinfo);
};
const addDevice = (data) => {
  return api_http.post(addDeviceUrl, data);
};
const delDevice = (imei) => {
  const data = new common_vendor.UTSJSONObject({ imei });
  return api_http.post(deleteDevice, data);
};
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
const getUserDeviceList = (data) => {
  return api_http.post(userDeviceList, data);
};
class ChangePasswordResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          msg: { type: String, optional: false }
        };
      },
      name: "ChangePasswordResponse"
    };
  }
  constructor(options, metadata = ChangePasswordResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.msg = this.__props__.msg;
    delete this.__props__;
  }
}
const changePassWord = (data) => {
  return api_http.post(changePSW, data);
};
const getUserMsgList = (data = null) => {
  return data != null ? api_http.get(userMsgList, data) : api_http.get(userMsgList);
};
const setMsgState = (msgId) => {
  return api_http.get(`${msgState}${msgId}`);
};
class DeviceDetailResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          data: { type: "Unknown", optional: false }
        };
      },
      name: "DeviceDetailResponse"
    };
  }
  constructor(options, metadata = DeviceDetailResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
const getDeviceDetail = (deviceId) => {
  return api_http.get(`${deviceDetail}${deviceId}`);
};
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
          list: { type: "Unknown", optional: false }
        };
      },
      name: "DevicePageData"
    };
  }
  constructor(options, metadata = DevicePageData.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.list = this.__props__.list;
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
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
const getGeofenceList = () => {
  return api_http.get(getGeofence);
};
const addGeofence = (data) => {
  return api_http.post(getGeofence, data);
};
const updateGeofence = (data) => {
  return api_http.put(getGeofence, data);
};
const deleteGeofence = (id) => {
  return api_http.remove(`${deleteGeo}${id}`);
};
const getUnboundDevices = (params) => {
  return api_http.get(unbindDeviceList, params);
};
const getBoundDevices = (params) => {
  return api_http.get(bindDeviceList, params);
};
const bindDevices = (data) => {
  return api_http.post(bindGeofence, data);
};
const unbindDevices = (data) => {
  return api_http.remove(unbindGeofence, data);
};
class CommandListResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
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
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
const getCmdAction = () => {
  return api_http.get(cmdActionUrl);
};
const getCmdByMid = (data) => {
  return api_http.get(cmdByMidUrl, data);
};
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
const sendCmd = (data) => {
  return api_http.post(cmdSendUrl, data);
};
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
