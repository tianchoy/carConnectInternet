"use strict";
const common_vendor = require("../common/vendor.js");
const api_response = require("../api/response.js");
const api_request = require("../api/request.js");
const TMPL_ID_VEHICLE_ALARM = "T35__Egmgn0Rqib_xeGw-qzLN7G-vlG4RDnD1xQdFo";
class DeviceSubscribeOutcome extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          requested: { type: Boolean, optional: false },
          errMsg: { type: String, optional: false },
          errCode: { type: Number, optional: false },
          result: { type: "Unknown", optional: false }
        };
      },
      name: "DeviceSubscribeOutcome"
    };
  }
  constructor(options, metadata = DeviceSubscribeOutcome.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.requested = this.__props__.requested;
    this.errMsg = this.__props__.errMsg;
    this.errCode = this.__props__.errCode;
    this.result = this.__props__.result;
    delete this.__props__;
  }
}
function isDeviceSubscribeSupported() {
  return true;
}
function parseSubscribeResult(value) {
  if (value == "accept" || value == "reject" || value == "ban" || value == "filter" || value == "acceptWithAudio") {
    return value;
  }
  return "unknown";
}
function requestDeviceSubscribe(deviceId) {
  return common_vendor.__awaiter(this, void 0, void 0, function* () {
    const outcome = new DeviceSubscribeOutcome({ requested: false, errMsg: "", errCode: 0, result: "unknown" });
    if (!isDeviceSubscribeSupported()) {
      outcome.errMsg = "当前环境不支持设备订阅";
      return outcome;
    }
    try {
      const ticketRes = yield api_request.getDeviceSubscribeTicket(deviceId);
      if (!api_response.isBusinessSuccessCode(ticketRes.code) || ticketRes.data == null) {
        outcome.errMsg = ticketRes.msg != "" ? ticketRes.msg : "获取设备票据失败";
        common_vendor.index.__f__("warn", "at utils/deviceSubscribe.uts:57", "[DeviceSubscribe] 获取订阅参数失败:", ticketRes.msg);
        return outcome;
      }
      const sn = ticketRes.data.getString("sn", "");
      const modelId = ticketRes.data.getString("modelId", "");
      const snTicket = ticketRes.data.getString("snTicket", "");
      if (sn == "" || modelId == "" || snTicket == "") {
        outcome.errMsg = "设备订阅参数不完整";
        common_vendor.index.__f__("warn", "at utils/deviceSubscribe.uts:65", "[DeviceSubscribe] 订阅参数不完整:", ticketRes.data);
        return outcome;
      }
      return yield callWxSubscribe(deviceId, sn, modelId, snTicket);
    } catch (error) {
      outcome.errMsg = "订阅请求异常，请稍后重试";
      common_vendor.index.__f__("error", "at utils/deviceSubscribe.uts:71", "[DeviceSubscribe] 订阅流程异常:", error);
      return outcome;
    }
  });
}
function callWxSubscribe(deviceId, sn, modelId, snTicket) {
  return new Promise((resolve) => {
    const outcome = new DeviceSubscribeOutcome({ requested: false, errMsg: "", errCode: 0, result: "unknown" });
    common_vendor.wx$1.requestSubscribeDeviceMessage(new common_vendor.UTSJSONObject({
      tmplIds: [TMPL_ID_VEHICLE_ALARM],
      sn,
      snTicket,
      modelId,
      success: (res = null) => {
        outcome.requested = true;
        const resObj = res;
        outcome.result = parseSubscribeResult(resObj != null ? resObj.getString(TMPL_ID_VEHICLE_ALARM, "") : "");
        reportSubscribeOutcome(deviceId, sn, outcome);
        resolve(outcome);
      },
      fail: (err = null) => {
        outcome.requested = true;
        const errObj = err;
        if (errObj != null) {
          outcome.errMsg = errObj.getString("errMsg", "");
          outcome.errCode = errObj.getNumber("errCode", 0);
        }
        reportSubscribeOutcome(deviceId, sn, outcome);
        resolve(outcome);
      }
    }));
  });
}
function reportSubscribeOutcome(deviceId, sn, outcome) {
  return common_vendor.__awaiter(this, void 0, void 0, function* () {
    try {
      const data = new api_request.DeviceSubscribeReportRequest({
        deviceId,
        sn,
        templateId: TMPL_ID_VEHICLE_ALARM,
        result: outcome.requested ? outcome.result : "fail",
        errMsg: outcome.errMsg,
        errCode: outcome.errCode
      });
      const res = yield api_request.reportDeviceSubscribe(data);
      if (!api_response.isBusinessSuccessCode(res.code)) {
        common_vendor.index.__f__("warn", "at utils/deviceSubscribe.uts:122", "[DeviceSubscribe] 订阅结果上报失败:", res.msg);
      }
    } catch (error) {
      common_vendor.index.__f__("warn", "at utils/deviceSubscribe.uts:125", "[DeviceSubscribe] 订阅结果上报异常:", error);
    }
  });
}
function queryDeviceSubscribeStatus(deviceId) {
  return common_vendor.__awaiter(this, void 0, void 0, function* () {
    if (!isDeviceSubscribeSupported() || deviceId == "")
      return false;
    try {
      const res = yield api_request.getDeviceSubscribeStatus(deviceId);
      if (!api_response.isBusinessSuccessCode(res.code) || res.data == null)
        return false;
      return res.data.getBoolean("subscribed", false);
    } catch (error) {
      common_vendor.index.__f__("warn", "at utils/deviceSubscribe.uts:139", "[DeviceSubscribe] 查询订阅状态失败:", error);
      return false;
    }
  });
}
exports.isDeviceSubscribeSupported = isDeviceSubscribeSupported;
exports.queryDeviceSubscribeStatus = queryDeviceSubscribeStatus;
exports.requestDeviceSubscribe = requestDeviceSubscribe;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/deviceSubscribe.js.map
