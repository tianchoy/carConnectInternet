"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
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
class ModalInstance extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          open: { type: "Unknown", optional: false },
          close: { type: "Unknown", optional: false }
        };
      },
      name: "ModalInstance"
    };
  }
  constructor(options, metadata = ModalInstance.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.open = this.__props__.open;
    this.close = this.__props__.close;
    delete this.__props__;
  }
}
class MessageData extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          list: { type: "Unknown", optional: false },
          total: { type: Number, optional: false },
          totalPage: { type: Number, optional: false }
        };
      },
      name: "MessageData"
    };
  }
  constructor(options, metadata = MessageData.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.list = this.__props__.list;
    this.total = this.__props__.total;
    this.totalPage = this.__props__.totalPage;
    delete this.__props__;
  }
}
class MessageResponse extends common_vendor.UTS.UTSType {
  static get$UTSMetadata$() {
    return {
      kind: 2,
      get fields() {
        return {
          code: { type: Number, optional: false },
          msg: { type: String, optional: false },
          data: { type: MessageData, optional: false }
        };
      },
      name: "MessageResponse"
    };
  }
  constructor(options, metadata = MessageResponse.get$UTSMetadata$(), isJSONParse = false) {
    super();
    this.__props__ = common_vendor.UTS.UTSType.initProps(options, metadata, isJSONParse);
    this.code = this.__props__.code;
    this.msg = this.__props__.msg;
    this.data = this.__props__.data;
    delete this.__props__;
  }
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
    const isLoading = common_vendor.ref(false);
    const hasNewMessages = common_vendor.ref(false);
    const newMessageCount = common_vendor.ref(0);
    const lastUpdateTime = common_vendor.ref((/* @__PURE__ */ new Date()).getTime());
    const Login = common_vendor.ref(false);
    const messageScrollViewportHeight = common_vendor.ref(0);
    const isNearMessageListBottom = common_vendor.ref(false);
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
        if (isLoading.value)
          return 0;
        isLoading.value = true;
        try {
          const res = yield api_request.getUserMsgList(new common_vendor.UTSJSONObject({ page: 1, pageSize: 50 }));
          if (res.code != 0 || res.data.list == null)
            return 0;
          const existingIds = /* @__PURE__ */ new Set();
          msgList.value.forEach((message) => {
            const messageId = message.getString("messageId", "");
            if (messageId != "")
              existingIds.add(messageId);
          });
          const latestMessages = [];
          res.data.list.forEach((message) => {
            const messageId = message.getString("messageId", "");
            if (messageId != "" && !existingIds.has(messageId)) {
              existingIds.add(messageId);
              latestMessages.push(message);
            }
          });
          if (latestMessages.length > 0) {
            msgList.value = [...latestMessages, ...msgList.value];
            const newestCreateTime = latestMessages[0].getString("createTime", "");
            if (newestCreateTime != "") {
              lastUpdateTime.value = new Date(newestCreateTime.replace(/-/g, "/")).getTime();
            }
          }
          return latestMessages.length;
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/message/message.uvue:149", "检查新消息失败:", error);
          return 0;
        } finally {
          isLoading.value = false;
        }
      });
    }
    function checkNewMessages() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!isPageActive.value || isLoading.value)
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
      common_vendor.index.__f__("log", "at pages/message/message.uvue:173", "启动定时消息检查");
      checkTimer = setInterval(() => {
        if (isPageActive.value) {
          common_vendor.index.__f__("log", "at pages/message/message.uvue:177", "定时检查新消息...");
          checkNewMessages();
        }
      }, 1e4);
    }
    function loadMsgList(isInit = false) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (isLoading.value)
          return Promise.resolve(null);
        if (isInit) {
          currPage.value = 1;
          msgList.value = [];
          loadStatus.value = "loadmore";
          isNearMessageListBottom.value = false;
        }
        isLoading.value = true;
        try {
          if (!isInit)
            loadStatus.value = "loading";
          const res = yield api_request.getUserMsgList(new common_vendor.UTSJSONObject({
            page: currPage.value,
            pageSize: pageSize.value
          }));
          if (res.code != 0) {
            loadStatus.value = "loadmore";
            return Promise.resolve(null);
          }
          const data = res.data;
          const totalPages = data.totalPage > 0 ? data.totalPage : 1;
          totalPage.value = totalPages;
          const newData = data.list;
          if (isInit) {
            msgList.value = newData;
            if (newData.length > 0)
              lastUpdateTime.value = (/* @__PURE__ */ new Date()).getTime();
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
          loadStatus.value = currPage.value >= totalPage.value ? "nomore" : "loadmore";
          if (isInit) {
            hasNewMessages.value = false;
            newMessageCount.value = 0;
          }
        } catch (error) {
          loadStatus.value = "loadmore";
          common_vendor.index.__f__("error", "at pages/message/message.uvue:225", "请求异常:", error);
        } finally {
          isLoading.value = false;
        }
      });
    }
    function loadNewMessages() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:233", "加载新消息");
        yield prependLatestMessages();
        hasNewMessages.value = false;
        newMessageCount.value = 0;
        common_vendor.index.__f__("log", "at pages/message/message.uvue:237", "新消息加载完成");
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
    common_vendor.onShow(() => {
      if (Login.value) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:272", "页面显示 - 启动自动刷新");
        isPageActive.value = true;
        measureMessageScrollViewport();
        startNewMessageCheck();
        checkNewMessages();
      }
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:283", "页面隐藏 - 停止自动刷新");
      if (Login.value) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:285", "页面隐藏 - 停止自动刷新");
        isPageActive.value = false;
        stopNewMessageCheck();
      }
    });
    common_vendor.onUnload(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:293", "页面卸载 - 清理资源");
      if (Login.value) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:295", "页面卸载 - 清理资源");
        isPageActive.value = false;
        stopNewMessageCheck();
      }
    });
    common_vendor.onActivated(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:302", "页面激活 - 启动自动刷新");
      if (Login.value) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:304", "页面激活 - 启动自动刷新");
        isPageActive.value = true;
        startNewMessageCheck();
        checkNewMessages();
      }
    });
    common_vendor.onDeactivated(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:313", "页面停用 - 停止自动刷新");
      if (Login.value) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:315", "页面停用 - 停止自动刷新");
        isPageActive.value = false;
        stopNewMessageCheck();
      }
    });
    const onRefresherRefresh = () => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:323", "下拉刷新触发");
      refresherTriggered.value = true;
      loadMsgList(true).then(() => {
        refresherTriggered.value = false;
      }).catch(() => {
        refresherTriggered.value = false;
      });
    };
    const loadMore = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (isLoading.value || loadStatus.value != "loadmore" || currPage.value >= totalPage.value) {
          if (currPage.value >= totalPage.value) {
            loadStatus.value = "nomore";
          }
          return Promise.resolve(null);
        }
        currPage.value++;
        yield loadMsgList();
      });
    };
    const onScrollToLower = () => {
      if (loadStatus.value == "loadmore" && !isLoading.value) {
        loadMore();
      }
    };
    const onMessageScroll = (event) => {
    };
    const handleItemClick = (item) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        modalContent.value = item;
        modal.value = true;
        if (item.getNumber("status", 0) == 1) {
          try {
            const messageId = item.getString("messageId", "");
            const res = yield api_request.setMsgState(messageId);
            if (res.code == 0 || res.msg == "success") {
              const index = msgList.value.findIndex((message) => {
                return message.getString("messageId", "") == messageId;
              });
              if (index != -1) {
                msgList.value[index].set("status", 0);
                msgList.value = [...msgList.value];
              }
            }
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/message/message.uvue:385", "更新状态失败:", error);
          }
        }
      });
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
        const date = new Date(timeString.replace(/-/g, "/"));
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
        b: msgList.value.length == 0 && !isLoading.value
      }, msgList.value.length == 0 && !isLoading.value ? {} : {}, {
        c: hasNewMessages.value
      }, hasNewMessages.value ? {
        d: common_vendor.t(newMessageCount.value),
        e: common_vendor.o(loadNewMessages, "c6")
      } : {}, {
        f: common_vendor.f(msgList.value, (item, index, i0) => {
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
        g: Login.value
      }, Login.value ? common_vendor.e({
        h: loadStatus.value == "loading"
      }, loadStatus.value == "loading" ? {} : loadStatus.value == "nomore" ? {} : {}, {
        i: loadStatus.value == "nomore"
      }) : {}, {
        j: common_vendor.sei("message-scroll-container", "scroll-view"),
        k: refresherTriggered.value,
        l: common_vendor.o(onRefresherRefresh, "3c"),
        m: common_vendor.o(onScrollToLower, "5b"),
        n: common_vendor.o(onMessageScroll, "00"),
        o: common_vendor.o(ReadIt, "66"),
        p: common_vendor.p({
          show: modal.value,
          title: getMessageTypeText(modalContent.value.getNumber("messageType", 0)),
          content: modalContent.value.getString("content", "")
        }),
        q: `${_ctx.u_s_b_h}px`,
        r: `${_ctx.u_s_a_i_b}px`
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
