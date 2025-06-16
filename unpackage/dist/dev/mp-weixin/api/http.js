"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "https://your-api-domain.com";
const TIMEOUT = 5e3;
const http = (url = null, method = "GET", data = new UTSJSONObject({}), config = new UTSJSONObject({})) => {
  return new Promise((resolve, reject) => {
    const finalConfig = requestInterceptor(new UTSJSONObject(Object.assign({
      url: `${BASE_URL}${url}`,
      method,
      data,
      timeout: TIMEOUT,
      header: new UTSJSONObject(Object.assign({ "Content-Type": "application/json" }, config.header))
    }, config)));
    common_vendor.index.request(Object.assign(Object.assign({}, finalConfig), { success: (res) => {
      common_vendor.index.__f__("log", "at api/http.uts:24", res);
      try {
        const processedData = responseInterceptor(res);
        resolve(processedData);
      } catch (err) {
        reject(err);
      }
    }, fail: (err) => {
      reject(err.errMsg || "网络错误");
    } }));
  });
};
const requestInterceptor = (config = null) => {
  const token = common_vendor.index.getStorageSync("token") || "";
  if (token) {
    config.header = config.header || new UTSJSONObject({});
    config.header["Authorization"] = `Bearer ${token}`;
  }
  return config;
};
const responseInterceptor = (response = null, config = null) => {
  const statusCode = response.statusCode, data = response.data;
  const url = config.url, method = config.method;
  if (statusCode < 200 || statusCode >= 300) {
    common_vendor.index.showToast({
      title: `请求失败 (HTTP ${statusCode})`,
      icon: "none"
    });
    return Promise.reject(new UTSJSONObject({
      type: "http",
      code: statusCode,
      message: `[${method}] ${url} 请求失败 (HTTP ${statusCode})`,
      original: response
    }));
  }
  if ((data === null || data === void 0 ? null : data.code) !== void 0 && data.code !== 200) {
    const error = new UTSJSONObject({
      type: "business",
      code: data.code,
      message: data.message || "业务逻辑错误",
      original: data
    });
    if (data.code === 401) {
      common_vendor.index.reLaunch({ url: "/pages/login" });
    }
    return Promise.reject(error);
  }
  if (config.needSignature && !validateDataSignature(data)) {
    return Promise.reject(new UTSJSONObject({
      type: "security",
      code: -300,
      message: "数据签名验证失败"
    }));
  }
  return new UTSJSONObject(Object.assign(Object.assign({}, data), { _metadata: new UTSJSONObject({
    timestamp: Date.now(),
    api: url
  }) }));
};
exports.http = http;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/http.js.map
