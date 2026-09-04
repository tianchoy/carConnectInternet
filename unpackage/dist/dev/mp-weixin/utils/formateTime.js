"use strict";
function pad(value) {
  return value.toString().padStart(2, "0");
}
function formatTimes(timestamp) {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
function formatTimesToMinute(timestamp) {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function parseLocalDateTime(timestamp) {
  var _a, _b, _c, _d, _e, _f;
  const match = timestamp.match(/^(\d{4})[-\/](\d{2})[-\/](\d{2})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (match == null)
    return null;
  const year = parseInt((_a = match[1]) !== null && _a !== void 0 ? _a : "0");
  const month = parseInt((_b = match[2]) !== null && _b !== void 0 ? _b : "0");
  const day = parseInt((_c = match[3]) !== null && _c !== void 0 ? _c : "0");
  const hour = match[4] == null ? 0 : parseInt((_d = match[4]) !== null && _d !== void 0 ? _d : "0");
  const minute = match[5] == null ? 0 : parseInt((_e = match[5]) !== null && _e !== void 0 ? _e : "0");
  const second = match[6] == null ? 0 : parseInt((_f = match[6]) !== null && _f !== void 0 ? _f : "0");
  const date = new Date(year, month - 1, day, hour, minute, second);
  if (date.getFullYear() != year || date.getMonth() != month - 1 || date.getDate() != day || date.getHours() != hour || date.getMinutes() != minute || date.getSeconds() != second) {
    return null;
  }
  return date.getTime();
}
function normalizeLocalDateTime(timestamp) {
  const milliseconds = parseLocalDateTime(timestamp);
  return milliseconds == null ? timestamp : formatTimes(milliseconds);
}
function formatLocalTime(timestamp) {
  const milliseconds = parseLocalDateTime(timestamp);
  if (milliseconds == null)
    return "";
  const date = new Date(milliseconds);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
exports.formatLocalTime = formatLocalTime;
exports.formatTimes = formatTimes;
exports.formatTimesToMinute = formatTimesToMinute;
exports.normalizeLocalDateTime = normalizeLocalDateTime;
exports.parseLocalDateTime = parseLocalDateTime;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/formateTime.js.map
