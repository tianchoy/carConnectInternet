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
  props: {
    lists: {}
  },
  setup(__props) {
    const props = __props;
    const todetail = (companyId, imei) => {
      common_vendor.index.__f__("log", "at components/indexListMode/indexListMode.uvue:33", companyId);
      common_vendor.index.navigateTo({
        url: "/pages/carInfoDetail/carInfoDetail?deptId=" + companyId + "&imei=" + imei
      });
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = common_vendor.e(new UTSJSONObject({
        a: props.lists.length != 0
      }), props.lists.length != 0 ? new UTSJSONObject({
        b: common_vendor.f(props.lists, (item = null, index = null, i0 = null) => {
          return new UTSJSONObject({
            a: common_vendor.t(item.deviceId),
            b: "245c735a-0-" + i0,
            c: common_vendor.p(new UTSJSONObject({
              text: item.status == 1 ? "在线" : "离线",
              type: item.status == 1 ? "success" : "error"
            })),
            d: common_vendor.t(item.imei),
            e: index,
            f: common_vendor.o(($event = null) => {
              return todetail(item.companyId, item.imei);
            }, index)
          });
        })
      }) : new UTSJSONObject({}), new UTSJSONObject({
        c: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      }));
      return __returned__;
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/indexListMode/indexListMode.js.map
