"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uv_empty_1 = common_vendor.resolveComponent("uv-empty");
  _easycom_uv_empty_1();
}
const _easycom_uv_empty = () => "../../uni_modules/uv-empty/components/uv-empty/uv-empty.js";
if (!Math) {
  _easycom_uv_empty();
}
const emptyImage = "/static/empty.png";
const _sfc_defineComponent = common_vendor.defineComponent({
  __name: "webview",
  setup(__props) {
    const webviewUrl = common_vendor.ref("");
    common_vendor.onLoad((options) => {
      console.log("接收到的参数:", options);
      if (options.url) {
        let decodedUrl = decodeURIComponent(options.url);
        if (!decodedUrl.startsWith("http://") && !decodedUrl.startsWith("https://")) {
          decodedUrl = "https://" + decodedUrl;
        }
        webviewUrl.value = decodedUrl;
        if (options.title) {
          common_vendor.index.setNavigationBarTitle({
            title: decodeURIComponent(options.title)
          });
        } else {
          const title = extractTitleFromUrl(decodedUrl);
          common_vendor.index.setNavigationBarTitle({
            title: title || "网页加载中..."
          });
        }
      } else {
        common_vendor.index.showToast({
          title: "链接地址无效",
          icon: "none"
        });
      }
    });
    const extractTitleFromUrl = (url = null) => {
      try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        return hostname.replace(/^www\./, "");
      } catch (e) {
        return "";
      }
    };
    const handleLoad = (e = null) => {
      console.log("网页加载成功", e);
      common_vendor.index.hideLoading();
    };
    const handleError = (e = null) => {
      console.error("网页加载失败", e);
      common_vendor.index.showToast({
        title: "页面加载失败",
        icon: "none"
      });
    };
    const handleMessage = (e = null) => {
      console.log("接收网页消息:", e.detail);
      const data = e.detail.data;
      if (data && data.length > 0) {
        const lastMessage = data[data.length - 1];
        console.log("最后一条消息:", lastMessage);
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack(new common_vendor.UTSJSONObject({
        delta: 1
      }));
    };
    common_vendor.onShareAppMessage(() => {
      return new common_vendor.UTSJSONObject({
        title: "产品商城",
        path: `/pages/webview/webview?url=${encodeURIComponent(webviewUrl.value)}`
      });
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: webviewUrl.value
      }, webviewUrl.value ? {
        b: webviewUrl.value,
        c: common_vendor.o(handleMessage, "b4"),
        d: common_vendor.o(handleLoad, "51"),
        e: common_vendor.o(handleError, "dc")
      } : {
        f: common_vendor.p({
          text: "页面加载失败",
          image: emptyImage,
          class: "data-v-fa7ac34d"
        }),
        g: common_vendor.o(goBack, "a2")
      }, {
        h: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        i: `${_ctx.u_s_b_h}px`,
        j: `${_ctx.u_s_a_i_b}px`,
        k: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
_sfc_defineComponent.__runtimeHooks = 2;
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_defineComponent, [["__scopeId", "data-v-fa7ac34d"]]);
wx.createPage(MiniProgramPage);
