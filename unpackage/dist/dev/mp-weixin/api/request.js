"use strict";
const api_http = require("./http.js");
const loginUrl = "/sys/login";
const customList = "/sys/dept/deps";
const login = (method, data) => {
  return api_http.http.post(loginUrl, data);
};
const getCustomList = () => {
  return api_http.http.get(customList);
};
exports.getCustomList = getCustomList;
exports.login = login;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/request.js.map
