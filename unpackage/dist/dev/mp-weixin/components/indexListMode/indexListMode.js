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
  emits: ["unbindDevice"],
  setup(__props, _a) {
    var __emit = _a.emit;
    const props = __props;
    const emit = __emit;
    const unbindDevice = (imei) => {
      emit("unbindDevice", imei);
    };
    const todetail = (companyId, imei, deviceId) => {
      common_vendor.index.navigateTo({
        url: "/pages/carInfoDetail/carInfoDetail?deptId=" + companyId + "&imei=" + imei + "&deviceId=" + deviceId
      });
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: props.lists.length != 0
      }, props.lists.length != 0 ? {
        b: common_vendor.f(props.lists, (item, index, i0) => {
          return {
            a: common_vendor.t(item.deviceName),
            b: "245c735a-0-" + i0,
            c: common_vendor.p({
              size: "mini",
              shape: "circle",
              text: item.connectionStatus == "online" ? "在线" : "离线",
              type: item.connectionStatus == "online" ? "success" : "error"
            }),
            d: common_vendor.o(($event) => {
              return unbindDevice(item.imei);
            }, index),
            e: "245c735a-1-" + i0,
            f: common_vendor.t(item.imei),
            g: index,
            h: common_vendor.o(($event) => {
              return todetail(item.companyId, item.imei, item.deviceId);
            }, index)
          };
        }),
        c: common_vendor.p({
          text: "解绑",
          type: "warning"
        })
      } : {}, {
        d: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      });
      return __returned__;
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/indexListMode/indexListMode.js.map
