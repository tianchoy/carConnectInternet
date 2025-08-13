"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_list_item_1 = common_vendor.resolveComponent("uv-list-item");
  const _easycom_uv_list_1 = common_vendor.resolveComponent("uv-list");
  const _easycom_uv_modal_1 = common_vendor.resolveComponent("uv-modal");
  (_easycom_custom_navBar_1 + _easycom_uv_list_item_1 + _easycom_uv_list_1 + _easycom_uv_modal_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_list_item = () => "../../uni_modules/uv-list/components/uv-list-item/uv-list-item.js";
const _easycom_uv_list = () => "../../uni_modules/uv-list/components/uv-list/uv-list.js";
const _easycom_uv_modal = () => "../../uni_modules/uv-modal/components/uv-modal/uv-modal.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_list_item + _easycom_uv_list + _easycom_uv_modal)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "message",
  setup(__props) {
    const modal = common_vendor.ref(null);
    const handleItemClick = (item = null) => {
      var _a;
      common_vendor.index.__f__("log", "at pages/message/message.uvue:23", "点击", item);
      (_a = modal.value) === null || _a === void 0 ? null : _a.open();
    };
    const msgList = common_vendor.ref(new UTSJSONObject({}));
    common_vendor.onLoad(() => {
      loadMsgList();
    });
    const ReadIt = () => {
    };
    const loadMsgList = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        const res = yield api_request.getUserMsgList();
        msgList.value = res.data.list;
        common_vendor.index.__f__("log", "at pages/message/message.uvue:38", res);
      });
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.p({
          title: "消息中心",
          ["show-back"]: false,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false
        }),
        b: common_vendor.f(msgList.value, (item = null, index = null, i0 = null) => {
          return {
            a: common_vendor.o(($event = null) => {
              return handleItemClick(item);
            }, item.messageId),
            b: "1993bd19-2-" + i0 + "," + ("1993bd19-1-" + i0),
            c: common_vendor.p({
              title: item.messageType == 1 ? "警告" : item.messageType == 2 ? "事件" : "通知",
              note: item.content,
              clickable: true,
              ["show-badge"]: item.status == 1,
              badge: {
                value: "未读"
              }
            }),
            d: item.messageId,
            e: "1993bd19-1-" + i0
          };
        }),
        c: common_vendor.sr(modal, "1993bd19-3", {
          "k": "modal"
        }),
        d: common_vendor.o(ReadIt),
        e: common_vendor.p({
          title: "标题",
          content: "不知天上宫阙，今夕是何年"
        }),
        f: common_vendor.sei(common_vendor.gei(_ctx, ""), "view")
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
