"use strict";
const common_vendor = require("../common/vendor.js");
const api_response = require("../api/response.js");
const api_request = require("../api/request.js");
const QUOTA_STORAGE_KEY = "wx_subscribe_quota";
const DEFAULT_BIZ_CODE = "alarm";
class DeviceAuthorizeOutcome extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          status: { type: "Unknown", optional: false },
          errMsg: { type: String, optional: false },
          templateId: { type: String, optional: false }
        };
      },
      name: "DeviceAuthorizeOutcome"
    };
  }
  constructor(options, metadata = DeviceAuthorizeOutcome.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.status = this.__props__.status;
    this.errMsg = this.__props__.errMsg;
    this.templateId = this.__props__.templateId;
    delete this.__props__;
  }
}
function isDeviceSubscribeSupported() {
  try {
    return common_vendor.wx$1.canIUse("requestSubscribeDeviceMessage");
  } catch (error) {
    common_vendor.index.__f__("warn", "at utils/notify.uts:33", "[notify] 能力探测失败:", error);
    return false;
  }
  return false;
}
function fetchNotifyQuota() {
  return common_vendor.__awaiter(this, void 0, void 0, function* () {
    try {
      const res = yield api_request.getNotifyQuota();
      if (!api_response.isBusinessSuccessCode(res.code)) {
        common_vendor.index.__f__("warn", "at utils/notify.uts:47", "[notify] 拉取订阅额度失败:", res.msg);
        return [];
      }
      cacheQuota(res.data);
      return res.data;
    } catch (error) {
      common_vendor.index.__f__("warn", "at utils/notify.uts:53", "[notify] 拉取订阅额度异常:", error);
      return [];
    }
  });
}
function cacheQuota(list) {
  try {
    common_vendor.index.setStorageSync(QUOTA_STORAGE_KEY, common_vendor.UTS.JSON.stringify(list));
  } catch (error) {
    common_vendor.index.__f__("warn", "at utils/notify.uts:62", "[notify] 缓存订阅额度失败:", error);
  }
}
function getCachedQuota(bizCode) {
  const list = readCachedQuota();
  for (let i = 0; i < list.length; i++) {
    if (list[i].bizCode == bizCode)
      return list[i];
  }
  return null;
}
function readCachedQuota() {
  try {
    const raw = common_vendor.index.getStorageSync(QUOTA_STORAGE_KEY);
    if (raw == null || raw.toString() == "")
      return [];
    const parsed = common_vendor.UTS.JSON.parse(raw.toString());
    const list = [];
    for (let i = 0; i < parsed.length; i++) {
      const row = parsed[i];
      list.push(new api_request.NotifyQuotaItem({
        bizCode: row.getString("bizCode", ""),
        templateId: row.getString("templateId", ""),
        remaining: row.getNumber("remaining", -1),
        mode: row.getString("mode", "")
      }));
    }
    return list;
  } catch (error) {
    return [];
  }
}
function authorizeDevice(deviceNo, bizCode = DEFAULT_BIZ_CODE) {
  return common_vendor.__awaiter(this, void 0, void 0, function* () {
    if (!isDeviceSubscribeSupported()) {
      return { status: "unsupported", errMsg: "当前微信版本不支持设备订阅", templateId: "" };
    }
    if (deviceNo == "") {
      return { status: "fail", errMsg: "未选择设备", templateId: "" };
    }
    let item = getCachedQuota(bizCode);
    if (item == null) {
      yield fetchNotifyQuota();
      item = getCachedQuota(bizCode);
    }
    if (item == null) {
      return { status: "noTemplate", errMsg: "", templateId: "" };
    }
    if (item.mode != "device") {
      return { status: "noTemplate", errMsg: "当前场景未启用设备订阅", templateId: item.templateId };
    }
    try {
      const ticketRes = yield api_request.getDeviceTicket(deviceNo);
      if (!api_response.isBusinessSuccessCode(ticketRes.code) || ticketRes.data == null) {
        const msg = ticketRes.msg != "" ? ticketRes.msg : "获取设备票据失败，请稍后重试";
        common_vendor.index.__f__("warn", "at utils/notify.uts:127", "[notify] 换票失败:", msg);
        return { status: "fail", errMsg: msg, templateId: item.templateId };
      }
      const sn = ticketRes.data.getString("sn", "");
      const snTicket = ticketRes.data.getString("snTicket", "");
      const modelId = ticketRes.data.getString("modelId", "");
      const templateId = ticketRes.data.getString("templateId", "") != "" ? ticketRes.data.getString("templateId", "") : item.templateId;
      if (sn == "" || snTicket == "" || templateId == "") {
        common_vendor.index.__f__("warn", "at utils/notify.uts:135", "[notify] 票据字段不完整:", ticketRes.data);
        return { status: "fail", errMsg: "设备票据不完整，请稍后重试", templateId };
      }
      return yield callDeviceSubscribe(sn, snTicket, modelId, templateId);
    } catch (error) {
      common_vendor.index.__f__("error", "at utils/notify.uts:141", "[notify] 设备订阅异常:", error);
      return { status: "fail", errMsg: "订阅请求异常，请稍后重试", templateId: item.templateId };
    }
  });
}
function callDeviceSubscribe(sn, snTicket, modelId, templateId) {
  return new Promise((resolve) => {
    common_vendor.wx$1.requestSubscribeDeviceMessage(new common_vendor.UTSJSONObject({
      sn,
      snTicket,
      modelId,
      tmplIds: [templateId],
      success: (res = null) => {
        const resObj = res;
        const rawValue = res != null ? resObj[templateId] : null;
        const value = rawValue != null ? rawValue.toString() : "";
        resolve({ status: parseDeviceStatus(value), errMsg: "", templateId });
      },
      fail: (err = null) => {
        const errObj = err;
        const rawErr = err != null ? errObj["errMsg"] : null;
        const rawCode = err != null ? errObj["errCode"] : null;
        const errMsg = rawErr != null ? rawErr.toString() : "";
        common_vendor.index.__f__("warn", "at utils/notify.uts:166", "[notify] 设备订阅授权失败:", errMsg, "errCode:", rawCode != null ? rawCode.toString() : "");
        resolve({ status: "fail", errMsg: normalizeDeviceError(errMsg), templateId });
      }
    }));
  });
}
function normalizeDeviceError(errMsg) {
  if (errMsg.indexOf("invalid scope") >= 0)
    return "设备消息能力未开通，请联系客服";
  if (errMsg.indexOf("cancel") >= 0)
    return errMsg;
  if (errMsg.indexOf("sn_ticket") >= 0 || errMsg.indexOf("1972072") >= 0)
    return "设备票据失效，请重试";
  if (errMsg.indexOf("19720736") >= 0)
    return "设备型号与模板不匹配";
  if (errMsg.indexOf("19720728") >= 0)
    return "模板 ID 不存在";
  return errMsg;
}
function parseDeviceStatus(value) {
  if (value == "accept" || value == "acceptWithAudio" || value == "acceptWithAlert")
    return value;
  if (value == "reject")
    return "reject";
  if (value == "ban")
    return "ban";
  if (value == "filter")
    return "filter";
  return "reject";
}
function checkTemplateSubscribed(templateId) {
  return new Promise((resolve) => {
    if (templateId == "" || !isDeviceSubscribeSupported()) {
      resolve(false);
      return null;
    }
    common_vendor.wx$1.getSetting(new common_vendor.UTSJSONObject({
      withSubscriptions: true,
      success: (res = null) => {
        try {
          const resObj = res;
          const settingRaw = res != null ? resObj["subscriptionsSetting"] : null;
          if (settingRaw == null) {
            resolve(false);
            return null;
          }
          const setting = settingRaw;
          const mainSwitch = setting["mainSwitch"];
          if (mainSwitch == false) {
            resolve(false);
            return null;
          }
          const itemsRaw = setting["itemSettings"];
          if (itemsRaw == null) {
            resolve(false);
            return null;
          }
          const items = itemsRaw;
          const state = items[templateId];
          resolve(state != null && state.toString() == "accept");
        } catch (error) {
          common_vendor.index.__f__("warn", "at utils/notify.uts:222", "[notify] 解析订阅状态失败:", error);
          resolve(false);
        }
      },
      fail: () => {
        return resolve(false);
      }
    }));
  });
}
exports.authorizeDevice = authorizeDevice;
exports.checkTemplateSubscribed = checkTemplateSubscribed;
exports.fetchNotifyQuota = fetchNotifyQuota;
exports.getCachedQuota = getCachedQuota;
exports.isDeviceSubscribeSupported = isDeviceSubscribeSupported;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/notify.js.map
