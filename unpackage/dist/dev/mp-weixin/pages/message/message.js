"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
const services_push = require("../../services/push.js");
const utils_formateTime = require("../../utils/formateTime.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_i_modal_1 = common_vendor.resolveComponent("i-modal");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  (_easycom_custom_navBar_1 + _easycom_i_modal_1 + _easycom_app_toast_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_i_modal = () => "../../uni_modules/i-ui-x/components/i-modal/i-modal.js";
const _easycom_app_toast = () => "../../components/app-toast/app-toast.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_i_modal + _easycom_app_toast)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "message",
  setup(__props) {
    const modal = common_vendor.ref(false);
    const modalContent = common_vendor.ref(new common_vendor.UTSJSONObject({}));
    const refresherTriggered = common_vendor.ref(false);
    const msgList = common_vendor.ref([]);
    const currPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(10);
    const totalPage = common_vendor.ref(1);
    const loadStatus = common_vendor.ref("loadmore");
    const isListLoading = common_vendor.ref(false);
    const isCheckingNewMessages = common_vendor.ref(false);
    const hasLoadedInitial = common_vendor.ref(false);
    const hasNewMessages = common_vendor.ref(false);
    const newMessageCount = common_vendor.ref(0);
    const Login = common_vendor.ref(false);
    const messageScrollViewportHeight = common_vendor.ref(0);
    const isNearMessageListBottom = common_vendor.ref(false);
    const isInitialLoading = common_vendor.computed(() => {
      return isListLoading.value && !hasLoadedInitial.value && msgList.value.length == 0;
    });
    const showLoadMore = common_vendor.computed(() => {
      return msgList.value.length > 0 && (isListLoading.value || loadStatus.value == "loadmore" || loadStatus.value == "nomore");
    });
    let checkTimer = 0;
    const isPageActive = common_vendor.ref(false);
    function stopNewMessageCheck() {
      if (checkTimer > 0) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:105", "停止定时消息检查");
        clearInterval(checkTimer);
        checkTimer = 0;
      }
    }
    function vibrateAlert() {
      for (let i = 0; i < 3; i++) {
        common_vendor.index.vibrateLong(new common_vendor.UTSJSONObject({}));
      }
    }
    function prependLatestMessages() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (isListLoading.value || isCheckingNewMessages.value)
          return 0;
        isCheckingNewMessages.value = true;
        try {
          const res = yield api_request.getUserMsgList(new common_vendor.UTSJSONObject({ page: 1, pageSize: 50 }));
          const pageData = res.data;
          if (res.code != 200 || pageData == null)
            return 0;
          const latestList = pageData.list;
          const existingIds = /* @__PURE__ */ new Set();
          msgList.value.forEach((message) => {
            const messageId = message.getString("messageId", "");
            if (messageId != "")
              existingIds.add(messageId);
          });
          const latestMessages = [];
          latestList.forEach((message) => {
            const messageId = message.getString("messageId", "");
            if (messageId != "" && !existingIds.has(messageId)) {
              existingIds.add(messageId);
              latestMessages.push(message);
            }
          });
          if (latestMessages.length > 0) {
            msgList.value = [...latestMessages, ...msgList.value];
          }
          return latestMessages.length;
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/message/message.uvue:147", "检查新消息失败:", error);
          return 0;
        } finally {
          isCheckingNewMessages.value = false;
        }
      });
    }
    function checkNewMessages() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!isPageActive.value || isListLoading.value || isCheckingNewMessages.value)
          return Promise.resolve(null);
        const insertedCount = yield prependLatestMessages();
        if (insertedCount > 0) {
          hasNewMessages.value = true;
          newMessageCount.value += insertedCount;
          vibrateAlert();
        }
      });
    }
    function startNewMessageCheck() {
      if (checkTimer > 0) {
        stopNewMessageCheck();
      }
      common_vendor.index.__f__("log", "at pages/message/message.uvue:171", "启动定时消息检查");
      checkTimer = setInterval(() => {
        if (isPageActive.value) {
          common_vendor.index.__f__("log", "at pages/message/message.uvue:175", "定时检查新消息...");
          checkNewMessages();
        }
      }, 1e4);
    }
    function loadMsgList(isInit = false) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (isListLoading.value || isCheckingNewMessages.value)
          return false;
        if (isInit) {
          currPage.value = 1;
          msgList.value = [];
          hasLoadedInitial.value = false;
          loadStatus.value = "loadmore";
          isNearMessageListBottom.value = false;
        }
        isListLoading.value = true;
        try {
          if (!isInit)
            loadStatus.value = "loading";
          const res = yield api_request.getUserMsgList(new common_vendor.UTSJSONObject({
            page: currPage.value,
            pageSize: pageSize.value
          }));
          if (res.code != 200) {
            loadStatus.value = "loadmore";
            return false;
          }
          const data = res.data;
          if (data == null) {
            totalPage.value = currPage.value;
            loadStatus.value = "nomore";
            if (isInit)
              hasLoadedInitial.value = true;
            return true;
          }
          const totalPages = data.totalPage > 0 ? data.totalPage : 1;
          totalPage.value = totalPages;
          const newData = data.list;
          const isEmptyInitial = isInit && newData.length == 0;
          if (isInit) {
            msgList.value = newData;
            hasLoadedInitial.value = true;
          } else {
            newData.forEach((item) => {
              const messageId = item.getString("messageId", "");
              const exists = msgList.value.some((existing) => {
                return existing.getString("messageId", "") == messageId;
              });
              if (!exists)
                msgList.value.push(item);
            });
          }
          loadStatus.value = isEmptyInitial || currPage.value >= totalPage.value ? "nomore" : "loadmore";
          if (isInit) {
            hasNewMessages.value = false;
            newMessageCount.value = 0;
          }
          return true;
        } catch (error) {
          loadStatus.value = "loadmore";
          common_vendor.index.__f__("error", "at pages/message/message.uvue:232", "请求异常:", error);
          return false;
        } finally {
          isListLoading.value = false;
        }
      });
    }
    function loadNewMessages() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:241", "加载新消息");
        yield prependLatestMessages();
        hasNewMessages.value = false;
        newMessageCount.value = 0;
        common_vendor.index.__f__("log", "at pages/message/message.uvue:245", "新消息加载完成");
      });
    }
    common_vendor.onLoad(() => {
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        Login.value = true;
        loadMsgList(true);
      } else {
        Login.value = false;
      }
    });
    const measureMessageScrollViewport = () => {
      common_vendor.index.createSelectorQuery().select("#message-scroll-container").boundingClientRect((rect = null) => {
        var _a;
        if (rect == null)
          return null;
        const nodeInfo = rect;
        const height = (_a = nodeInfo.height) !== null && _a !== void 0 ? _a : 0;
        if (height > 0) {
          messageScrollViewportHeight.value = height;
        }
      }).exec();
    };
    function handleItemClick(item) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        modalContent.value = item;
        modal.value = true;
        if (item.getNumber("status", 0) == 1) {
          try {
            const messageId = item.getString("messageId", "");
            const res = yield api_request.setMsgState(messageId);
            if (res.code == 200) {
              const index = msgList.value.findIndex((message) => {
                return message.getString("messageId", "") == messageId;
              });
              if (index != -1) {
                msgList.value[index].set("status", 0);
                msgList.value = [...msgList.value];
              }
            }
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/message/message.uvue:288", "更新状态失败:", error);
          }
        }
      });
    }
    function openPendingPushMessage() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (isListLoading.value || isCheckingNewMessages.value) {
          setTimeout(() => {
            void openPendingPushMessage();
          }, 150);
          return Promise.resolve(null);
        }
        const messageId = services_push.consumePendingMessageId();
        const shouldRefresh = services_push.consumePushStaleFlag();
        if (messageId == "" && !shouldRefresh)
          return Promise.resolve(null);
        yield loadMsgList(true);
        if (messageId == "")
          return Promise.resolve(null);
        const message = common_vendor.UTS.arrayFind(msgList.value, (item) => {
          return item.getString("messageId", "") == messageId;
        });
        if (message != null)
          yield handleItemClick(message);
      });
    }
    const finishPageLifecycle = () => {
      isPageActive.value = false;
      stopNewMessageCheck();
    };
    const resumePageLifecycle = () => {
      isPageActive.value = true;
      startNewMessageCheck();
      void openPendingPushMessage();
      void checkNewMessages();
    };
    common_vendor.onShow(() => {
      if (!Login.value)
        return null;
      common_vendor.index.__f__("log", "at pages/message/message.uvue:324", "页面显示 - 启动自动刷新");
      measureMessageScrollViewport();
      resumePageLifecycle();
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:330", "页面隐藏 - 停止自动刷新");
      finishPageLifecycle();
    });
    common_vendor.onUnload(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:335", "页面卸载 - 清理资源");
      finishPageLifecycle();
    });
    common_vendor.onActivated(() => {
      if (!Login.value)
        return null;
      common_vendor.index.__f__("log", "at pages/message/message.uvue:341", "页面激活 - 启动自动刷新");
      resumePageLifecycle();
    });
    common_vendor.onDeactivated(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:346", "页面停用 - 停止自动刷新");
      finishPageLifecycle();
    });
    const onRefresherRefresh = () => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:352", "下拉刷新触发");
      refresherTriggered.value = true;
      loadMsgList(true).then(() => {
        refresherTriggered.value = false;
      }).catch(() => {
        refresherTriggered.value = false;
      });
    };
    const loadMore = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (isListLoading.value || isCheckingNewMessages.value || loadStatus.value != "loadmore" || currPage.value >= totalPage.value) {
          if (currPage.value >= totalPage.value) {
            loadStatus.value = "nomore";
          }
          return Promise.resolve(null);
        }
        const previousPage = currPage.value;
        currPage.value = previousPage + 1;
        const loaded = yield loadMsgList();
        if (!loaded)
          currPage.value = previousPage;
      });
    };
    const onScrollToLower = () => {
      if (loadStatus.value == "loadmore" && !isListLoading.value && !isCheckingNewMessages.value) {
        loadMore();
      }
    };
    const onMessageScroll = (event) => {
    };
    const ReadIt = () => {
      modal.value = false;
    };
    const getMessageId = (item, index) => {
      const messageId = item.getString("messageId", "");
      return messageId != "" ? messageId : index.toString();
    };
    const getMessageCreateTime = (item) => {
      return item.getString("createTime", "");
    };
    const getMessageContent = (item) => {
      return item.getString("content", "");
    };
    const isMessageUnread = (item) => {
      return item.getNumber("status", 0) == 1;
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
    const getMessageTitle = (item) => {
      return getMessageTypeText(item.getNumber("messageType", 0)) + " - " + getMessageCreateTime(item);
    };
    const formatTime = (timeString) => {
      if (!timeString)
        return "";
      try {
        const milliseconds = utils_formateTime.parseLocalDateTime(timeString);
        if (milliseconds == null)
          return timeString;
        const date = new Date(milliseconds);
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
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false,
          isShowStyle: true
        }),
        b: isInitialLoading.value
      }, isInitialLoading.value ? {} : hasLoadedInitial.value && msgList.value.length == 0 ? {} : {}, {
        c: hasLoadedInitial.value && msgList.value.length == 0,
        d: hasNewMessages.value
      }, hasNewMessages.value ? {
        e: common_vendor.t(newMessageCount.value),
        f: common_vendor.o(loadNewMessages, "d0")
      } : {}, {
        g: common_vendor.f(msgList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(getMessageTitle(item)),
            b: common_vendor.t(formatTime(getMessageCreateTime(item))),
            c: common_vendor.t(getMessageContent(item)),
            d: isMessageUnread(item)
          }, isMessageUnread(item) ? {} : {}, {
            e: getMessageId(item, index),
            f: common_vendor.o(($event) => {
              return handleItemClick(item);
            }, getMessageId(item, index))
          });
        }),
        h: showLoadMore.value
      }, showLoadMore.value ? common_vendor.e({
        i: isListLoading.value
      }, isListLoading.value ? {} : loadStatus.value == "nomore" ? {} : {}, {
        j: loadStatus.value == "nomore"
      }) : {}, {
        k: common_vendor.sei("message-scroll-container", "scroll-view"),
        l: refresherTriggered.value,
        m: common_vendor.o(onRefresherRefresh, "3c"),
        n: common_vendor.o(onScrollToLower, "5b"),
        o: common_vendor.o(onMessageScroll, "00"),
        p: common_vendor.o(ReadIt, "40"),
        q: common_vendor.p({
          show: modal.value,
          title: getMessageTypeText(modalContent.value.getNumber("messageType", 0)),
          content: modalContent.value.getString("content", "")
        }),
        r: `${_ctx.u_s_b_h}px`,
        s: `${_ctx.u_s_a_i_b}px`
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
