"use strict";
function formatTimes(timestamp) {
  const d = new Date(timestamp);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  const h = d.getHours().toString().padStart(2, "0");
  const mi = d.getMinutes().toString().padStart(2, "0");
  const s = d.getSeconds().toString().padStart(2, "0");
  return `${y}-${m}-${day} ${h}:${mi}:${s}`;
}
exports.formatTimes = formatTimes;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/formateTime.js.map
