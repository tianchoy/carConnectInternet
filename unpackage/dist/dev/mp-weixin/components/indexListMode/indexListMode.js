"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../api/http.js");
if (!Array) {
  const _easycom_uv_tags_1 = common_vendor.resolveComponent("uv-tags");
  _easycom_uv_tags_1();
}
const _easycom_uv_tags = () => "../../uni_modules/uv-tags/components/uv-tags/uv-tags.js";
if (!Math) {
  _easycom_uv_tags();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "indexListMode",
  setup(__props) {
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.p({
          text: "在线",
          type: "success"
        }),
        b: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/indexListMode/indexListMode.js.map
