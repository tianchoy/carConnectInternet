"use strict";
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}
exports.clamp = clamp;
