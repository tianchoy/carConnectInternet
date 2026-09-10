"use strict";
const common_vendor = require("../../common/vendor.js");
const api_request = require("../../api/request.js");
const utils_toast = require("../../utils/toast.js");
const utils_modal = require("../../utils/modal.js");
if (!Array) {
  const _easycom_custom_navBar_1 = common_vendor.resolveComponent("custom-navBar");
  const _easycom_app_toast_1 = common_vendor.resolveComponent("app-toast");
  const _easycom_app_modal_1 = common_vendor.resolveComponent("app-modal");
  (_easycom_custom_navBar_1 + _easycom_app_toast_1 + _easycom_app_modal_1)();
}
const _easycom_custom_navBar = () => "../../components/custom-navBar/custom-navBar.js";
const _easycom_app_toast = () => "../../components/app-toast/app-toast.js";
const _easycom_app_modal = () => "../../components/app-modal/app-modal.js";
if (!Math) {
  (_easycom_custom_navBar + _easycom_app_toast + _easycom_app_modal)();
}
const requestPageSize = 10;
const permanentExpireDate = "2099-12-31";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "deviceShare",
  setup(__props) {
    const enabled = common_vendor.ref(false);
    const loadingEnabled = common_vendor.ref(true);
    const deviceId = common_vendor.ref("");
    const deviceName = common_vendor.ref("");
    const imei = common_vendor.ref("");
    const targetPhone = common_vendor.ref("");
    const expireDate = common_vendor.ref("");
    const submitting = common_vendor.ref(false);
    const sentShares = common_vendor.ref([]);
    const sentTotalCount = common_vendor.ref(0);
    const sentPage = common_vendor.ref(1);
    const sentHasMore = common_vendor.ref(false);
    const sentLoading = common_vendor.ref(false);
    const sharees = common_vendor.ref([]);
    const shareesVisible = common_vendor.ref(false);
    const shareesLoading = common_vendor.ref(false);
    const normalizeRouteValue = (value = null) => {
      if (value == null)
        return "";
      const text = value.toString().trim();
      if (text == "" || text == "null" || text == "undefined")
        return "";
      try {
        const decoded = decodeURIComponent(text);
        return decoded == null ? text : decoded.trim();
      } catch (error) {
        return text;
      }
    };
    const displayDeviceName = common_vendor.computed(() => {
      if (deviceName.value != "" && deviceName.value != "null" && deviceName.value != "undefined")
        return deviceName.value;
      if (imei.value != "" && imei.value != "null" && imei.value != "undefined")
        return imei.value;
      return "--";
    });
    const canSubmit = common_vendor.computed(() => {
      return targetPhone.value.trim() != "";
    });
    common_vendor.computed(() => {
      const now = /* @__PURE__ */ new Date();
      const month = (now.getMonth() + 1).toString().padStart(2, "0");
      const day = now.getDate().toString().padStart(2, "0");
      return `${now.getFullYear()}-${month}-${day}`;
    });
    const displayDevice = (item) => {
      const name = item.getString("deviceName", "");
      if (name != "")
        return name;
      const plate = item.getString("plateNo", "");
      if (plate != "")
        return plate;
      return item.getString("deviceId", "设备");
    };
    const getSharePerson = (item, nameKey, phoneKey) => {
      const name = item.getString(nameKey, "");
      if (name != "")
        return name;
      if (phoneKey != "") {
        const phone = item.getString(phoneKey, "");
        if (phone != "")
          return phone;
      }
      return "--";
    };
    const statusText = (status) => {
      if (status == "active")
        return "生效中";
      if (status == "exited")
        return "已退出";
      if (status == "revoked")
        return "已撤销";
      if (status == "expired")
        return "已过期";
      return status != "" ? status : "未知状态";
    };
    const statusClass = (status) => {
      return status == "active" ? "status-active" : "status-inactive";
    };
    const formatTimestamp = (timestamp) => {
      if (timestamp <= 0)
        return "--";
      const date = new Date(timestamp * 1e3);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    };
    const formatExpireTime = (item) => {
      const value = item["expireTime"];
      return value == null || value <= 0 ? "永久" : formatTimestamp(value);
    };
    const loadSent = (reset) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (sentLoading.value)
          return Promise.resolve(null);
        if (reset) {
          sentPage.value = 1;
          sentHasMore.value = false;
          sentShares.value = [];
          sentTotalCount.value = 0;
        }
        sentLoading.value = true;
        try {
          const res = yield api_request.getDeviceSharees(deviceId.value, new common_vendor.UTSJSONObject({ pageNum: sentPage.value, pageSize: requestPageSize }));
          if (res.code != 200) {
            utils_toast.showAppToast({ title: res.msg || "获取分享列表失败", icon: "none" });
            return Promise.resolve(null);
          }
          const data = res.data;
          sentTotalCount.value = data.totalCount;
          sentShares.value = reset ? data.list : [...sentShares.value, ...data.list];
          const currentPage = data.currPage > 0 ? data.currPage : sentPage.value;
          const totalPage = data.totalPage > 0 ? data.totalPage : 1;
          sentHasMore.value = currentPage < totalPage;
          if (sentHasMore.value)
            sentPage.value = currentPage + 1;
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/deviceShare/deviceShare.uvue:195", "获取发起分享列表失败:", error);
          utils_toast.showAppToast({ title: "获取分享列表失败，请重试", icon: "none" });
        } finally {
          sentLoading.value = false;
        }
      });
    };
    const submitShare = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (submitting.value)
          return Promise.resolve(null);
        if (deviceId.value == "") {
          utils_toast.showAppToast({ title: "设备ID不能为空", icon: "none" });
          return Promise.resolve(null);
        }
        const phone = targetPhone.value.trim();
        if (phone == "") {
          utils_toast.showAppToast({ title: "请填写手机号", icon: "none" });
          return Promise.resolve(null);
        }
        if (!/^1[3-9]\d{9}$/.test(phone)) {
          utils_toast.showAppToast({ title: "请输入正确的手机号", icon: "none" });
          return Promise.resolve(null);
        }
        const dateValue = expireDate.value == "" ? permanentExpireDate : expireDate.value;
        const expireTime = Math.floor((/* @__PURE__ */ new Date(`${dateValue}T23:59:59`)).getTime() / 1e3);
        if (expireTime <= Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3)) {
          utils_toast.showAppToast({ title: "到期时间必须晚于当前时间", icon: "none" });
          return Promise.resolve(null);
        }
        submitting.value = true;
        try {
          const res = yield api_request.createDeviceShare(new api_request.DeviceShareCreateRequest({
            targetUserNo: null,
            role: null,
            deviceId: deviceId.value,
            targetPhone: phone,
            expireTime
          }));
          if (res.code == 200) {
            utils_toast.showAppToast({ title: "分享成功", icon: "success" });
            targetPhone.value = "";
            expireDate.value = "";
            yield loadSent(true);
          } else {
            utils_toast.showAppToast({ title: res.msg || "分享失败", icon: "none" });
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/deviceShare/deviceShare.uvue:245", "发起设备分享失败:", error);
          utils_toast.showAppToast({ title: "分享失败，请重试", icon: "none" });
        } finally {
          submitting.value = false;
        }
      });
    };
    const revokeShare = (shareId) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        if (shareId == "")
          return Promise.resolve(null);
        try {
          const res = yield api_request.revokeDeviceShare(shareId);
          if (res.code == 200) {
            utils_toast.showAppToast({ title: "撤销成功", icon: "success" });
            yield loadSent(true);
          } else
            utils_toast.showAppToast({ title: res.msg || "撤销失败", icon: "none" });
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/deviceShare/deviceShare.uvue:261", "撤销设备分享失败:", error);
          utils_toast.showAppToast({ title: "撤销失败，请重试", icon: "none" });
        }
      });
    };
    const confirmRevoke = (item) => {
      utils_modal.showAppModal(new common_vendor.UTSJSONObject({
        title: "撤销分享",
        content: `确定撤销“${displayDevice(item)}”的分享吗？`,
        showCancel: true,
        success: (result) => {
          if (result.confirm)
            void revokeShare(item.getString("shareId", ""));
        }
      }));
    };
    const showSharees = (item) => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        sharees.value = [];
        shareesVisible.value = true;
        shareesLoading.value = true;
        try {
          const res = yield api_request.getDeviceSharees(item.getString("deviceId", ""), new common_vendor.UTSJSONObject({ pageNum: 1, pageSize: requestPageSize }));
          if (res.code == 200)
            sharees.value = res.data.list;
          else
            utils_toast.showAppToast({ title: res.msg || "获取被分享者失败", icon: "none" });
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/deviceShare/deviceShare.uvue:282", "获取被分享者失败:", error);
          utils_toast.showAppToast({ title: "获取被分享者失败，请重试", icon: "none" });
        } finally {
          shareesLoading.value = false;
        }
      });
    };
    const loadMore = () => {
      if (sentHasMore.value)
        void loadSent(false);
    };
    const initializeDeviceShare = () => {
      return common_vendor.__awaiter(this, void 0, void 0, function* () {
        try {
          const res = yield api_request.getDeviceShareEnabled();
          if (res.code == 200) {
            enabled.value = res.data.getBoolean("enabled", false);
          } else {
            utils_toast.showAppToast({ title: res.msg || "获取分享开关失败", icon: "none" });
          }
          if (enabled.value)
            yield loadSent(true);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/deviceShare/deviceShare.uvue:302", "初始化设备分享失败:", error);
          utils_toast.showAppToast({ title: "加载分享功能失败，请重试", icon: "none" });
        } finally {
          loadingEnabled.value = false;
        }
      });
    };
    common_vendor.onLoad((options) => {
      var _a, _b, _c;
      deviceId.value = normalizeRouteValue((_a = options.deviceId) !== null && _a !== void 0 ? _a : "");
      deviceName.value = normalizeRouteValue((_b = options.deviceName) !== null && _b !== void 0 ? _b : "");
      imei.value = normalizeRouteValue((_c = options.imei) !== null && _c !== void 0 ? _c : "");
      common_vendor.index.__f__("log", "at pages/deviceShare/deviceShare.uvue:313", "imei:", imei.value, deviceName.value);
      void initializeDeviceShare();
    });
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: common_vendor.p({
          title: "设备分享",
          ["show-back"]: true,
          backgroundColor: "#fff",
          textColor: "#333",
          showCapsule: false,
          class: "data-v-19696bd2"
        }),
        b: loadingEnabled.value
      }, loadingEnabled.value ? {} : !enabled.value ? {} : common_vendor.e({
        d: common_vendor.t(displayDeviceName.value),
        e: targetPhone.value,
        f: common_vendor.o(($event) => {
          return targetPhone.value = $event.detail.value;
        }, "92"),
        g: expireDate.value == ""
      }, expireDate.value == "" ? {} : {}, {
        h: common_vendor.t(submitting.value ? "提交中..." : "确认分享"),
        i: submitting.value || !canSubmit.value ? 1 : "",
        j: submitting.value || !canSubmit.value,
        k: common_vendor.o(submitShare, "6d"),
        l: common_vendor.t(sentTotalCount.value),
        m: sentLoading.value && sentShares.value.length == 0
      }, sentLoading.value && sentShares.value.length == 0 ? {} : sentShares.value.length == 0 ? {} : {}, {
        n: sentShares.value.length == 0,
        o: common_vendor.f(sentShares.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(displayDevice(item)),
            b: common_vendor.t(item.getString("plateNo", "")),
            c: common_vendor.t(statusText(item.getString("status", ""))),
            d: common_vendor.n(statusClass(item.getString("status", ""))),
            e: common_vendor.t(getSharePerson(item, "targetNickName", "targetPhoneMasked")),
            f: common_vendor.t(item.getString("role", "view")),
            g: common_vendor.t(formatTimestamp(item.getNumber("shareTime", 0))),
            h: common_vendor.t(formatExpireTime(item)),
            i: common_vendor.o(($event) => {
              return showSharees(item);
            }, item.getString("shareId", "")),
            j: item.getString("status", "") == "active"
          }, item.getString("status", "") == "active" ? {
            k: common_vendor.o(($event) => {
              return confirmRevoke(item);
            }, item.getString("shareId", ""))
          } : {}, {
            l: item.getString("shareId", "")
          });
        }),
        p: sentHasMore.value
      }, sentHasMore.value ? {
        q: common_vendor.t(sentLoading.value ? "加载中..." : "加载更多"),
        r: sentLoading.value,
        s: common_vendor.o(loadMore, "d3")
      } : {}), {
        c: !enabled.value,
        t: common_vendor.o(loadMore, "88"),
        v: shareesVisible.value
      }, shareesVisible.value ? common_vendor.e({
        w: common_vendor.o(($event) => {
          return shareesVisible.value = false;
        }, "cd"),
        x: shareesLoading.value
      }, shareesLoading.value ? {} : sharees.value.length == 0 ? {} : {}, {
        y: sharees.value.length == 0,
        z: common_vendor.f(sharees.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(getSharePerson(item, "targetNickName", "")),
            b: common_vendor.t(item.getString("targetPhoneMasked", "")),
            c: common_vendor.t(statusText(item.getString("status", ""))),
            d: common_vendor.n(statusClass(item.getString("status", ""))),
            e: item.getString("shareId", "")
          };
        }),
        A: common_vendor.o(() => {
        }, "bc"),
        B: common_vendor.o(($event) => {
          return shareesVisible.value = false;
        }, "55")
      }) : {}, {
        C: `${_ctx.u_s_b_h}px`,
        D: `${_ctx.u_s_a_i_b}px`,
        E: common_vendor.p({
          class: "data-v-19696bd2"
        }),
        F: common_vendor.p({
          class: "data-v-19696bd2"
        })
      });
      return __returned__;
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-19696bd2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/deviceShare/deviceShare.js.map
