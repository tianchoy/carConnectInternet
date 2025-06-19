"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uv_tabs_1 = common_vendor.resolveComponent("uv-tabs");
  _easycom_uv_tabs_1();
}
const _easycom_uv_tabs = () => "../../uni_modules/uv-tabs/components/uv-tabs/uv-tabs.js";
if (!Math) {
  _easycom_uv_tabs();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent(new UTSJSONObject({
  __name: "indexListMode",
  setup(__props) {
    const currentList = common_vendor.ref(0);
    const list = [new UTSJSONObject({
      name: "全部",
      badge: new UTSJSONObject({
        value: 15
      })
    }), new UTSJSONObject({
      name: "在线",
      badge: new UTSJSONObject({
        value: 10
      })
    }), new UTSJSONObject({
      name: "离线",
      badge: new UTSJSONObject({
        value: 5
      })
    })];
    const selectList = (e = null) => {
      common_vendor.index.__f__("log", "at components/indexListMode/indexListMode.uvue:30", e.index);
      currentList.value = e.index;
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.o(selectList),
        b: common_vendor.p({
          list,
          current: common_vendor.unref(currentList),
          itemStyle: "height:35",
          lineWidth: "55"
        }),
        c: common_vendor.t(list[common_vendor.unref(currentList)].name),
        d: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
}));
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/indexListMode/indexListMode.js.map
