"use strict";
const common_vendor = require("../../../../common/vendor.js");
function pathToDataUrl(path) {
  return new Promise((resolve, reject) => {
    common_vendor.index.getFileSystemManager().readFile({
      filePath: path,
      encoding: "base64",
      success: (res) => {
        resolve(`data:image/svg+xml;base64,${res.data}`);
      },
      fail: (error) => {
        common_vendor.index.__f__("error", "at uni_modules/lime-svg/components/l-svg/utils.ts:23", { error, path });
        reject(error);
      }
    });
  });
}
function svgToDataUrl(svgString) {
  const encodedSvg = encodeURIComponent(svgString).replace(/\+/g, "%20");
  return `data:image/svg+xml,${encodedSvg}`;
}
exports.pathToDataUrl = pathToDataUrl;
exports.svgToDataUrl = svgToDataUrl;
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/lime-svg/components/l-svg/utils.js.map
