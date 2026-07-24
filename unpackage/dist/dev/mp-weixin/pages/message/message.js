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
    let checkTimer = 0;
    const isPageActive = common_vendor.ref(false);
    function stopNewMessageCheck() {
      if (checkTimer > 0) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:100", "停止定时消息检查");
        clearInterval(checkTimer);
        checkTimer = 0;
      }
    }
    function vibrateAlert() {
      for (let i = 0; i < 3; i++) {
        common_vendor.index.vibrateLong(new common_vendor.UTSJSONObject({}));
      }
    }
    function checkNewMessages() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (!isPageActive.value || isLoading.value)
          return Promise.resolve(null);
        try {
          const res = yield api_request.getUserMsgList(new common_vendor.UTSJSONObject({ page: 1, pageSize: 1 }));
          const code = res.code;
          if (code != 0)
            return Promise.resolve(null);
          const data = res.data;
          const list = data.list;
          if (list == null || list.length == 0)
            return Promise.resolve(null);
          const latestMessage = list[0];
          const createTime = latestMessage.getString("createTime", "");
          if (createTime == "")
            return Promise.resolve(null);
          const messageTime = new Date(createTime).getTime();
          if (messageTime <= lastUpdateTime.value)
            return Promise.resolve(null);
          hasNewMessages.value = true;
          vibrateAlert();
          const countRes = yield api_request.getUserMsgList(new common_vendor.UTSJSONObject({ page: 1, pageSize: 50 }));
          const newList = countRes.data.list;
          if (newList != null) {
            let count = 0;
            newList.forEach((message) => {
              if (new Date(message.getString("createTime", "")).getTime() > lastUpdateTime.value)
                count++;
            });
            newMessageCount.value = count;
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/message/message.uvue:140", "检查新消息失败:", error);
        }
      });
    }
    function startNewMessageCheck() {
      if (checkTimer > 0) {
        stopNewMessageCheck();
      }
      common_vendor.index.__f__("log", "at pages/message/message.uvue:150", "启动定时消息检查");
      checkTimer = setInterval(() => {
        if (isPageActive.value) {
          common_vendor.index.__f__("log", "at pages/message/message.uvue:154", "定时检查新消息...");
          checkNewMessages();
        }
      }, 1e4);
    }
    function loadMsgList(isInit = false) {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (isInit) {
          currPage.value = 1;
          msgList.value = [];
          loadStatus.value = "loadmore";
        }
        if (isLoading.value)
          return Promise.resolve(null);
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
          common_vendor.index.__f__("error", "at pages/message/message.uvue:201", "请求异常:", error);
        } finally {
          isLoading.value = false;
        }
      });
    }
    function loadNewMessages() {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:209", "加载新消息");
        yield loadMsgList(true);
        hasNewMessages.value = false;
        newMessageCount.value = 0;
        lastUpdateTime.value = (/* @__PURE__ */ new Date()).getTime();
        common_vendor.index.__f__("log", "at pages/message/message.uvue:214", "新消息加载完成");
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
    common_vendor.onShow(() => {
      if (Login.value) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:238", "页面显示 - 启动自动刷新");
        isPageActive.value = true;
        startNewMessageCheck();
        checkNewMessages();
      }
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:248", "页面隐藏 - 停止自动刷新");
      if (Login.value) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:250", "页面隐藏 - 停止自动刷新");
        isPageActive.value = false;
        stopNewMessageCheck();
      }
    });
    common_vendor.onUnload(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:258", "页面卸载 - 清理资源");
      if (Login.value) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:260", "页面卸载 - 清理资源");
        isPageActive.value = false;
        stopNewMessageCheck();
      }
    });
    common_vendor.onActivated(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:267", "页面激活 - 启动自动刷新");
      if (Login.value) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:269", "页面激活 - 启动自动刷新");
        isPageActive.value = true;
        startNewMessageCheck();
        checkNewMessages();
      }
    });
    common_vendor.onDeactivated(() => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:278", "页面停用 - 停止自动刷新");
      if (Login.value) {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:280", "页面停用 - 停止自动刷新");
        isPageActive.value = false;
        stopNewMessageCheck();
      }
    });
    const onRefresherRefresh = () => {
      common_vendor.index.__f__("log", "at pages/message/message.uvue:288", "下拉刷新触发");
      refresherTriggered.value = true;
      loadMsgList(true).then(() => {
        refresherTriggered.value = false;
      }).catch(() => {
        refresherTriggered.value = false;
      });
    };
    const loadMore = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        common_vendor.index.__f__("log", "at pages/message/message.uvue:299", "准备加载更多 - 当前页:", currPage.value, "总页数:", totalPage.value);
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
      common_vendor.index.__f__("log", "at pages/message/message.uvue:313", "滚动到底部 - 当前页:", currPage.value, "总页数:", totalPage.value);
      if (loadStatus.value == "loadmore" && !isLoading.value) {
        loadMore();
      }
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
            common_vendor.index.__f__("error", "at pages/message/message.uvue:337", "更新状态失败:", error);
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
        e: common_vendor.o(loadNewMessages, "47")
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
        j: refresherTriggered.value,
        k: common_vendor.o(onRefresherRefresh, "4b"),
        l: common_vendor.o(onScrollToLower, "fb"),
        m: common_vendor.o(ReadIt, "7c"),
        n: common_vendor.p({
          show: modal.value,
          title: getMessageTypeText(modalContent.value.getNumber("messageType", 0)),
          content: modalContent.value.getString("content", "")
        }),
        o: `${_ctx.u_s_b_h}px`,
        p: `${_ctx.u_s_a_i_b}px`
      });
      return __returned__;
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
