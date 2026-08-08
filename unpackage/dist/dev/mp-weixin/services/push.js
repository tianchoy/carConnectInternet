"use strict";
const common_vendor = require("../common/vendor.js");
const PUSH_PENDING_MESSAGE_ID_KEY = "push_pending_message_id";
const PUSH_MESSAGE_STALE_KEY = "push_message_stale";
const PUSH_SESSION_KEY = "push_session_key";
function stringValue(value = null) {
  if (value == null)
    return "";
  return value.toString();
}
function clearPushSessionState() {
  common_vendor.index.removeStorageSync(PUSH_SESSION_KEY);
  common_vendor.index.removeStorageSync(PUSH_PENDING_MESSAGE_ID_KEY);
  common_vendor.index.removeStorageSync(PUSH_MESSAGE_STALE_KEY);
}
function consumePendingMessageId() {
  const rawValue = common_vendor.index.getStorageSync(PUSH_PENDING_MESSAGE_ID_KEY);
  const value = rawValue == null ? "" : stringValue(rawValue);
  common_vendor.index.removeStorageSync(PUSH_PENDING_MESSAGE_ID_KEY);
  return value;
}
function consumePushStaleFlag() {
  const value = common_vendor.index.getStorageSync(PUSH_MESSAGE_STALE_KEY);
  common_vendor.index.removeStorageSync(PUSH_MESSAGE_STALE_KEY);
  return value != null && value.toString() == "true";
}
exports.clearPushSessionState = clearPushSessionState;
exports.consumePendingMessageId = consumePendingMessageId;
exports.consumePushStaleFlag = consumePushStaleFlag;
//# sourceMappingURL=../../.sourcemap/mp-weixin/services/push.js.map
