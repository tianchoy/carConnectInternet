"use strict";
const common_vendor = require("../common/vendor.js");
class NormalizedPushEvent extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          kind: { type: "Unknown", optional: false },
          payload: { type: "Any", optional: false }
        };
      },
      name: "NormalizedPushEvent"
    };
  }
  constructor(options, metadata = NormalizedPushEvent.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.kind = this.__props__.kind;
    this.payload = this.__props__.payload;
    delete this.__props__;
  }
}
const pushRegistrationIdReadyListeners = [];
const pushSessionAuthenticatedListeners = [];
const PUSH_PENDING_MESSAGE_ID_KEY = "push.pending_message_id.jpush";
const PUSH_MESSAGE_STALE_KEY = "push.message_stale.jpush";
const PUSH_SESSION_KEY = "push.session.jpush";
const PUSH_REGISTRATION_ID_KEY = "push.registration_id.jpush";
const PUSH_REGISTRATION_ID_MAX_RETRY_COUNT = 5;
const PUSH_REGISTRATION_ID_RETRY_DELAY = 3e3;
function pushDebug(message) {
  common_vendor.index.__f__("error", "at services/push.uts:56", "[PushManager] " + message);
}
function notifyPushRegistrationIdReady(registrationId) {
  for (let index = 0; index < pushRegistrationIdReadyListeners.length; index++) {
    try {
      pushRegistrationIdReadyListeners[index](registrationId);
    } catch (error) {
      common_vendor.index.__f__("error", "at services/push.uts:64", "[PushManager] RegistrationID 就绪监听执行失败:", error);
    }
  }
}
function notifyPushSessionAuthenticated(registrationId) {
  for (let index = 0; index < pushSessionAuthenticatedListeners.length; index++) {
    try {
      pushSessionAuthenticatedListeners[index](registrationId);
    } catch (error) {
      common_vendor.index.__f__("error", "at services/push.uts:74", "[PushManager] 已认证会话监听执行失败:", error);
    }
  }
}
function stringValue(value = null) {
  if (value == null)
    return "";
  return value.toString();
}
function storageString(key) {
  const value = common_vendor.index.getStorageSync(key);
  return value == null ? "" : stringValue(value);
}
function payloadValue(payload = null, key) {
  if (payload == null)
    return "";
  if (typeof payload == "string") {
    try {
      const parsedPayload = common_vendor.UTS.JSON.parse(payload, common_vendor.UTSJSONObject);
      if (parsedPayload == null)
        return "";
      return payloadValue(parsedPayload, key);
    } catch (error) {
      return "";
    }
  }
  try {
    const object = payload;
    return object.getString(key, "");
  } catch (error) {
    return "";
  }
}
function nestedPayloadValue(payload = null, key) {
  let value = payloadValue(payload, key);
  if (value != "")
    return value;
  const nestedKeys = ["data", "extra", "notificationExtras", "extras"];
  for (let index = 0; index < nestedKeys.length; index++) {
    const nestedValue = payloadValue(payload, nestedKeys[index]);
    if (nestedValue == "")
      continue;
    value = payloadValue(nestedValue, key);
    if (value != "")
      return value;
  }
  return "";
}
function pushMessageId(payload = null) {
  let id = nestedPayloadValue(payload, "messageId");
  if (id == "")
    id = nestedPayloadValue(payload, "message_id");
  if (id == "")
    id = nestedPayloadValue(payload, "id");
  return id;
}
class JPushAdapter {
  constructor() {
    this.initialized = false;
  }
  init(onEvent, onRegistrationAvailable, onRegistrationId) {
    if (this.initialized)
      return null;
    this.initialized = true;
  }
  getRegistrationId() {
    return "";
  }
}
class PushManager {
  constructor() {
    this.adapter = null;
    this.initialized = false;
    this.registrationRequesting = false;
    this.registrationRetryCount = 0;
    this.registrationRetryTimer = 0;
  }
  init() {
    if (this.initialized) {
      this.refreshRegistrationId();
      return null;
    }
    pushDebug("已选择推送 provider: jpush");
    this.adapter = new JPushAdapter();
    this.initialized = true;
    this.adapter.init((event) => {
      this.handlePushEvent(event);
    }, () => {
      this.refreshRegistrationId();
    }, (registrationId, reason) => {
      if (!this.initialized)
        return null;
      if (registrationId != "") {
        this.saveRegistrationId(registrationId);
        return null;
      }
      if (reason != "") {
        pushDebug(reason);
        this.scheduleRegistrationRetry(reason);
      }
    });
    this.refreshRegistrationId();
  }
  refreshRegistrationId() {
    if (!this.initialized)
      this.init();
    if (this.adapter == null || this.registrationRequesting)
      return null;
    this.saveJPushRegistrationId();
  }
  markAuthenticated() {
    if (!this.initialized)
      this.init();
    common_vendor.index.setStorageSync(PUSH_SESSION_KEY, "authenticated");
    const cachedRegistrationId = this.getCachedRegistrationId();
    this.refreshRegistrationId();
    notifyPushSessionAuthenticated(cachedRegistrationId);
  }
  clearSessionState() {
    common_vendor.index.removeStorageSync(PUSH_SESSION_KEY);
    common_vendor.index.removeStorageSync(PUSH_PENDING_MESSAGE_ID_KEY);
    common_vendor.index.removeStorageSync(PUSH_MESSAGE_STALE_KEY);
  }
  consumePendingMessageId() {
    const value = storageString(PUSH_PENDING_MESSAGE_ID_KEY);
    common_vendor.index.removeStorageSync(PUSH_PENDING_MESSAGE_ID_KEY);
    return value;
  }
  consumeStaleFlag() {
    const value = storageString(PUSH_MESSAGE_STALE_KEY);
    common_vendor.index.removeStorageSync(PUSH_MESSAGE_STALE_KEY);
    return value == "true";
  }
  getCachedRegistrationId() {
    return storageString(PUSH_REGISTRATION_ID_KEY);
  }
  clearBadge() {
  }
  handlePushEvent(event) {
    this.clearBadge();
    const messageId = pushMessageId(event.payload);
    if (messageId != "")
      common_vendor.index.setStorageSync(PUSH_PENDING_MESSAGE_ID_KEY, messageId);
    if (event.kind == "received" || event.kind == "clicked" || event.kind == "custom") {
      common_vendor.index.setStorageSync(PUSH_MESSAGE_STALE_KEY, true);
    }
    if (event.kind == "clicked") {
      common_vendor.index.switchTab({ url: "/pages/message/message" });
    }
  }
  clearRegistrationTimers() {
    if (this.registrationRetryTimer > 0) {
      clearTimeout(this.registrationRetryTimer);
      this.registrationRetryTimer = 0;
    }
  }
  scheduleRegistrationRetry(reason) {
    if (this.registrationRetryCount >= PUSH_REGISTRATION_ID_MAX_RETRY_COUNT) {
      pushDebug("设备注册 ID 获取超时，已停止重试。原因: " + reason);
      return null;
    }
    if (this.registrationRetryTimer > 0)
      return null;
    this.registrationRetryCount += 1;
    this.registrationRetryTimer = setTimeout(() => {
      this.registrationRetryTimer = 0;
      this.refreshRegistrationId();
    }, PUSH_REGISTRATION_ID_RETRY_DELAY);
  }
  saveRegistrationId(registrationId) {
    this.clearRegistrationTimers();
    this.registrationRequesting = false;
    if (registrationId == "") {
      this.scheduleRegistrationRetry("注册 ID 为空");
      return null;
    }
    this.registrationRetryCount = 0;
    common_vendor.index.setStorageSync(PUSH_REGISTRATION_ID_KEY, registrationId);
    pushDebug("JPush RegistrationID 已就绪");
    notifyPushRegistrationIdReady(registrationId);
  }
  saveJPushRegistrationId() {
    if (this.adapter == null)
      return null;
    this.registrationRequesting = true;
    const registrationId = this.adapter.getRegistrationId();
    this.registrationRequesting = false;
    if (registrationId == "") {
      this.scheduleRegistrationRetry("JPush RegistrationID 为空");
      return null;
    }
    this.saveRegistrationId(registrationId);
  }
}
const pushManager = new PushManager();
function clearPushSessionState() {
  pushManager.clearSessionState();
}
function consumePendingMessageId() {
  return pushManager.consumePendingMessageId();
}
function consumePushStaleFlag() {
  return pushManager.consumeStaleFlag();
}
function getCachedPushRegistrationId() {
  return pushManager.getCachedRegistrationId();
}
function onPushRegistrationIdReady(listener) {
  pushRegistrationIdReadyListeners.push(listener);
}
function onPushSessionAuthenticated(listener) {
  pushSessionAuthenticatedListeners.push(listener);
}
exports.clearPushSessionState = clearPushSessionState;
exports.consumePendingMessageId = consumePendingMessageId;
exports.consumePushStaleFlag = consumePushStaleFlag;
exports.getCachedPushRegistrationId = getCachedPushRegistrationId;
exports.onPushRegistrationIdReady = onPushRegistrationIdReady;
exports.onPushSessionAuthenticated = onPushSessionAuthenticated;
//# sourceMappingURL=../../.sourcemap/mp-weixin/services/push.js.map
