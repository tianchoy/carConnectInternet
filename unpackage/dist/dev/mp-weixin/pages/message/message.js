"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_list_item_1 = common_vendor.resolveComponent("uv-list-item");
  const _easycom_uv_list_1 = common_vendor.resolveComponent("uv-list");
  (_easycom_custom_navBar_1 + _easycom_uv_list_item_1 + _easycom_uv_list_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_list_item = () => "../../uni_modules/uv-list/components/uv-list-item/uv-list-item.js";
const _easycom_uv_list = () => "../../uni_modules/uv-list/components/uv-list/uv-list.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_list_item + _easycom_uv_list)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "message",
  setup(__props) {
    const handleItemClick = (e = null) => {
      common_vendor.index.showToast({
        title: "点击事件已触发",
        icon: "none"
      });
      common_vendor.index.__f__("log", "at pages/message/message.uvue:25", "点击", e);
    };
    const badge = common_vendor.ref(98);
    const title = common_vendor.ref("这里是消息的主题");
    const desc = common_vendor.ref("这里是描述文字");
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.o(_ctx.handleCapsule),
        b: common_vendor.p({
          title: "消息中心",
          ["show-back"]: false,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        c: common_vendor.o(($event = null) => {
          return handleItemClick(1);
        }),
        d: common_vendor.p({
          title: common_vendor.unref(title),
          ["show-badge"]: true,
          note: common_vendor.unref(desc),
          clickable: true,
          badge: {
            value: common_vendor.unref(badge)
          }
        }),
        e: common_vendor.o(($event = null) => {
          return handleItemClick(2);
        }),
        f: common_vendor.p({
          title: common_vendor.unref(title),
          ["show-badge"]: true,
          note: common_vendor.unref(desc),
          clickable: true,
          badge: {
            value: common_vendor.unref(badge)
          }
        }),
        g: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
