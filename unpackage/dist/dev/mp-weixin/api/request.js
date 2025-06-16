"use strict";
const api_http = require("./http.js");
const getUserInfoUrl = "/api/getuserInfo";
const getUserInfo = () => {
  return api_http.http(getUserInfoUrl);
};
exports.getUserInfo = getUserInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/request.js.map
