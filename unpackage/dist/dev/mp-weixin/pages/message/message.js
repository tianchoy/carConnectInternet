"use strict";
const common_vendor = require("../../common/vendor.js");
const api_response = require("../../api/response.js");
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
const NEW_MESSAGE_CHECK_INTERVAL = 1e4;
const SCROLL_RESUME_DELAY = 1500;
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
    const pendingNewMessages = common_vendor.ref([]);
    const messageScrollTop = common_vendor.ref(0);
    const Login = common_vendor.ref(false);
    const messageScrollViewportHeight = common_vendor.ref(0);
    const isNearMessageListBottom = common_vendor.ref(false);
    const isInitialLoading = common_vendor.computed(() => {
      return isListLoading.value && !hasLoadedInitial.value && msgList.value.length == 0;
    });
    const isMessageListEmpty = common_vendor.computed(() => {
      return hasLoadedInitial.value && msgList.value.length == 0 && !hasNewMessages.value;
    });
    const showLoadMore = common_vendor.computed(() => {
      return msgList.value.length > 0 && (isListLoading.value || loadStatus.value == "loadmore" || loadStatus.value == "nomore");
    });
    let checkTimer = 0;
    let scrollResumeTimer = null;
    const isPageActive = common_vendor.ref(false);
    function stopNewMessageCheck() {
      if (checkTimer > 0) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:115", "停止定时消息检查");
        clearInterval(checkTimer);
        checkTimer = 0;
      }
    }
    function stopScrollResumeTimer() {
      const timer = scrollResumeTimer;
      if (timer != null) {
        clearTimeout(timer);
        scrollResumeTimer = null;
      }
    }
    function vibrateAlert() {
      for (let i = 0; i < 3; i++) {
        common_vendor.index.vibrateLong(new common_vendor.UTSJSONObject({}));
      }
    }
    function findLatestMessages() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (isListLoading.value || isCheckingNewMessages.value)
          return [];
        isCheckingNewMessages.value = true;
        try {
          const res = yield api_request.getUserMsgList(new common_vendor.UTSJSONObject({ page: 1, pageSize: 10 }));
          const pageData = res.data;
          if (!api_response.isBusinessSuccessCode(res.code) || pageData == null)
            return [];
          const latestList = pageData.list;
          const existingIds = /* @__PURE__ */ new Set();
          let latestLoadedTime = null;
          const rememberMessage = (message) => {
            const messageId = message.getString("messageId", "");
            if (messageId != "")
              existingIds.add(messageId);
            const messageTime = utils_formateTime.parseLocalDateTime(message.getString("createTime", ""));
            const currentLatestLoadedTime = latestLoadedTime;
            if (messageTime != null && (currentLatestLoadedTime == null || messageTime > currentLatestLoadedTime)) {
              latestLoadedTime = messageTime;
            }
          };
          msgList.value.forEach(rememberMessage);
          pendingNewMessages.value.forEach(rememberMessage);
          const latestMessages = [];
          latestList.forEach((message) => {
            const messageId = message.getString("messageId", "");
            const messageTime = utils_formateTime.parseLocalDateTime(message.getString("createTime", ""));
            const isNewerThanLoaded = latestLoadedTime == null ? msgList.value.length == 0 && pendingNewMessages.value.length == 0 : messageTime != null && messageTime > latestLoadedTime;
            if (messageId != "" && !existingIds.has(messageId) && isNewerThanLoaded) {
              existingIds.add(messageId);
              latestMessages.push(message);
            }
          });
          return latestMessages;
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/message/message.uvue:175", "检查新消息失败:", error);
          return [];
        } finally {
          isCheckingNewMessages.value = false;
        }
      });
    }
    function checkNewMessages() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!isPageActive.value || isListLoading.value || isCheckingNewMessages.value)
          return Promise.resolve(null);
        const latestMessages = yield findLatestMessages();
        if (latestMessages.length > 0) {
          pendingNewMessages.value = [...pendingNewMessages.value, ...latestMessages];
          hasNewMessages.value = true;
          newMessageCount.value = pendingNewMessages.value.length;
          vibrateAlert();
        }
      });
    }
    function startNewMessageCheck() {
      if (checkTimer > 0) {
        stopNewMessageCheck();
      }
      common_vendor.index.__f__("log", "at pages/message/message.uvue:200", "启动定时消息检查");
      checkTimer = setInterval(() => {
        if (isPageActive.value) {
          common_vendor.index.__f__("log", "at pages/message/message.uvue:204", "定时检查新消息...");
          void checkNewMessages();
        }
      }, NEW_MESSAGE_CHECK_INTERVAL);
    }
    function pauseNewMessageCheckWhileScrolling() {
      stopNewMessageCheck();
      stopScrollResumeTimer();
      scrollResumeTimer = setTimeout(() => {
        scrollResumeTimer = null;
        if (!isPageActive.value)
          return null;
        startNewMessageCheck();
        void checkNewMessages();
      }, SCROLL_RESUME_DELAY);
    }
    function loadMsgList(isInit = false) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (isListLoading.value || isCheckingNewMessages.value)
          return false;
        if (isInit) {
          currPage.value = 1;
          msgList.value = [];
          hasLoadedInitial.value = false;
          pendingNewMessages.value = [];
          hasNewMessages.value = false;
          newMessageCount.value = 0;
          messageScrollTop.value = 0;
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
          if (!api_response.isBusinessSuccessCode(res.code)) {
            loadStatus.value = "loadmore";
            return false;
          }
          const data = res.data;
          if (data == null) {
            totalPage.value = currPage.value;
            loadStatus.value = "nomore";
            if (isInit) {
              hasLoadedInitial.value = true;
              pendingNewMessages.value = [];
              hasNewMessages.value = false;
              newMessageCount.value = 0;
            }
            return true;
          }
          const totalPages = data.totalPage > 0 ? data.totalPage : 1;
          totalPage.value = totalPages;
          const newData = data.list;
          const isEmptyInitial = isInit && newData.length == 0;
          if (isInit) {
            msgList.value = newData;
            hasLoadedInitial.value = true;
            pendingNewMessages.value = [];
            hasNewMessages.value = false;
            newMessageCount.value = 0;
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
          return true;
        } catch (error) {
          loadStatus.value = "loadmore";
          common_vendor.index.__f__("error", "at pages/message/message.uvue:280", "请求异常:", error);
          return false;
        } finally {
          isListLoading.value = false;
        }
      });
    }
    function loadNewMessages() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (isListLoading.value || isCheckingNewMessages.value)
          return Promise.resolve(null);
        common_vendor.index.__f__("log", "at pages/message/message.uvue:290", "加载新消息");
        yield checkNewMessages();
        if (pendingNewMessages.value.length > 0) {
          msgList.value = [...pendingNewMessages.value, ...msgList.value];
          pendingNewMessages.value = [];
          messageScrollTop.value = 1;
          yield common_vendor.nextTick$1();
          messageScrollTop.value = 0;
        }
        hasNewMessages.value = false;
        newMessageCount.value = 0;
        common_vendor.index.__f__("log", "at pages/message/message.uvue:301", "新消息加载完成");
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
            if (api_response.isBusinessSuccessCode(res.code)) {
              const index = msgList.value.findIndex((message) => {
                return message.getString("messageId", "") == messageId;
              });
              if (index != -1) {
                msgList.value[index].set("status", 0);
                msgList.value = [...msgList.value];
              }
            }
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/message/message.uvue:344", "更新状态失败:", error);
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
      stopScrollResumeTimer();
    };
    const resumePageLifecycle = () => {
      stopScrollResumeTimer();
      isPageActive.value = true;
      startNewMessageCheck();
      void openPendingPushMessage();
      void checkNewMessages();
    };
    common_vendor.onShow(() => {
      if (!Login.value)
        return null;
      common_vendor.index.__f__("log", "at pages/message/message.uvue:382", "页面显示 - 启动自动刷新");
      measureMessageScrollViewport();
      resumePageLifecycle();
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:388", "页面隐藏 - 停止自动刷新");
      finishPageLifecycle();
    });
    common_vendor.onUnload(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:393", "页面卸载 - 清理资源");
      finishPageLifecycle();
    });
    common_vendor.onActivated(() => {
      if (!Login.value)
        return null;
      common_vendor.index.__f__("log", "at pages/message/message.uvue:399", "页面激活 - 启动自动刷新");
      resumePageLifecycle();
    });
    common_vendor.onDeactivated(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:404", "页面停用 - 停止自动刷新");
      finishPageLifecycle();
    });
    const onRefresherRefresh = () => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:410", "下拉刷新触发");
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
      pauseNewMessageCheckWhileScrolling();
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
        b: hasNewMessages.value
      }, hasNewMessages.value ? {
        c: common_vendor.t(newMessageCount.value),
        d: common_vendor.o(loadNewMessages, "2f")
      } : {}, {
        e: isInitialLoading.value
      }, isInitialLoading.value ? {} : isMessageListEmpty.value ? {} : {}, {
        f: isMessageListEmpty.value,
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
        l: messageScrollTop.value,
        m: refresherTriggered.value,
        n: common_vendor.o(onRefresherRefresh, "b8"),
        o: common_vendor.o(onScrollToLower, "43"),
        p: common_vendor.o(onMessageScroll, "9f"),
        q: common_vendor.o(ReadIt, "b3"),
        r: common_vendor.p({
          show: modal.value,
          title: getMessageTypeText(modalContent.value.getNumber("messageType", 0)),
          content: modalContent.value.getString("content", "")
        }),
        s: `${_ctx.u_s_b_h}px`,
        t: `${_ctx.u_s_a_i_b}px`
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
