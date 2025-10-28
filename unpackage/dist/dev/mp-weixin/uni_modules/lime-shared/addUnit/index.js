"use strict";
const uni_modules_limeShared_isNumeric_index = require("../isNumeric/index.js");
const uni_modules_limeShared_isDef_index = require("../isDef/index.js");
function addUnit(value) {
  if (!uni_modules_limeShared_isDef_index.isDef(value)) {
    return null;
  }
  value = String(value);
  return uni_modules_limeShared_isNumeric_index.isNumeric(value) ? `${value}px` : value;
}
exports.addUnit = addUnit;
