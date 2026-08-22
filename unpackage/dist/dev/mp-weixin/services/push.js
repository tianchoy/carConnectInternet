"use strict";
const common_vendor = require("../common/vendor.js");
class NormalizedPushEvent extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          provider: { type: "Unknown", optional: false },
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
    this.provider = this.__props__.provider;
    this.kind = this.__props__.kind;
    this.payload = this.__props__.payload;
    delete this.__props__;
  }
}
const pushRegistrationIdReadyListeners = [];
const pushSessionAuthenticatedListeners = [];
const PUSH_PROVIDER_KEY = "push_provider";
const PUSH_PENDING_MESSAGE_ID_KEY_PREFIX = "push.pending_message_id.";
const PUSH_MESSAGE_STALE_KEY_PREFIX = "push.message_stale.";
const PUSH_SESSION_KEY_PREFIX = "push.session.";
const PUSH_REGISTRATION_ID_KEY_PREFIX = "push.registration_id.";
const LEGACY_PUSH_CLIENT_ID_KEY = "push_client_id";
const LEGACY_PUSH_PENDING_MESSAGE_ID_KEY = "push_pending_message_id";
const LEGACY_PUSH_MESSAGE_STALE_KEY = "push_message_stale";
const LEGACY_PUSH_SESSION_KEY = "push_session_key";
const PUSH_REGISTRATION_ID_MAX_RETRY_COUNT = 5;
const PUSH_REGISTRATION_ID_RETRY_DELAY = 3e3;
const PUSH_REGISTRATION_ID_REQUEST_TIMEOUT = 18e3;
const DEFAULT_PUSH_PROVIDER = "jpush";
function registrationIdKey(provider) {
  return PUSH_REGISTRATION_ID_KEY_PREFIX + provider;
}
function pendingMessageIdKey(provider) {
  return PUSH_PENDING_MESSAGE_ID_KEY_PREFIX + provider;
}
function messageStaleKey(provider) {
  return PUSH_MESSAGE_STALE_KEY_PREFIX + provider;
}
function sessionKey(provider) {
  return PUSH_SESSION_KEY_PREFIX + provider;
}
function pushDebug(provider, message) {
  common_vendor.index.__f__("error", "at services/push.uts:88", "[PushManager][" + provider + "] " + message);
}
function notifyPushRegistrationIdReady(registrationId) {
  for (let index = 0; index < pushRegistrationIdReadyListeners.length; index++) {
    try {
      pushRegistrationIdReadyListeners[index](registrationId);
    } catch (error) {
      common_vendor.index.__f__("error", "at services/push.uts:96", "[PushManager] RegistrationID 就绪监听执行失败:", error);
    }
  }
}
function notifyPushSessionAuthenticated(registrationId) {
  for (let index = 0; index < pushSessionAuthenticatedListeners.length; index++) {
    try {
      pushSessionAuthenticatedListeners[index](registrationId);
    } catch (error) {
      common_vendor.index.__f__("error", "at services/push.uts:106", "[PushManager] 已认证会话监听执行失败:", error);
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
function selectedPushProvider() {
  return DEFAULT_PUSH_PROVIDER;
}
function migrateLegacyStorage(provider) {
  if (provider != "unipush")
    return null;
  if (storageString(registrationIdKey(provider)) == "") {
    const legacyId = storageString(LEGACY_PUSH_CLIENT_ID_KEY);
    if (legacyId != "")
      common_vendor.index.setStorageSync(registrationIdKey(provider), legacyId);
  }
  if (storageString(pendingMessageIdKey(provider)) == "") {
    const legacyPendingId = storageString(LEGACY_PUSH_PENDING_MESSAGE_ID_KEY);
    if (legacyPendingId != "")
      common_vendor.index.setStorageSync(pendingMessageIdKey(provider), legacyPendingId);
  }
  if (storageString(messageStaleKey(provider)) == "") {
    const legacyStale = storageString(LEGACY_PUSH_MESSAGE_STALE_KEY);
    if (legacyStale != "")
      common_vendor.index.setStorageSync(messageStaleKey(provider), legacyStale);
  }
  if (storageString(sessionKey(provider)) == "") {
    const legacySession = storageString(LEGACY_PUSH_SESSION_KEY);
    if (legacySession != "")
      common_vendor.index.setStorageSync(sessionKey(provider), legacySession);
  }
  common_vendor.index.removeStorageSync(LEGACY_PUSH_CLIENT_ID_KEY);
  common_vendor.index.removeStorageSync(LEGACY_PUSH_PENDING_MESSAGE_ID_KEY);
  common_vendor.index.removeStorageSync(LEGACY_PUSH_MESSAGE_STALE_KEY);
  common_vendor.index.removeStorageSync(LEGACY_PUSH_SESSION_KEY);
}
class UniPushAdapter {
  constructor() {
    this.provider = "unipush";
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
  requestRegistrationId(onSuccess, onFailure) {
  }
}
class JPushAdapter {
  constructor() {
    this.provider = "jpush";
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
    this.provider = "unipush";
    this.adapter = null;
    this.initialized = false;
    this.registrationRequesting = false;
    this.registrationRetryCount = 0;
    this.registrationRetryTimer = 0;
    this.registrationRequestTimeout = 0;
    this.registrationRequestGeneration = 0;
  }
  init() {
    const selectedProvider = selectedPushProvider();
    if (this.initialized && this.provider == selectedProvider) {
      this.refreshRegistrationId();
      return null;
    }
    if (this.initialized) {
      pushDebug(this.provider, "运行中不能切换推送 provider，请重启应用后生效");
      return null;
    }
    this.provider = selectedProvider;
    pushDebug(this.provider, "已选择推送 provider: " + this.provider);
    migrateLegacyStorage(this.provider);
    common_vendor.index.setStorageSync(PUSH_PROVIDER_KEY, this.provider);
    this.adapter = this.provider == "jpush" ? new JPushAdapter() : new UniPushAdapter();
    this.initialized = true;
    this.adapter.init((event) => {
      this.handlePushEvent(event);
    }, () => {
      this.refreshRegistrationId();
    }, (registrationId, reason) => {
      if (!this.initialized || this.provider != "jpush")
        return null;
      if (registrationId != "") {
        this.saveRegistrationId(registrationId);
        return null;
      }
      if (reason != "") {
        pushDebug(this.provider, reason);
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
    if (this.provider == "unipush") {
      this.requestUniPushRegistrationId(this.adapter);
      return null;
    }
    this.saveJPushRegistrationId();
  }
  markAuthenticated() {
    if (!this.initialized)
      this.init();
    common_vendor.index.setStorageSync(sessionKey(this.provider), "authenticated");
    const cachedRegistrationId = this.getCachedRegistrationId();
    this.refreshRegistrationId();
    notifyPushSessionAuthenticated(cachedRegistrationId);
  }
  clearSessionState() {
    common_vendor.index.removeStorageSync(sessionKey(this.provider));
    common_vendor.index.removeStorageSync(pendingMessageIdKey(this.provider));
    common_vendor.index.removeStorageSync(messageStaleKey(this.provider));
    common_vendor.index.removeStorageSync(LEGACY_PUSH_SESSION_KEY);
    common_vendor.index.removeStorageSync(LEGACY_PUSH_PENDING_MESSAGE_ID_KEY);
    common_vendor.index.removeStorageSync(LEGACY_PUSH_MESSAGE_STALE_KEY);
  }
  consumePendingMessageId() {
    const value = storageString(pendingMessageIdKey(this.provider));
    common_vendor.index.removeStorageSync(pendingMessageIdKey(this.provider));
    return value;
  }
  consumeStaleFlag() {
    const value = storageString(messageStaleKey(this.provider));
    common_vendor.index.removeStorageSync(messageStaleKey(this.provider));
    return value == "true";
  }
  getCachedRegistrationId() {
    return storageString(registrationIdKey(this.provider));
  }
  setLocalProviderForTesting(provider) {
    return null;
  }
  clearBadge() {
  }
  handlePushEvent(event) {
    this.clearBadge();
    const messageId = pushMessageId(event.payload);
    if (messageId != "")
      common_vendor.index.setStorageSync(pendingMessageIdKey(event.provider), messageId);
    if (event.kind == "received" || event.kind == "clicked" || event.kind == "custom") {
      common_vendor.index.setStorageSync(messageStaleKey(event.provider), true);
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
    if (this.registrationRequestTimeout > 0) {
      clearTimeout(this.registrationRequestTimeout);
      this.registrationRequestTimeout = 0;
    }
  }
  scheduleRegistrationRetry(reason) {
    if (this.registrationRetryCount >= PUSH_REGISTRATION_ID_MAX_RETRY_COUNT) {
      pushDebug(this.provider, "设备注册 ID 获取超时，已停止重试。原因: " + reason);
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
    common_vendor.index.setStorageSync(registrationIdKey(this.provider), registrationId);
    const registrationIdLabel = this.provider == "unipush" ? "UniPush CID 已就绪" : "JPush RegistrationID 已就绪";
    pushDebug(this.provider, registrationIdLabel);
    notifyPushRegistrationIdReady(registrationId);
  }
  requestUniPushRegistrationId(adapter) {
    this.registrationRequesting = true;
    this.clearRegistrationTimers();
    const requestGeneration = this.registrationRequestGeneration + 1;
    this.registrationRequestGeneration = requestGeneration;
    this.registrationRequestTimeout = setTimeout(() => {
      if (requestGeneration != this.registrationRequestGeneration || !this.registrationRequesting)
        return null;
      this.registrationRequesting = false;
      this.registrationRequestTimeout = 0;
      this.scheduleRegistrationRetry("UniPush 回调超时");
    }, PUSH_REGISTRATION_ID_REQUEST_TIMEOUT);
    adapter.requestRegistrationId((registrationId) => {
      if (requestGeneration != this.registrationRequestGeneration || !this.registrationRequesting)
        return null;
      this.saveRegistrationId(registrationId);
    }, (reason) => {
      if (requestGeneration != this.registrationRequestGeneration || !this.registrationRequesting)
        return null;
      this.clearRegistrationTimers();
      this.registrationRequesting = false;
      this.scheduleRegistrationRetry(reason);
    });
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
function onPushRegistrationIdReady(listener) {
  pushRegistrationIdReadyListeners.push(listener);
}
function onPushSessionAuthenticated(listener) {
  pushSessionAuthenticatedListeners.push(listener);
}
exports.clearPushSessionState = clearPushSessionState;
exports.consumePendingMessageId = consumePendingMessageId;
exports.consumePushStaleFlag = consumePushStaleFlag;
exports.onPushRegistrationIdReady = onPushRegistrationIdReady;
exports.onPushSessionAuthenticated = onPushSessionAuthenticated;
//# sourceMappingURL=../../.sourcemap/mp-weixin/services/push.js.map
