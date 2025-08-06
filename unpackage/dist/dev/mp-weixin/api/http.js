"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "https://car.zdiot.cn:18443/api";
function requestInterceptor(config) {
  const token = common_vendor.index.getStorageSync("token");
  common_vendor.index.__f__("log", "at api/http.uts:29", "token", token);
  if (token) {
    config.header = config.header || {};
    config.header["token"] = `${token}`;
  }
  if (config.showLoading !== false) {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
  }
  return config;
}
function responseInterceptor(response = null, config) {
  if (config.showLoading !== false) {
    common_vendor.index.hideLoading();
  }
  if (response.statusCode === 200) {
    return response.data;
  } else {
    throw response;
  }
}
function errorHandler(error, config) {
  if (config.showLoading !== false) {
    common_vendor.index.hideLoading();
  }
  if (error.statusCode) {
    switch (error.statusCode) {
      case 401:
        common_vendor.index.showToast({
          title: "登录已过期，请重新登录",
          icon: "none"
        });
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        break;
      case 403:
        common_vendor.index.showToast({
          title: "没有权限访问",
          icon: "none"
        });
        break;
      case 404:
        common_vendor.index.showToast({
          title: "请求资源不存在",
          icon: "none"
        });
        break;
      case 500:
        common_vendor.index.showToast({
          title: "服务器错误",
          icon: "none"
        });
        break;
      default:
        common_vendor.index.showToast({
          title: `请求错误: ${error.statusCode}`,
          icon: "none"
        });
    }
  } else {
    common_vendor.index.showToast({
      title: "网络错误，请检查网络连接",
      icon: "none"
    });
  }
}
function request(options) {
  const config = Object.assign({ url: options.url, method: options.method || "GET", data: options.data || new UTSJSONObject({}), header: options.header || {}, showLoading: options.showLoading !== false }, options);
  if (!config.url.startsWith("http")) {
    config.url = BASE_URL + config.url;
  }
  common_vendor.index.__f__("log", "at api/http.uts:131", "config", config);
  requestInterceptor(config);
  return new Promise((resolve, reject) => {
    common_vendor.index.request(Object.assign(Object.assign({}, config), { success: (res = null) => {
      try {
        const data = responseInterceptor(res, config);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    }, fail: (error = null) => {
      errorHandler(error, config);
      reject(error);
    } }));
  });
}
const http = new UTSJSONObject({
  get(url, data = new UTSJSONObject({}), options = {}) {
    return request(Object.assign({
      url,
      data,
      method: "GET"
    }, options));
  },
  post(url, data = new UTSJSONObject({}), options = {}) {
    return request(Object.assign({
      url,
      data,
      method: "POST"
    }, options));
  },
  put(url, data = new UTSJSONObject({}), options = {}) {
    return request(Object.assign({
      url,
      data,
      method: "PUT"
    }, options));
  },
  delete(url, data = new UTSJSONObject({}), options = {}) {
    return request(Object.assign({
      url,
      data,
      method: "DELETE"
    }, options));
  },
  upload(url, filePath, name = "file", formData = new UTSJSONObject({}), options = {}) {
    return new Promise((resolve, reject) => {
      common_vendor.index.uploadFile({
        url: BASE_URL + url,
        filePath,
        name,
        formData,
        header: options.header || new UTSJSONObject({}),
        success: (res = null) => {
          if (res.statusCode === 200) {
            try {
              const data = UTS.JSON.parse(res.data);
              resolve(data);
            } catch (e) {
              resolve(res.data);
            }
          } else {
            reject(res);
          }
        },
        fail: (error = null) => {
          errorHandler(error, options);
          reject(error);
        }
      });
    });
  }
});
exports.http = http;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/http.js.map
