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
const authLoginUrl = "/auth/login";
const smsSendCodeUrl = "/resource/sms/code";
const registerUrl = "/auth/register";
const forgotPasswordResetUrl = "/auth/forgot-password/reset";
const smsClientId = "428a8310cd442757ae699df5d894f051";
const defaultTenantId = "000000";
const changePasswordUrl = "/user/profile/updatePassword";
const userMsgList = "/usermessage/listForUser";
const msgState = "/usermessage/detail/";
const updateDevice = "/device/update";
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
const appCommandAvailableUrl = "/app/command/available-cmds";
const appCommandSendUrl = "/app/command/send";
const appCommandListUrl = "/app/command/list";
const appCommandDetailUrl = "/app/command/";
const appCommandRetryUrl = "/app/command/retry/";
const pushUnbindUrl = "/app/push/unbind";
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
class PushDeviceBindRequest extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          registrationId: { type: String, optional: false },
          platform: { type: String, optional: false },
          deviceName: { type: String, optional: false },
          appVersion: { type: String, optional: false }
        };
      },
      name: "PushDeviceBindRequest"
    };
  }
  constructor(options, metadata = PushDeviceBindRequest.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.registrationId = this.__props__.registrationId;
    this.platform = this.__props__.platform;
    this.deviceName = this.__props__.deviceName;
    this.appVersion = this.__props__.appVersion;
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
class LegacyEnterpriseLoginRequest extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          username: { type: String, optional: false },
          password: { type: String, optional: false },
          clientId: { type: String, optional: true },
          tenantId: { type: String, optional: true }
        };
      },
      name: "LegacyEnterpriseLoginRequest"
    };
  }
  constructor(options, metadata = LegacyEnterpriseLoginRequest.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.username = this.__props__.username;
    this.password = this.__props__.password;
    this.clientId = this.__props__.clientId;
    this.tenantId = this.__props__.tenantId;
    delete this.__props__;
  }
}
class WechatLoginRequest extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: String, optional: false },
          encryptedData: { type: String, optional: false },
          iv: { type: String, optional: false },
          clientId: { type: String, optional: true },
          tenantId: { type: String, optional: true }
        };
      },
      name: "WechatLoginRequest"
    };
  }
  constructor(options, metadata = WechatLoginRequest.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.encryptedData = this.__props__.encryptedData;
    this.iv = this.__props__.iv;
    this.clientId = this.__props__.clientId;
    this.tenantId = this.__props__.tenantId;
    delete this.__props__;
  }
}
class SendSmsCodeRequest extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          phonenumber: { type: String, optional: false },
          tenantId: { type: String, optional: true }
        };
      },
      name: "SendSmsCodeRequest"
    };
  }
  constructor(options, metadata = SendSmsCodeRequest.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.phonenumber = this.__props__.phonenumber;
    this.tenantId = this.__props__.tenantId;
    delete this.__props__;
  }
}
class SmsLoginRequest extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          phonenumber: { type: String, optional: false },
          smsCode: { type: String, optional: false },
          clientId: { type: String, optional: true },
          tenantId: { type: String, optional: true }
        };
      },
      name: "SmsLoginRequest"
    };
  }
  constructor(options, metadata = SmsLoginRequest.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.phonenumber = this.__props__.phonenumber;
    this.smsCode = this.__props__.smsCode;
    this.clientId = this.__props__.clientId;
    this.tenantId = this.__props__.tenantId;
    delete this.__props__;
  }
}
class PersonalPasswordLoginRequest extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          username: { type: String, optional: false },
          password: { type: String, optional: false },
          clientId: { type: String, optional: true },
          tenantId: { type: String, optional: true }
        };
      },
      name: "PersonalPasswordLoginRequest"
    };
  }
  constructor(options, metadata = PersonalPasswordLoginRequest.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.username = this.__props__.username;
    this.password = this.__props__.password;
    this.clientId = this.__props__.clientId;
    this.tenantId = this.__props__.tenantId;
    delete this.__props__;
  }
}
class RegisterRequest extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          username: { type: String, optional: true },
          password: { type: String, optional: false },
          confirmPassword: { type: String, optional: false },
          phonenumber: { type: String, optional: false },
          smsCode: { type: String, optional: false },
          clientId: { type: String, optional: true },
          tenantId: { type: String, optional: true }
        };
      },
      name: "RegisterRequest"
    };
  }
  constructor(options, metadata = RegisterRequest.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.username = this.__props__.username;
    this.password = this.__props__.password;
    this.confirmPassword = this.__props__.confirmPassword;
    this.phonenumber = this.__props__.phonenumber;
    this.smsCode = this.__props__.smsCode;
    this.clientId = this.__props__.clientId;
    this.tenantId = this.__props__.tenantId;
    delete this.__props__;
  }
}
class ForgotPasswordResetRequest extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          tenantId: { type: String, optional: true },
          phonenumber: { type: String, optional: false },
          smsCode: { type: String, optional: false },
          newPassword: { type: String, optional: false },
          confirmPassword: { type: String, optional: false }
        };
      },
      name: "ForgotPasswordResetRequest"
    };
  }
  constructor(options, metadata = ForgotPasswordResetRequest.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.tenantId = this.__props__.tenantId;
    this.phonenumber = this.__props__.phonenumber;
    this.smsCode = this.__props__.smsCode;
    this.newPassword = this.__props__.newPassword;
    this.confirmPassword = this.__props__.confirmPassword;
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
          msg: { type: String, optional: false },
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
    this.msg = this.__props__.msg;
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
class AppCommandPageData extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          total: { type: Number, optional: false },
          rows: { type: "Unknown", optional: false }
        };
      },
      name: "AppCommandPageData"
    };
  }
  constructor(options, metadata = AppCommandPageData.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.total = this.__props__.total;
    this.rows = this.__props__.rows;
    delete this.__props__;
  }
}
class AppCommandPageResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: false },
          data: { type: AppCommandPageData, optional: false }
        };
      },
      name: "AppCommandPageResponse"
    };
  }
  constructor(options, metadata = AppCommandPageResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
class AppCommandDetailResponse extends common_vendor.UTS.UTSType {
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
      name: "AppCommandDetailResponse"
    };
  }
  constructor(options, metadata = AppCommandDetailResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
class ChangePasswordRequest extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          oldPassword: { type: String, optional: false },
          newPassword: { type: String, optional: false },
          confirmPassword: { type: String, optional: false }
        };
      },
      name: "ChangePasswordRequest"
    };
  }
  constructor(options, metadata = ChangePasswordRequest.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.oldPassword = this.__props__.oldPassword;
    this.newPassword = this.__props__.newPassword;
    this.confirmPassword = this.__props__.confirmPassword;
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
function appCommandPageResponse(raw = null) {
  const response = api_response.asJSONObject(raw);
  const rows = response.getArray("rows");
  return new AppCommandPageResponse({
    code: api_response.getResponseCode(response),
    msg: api_response.getResponseMessage(response),
    data: new AppCommandPageData({
      total: response.getNumber("total", 0),
      rows: rows != null ? rows : []
    })
  });
}
const login = (data) => {
  const requestData = new common_vendor.UTSJSONObject();
  requestData.set("username", data.username);
  requestData.set("password", data.password);
  requestData.set("tenantId", data.tenantId != null ? data.tenantId : defaultTenantId);
  requestData.set("clientId", data.clientId != null ? data.clientId : smsClientId);
  return api_http.post(loginUrl, requestData).then((raw = null) => {
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
      msg: api_response.getResponseMessage(response),
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
const delDevice = (deviceId) => {
  return api_http.post(deleteDevice, new common_vendor.UTSJSONObject({ deviceId })).then((raw = null) => {
    return basicResponse(raw);
  });
};
const getUserDeviceList = (data) => {
  return api_http.post(userDeviceList, data).then((raw = null) => {
    return userDevicePageResponse(raw);
  });
};
const PostWechatlogin = (data) => {
  const requestData = new common_vendor.UTSJSONObject();
  requestData.set("code", data.code);
  requestData.set("encryptedData", data.encryptedData);
  requestData.set("iv", data.iv);
  requestData.set("tenantId", data.tenantId != null ? data.tenantId : defaultTenantId);
  requestData.set("clientId", data.clientId != null ? data.clientId : smsClientId);
  return api_http.post(wechatLogin, requestData).then((raw = null) => {
    return jsonDataResponse(raw);
  });
};
const sendSmsRegisterCode = (data) => {
  return api_http.get(smsSendCodeUrl, new common_vendor.UTSJSONObject({
    phonenumber: data.phonenumber,
    tenantId: data.tenantId != null ? data.tenantId : defaultTenantId,
    scene: "register"
  })).then((raw = null) => {
    return basicResponse(raw);
  });
};
const sendSmsForgotPasswordCode = (data) => {
  return api_http.get(smsSendCodeUrl, new common_vendor.UTSJSONObject({
    phonenumber: data.phonenumber,
    tenantId: data.tenantId != null ? data.tenantId : defaultTenantId,
    scene: "forgot"
  })).then((raw = null) => {
    return basicResponse(raw);
  });
};
const personalPasswordLogin = (data) => {
  const requestData = new common_vendor.UTSJSONObject();
  requestData.set("grantType", "password");
  requestData.set("username", data.username);
  requestData.set("password", data.password);
  requestData.set("tenantId", data.tenantId != null ? data.tenantId : defaultTenantId);
  requestData.set("clientId", data.clientId != null ? data.clientId : smsClientId);
  return api_http.post(authLoginUrl, requestData).then((raw = null) => {
    return jsonDataResponse(raw);
  });
};
const registerPersonalUser = (data) => {
  const requestData = new common_vendor.UTSJSONObject();
  if (data.username != null && data.username != "")
    requestData.set("username", data.username);
  requestData.set("password", data.password);
  requestData.set("confirmPassword", data.confirmPassword);
  requestData.set("phonenumber", data.phonenumber);
  requestData.set("smsCode", data.smsCode);
  requestData.set("tenantId", data.tenantId != null ? data.tenantId : defaultTenantId);
  requestData.set("clientId", data.clientId != null ? data.clientId : smsClientId);
  return api_http.post(registerUrl, requestData).then((raw = null) => {
    return jsonDataResponse(raw);
  });
};
const resetForgotPassword = (data) => {
  const requestData = new common_vendor.UTSJSONObject();
  requestData.set("tenantId", data.tenantId != null ? data.tenantId : defaultTenantId);
  requestData.set("phonenumber", data.phonenumber);
  requestData.set("smsCode", data.smsCode);
  requestData.set("newPassword", data.newPassword);
  requestData.set("confirmPassword", data.confirmPassword);
  return api_http.post(forgotPasswordResetUrl, requestData).then((raw = null) => {
    return jsonDataResponse(raw);
  });
};
const updatePassword = (data) => {
  return api_http.post(changePasswordUrl, data).then((raw = null) => {
    return basicResponse(raw);
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
const editDeviceInfo = (data) => {
  return api_http.put(updateDevice, data).then((raw = null) => {
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
const getAppAvailableCommands = (deviceId) => {
  return api_http.get(appCommandAvailableUrl, new common_vendor.UTSJSONObject({ deviceId })).then((raw = null) => {
    const response = api_response.asJSONObject(raw);
    return new CommandListResponse({ code: api_response.getResponseCode(response), msg: api_response.getResponseMessage(response), data: api_response.getResponseDataArray(response) });
  });
};
const sendAppCommand = (data) => {
  return api_http.post(appCommandSendUrl, data).then((raw = null) => {
    const response = api_response.asJSONObject(raw);
    return new SendCmdResponse({ code: api_response.getResponseCode(response), msg: api_response.getResponseMessage(response), data: response.getString("data", "") });
  });
};
const getAppCommandHistory = (query) => {
  query.set("tenantId", defaultTenantId);
  return api_http.get(appCommandListUrl, query).then((raw = null) => {
    return appCommandPageResponse(raw);
  });
};
const getAppCommandDetail = (commandId) => {
  return api_http.get(`${appCommandDetailUrl}${commandId.toString()}`).then((raw = null) => {
    const response = jsonDataResponse(raw);
    return new AppCommandDetailResponse({ code: response.code, msg: response.msg, data: response.data });
  });
};
const retryAppCommand = (commandId) => {
  return api_http.get(`${appCommandRetryUrl}${commandId.toString()}`).then((raw = null) => {
    return basicResponse(raw);
  });
};
const unbindPushDevice = (registrationId) => {
  return api_http.postSilently(pushUnbindUrl + "?registrationId=" + encodeURIComponent(registrationId), new common_vendor.UTSJSONObject()).then((raw = null) => {
    return basicResponse(raw);
  });
};
exports.ChangePasswordRequest = ChangePasswordRequest;
exports.ForgotPasswordResetRequest = ForgotPasswordResetRequest;
exports.LegacyEnterpriseLoginRequest = LegacyEnterpriseLoginRequest;
exports.PersonalPasswordLoginRequest = PersonalPasswordLoginRequest;
exports.PostWechatlogin = PostWechatlogin;
exports.RegisterRequest = RegisterRequest;
exports.SendSmsCodeRequest = SendSmsCodeRequest;
exports.WechatLoginRequest = WechatLoginRequest;
exports.addDevice = addDevice;
exports.addGeofence = addGeofence;
exports.bindDevices = bindDevices;
exports.delDevice = delDevice;
exports.deleteGeofence = deleteGeofence;
exports.editDeviceInfo = editDeviceInfo;
exports.getAppAvailableCommands = getAppAvailableCommands;
exports.getAppCommandDetail = getAppCommandDetail;
exports.getAppCommandHistory = getAppCommandHistory;
exports.getBoundDevices = getBoundDevices;
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
exports.personalPasswordLogin = personalPasswordLogin;
exports.registerPersonalUser = registerPersonalUser;
exports.resetForgotPassword = resetForgotPassword;
exports.retryAppCommand = retryAppCommand;
exports.sendAppCommand = sendAppCommand;
exports.sendCommand = sendCommand;
exports.sendSmsForgotPasswordCode = sendSmsForgotPasswordCode;
exports.sendSmsRegisterCode = sendSmsRegisterCode;
exports.setMsgState = setMsgState;
exports.unbindDevices = unbindDevices;
exports.unbindPushDevice = unbindPushDevice;
exports.updateGeofence = updateGeofence;
exports.updatePassword = updatePassword;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/request.js.map
