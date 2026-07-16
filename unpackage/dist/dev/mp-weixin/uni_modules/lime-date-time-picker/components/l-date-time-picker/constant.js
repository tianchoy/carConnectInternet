"use strict";
const MODE_YEAR = 1;
const MODE_MONTH = 2;
const MODE_DATE = 4;
const MODE_HOUR = 8;
const MODE_MINUTE = 16;
const MODE_SECOND = 32;
const MODE_MAP = /* @__PURE__ */ new Map([
  ["年", MODE_YEAR],
  ["月", MODE_MONTH],
  ["日", MODE_DATE],
  ["时", MODE_HOUR],
  ["分", MODE_MINUTE],
  ["秒", MODE_SECOND],
  ["year", MODE_YEAR],
  ["month", MODE_MONTH],
  ["date", MODE_DATE],
  ["hour", MODE_HOUR],
  ["minute", MODE_MINUTE],
  ["second", MODE_SECOND]
]);
const FORMAT_MAP = /* @__PURE__ */ new Map([
  ["year", "YYYY"],
  ["month", "MM"],
  ["date", "DD"],
  ["hour", "HH"],
  ["minute", "mm"],
  ["second", "ss"]
]);
const UNIT_MAP = /* @__PURE__ */ new Map([
  ["year", "年"],
  ["month", "月"],
  ["date", "日"],
  ["hour", "时"],
  ["minute", "分"],
  ["second", "秒"]
]);
const MODE_NAMES = ["year", "month", "date", "hour", "minute", "second"];
const DEFAULT_FORMAT = "YYYY-MM-DD HH:mm:ss";
exports.DEFAULT_FORMAT = DEFAULT_FORMAT;
exports.FORMAT_MAP = FORMAT_MAP;
exports.MODE_DATE = MODE_DATE;
exports.MODE_HOUR = MODE_HOUR;
exports.MODE_MAP = MODE_MAP;
exports.MODE_MINUTE = MODE_MINUTE;
exports.MODE_MONTH = MODE_MONTH;
exports.MODE_NAMES = MODE_NAMES;
exports.MODE_SECOND = MODE_SECOND;
exports.MODE_YEAR = MODE_YEAR;
exports.UNIT_MAP = UNIT_MAP;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/lime-date-time-picker/components/l-date-time-picker/constant.js.map
