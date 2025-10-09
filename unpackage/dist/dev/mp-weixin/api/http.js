"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "https://car.zdiot.cn:18443/api";
function handleTokenExpired() {
  common_vendor.index.__f__("log", "at api/http.uts:27", "检测到token过期，执行跳转登录页逻辑");
  common_vendor.index.removeStorageSync("token");
  common_vendor.index.showToast({
    title: "登录已过期，请重新登录",
    icon: "none",
    duration: 2e3
  });
  setTimeout(() => {
    common_vendor.index.__f__("log", "at api/http.uts:41", "正在跳转到登录页...");
    common_vendor.index.redirectTo({
      url: "/pages/login/login",
      success: () => {
        common_vendor.index.__f__("log", "at api/http.uts:46", "跳转登录页成功");
      },
      fail: (err) => {
        common_vendor.index.__f__("log", "at api/http.uts:49", "跳转登录页失败:", err);
        common_vendor.index.reLaunch({
          url: "/pages/login/login"
        });
      }
    });
  }, 1500);
}
function requestInterceptor(config) {
  const token = common_vendor.index.getStorageSync("token");
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
  const statusCode = response.statusCode;
  if (statusCode === 200) {
    return response.data;
  } else {
    const error = {
      statusCode,
      message: response.errMsg || `请求失败: ${statusCode}`,
      data: response.data
    };
    throw error;
  }
}
function errorHandler(error, config) {
  if (config.showLoading !== false) {
    common_vendor.index.hideLoading();
  }
  common_vendor.index.__f__("log", "at api/http.uts:110", "请求错误详情:", error);
  if (error.statusCode) {
    switch (error.statusCode) {
      case 401:
        handleTokenExpired();
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
          title: error.message || `请求错误: ${error.statusCode}`,
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
  const processedConfig = requestInterceptor(config);
  return new Promise((resolve, reject) => {
    common_vendor.index.request(Object.assign(Object.assign({}, processedConfig), { success: (res = null) => {
      try {
        const data = responseInterceptor(res, processedConfig);
        resolve(data);
      } catch (error) {
        errorHandler(error, processedConfig);
        reject(error);
      }
    }, fail: (error = null) => {
      const httpError = {
        statusCode: 0,
        message: error.errMsg || "网络请求失败",
        data: error
      };
      errorHandler(httpError, processedConfig);
      reject(httpError);
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
      const fullUrl = url.startsWith("http") ? url : BASE_URL + url;
      const token = common_vendor.index.getStorageSync("token");
      const header = options.header || {};
      if (token) {
        header["token"] = `${token}`;
      }
      if (options.showLoading !== false) {
        common_vendor.index.showLoading({
          title: "上传中...",
          mask: true
        });
      }
      common_vendor.index.uploadFile({
        url: fullUrl,
        filePath,
        name,
        formData,
        header,
        success: (res = null) => {
          if (options.showLoading !== false) {
            common_vendor.index.hideLoading();
          }
          if (res.statusCode === 200) {
            try {
              const data = UTS.JSON.parse(res.data);
              resolve(data);
            } catch (e) {
              resolve(res.data);
            }
          } else {
            const error = {
              statusCode: res.statusCode,
              message: "文件上传失败",
              data: res.data
            };
            errorHandler(error, options);
            reject(error);
          }
        },
        fail: (error = null) => {
          if (options.showLoading !== false) {
            common_vendor.index.hideLoading();
          }
          const httpError = {
            statusCode: 0,
            message: error.errMsg || "文件上传失败",
            data: error
          };
          errorHandler(httpError, options);
          reject(httpError);
        }
      });
    });
  }
});
exports.http = http;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/http.js.map
