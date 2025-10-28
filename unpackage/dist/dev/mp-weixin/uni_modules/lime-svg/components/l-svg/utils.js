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
        console.error({ error, path });
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
