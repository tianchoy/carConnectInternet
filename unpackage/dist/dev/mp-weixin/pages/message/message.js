"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_uv_list_item_1 = common_vendor.resolveComponent("uv-list-item");
  const _easycom_uv_list_1 = common_vendor.resolveComponent("uv-list");
  const _easycom_uv_load_more_1 = common_vendor.resolveComponent("uv-load-more");
  const _easycom_uv_modal_1 = common_vendor.resolveComponent("uv-modal");
  (_easycom_custom_navBar_1 + _easycom_uv_list_item_1 + _easycom_uv_list_1 + _easycom_uv_load_more_1 + _easycom_uv_modal_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_uv_list_item = () => "../../uni_modules/uv-list/components/uv-list-item/uv-list-item.js";
const _easycom_uv_list = () => "../../uni_modules/uv-list/components/uv-list/uv-list.js";
const _easycom_uv_load_more = () => "../../uni_modules/uv-load-more/components/uv-load-more/uv-load-more.js";
const _easycom_uv_modal = () => "../../uni_modules/uv-modal/components/uv-modal/uv-modal.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_uv_list_item + _easycom_uv_list + _easycom_uv_load_more + _easycom_uv_modal)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "message",
  setup(__props) {
    const modal = common_vendor.ref(null);
    const modalContent = common_vendor.ref(new UTSJSONObject({}));
    const msgList = common_vendor.ref([]);
    const currPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(10);
    const totalPage = common_vendor.ref(1);
    const loadStatus = common_vendor.ref("loadmore");
    const isLoading = common_vendor.ref(false);
    common_vendor.onLoad(() => {
      loadMsgList(true);
    });
    common_vendor.onReachBottom(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:57", "滚动到底部 - 当前页:", currPage.value, "总页数:", totalPage.value);
      if (loadStatus.value == "loadmore" && !isLoading.value) {
        loadMore();
      }
    });
    const loadMsgList = (isInit = false) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a;
        if (isInit) {
          currPage.value = 1;
          msgList.value = [];
          loadStatus.value = "loadmore";
        }
        if (isLoading.value)
          return Promise.resolve(null);
        isLoading.value = true;
        try {
          if (!isInit) {
            loadStatus.value = "loading";
          }
          common_vendor.index.__f__("log", "at pages/message/message.uvue:79", "请求数据 - 页码:", currPage.value);
          const res = yield api_request.getUserMsgList(new UTSJSONObject({
            page: currPage.value,
            pageSize: pageSize.value
          }));
          if (res.code == 0 && res.msg == "success") {
            const data = res.data || new UTSJSONObject({ list: [], totalPage: 0 });
            totalPage.value = data.totalPage || 1;
            common_vendor.index.__f__("log", "at pages/message/message.uvue:92", "第", currPage.value, "页接口返回:", data);
            common_vendor.index.__f__("log", "at pages/message/message.uvue:93", "第", currPage.value, "页列表长度:", (_a = data.list) === null || _a === void 0 ? null : _a.length);
            if (isInit) {
              msgList.value = data.list || [];
            } else {
              const newData = data.list || [];
              common_vendor.index.__f__("log", "at pages/message/message.uvue:100", "即将添加的新数据长度:", newData.length);
              msgList.value = [...msgList.value, ...newData];
              msgList.value = [...msgList.value];
            }
            if (currPage.value >= totalPage.value) {
              loadStatus.value = "nomore";
            } else {
              loadStatus.value = "loadmore";
            }
          } else {
            loadStatus.value = "loadmore";
            common_vendor.index.__f__("error", "at pages/message/message.uvue:114", "接口返回错误:", res.msg);
          }
        } catch (error) {
          loadStatus.value = "loadmore";
          common_vendor.index.__f__("error", "at pages/message/message.uvue:118", "请求异常:", error);
        } finally {
          isLoading.value = false;
        }
      });
    };
    const loadMore = () => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:126", "准备加载更多 - 当前页:", currPage.value, "总页数:", totalPage.value);
      if (currPage.value < totalPage.value) {
        currPage.value++;
        loadMsgList();
      } else {
        loadStatus.value = "nomore";
      }
    };
    const handleItemClick = (item = null) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a;
        modalContent.value = item;
        (_a = modal.value) === null || _a === void 0 ? null : _a.open();
        if (item.status == 1) {
          try {
            const res = yield api_request.setMsgState(item.messageId);
            if (res.msg == "success") {
              const index = msgList.value.findIndex((msg) => {
                return msg.messageId == item.messageId;
              });
              if (index !== -1) {
                msgList.value[index].status = 0;
              }
            }
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/message/message.uvue:150", "更新状态失败:", error);
          }
        }
      });
    };
    const ReadIt = () => {
      var _a;
      (_a = modal.value) === null || _a === void 0 ? null : _a.close();
    };
    return (_ctx = null, _cache = null) => {
      const __returned__ = {
        a: common_vendor.p({
          title: "消息中心",
          ["show-back"]: false,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false,
          isShowStyle: true
        }),
        b: common_vendor.f(msgList.value, (item = null, index = null, i0 = null) => {
          return {
            a: common_vendor.o(($event = null) => {
              return handleItemClick(item);
            }, index),
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
            d: index,
            e: "1993bd19-1-" + i0
          };
        }),
        c: common_vendor.o(loadMore),
        d: common_vendor.p({
          status: loadStatus.value
        }),
        e: common_vendor.sr(modal, "1993bd19-4", {
          "k": "modal"
        }),
        f: common_vendor.o(ReadIt),
        g: common_vendor.p({
          title: modalContent.value.messageType == 1 ? "警告" : modalContent.value.messageType == 2 ? "事件" : "通知",
          content: modalContent.value.content
        })
      };
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
