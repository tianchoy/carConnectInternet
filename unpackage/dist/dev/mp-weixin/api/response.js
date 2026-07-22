"use strict";
const common_vendor = require("../common/vendor.js");
function asJSONObject(value = null) {
  if (value == null) {
    return new common_vendor.UTSJSONObject();
  }
  return value;
}
function getResponseCode(response) {
  return response.getNumber("code", -1);
}
function getResponseMessage(response) {
  const msg = response.getString("msg", "");
  return msg != "" ? msg : response.getString("message", "");
}
function getResponseDataObject(response) {
  const data = response.getJSON("data");
  return data != null ? data : new common_vendor.UTSJSONObject();
}
function getResponseDataArray(response) {
  const data = response.getArray("data");
  return data != null ? data : [];
}
exports.asJSONObject = asJSONObject;
exports.getResponseCode = getResponseCode;
exports.getResponseDataArray = getResponseDataArray;
exports.getResponseDataObject = getResponseDataObject;
exports.getResponseMessage = getResponseMessage;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/response.js.map
