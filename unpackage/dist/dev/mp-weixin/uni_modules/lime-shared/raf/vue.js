"use strict";
function raf(fn) {
  return setTimeout(fn, 1e3 / 60);
}
exports.raf = raf;
