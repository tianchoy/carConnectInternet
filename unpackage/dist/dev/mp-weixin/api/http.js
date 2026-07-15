"use strict";
const common_vendor = require("../common/vendor.js");
class RequestOptions extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          url: { type: String, optional: false },
          method: { type: "Unknown", optional: true },
          data: { type: "Any", optional: true },
          header: { type: "Unknown", optional: true },
          showLoading: { type: Boolean, optional: true }
        };
      },
      name: "RequestOptions"
    };
  }
  constructor(options, metadata = RequestOptions.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.url = this.__props__.url;
    this.method = this.__props__.method;
    this.data = this.__props__.data;
    this.header = this.__props__.header;
    this.showLoading = this.__props__.showLoading;
    delete this.__props__;
  }
}
class HttpResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$(T) {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          message: { type: String, optional: false },
          data: { type: "Unknown", optional: false }
        };
      },
      name: "HttpResponse"
    };
  }
  constructor(options, metadata = HttpResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.message = this.__props__.message;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
class HttpError extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          statusCode: { type: Number, optional: false },
          message: { type: String, optional: false },
          data: { type: "Any", optional: true }
        };
      },
      name: "HttpError"
    };
  }
  constructor(options, metadata = HttpError.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.statusCode = this.__props__.statusCode;
    this.message = this.__props__.message;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
const BASE_URL = "https://car.zdiot.cn:18443/api";
function handleTokenExpired() {
  console.log("检测到token过期，执行跳转登录页逻辑");
  common_vendor.index.removeStorageSync("token");
  common_vendor.index.showToast({
    title: "登录已过期，请重新登录",
    icon: "none",
    duration: 2e3
  });
  setTimeout(() => {
    console.log("正在跳转到登录页...");
    common_vendor.index.redirectTo({
      url: "/pages/login/login",
      success: () => {
        console.log("跳转登录页成功");
      },
      fail: (err) => {
        console.log("跳转登录页失败:", err);
        common_vendor.index.reLaunch({
          url: "/pages/login/login"
        });
      }
    });
  }, 500);
}
function requestInterceptor(config) {
  const token = common_vendor.index.getStorageSync("token");
  if (token) {
    config.header = config.header || {};
    config.header["token"] = `${token}`;
  }
  return config;
}
function responseInterceptor(response = null, config) {
  const statusCode = response.statusCode;
  if (statusCode === 200) {
    return response.data;
  } else {
    const error = new HttpError({
      statusCode,
      message: response.errMsg || `请求失败: ${statusCode}`,
      data: response.data
    });
    throw error;
  }
}
function errorHandler(error, config) {
  if (config.showLoading !== false) {
    common_vendor.index.hideLoading();
  }
  console.log("请求错误详情:", error);
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
  const config = new RequestOptions(Object.assign(Object.assign({}, options), { url: options.url, method: options.method || "GET", data: options.data || new common_vendor.UTSJSONObject({}), header: options.header || {}, showLoading: options.showLoading !== false }));
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
      const httpError = new HttpError({
        statusCode: 0,
        message: error.errMsg || "网络请求失败",
        data: error
      });
      errorHandler(httpError, processedConfig);
      reject(httpError);
    } }));
  });
}
const http = new common_vendor.UTSJSONObject({
  get(url, data = new common_vendor.UTSJSONObject({}), options = new RequestOptions({
    url: null,
    method: null,
    data: null,
    header: null,
    showLoading: null
  })) {
    return request(new RequestOptions(Object.assign(Object.assign({ header: null, showLoading: null }, options), {
      url,
      data,
      method: "GET"
    })));
  },
  post(url, data = new common_vendor.UTSJSONObject({}), options = new RequestOptions({
    url: null,
    method: null,
    data: null,
    header: null,
    showLoading: null
  })) {
    return request(new RequestOptions(Object.assign(Object.assign({ header: null, showLoading: null }, options), {
      url,
      data,
      method: "POST"
    })));
  },
  put(url, data = new common_vendor.UTSJSONObject({}), options = new RequestOptions({
    url: null,
    method: null,
    data: null,
    header: null,
    showLoading: null
  })) {
    return request(new RequestOptions(Object.assign(Object.assign(Object.assign({ header: null, showLoading: null }, options), {
      url,
      data,
      method: "PUT"
    }), options)));
  },
  delete(url, data = new common_vendor.UTSJSONObject({}), options = new RequestOptions({
    url: null,
    method: null,
    data: null,
    header: null,
    showLoading: null
  })) {
    return request(new RequestOptions(Object.assign(Object.assign({ header: null, showLoading: null }, options), {
      url,
      data,
      method: "DELETE"
    })));
  },
  upload(url, filePath, name = "file", formData = new common_vendor.UTSJSONObject({}), options = new RequestOptions({
    url: null,
    method: null,
    data: null,
    header: null,
    showLoading: null
  })) {
    return new Promise((resolve, reject) => {
      const fullUrl = url.startsWith("http") ? url : BASE_URL + url;
      const token = common_vendor.index.getStorageSync("token");
      const header = options.header || {};
      if (token) {
        header["token"] = `${token}`;
      }
      if (options.showLoading !== false) {
        common_vendor.index.showLoading(new common_vendor.UTSJSONObject({
          title: "上传中...",
          mask: true
        }));
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
              const data = common_vendor.UTS.JSON.parse(res.data);
              resolve(data);
            } catch (e) {
              resolve(res.data);
            }
          } else {
            const error = new HttpError({
              statusCode: res.statusCode,
              message: "文件上传失败",
              data: res.data
            });
            errorHandler(error, options);
            reject(error);
          }
        },
        fail: (error = null) => {
          if (options.showLoading !== false) {
            common_vendor.index.hideLoading();
          }
          const httpError = new HttpError({
            statusCode: 0,
            message: error.errMsg || "文件上传失败",
            data: error
          });
          errorHandler(httpError, options);
          reject(httpError);
        }
      });
    });
  }
});
exports.http = http;
