"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../api/http.js");
if (!Array) {
  const _easycom_uv_tags_1 = common_vendor.resolveComponent("uv-tags");
  const _easycom_uv_modal_1 = common_vendor.resolveComponent("uv-modal");
  (_easycom_uv_tags_1 + _easycom_uv_modal_1)();
}
const _easycom_uv_tags = () => "../../uni_modules/uv-tags/components/uv-tags/uv-tags.js";
const _easycom_uv_modal = () => "../../uni_modules/uv-modal/components/uv-modal/uv-modal.js";
if (!Math) {
  (_easycom_uv_tags + _easycom_uv_modal)();
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
    const modal = common_vendor.ref();
    const imeis = common_vendor.ref("");
    const needRefresh = common_vendor.ref(false);
    const pay = (iccid, simMerchant) => {
      if (simMerchant.toLowerCase() == "zddx") {
        iccid = iccid.substring(0, iccid.length - 1);
      }
      console.log(iccid);
      needRefresh.value = true;
      common_vendor.wx$1.openEmbeddedMiniProgram(new common_vendor.UTSJSONObject({
        appId: "wx1d647f2cfdc089e6",
        path: "/pages/home/userSimRecharge?iccid=" + iccid,
        envVersion: "release",
        success(res = null) {
          console.log("打开小程序成功", res);
        },
        fail(res = null) {
          console.log("打开小程序失败", res);
          needRefresh.value = false;
          common_vendor.index.showToast({
            title: "打开支付页面失败",
            icon: "none"
          });
        }
      }));
    };
    const unbindDevice = (imei) => {
      var _a2;
      imeis.value = imei;
      (_a2 = modal.value) === null || _a2 === void 0 ? null : _a2.open();
    };
    const confirm = () => {
      var _a2;
      emit("unbindDevice", imeis.value);
      (_a2 = modal.value) === null || _a2 === void 0 ? null : _a2.close();
    };
    const cancel = () => {
      var _a2;
      (_a2 = modal.value) === null || _a2 === void 0 ? null : _a2.close();
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
            a: common_vendor.t(item.deviceName),
            b: "245c735a-0-" + i0,
            c: common_vendor.p({
              size: "mini",
              shape: "circle",
              text: item.connectionStatus == "online" ? "在线" : "离线",
              type: item.connectionStatus == "online" ? "success" : "error"
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
          type: "warning"
        }),
        e: common_vendor.sr(modal, "245c735a-3", {
          "k": "modal"
        }),
        f: common_vendor.o(confirm, "31"),
        g: common_vendor.o(cancel, "ac"),
        h: common_vendor.p({
          title: "提示",
          content: "是否要解绑设备？",
          buttonReverse: true,
          align: "center",
          confirmText: "确定",
          cancelText: "取消",
          showCancelButton: true,
          class: "r"
        })
      } : {}, {
        i: common_vendor.sei(common_vendor.gei(_ctx, ""), "view"),
        j: `${_ctx.u_s_b_h}px`,
        k: `${_ctx.u_s_a_i_b}px`,
        l: common_vendor.pvhc(_ctx.$scope.data.virtualHostClass)
      });
      return __returned__;
    };
  }
});
wx.createComponent(_sfc_main);
