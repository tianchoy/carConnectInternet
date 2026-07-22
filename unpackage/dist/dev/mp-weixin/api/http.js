"use strict";
const common_vendor = require("../common/vendor.js");
class RequestOptions extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          url: { type: String, optional: true },
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
class RequestResult extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          statusCode: { type: Number, optional: false },
          data: { type: "Any", optional: false },
          errMsg: { type: String, optional: true }
        };
      },
      name: "RequestResult"
    };
  }
  constructor(options, metadata = RequestResult.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.statusCode = this.__props__.statusCode;
    this.data = this.__props__.data;
    this.errMsg = this.__props__.errMsg;
    delete this.__props__;
  }
}
class RequestFailure extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          errMsg: { type: String, optional: true },
          data: { type: "Any", optional: true }
        };
      },
      name: "RequestFailure"
    };
  }
  constructor(options, metadata = RequestFailure.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.errMsg = this.__props__.errMsg;
    this.data = this.__props__.data;
    delete this.__props__;
  }
}
const BASE_URL = "https://car.zdiot.cn:18443/api";
function handleTokenExpired() {
  common_vendor.index.__f__("log", "at api/http.uts:38", "检测到token过期，执行跳转登录页逻辑");
  common_vendor.index.removeStorageSync("token");
  common_vendor.index.showToast({
    title: "登录已过期，请重新登录",
    icon: "none",
    duration: 2e3
  });
  setTimeout(() => {
    common_vendor.index.__f__("log", "at api/http.uts:52", "正在跳转到登录页...");
    common_vendor.index.redirectTo({
      url: "/pages/login/login",
      success: () => {
        common_vendor.index.__f__("log", "at api/http.uts:56", "跳转登录页成功");
      },
      fail: (err) => {
        common_vendor.index.__f__("log", "at api/http.uts:59", "跳转登录页失败:", err);
        common_vendor.index.reLaunch({
          url: "/pages/login/login"
        });
      }
    });
  }, 500);
}
function requestInterceptor(config) {
  const token = common_vendor.index.getStorageSync("token");
  if (token != null && token.toString().length > 0) {
    if (config.header == null) {
      config.header = new common_vendor.UTSJSONObject({});
    }
    config.header["token"] = token.toString();
  }
  return config;
}
function responseInterceptor(response, config) {
  return response.data;
}
function errorHandler(error, config) {
  if (config.showLoading != false) {
    common_vendor.index.hideLoading();
  }
  common_vendor.index.__f__("log", "at api/http.uts:111", "请求错误详情:", error);
  if (error.statusCode != 0) {
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
          title: error.message != null ? error.message : `请求错误: ${error.statusCode}`,
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
  const requestUrl = options.url != null ? options.url : "";
  const config = new common_vendor.UTSJSONObject(
    {
      url: requestUrl,
      method: options.method != null ? options.method : "GET",
      data: options.data != null ? options.data : new common_vendor.UTSJSONObject({}),
      header: options.header != null ? options.header : new common_vendor.UTSJSONObject(),
      showLoading: options.showLoading != false
    }
    // 处理完整URL
  );
  if (!config.url.startsWith("http")) {
    config.url = BASE_URL + config.url;
  }
  const processedConfig = requestInterceptor(config);
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: processedConfig.url,
      method: processedConfig.method,
      data: processedConfig.data,
      header: processedConfig.header,
      success: (res) => {
        const statusCode = res.statusCode;
        if (statusCode == 200) {
          const data = responseInterceptor(res);
          resolve(data);
        } else {
          const httpError = new HttpError({
            statusCode,
            message: `请求失败: ${statusCode}`,
            data: res.data
          });
          errorHandler(httpError, processedConfig);
          reject(httpError);
        }
      },
      fail: (error) => {
        const httpError = new HttpError({
          statusCode: 0,
          message: error.errMsg != null ? error.errMsg : "网络请求失败",
          data: error
        });
        errorHandler(httpError, processedConfig);
        reject(httpError);
      }
    });
  });
}
function get(url, data = new common_vendor.UTSJSONObject({}), options = new RequestOptions({
  url: null,
  method: null,
  data: null,
  header: null,
  showLoading: null
})) {
  return request(new common_vendor.UTSJSONObject({
    url,
    method: "GET",
    data,
    header: options.header,
    showLoading: options.showLoading
  }));
}
function post(url, data = new common_vendor.UTSJSONObject({}), options = new RequestOptions({
  url: null,
  method: null,
  data: null,
  header: null,
  showLoading: null
})) {
  return request(new common_vendor.UTSJSONObject({
    url,
    method: "POST",
    data,
    header: options.header,
    showLoading: options.showLoading
  }));
}
function put(url, data = new common_vendor.UTSJSONObject({}), options = new RequestOptions({
  url: null,
  method: null,
  data: null,
  header: null,
  showLoading: null
})) {
  return request(new common_vendor.UTSJSONObject({
    url,
    method: "PUT",
    data,
    header: options.header,
    showLoading: options.showLoading
  }));
}
function remove(url, data = new common_vendor.UTSJSONObject({}), options = new RequestOptions({
  url: null,
  method: null,
  data: null,
  header: null,
  showLoading: null
})) {
  return request(new common_vendor.UTSJSONObject({
    url,
    method: "DELETE",
    data,
    header: options.header,
    showLoading: options.showLoading
  }));
}
exports.get = get;
exports.post = post;
exports.put = put;
exports.remove = remove;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/http.js.map
