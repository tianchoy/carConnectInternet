"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_toast = require("../../utils/toast.js");
require("../../api/request.js");
require("../../utils/device.js");
if (!Array) {
  const _easycom_i_tag_1 = common_vendor.resolveComponent("i-tag");
  const _easycom_i_modal_1 = common_vendor.resolveComponent("i-modal");
  (_easycom_i_tag_1 + _easycom_i_modal_1)();
}
const _easycom_i_tag = () => "../../uni_modules/i-ui-x/components/i-tag/i-tag.js";
const _easycom_i_modal = () => "../../uni_modules/i-ui-x/components/i-modal/i-modal.js";
if (!Math) {
  (_easycom_i_tag + _easycom_i_modal)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "indexListMode",
  props: {
    lists: {}
  },
  emits: ["unbindDevice"],
  setup(__props, _a) {
    var __emit = _a.emit;
    const props = __props;
    const emit = __emit;
    const modal = common_vendor.ref(false);
    const imeis = common_vendor.ref("");
    const needRefresh = common_vendor.ref(false);
    const pay = (iccid, simMerchant) => {
      if (simMerchant.toLowerCase() == "zddx") {
        iccid = iccid.substring(0, iccid.length - 1);
      }
      common_vendor.index.__f__("log", "at components/indexListMode/indexListMode.uvue:52", iccid);
      needRefresh.value = true;
      common_vendor.index.openEmbeddedMiniProgram(new common_vendor.UTSJSONObject({
        appId: "wx1d647f2cfdc089e6",
        path: "/pages/home/userSimRecharge?iccid=" + iccid,
        envVersion: "release",
        success(res = null) {
          common_vendor.index.__f__("log", "at components/indexListMode/indexListMode.uvue:64", "打开小程序成功", res);
        },
        fail(res = null) {
          common_vendor.index.__f__("log", "at components/indexListMode/indexListMode.uvue:68", "打开小程序失败", res);
          needRefresh.value = false;
          utils_toast.showAppToast({
            title: "打开支付页面失败",
            icon: "none"
          });
        }
      }));
    };
    const unbindDevice = (imei) => {
      imeis.value = imei;
      modal.value = true;
    };
    const confirm = () => {
      emit("unbindDevice", imeis.value);
      modal.value = false;
    };
    const cancel = () => {
      modal.value = false;
    };
    const todetail = (companyId, imei, deviceId) => {
      common_vendor.index.navigateTo({
        url: "/pages/carInfoDetail/carInfoDetail?deptId=" + companyId + "&imei=" + imei + "&deviceId=" + deviceId
      });
    };
    return (_ctx, _cache) => {
      "raw js";
      const __returned__ = common_vendor.e({
        a: props.lists.length != 0
      }, props.lists.length != 0 ? {
        b: common_vendor.f(props.lists, (item, index, i0) => {
          return {
            a: common_vendor.t(item.deviceName || item.imei),
            b: "245c735a-0-" + i0,
            c: common_vendor.p({
              size: "mini",
              shape: "circle",
              text: item.connectionStatus == "online" ? "在线" : "离线",
              type: item.connectionStatus == "online" ? "success" : "error",
              class: "car-status-spacing"
            }),
            d: common_vendor.o(($event) => {
              return pay(item.iccid, item.simMerchant);
            }, index),
            e: "245c735a-1-" + i0,
            f: common_vendor.o(($event) => {
              return unbindDevice(item.imei);
            }, index),
            g: "245c735a-2-" + i0,
            h: common_vendor.t(item.imei),
            i: index,
            j: common_vendor.o(($event) => {
              return todetail(item.companyId, item.imei, item.deviceId);
            }, index)
          };
        }),
        c: common_vendor.p({
          text: "充值",
          type: "success"
        }),
        d: common_vendor.p({
          text: "解绑",
          type: "warning",
          class: "device-tool-spacing"
        })
      } : {}, {
        e: common_vendor.o(confirm, "16"),
        f: common_vendor.o(cancel, "2f"),
        g: common_vendor.p({
          show: common_vendor.unref(modal),
          title: "提示",
          content: "是否要解绑设备？",
          buttonReverse: true,
          align: "center",
          confirmText: "确定",
          cancelText: "取消",
          showCancelButton: true
        }),
        h: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        i: `${_ctx.u_s_b_h}px`,
        j: `${_ctx.u_s_a_i_b}px`,
        k: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/indexListMode/indexListMode.js.map
