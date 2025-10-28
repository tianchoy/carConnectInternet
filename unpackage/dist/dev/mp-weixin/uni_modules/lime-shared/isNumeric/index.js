"use strict";
function isNumeric(value) {
  return /^(-)?\d+(\.\d+)?$/.test(value);
}
exports.isNumeric = isNumeric;
