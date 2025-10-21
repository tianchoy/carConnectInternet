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
    const refresherTriggered = common_vendor.ref(false);
    const msgList = common_vendor.ref([]);
    const currPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(10);
    const totalPage = common_vendor.ref(1);
    const loadStatus = common_vendor.ref("loadmore");
    const isLoading = common_vendor.ref(false);
    const hasNewMessages = common_vendor.ref(false);
    const newMessageCount = common_vendor.ref(0);
    const lastUpdateTime = common_vendor.ref((/* @__PURE__ */ new Date()).getTime());
    const Login = common_vendor.ref(false);
    let checkTimer = null;
    const isPageActive = common_vendor.ref(false);
    common_vendor.onLoad(() => {
      const token = common_vendor.index.getStorageSync("token");
      common_vendor.index.__f__("log", "at pages/message/message.uvue:94", "获取到的 token:", token);
      if (token) {
        Login.value = true;
        loadMsgList(true);
      } else {
        Login.value = false;
      }
    });
    common_vendor.onShow(() => {
      if (Login.value) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:111", "页面显示 - 启动自动刷新");
        isPageActive.value = true;
        startNewMessageCheck();
        checkNewMessages();
      }
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:121", "页面隐藏 - 停止自动刷新");
      if (Login.value) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:123", "页面隐藏 - 停止自动刷新");
        isPageActive.value = false;
        stopNewMessageCheck();
      }
    });
    common_vendor.onUnload(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:131", "页面卸载 - 清理资源");
      if (Login.value) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:133", "页面卸载 - 清理资源");
        isPageActive.value = false;
        stopNewMessageCheck();
      }
    });
    common_vendor.onActivated(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:140", "页面激活 - 启动自动刷新");
      if (Login.value) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:142", "页面激活 - 启动自动刷新");
        isPageActive.value = true;
        startNewMessageCheck();
        checkNewMessages();
      }
    });
    common_vendor.onDeactivated(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:151", "页面停用 - 停止自动刷新");
      if (Login.value) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:153", "页面停用 - 停止自动刷新");
        isPageActive.value = false;
        stopNewMessageCheck();
      }
    });
    const onRefresherRefresh = () => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:161", "下拉刷新触发");
      refresherTriggered.value = true;
      loadMsgList(true).then(() => {
        refresherTriggered.value = false;
      }).catch(() => {
        refresherTriggered.value = false;
      });
    };
    const onScrollToLower = () => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:172", "滚动到底部 - 当前页:", currPage.value, "总页数:", totalPage.value);
      if (loadStatus.value == "loadmore" && !isLoading.value) {
        loadMore();
      }
    };
    const startNewMessageCheck = () => {
      if (checkTimer) {
        stopNewMessageCheck();
      }
      common_vendor.index.__f__("log", "at pages/message/message.uvue:184", "启动定时消息检查");
      checkTimer = setInterval(() => {
        if (isPageActive.value) {
          common_vendor.index.__f__("log", "at pages/message/message.uvue:188", "定时检查新消息...");
          checkNewMessages();
        }
      }, 1e4);
    };
    const stopNewMessageCheck = () => {
      if (checkTimer) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:197", "停止定时消息检查");
        clearInterval(checkTimer);
        checkTimer = null;
      }
    };
    const checkNewMessages = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        if (!isPageActive.value) {
          common_vendor.index.__f__("log", "at pages/message/message.uvue:207", "页面不活跃，跳过新消息检查");
          return Promise.resolve(null);
        }
        if (isLoading.value) {
          common_vendor.index.__f__("log", "at pages/message/message.uvue:213", "正在加载中，跳过新消息检查");
          return Promise.resolve(null);
        }
        try {
          common_vendor.index.__f__("log", "at pages/message/message.uvue:218", "开始检查新消息...");
          const res = yield api_request.getUserMsgList(new UTSJSONObject({
            page: 1,
            pageSize: 1
          }));
          if (res.code == 0 && res.msg == "success") {
            const data = res.data || new UTSJSONObject({ list: [], total: 0 });
            const latestMessage = (_a = data.list) === null || _a === void 0 ? null : _a[0];
            if (latestMessage && latestMessage.createTime) {
              const messageTime = new Date(latestMessage.createTime).getTime();
              if (messageTime > lastUpdateTime.value) {
                hasNewMessages.value = true;
                vibrateAlert();
                const countRes = yield api_request.getUserMsgList(new UTSJSONObject({
                  page: 1,
                  pageSize: 50
                }));
                if (countRes.code == 0) {
                  const newMessages = ((_c = (_b = countRes.data) === null || _b === void 0 ? null : _b.list) === null || _c === void 0 ? null : _c.filter((msg) => {
                    return new Date(msg.createTime).getTime() > lastUpdateTime.value;
                  })) || [];
                  newMessageCount.value = newMessages.length;
                  common_vendor.index.__f__("log", "at pages/message/message.uvue:245", "新消息数量:", newMessageCount.value);
                }
              } else {
                common_vendor.index.__f__("log", "at pages/message/message.uvue:248", "没有发现新消息");
              }
            }
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/message/message.uvue:253", "检查新消息失败:", error);
        }
      });
    };
    const vibrateAlert = () => {
      for (let i = 0; i < 3; i++) {
        common_vendor.index.vibrateLong();
      }
    };
    const loadNewMessages = () => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:266", "加载新消息");
      loadMsgList(true).then(() => {
        hasNewMessages.value = false;
        newMessageCount.value = 0;
        lastUpdateTime.value = (/* @__PURE__ */ new Date()).getTime();
        common_vendor.index.__f__("log", "at pages/message/message.uvue:271", "新消息加载完成");
      });
    };
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
          common_vendor.index.__f__("log", "at pages/message/message.uvue:291", "请求数据 - 页码:", currPage.value);
          const res = yield api_request.getUserMsgList(new UTSJSONObject({
            page: currPage.value,
            pageSize: pageSize.value
          }));
          if (res.code == 0 && res.msg == "success") {
            const data = res.data || new UTSJSONObject({ list: [], totalPage: 0 });
            totalPage.value = data.totalPage || 1;
            common_vendor.index.__f__("log", "at pages/message/message.uvue:303", "第", currPage.value, "页接口返回:", data);
            common_vendor.index.__f__("log", "at pages/message/message.uvue:304", "第", currPage.value, "页列表长度:", (_a = data.list) === null || _a === void 0 ? null : _a.length);
            if (isInit) {
              msgList.value = data.list || [];
              if (data.list && data.list.length > 0) {
                lastUpdateTime.value = (/* @__PURE__ */ new Date()).getTime();
              }
            } else {
              const newData = data.list || [];
              common_vendor.index.__f__("log", "at pages/message/message.uvue:314", "即将添加的新数据长度:", newData.length);
              const existingIds = new Set(msgList.value.map((item) => {
                return item.messageId;
              }));
              const uniqueNewData = newData.filter((item) => {
                return !existingIds.has(item.messageId);
              });
              if (uniqueNewData.length > 0) {
                msgList.value = [...msgList.value, ...uniqueNewData];
              }
            }
            if (currPage.value >= totalPage.value) {
              loadStatus.value = "nomore";
            } else {
              loadStatus.value = "loadmore";
            }
            if (isInit) {
              hasNewMessages.value = false;
              newMessageCount.value = 0;
            }
          } else {
            loadStatus.value = "loadmore";
            common_vendor.index.__f__("error", "at pages/message/message.uvue:339", "接口返回错误:", res.msg);
          }
        } catch (error) {
          loadStatus.value = "loadmore";
          common_vendor.index.__f__("error", "at pages/message/message.uvue:343", "请求异常:", error);
        } finally {
          isLoading.value = false;
        }
      });
    };
    const loadMore = () => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:351", "准备加载更多 - 当前页:", currPage.value, "总页数:", totalPage.value);
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
                msgList.value = [...msgList.value];
              }
            }
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/message/message.uvue:377", "更新状态失败:", error);
          }
        }
      });
    };
    const ReadIt = () => {
      var _a;
      (_a = modal.value) === null || _a === void 0 ? null : _a.close();
    };
    const getMessageTypeText = (type) => {
      switch (type) {
        case 1:
          return "警告";
        case 2:
          return "事件";
        default:
          return "通知";
      }
    };
    const formatTime = (timeString) => {
      if (!timeString)
        return "";
      try {
        const date = new Date(timeString);
        const now = /* @__PURE__ */ new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 6e4);
        const hours = Math.floor(diff / 36e5);
        const days = Math.floor(diff / 864e5);
        if (minutes < 1)
          return "刚刚";
        if (minutes < 60)
          return `${minutes}分钟前`;
        if (hours < 24)
          return `${hours}小时前`;
        if (days < 7)
          return `${days}天前`;
        return `${date.getMonth() + 1}-${date.getDate()}`;
      } catch (error) {
        return timeString;
      }
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.p({
          title: "消息中心",
          ["show-back"]: false,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false,
          isShowStyle: true
        }),
        b: msgList.value.length == 0 && !isLoading.value
      }, msgList.value.length == 0 && !isLoading.value ? {} : {}, {
        c: hasNewMessages.value
      }, hasNewMessages.value ? {
        d: common_vendor.t(newMessageCount.value),
        e: common_vendor.o(loadNewMessages)
      } : {}, {
        f: common_vendor.f(msgList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(formatTime(item.createTime)),
            b: common_vendor.o(($event) => {
              return handleItemClick(item);
            }, item.messageId || index),
            c: "1993bd19-2-" + i0 + "," + ("1993bd19-1-" + i0),
            d: common_vendor.p({
              title: getMessageTypeText(item.messageType) + " - " + item.createTime,
              note: item.content,
              clickable: true,
              ["show-badge"]: item.status == 1,
              badge: {
                value: "未读"
              }
            }),
            e: item.messageId || index,
            f: "1993bd19-1-" + i0
          };
        }),
        g: Login.value
      }, Login.value ? {
        h: common_vendor.p({
          status: loadStatus.value
        })
      } : {}, {
        i: refresherTriggered.value,
        j: common_vendor.o(onRefresherRefresh),
        k: common_vendor.o(onScrollToLower),
        l: common_vendor.sr(modal, "1993bd19-4", {
          "k": "modal"
        }),
        m: common_vendor.o(ReadIt),
        n: common_vendor.p({
          title: getMessageTypeText(modalContent.value.messageType),
          content: modalContent.value.content
        })
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
