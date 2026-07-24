"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_toast = require("../../utils/toast.js");
if (!Array) {
  const _easycom_i_empty_1 = common_vendor.resolveComponent("i-empty");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  (_easycom_i_empty_1 + _easycom_app_toast_1)();
}
const _easycom_i_empty = () => "../../uni_modules/i-ui-x/components/i-empty/i-empty.js";
const _easycom_app_toast = () => "../../components/app-toast/app-toast.js";
if (!Math) {
  (_easycom_i_empty + _easycom_app_toast)();
}
const emptyImage = "/static/empty.png";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "webview",
  setup(__props) {
    const webviewUrl = common_vendor.ref("");
    function extractTitleFromUrl(url) {
      let hostname = url;
      const protocolIndex = hostname.indexOf("://");
      if (protocolIndex >= 0) {
        hostname = hostname.substring(protocolIndex + 3);
      }
      const pathIndex = hostname.indexOf("/");
      if (pathIndex >= 0) {
        hostname = hostname.substring(0, pathIndex);
      }
      if (hostname.startsWith("www.")) {
        hostname = hostname.substring(4);
      }
      return hostname;
    }
    common_vendor.onLoad((options) => {
      var _a, _b, _c, _d;
      common_vendor.index.__f__("log", "at pages/webview/webview.uvue:44", "接收到的参数:", options);
      const optionData = options;
      const url = (_a = optionData.getString("url", "")) !== null && _a !== void 0 ? _a : "";
      const pageTitle = (_b = optionData.getString("title", "")) !== null && _b !== void 0 ? _b : "";
      if (url != "") {
        let decodedUrl = (_c = decodeURIComponent(url)) !== null && _c !== void 0 ? _c : "";
        if (!decodedUrl.startsWith("http://") && !decodedUrl.startsWith("https://")) {
          decodedUrl = "https://" + decodedUrl;
        }
        webviewUrl.value = decodedUrl;
        if (pageTitle != "") {
          common_vendor.index.setNavigationBarTitle({
            title: (_d = decodeURIComponent(pageTitle)) !== null && _d !== void 0 ? _d : ""
          });
        } else {
          const extractedTitle = extractTitleFromUrl(decodedUrl);
          common_vendor.index.setNavigationBarTitle({
            title: extractedTitle != "" ? extractedTitle : "网页加载中..."
          });
        }
      } else {
        utils_toast.showAppToast({
          title: "链接地址无效",
          icon: "none"
        });
      }
    });
    const handleLoad = (e = null) => {
      common_vendor.index.__f__("log", "at pages/webview/webview.uvue:81", "网页加载成功", e);
      common_vendor.index.hideLoading();
    };
    const handleError = (e = null) => {
      common_vendor.index.__f__("error", "at pages/webview/webview.uvue:87", "网页加载失败", e);
      utils_toast.showAppToast({
        title: "页面加载失败",
        icon: "none"
      });
    };
    const handleMessage = (e) => {
      const detail = e.getJSON("detail");
      common_vendor.index.__f__("log", "at pages/webview/webview.uvue:97", "接收网页消息:", detail);
    };
    const goBack = () => {
      common_vendor.index.navigateBack(new common_vendor.UTSJSONObject({
        delta: 1
      }));
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: webviewUrl.value
      }, webviewUrl.value ? {
        b: webviewUrl.value,
        c: common_vendor.o(handleMessage, "a7"),
        d: common_vendor.o(handleLoad, "13"),
        e: common_vendor.o(handleError, "c0")
      } : {
        f: common_vendor.p({
          text: "页面加载失败",
          showButton: false,
          description: "",
          image: emptyImage,
          class: "data-v-fa7ac34d"
        }),
        g: common_vendor.o(goBack, "1e")
      }, {
        h: `${_ctx.u_s_b_h}px`,
        i: `${_ctx.u_s_a_i_b}px`,
        j: common_vendor.p({
          class: "data-v-fa7ac34d"
        })
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fa7ac34d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/webview/webview.js.map
